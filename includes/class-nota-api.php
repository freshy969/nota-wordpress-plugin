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
		if ( Nota::is_debug_mode() && $this->settings->get_option( 'api_url' ) ) {
			return trailingslashit( $this->settings->get_option( 'api_url' ) ); 
		}
		return 'https://api.heynota.com/';
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

		$request_args = array_merge(
			$args,
			array(
				'method'  => $method,
				'headers' => array_merge( $headers, $default_headers ),
				'timeout' => MINUTE_IN_SECONDS * 2, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);
		$url          = $this->get_api_url() . $endpoint;
		$response     = wp_remote_request( $url, $request_args );
		$status_code  = (int) wp_remote_retrieve_response_code( $response );

		if ( $status_code < 200 || $status_code > 299 ) {
			$err_body = wp_remote_retrieve_body( $response );
			Nota_Logger::debug( $err_body );
			$err_body_json = json_decode( $err_body, false );

			// if this is an auth error, return a known response.
			if ( 401 === $status_code ) {
				return new WP_Error(
					'nota_error',
					'Authentication error: Please verify your API key setting.'
				);
			}

			// The Nota API will return human readable errors with the "isNotaError" property.
			// Let's return these so that we can distingush them on the front-end from other generic errors.
			if ( ! is_null( $err_body_json ) && isset( $err_body_json->isNotaError ) && $err_body_json->isNotaError && $err_body_json->message ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				return new WP_Error(
					'nota_error',
					$err_body_json->message 
				);
			}

			return new WP_Error(
				'nota_api_error',
				'Non-200 status code returned from Nota API',
				[
					'body'        => $err_body_json || $err_body,
					'status_code' => $status_code,
				]
			);
		}

		if ( is_wp_error( $response ) ) {
			return $response;
		}
		return json_decode( wp_remote_retrieve_body( $response ) );
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
}
