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
	 * Converts HTML to text and trims to acceptable length
	 * 
	 * @param string $html string HTML to trim.
	 */
	private function trim_html( $html ) {
		// strip HTML tags from text.
		$text = wp_strip_all_tags( $html );
		$text = substr( $text, 0, 12000 );
		return $text;
	}

	/**
	 * Sanitizes core request properties.
	 *
	 * @param array $request A $_REQUEST superglobal.
	 */
	private function sanitize_nota_request( $request ) {
		$safe_request = $request['nota'];
		if ( ! isset( $request['nota'] ) || ! is_array( $request['nota'] ) ) {
			return new WP_Error( 'Request is missing required property "nota"' );
		}

		// sanitize action.
		$safe_request['nota_action'] = isset( $request['nota']['nota_action'] ) ? sanitize_key( $request['nota']['nota_action'] ) : '';

		// sanitize post HTML.
		$valid_post_html          = isset( $request['nota']['postHTML'] ) && is_string( $request['nota']['postHTML'] );
		$safe_request['postHTML'] = $valid_post_html ? (string) $request['nota']['postHTML'] : '';
		$safe_request['postText'] = $this->trim_html( $safe_request['postHTML'] );

		// sanitize count.
		// count needs to be an integer, but we'll cast any strings to an integer if need be.
		$valid_count           = isset( $request['nota']['count'] ) && ( is_int( $request['nota']['count'] ) || is_string( $request['nota']['count'] ) );
		$safe_request['count'] = $valid_count ? (int) $request['nota']['count'] : null;

		// sanitize regenerate.
		// regenerate needs to be a boolean, but we'll cast any strings to a boolean if need be.
		$valid_regenerate           = isset( $request['nota']['regenerate'] ) && ( is_bool( $request['nota']['regenerate'] ) || is_string( $request['nota']['regenerate'] ) );
		$safe_request['regenerate'] = $valid_regenerate ? (bool) $request['nota']['regenerate'] : false;

		return $safe_request;
	}

	/**
	 * Handles actions
	 */
	public function handle_action() {
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( $_REQUEST['nonce'] ), NOTA_PLUGIN_NONCE ) ) {
			exit( 'Invalid nonce' );
		}

		if ( ! isset( $_REQUEST['nota'] ) ) {
			wp_send_json_error( array( 'message' => 'Missing Nota data' ) );
			return;
		}

		$payload = $this->sanitize_nota_request( $_REQUEST );

		$actions = array(
			'get_text_hashtags'          => array( $this, 'get_text_hashtags' ),
			'get_text_summary'           => array( $this, 'get_text_summary' ),
			'get_text_headlines'         => array( $this, 'get_text_headlines' ),
			'get_text_slugs'             => array( $this, 'get_text_slugs' ),
			'get_text_keywords'          => array( $this, 'get_text_keywords' ),
			'get_text_meta_descriptions' => array( $this, 'get_text_meta_descriptions' ),
			'get_text_meta_titles'       => array( $this, 'get_text_meta_titles' ),
			'get_text_social_posts'      => array( $this, 'get_text_social_posts' ),
			'get_text_sms_messages'      => array( $this, 'get_text_sms_messages' ),
		);
		if ( ! $payload['nota_action'] || ! isset( $actions[ $payload['nota_action'] ] ) ) {
			wp_send_json_error( array( 'message' => 'invalid action' ), 400 );
			return;
		}

		$action   = sanitize_key( $payload['nota_action'] );
		$response = $actions[ $action ]( $payload );
		if ( is_wp_error( $response ) ) {
			$error_code = $response->get_error_code();
			// Detect a 429 error specifically and send a custom message.
			if ( 429 === $error_code ) {
				wp_send_json_error(
					array(
						array(
							'code'    => 'nota_error',
							'message' => 'Rate limit error: API rate limit exceeded. Please try again later.',
						),
					),
					429
				);
			} else {
				wp_send_json_error( $response, 400 );
			}
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
		if ( ! $data['postText'] ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text          = $data['postText'];
		$length_option = isset( $data['length_option'] ) && is_string( $data['length_option'] ) ? $data['length_option'] : '1-sentence';
		$regenerate    = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_summary( $text, $length_option, $regenerate );
	}
	
	/**
	 *  Gets hashtags
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_hashtags( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_hashtags( $text, $regenerate );
	}

	/**
	 *  Gets headlines
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_headlines( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 3;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_headlines( $text, $count, $regenerate );
	}

	/**
	 *  Gets slugs
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_slugs( $data ) {
		if ( ! isset( $data['postHTML'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		// strip HTML tags from text.
		$text       = $data['postText'];
		$count      = isset( $data['count'] ) ? $data['count'] : 3;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_slugs( $text, $count, $regenerate );
	}

	/**
	 *  Gets keywords
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_keywords( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 10;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		// maybe we'll expose this as a setting at some point.
		$variability = 0.3;

		return $this->api->get_text_keywords( $text, $count, $variability, $regenerate );
	}

	/**
	 *  Gets meta descriptions
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_meta_descriptions( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 10;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		// maybe we'll expose this as a setting at some point.
		$variability = 0.3;

		return $this->api->get_text_meta_descriptions( $text, $count, $variability, $regenerate );
	}

	/**
	 *  Gets meta titles
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_meta_titles( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 10;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		// maybe we'll expose this as a setting at some point.
		$variability = 0.3;

		return $this->api->get_text_meta_titles( $text, $count, $variability, $regenerate );
	}

	/**
	 *  Gets social posts for the given platform
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_social_posts( $data ) {
		if ( ! isset( $data['postText'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		if ( ! isset( $data['platform'] ) || ! is_string( $data['platform'] ) ) {
			wp_send_json_error( array( 'message' => 'platform is required' ), 400 );
			return;
		}

		$text       = $data['postText'];
		$platform   = $data['platform'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 10;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_social_posts( $text, $platform, $count, $regenerate );
	}

	/**
	 *  Gets SMS messages
	 *
	 * @param array $data Data sent with the request.
	 */
	private function get_text_sms_messages( $data ) {
		if ( ! isset( $data['postHTML'] ) ) {
			wp_send_json_error( array( 'message' => 'HTML is required' ), 400 );
			return;
		}

		// strip HTML tags from text.
		$text       = $data['postText'];
		$count      = ! is_null( $data['count'] ) ? $data['count'] : 1;
		$regenerate = isset( $data['regenerate'] ) ? $data['regenerate'] : false;

		return $this->api->get_text_sms_messages( $text, $count, $regenerate );
	}
}
