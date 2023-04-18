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
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], NOTA_NONCE ) ) {
			exit( 'Invalid nonce' );
		}

		$actions = array(
			'get_text_summary' => array( $this, 'get_text_summary' ),
		);
		if ( ! isset( $_REQUEST['action'] ) || ! isset( $actions[ $_REQUEST['action'] ] ) ) {
			wp_send_json_error( array( 'message' => 'invalid action' ), 400 );
			return;
		}

		$response = $actions[ $_REQUEST['action'] ]();
		if ( is_wp_error( $response ) ) {
			wp_send_json_error( $response );
		} else {
			wp_send_json( $response );
		}
	}

	/**
	 * Gets text summary
	 */
	private function get_text_summary() {
		if ( ! isset( $_REQUEST['text'] ) ) {
			wp_send_json_error( array( 'message' => 'Text is required' ), 400 );
			return;
		}

		return $this->api->get_text_summary( $_REQUEST['text'] );
	}
	

}
