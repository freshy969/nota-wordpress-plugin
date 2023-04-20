<?php
/**
 * Nota Rest
 * This class adds and removes WP Rest actions
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

/**
 * Nota Rest main class
 */
class Nota_WP_Rest {
	/**
	 * Nota API instance
	 * 
	 * @var Nota_Api
	 */
	private $api;

	/**
	 * Nota_Rest constructor
	 * 
	 * @param Nota_Api $api An instance of Nota_Api.
	 */
	public function __construct( $api ) {
		$this->api = $api;

		add_action( 'wp_ajax_nota_action', array( $this, 'handle_action' ) );   
	}

	/**
	 * Handles actions
	 */
	public function handle_action() {
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], NOTA_PLUGIN_NONCE ) ) {
			exit( 'Invalid nonce' );
		}

		if ( ! isset( $_REQUEST['nota'] ) ) {
			wp_send_json_error( array( 'message' => 'Missing Nota data' ) );
			return;
		}

		$payload = $_REQUEST['nota'];

		$actions = array(
			'get_text_summary'   => array( $this, 'get_text_summary' ),
			'get_text_headlines' => array( $this, 'get_text_headlines' ),
		);
		if ( ! isset( $payload['nota_action'] ) || ! isset( $actions[ $payload['nota_action'] ] ) ) {
			wp_send_json_error( array( 'message' => 'invalid action' ), 400 );
			return;
		}

		$response = $actions[ $payload['nota_action'] ]( $payload );
		if ( is_wp_error( $response ) ) {
			wp_send_json_error( $response, 400 );
		} else {
			wp_send_json( $response );
		}
	}

	/**
	 * Gets text summary
	 * 
	 * @param array $data Data sent with the request.
	 */
	private function get_text_summary( $data ) {
		if ( ! isset( $data['html'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		// strip HTML tags from text.
		$text          = wp_strip_all_tags( $data['html'] );
		$length_option = (string) isset( $data['length_option'] ) ? $data['length_option'] : '1 sentence';

		return $this->api->get_text_summary( $text, $length_option );
	}
	
	/**
	 *  Gets headlines
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_headlines( $data ) {
		if ( ! isset( $data['html'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		// strip HTML tags from text.
		$text  = wp_strip_all_tags( $data['html'] );
		$count = isset( $data['count'] ) ? (int) $data['count'] : 3;

		return $this->api->get_text_summary( $text, $count );
	}

}
