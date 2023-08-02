<?php
/**
 * Nota API
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

/**
 * Nota API class
 */
class Nota_Api {
	/**
	 * Nota settings class.
	 * 
	 * @var Nota_Settings
	 */
	private $settings;

	/**
	 * Nota_Api constructor
	 * 
	 * @param Nota_Settings $settings An instance of Nota_Settings.
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
	}   

	/**
	 * Returns the API url
	 */
	private function get_api_url() {
		$api_url = $this->settings->get_option( 'api_url' );
		if ( ! $api_url ) {
			return new WP_Error( 'nota_error', 'Missing API URL' );
		}
		return trailingslashit( $api_url );
	}

	/**
	 * Makes a request
	 * 
	 * @param string $method HTTP method to use in the request.
	 * @param string $endpoint Endpoint to make the request to.
	 * @param array  $args Any other info for the request.
	 */
	private function make_request( $method, $endpoint, $args = array() ) {
		// get any headers sent with the request, but default to an empty array.
		$headers = array_key_exists( 'headers', $args ) && is_array( $args['headers'] ) ? $args['headers'] : array();

		// add in our authorization headers, these are always required.
		$default_headers = array(
			'nota-subscription-key' => $this->settings->get_option( 'api_key' ),
		);

		$request_args    = array_merge(
			$args,
			array(
				'method'  => $method,
				'headers' => array_merge( $headers, $default_headers ),
			)
		);
		$request_timeout = (int) $this->settings->get_option( 'request_timeout_seconds' );

		if ( $request_timeout ) {
			$request_args['timeout'] = $request_timeout;
		}

		$url = $this->get_api_url();

		if ( is_wp_error( $url ) ) {
			return $url;
		}

		$url      = $url . $endpoint;
		$response = wp_remote_request( $url, $request_args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$status_code = (int) wp_remote_retrieve_response_code( $response );
		$body        = wp_remote_retrieve_body( $response );
		$body_json   = json_decode( $body, false );

		if ( $status_code < 200 || $status_code > 299 ) {
			Nota_Logger::debug( $body );

			// if this is an auth error, return a known response.
			if ( 401 === $status_code ) {
				return new WP_Error(
					'nota_error',
					'Authentication error: Please verify your API key setting.'
				);
			}

			// The Nota API will return human readable errors with the "isNotaError" property.
			// Let's return these so that we can distingush them on the front-end from other generic errors.
			if ( ! is_null( $body_json ) && isset( $body_json->isNotaError ) && $body_json->isNotaError && $body_json->message ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				return new WP_Error(
					'nota_error',
					$body_json->message 
				);
			}

			return new WP_Error(
				'nota_api_error',
				'Non-200 status code returned from Nota API',
				[
					'body'        => $body_json || $body,
					'status_code' => $status_code,
				]
			);
		}

		if ( is_null( $body_json ) ) {
			return new WP_Error(
				'nota_api_error',
				'Could not parse response body',
				[
					'body' => $body,
				]
			);
		}
		return $body_json;
	}

	/**
	 * Gets a text summary
	 * 
	 * @param string $text Text to summarise.
	 * @param string $length_option How long the summary should be.
	 */
	public function get_text_summary( $text, $length_option ) {
		return $this->make_request(
			'POST',
			'sum/v1/summary',
			array(
				'body' => array(
					'text'         => $text,
					'lengthOption' => $length_option,
				),
			)
		);
	}

		/**
		 * Gets the hashtags from the text
		 * 
		 * @param string $text Text to get keywords from.
		 */
	public function get_text_hashtags( $text ) {
		return $this->make_request(
			'POST',
			'social/v1/hashtags',
			array(
				'body' => array(
					'text' => $text,
				),
			)
		);
	}

	/**
	 * Gets the headline from the text
	 * 
	 * @param string $text Text to get headlines from.
	 * @param int    $count Number of headlines to get.
	 */
	public function get_text_headlines( $text, $count ) {
		return $this->make_request(
			'POST',
			'sum/v1/headlines',
			array(
				'body' => array(
					'text'  => $text,
					'count' => $count,
				),
			)
		);
	}


	/**
	 * Gets the keywords from the text
	 * 
	 * @param string $text Text to get keywords from.
	 * @param int    $count Number of keywords to get.
	 * @param float  $variability How much the keywords should vary.
	 */
	public function get_text_keywords( $text, $count, $variability ) {
		return $this->make_request(
			'POST',
			'sum/v1/keywords',
			array(
				'body' => array(
					'text'        => $text,
					'count'       => $count,
					'variability' => $variability,
				),
			)
		);
	}

	/**
	 * Gets the meta description from the text
	 * 
	 * @param string $text Text to get description from.
	 * @param int    $count Number of descriptions to get.
	 * @param float  $variability How much the descriptions should vary.
	 */
	public function get_text_meta_descriptions( $text, $count, $variability ) {
		return $this->make_request(
			'POST',
			'sum/v1/meta/descriptions',
			array(
				'body' => array(
					'text'        => $text,
					'count'       => $count,
					'variability' => $variability,
				),
			)
		);
	}

	/**
	 * Gets the meta title from the text
	 * 
	 * @param string $text Text to get title from.
	 * @param int    $count Number of titles to get.
	 * @param float  $variability How much the titles should vary.
	 */
	public function get_text_meta_titles( $text, $count, $variability ) {
		return $this->make_request(
			'POST',
			'sum/v1/meta/titles',
			array(
				'body' => array(
					'text'        => $text,
					'count'       => $count,
					'variability' => $variability,
				),
			)
		);
	}

	/**
	 * Gets the social posts for the text
	 * 
	 * @param string $text Text to get title from.
	 * @param string $platform Platform to get posts for (facebook, twitter, instagram, ...).
	 * @param int    $count Number of titles to get.
	 */
	public function get_text_social_posts( $text, $platform, $count ) {
		return $this->make_request(
			'POST',
			'social/v1/posts',
			array(
				'body' => array(
					'text'     => $text,
					'platform' => $platform,
					'count'    => $count,
				),
			)
		);
	}
}
