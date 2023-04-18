<?php
/**
 * Nota Post Tools
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

/**
 * Nota Post Tools class
 */
class Nota_Post_Tools {
	/**
	 * Post tools constructor
	 */
	public function __construct() {         
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Returns a list of supported post types to display the tools on
	 */
	public function get_tools_supported_post_types() {
		$post_types = apply_filters( 'nota_tools_supported_post_types', [ 'post', 'page' ] );
		return $post_types;
	}

	/**
	 * Enqueues various admin scripts
	 * 
	 * @param string $hook The hook suffix.
	 */
	public function admin_enqueue_scripts( $hook ) {
		global $post;
		if ( 'post-new.php' === $hook || 'post.php' === $hook ) {
			if ( in_array( $post->post_type, $this->get_tools_supported_post_types() ) ) {
				wp_register_script( 'nota-post-tools', NOTA_PLUGIN_URL . 'assets/js/post-tools.js', [ 'jquery' ], NOTA_PLUGIN_VERSION, true );
				wp_localize_script(
					'nota-post-tools',
					'notaTools',
					[
						'ajaxUrl' => admin_url( 'admin-ajax.php' ),
						'nonce'   => wp_create_nonce( NOTA_PLUGIN_NONCE ),
					]
				);
				wp_enqueue_script( 'nota-post-tools' );
			}
		}
	}

	/**
	 * Adds meta boxes
	 */
	public function add_meta_boxes() {
		add_meta_box( 'nota-post-tools', __( 'Nota Tools', 'nota' ), array( $this, 'render_post_tools' ), $this->get_tools_supported_post_types(), 'side', 'high' );
	}

	/**
	 * Renders the tool meta box
	 */
	public function render_post_tools() {
		include_once NOTA_PLUGIN_ABSPATH . 'templates/admin/post-tools-meta-box.php';
	}
}
