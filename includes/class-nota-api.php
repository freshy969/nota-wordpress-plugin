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
		if ( Nota::is_debug_mode() && defined( 'WP_NOTA_API_URL' ) ) {
			return trailingslashit( WP_NOTA_API_URL ); 
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
			'Authorization' => 'Bearer ' . $this->settings->get_option( 'api_key' ),
		);

		$request_args = array_merge(
			$args,
			array(
				'method'  => $method,
				'headers' => array_merge( $headers, $default_headers ),
				'timeout' => 30, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);
		$url          = $this->get_api_url() . $endpoint;
		$response     = wp_remote_request( $url, $request_args );
		$status_code  = (int) wp_remote_retrieve_response_code( $response );

		if ( $status_code < 200 || $status_code > 299 ) {
			return new WP_Error(
				'nota_api_error',
				'Non-200 status code returned from Nota API',
				[
					'body'        => json_decode( wp_remote_retrieve_body( $response ) ),
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
			'notasum/v1/summary',
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
			'notasum/v1/headlines',
			array(
				'body' => array(
					'text'  => $text,
					'count' => $count,
				),
			)
		);
	}

}
