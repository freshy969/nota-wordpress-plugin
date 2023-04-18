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
		return $response;
	}

	/**
	 * Gets a text summary
	 * 
	 * @param string $text Text to summarise.
	 */
	public function get_text_summary( $text ) {
		$response = $this->make_request(
			'POST',
			'notasum/v1/summary',
			array(
				'body' => array(
					'text' => $text,
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		return wp_remote_retrieve_body( $response );
	}

}
