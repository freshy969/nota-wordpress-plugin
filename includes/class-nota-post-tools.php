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
	 * The meta key used to store the SEO title.
	 * 
	 * @var string
	 */
	public static $seo_title_meta_key = 'nota_seo_page_title';

	/**
	 * The meta key used to store the SEO description.
	 * 
	 * @var string
	 */
	private static $seo_desc_meta_key = 'nota_seo_page_description';

	/**
	 * Post tools constructor
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		add_action( 'init', array( $this, 'register_seo_meta_fields' ) );
	}

	/**
	 * Returns a list of supported post types to display the tools on
	 */
	public function get_tools_supported_post_types() {
		$post_types = apply_filters( 'nota_tools_supported_post_types', [ 'post' ] );
		return $post_types;
	}

	/**
	 * Enqueues various admin scripts
	 * 
	 * @param string $hook The hook suffix.
	 */
	public function admin_enqueue_scripts( $hook ) {
		global $post;
		$screen = get_current_screen();
		if (
			( 'post-new.php' === $hook || 'post.php' === $hook ) &&
			$screen->is_block_editor() &&
			in_array( $post->post_type, $this->get_tools_supported_post_types() )
		   ) {
				$yoast_post_types = class_exists( 'WPSEO_Post_Type' ) ? WPSEO_Post_Type::get_accessible_post_types() : [];
				$yoast_enabled    = in_array( $post->post_type, $yoast_post_types );
				$taxonomies       = get_post_taxonomies();
				$tool_script_args = include NOTA_PLUGIN_ABSPATH . 'dist/postTools.asset.php';
				wp_register_script( 'nota-post-tools', NOTA_PLUGIN_URL . 'dist/postTools.js', $tool_script_args['dependencies'], $tool_script_args['version'], true );
				wp_localize_script(
					'nota-post-tools',
					'notaTools',
					[
						'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
						'nonce'             => wp_create_nonce( NOTA_PLUGIN_NONCE ),
						'components'        => [
							'categories'       => in_array( 'category', $taxonomies ),
							'meta_description' => true,
							'meta_title'       => true,
							'tags'             => in_array( 'post_tag', $taxonomies ),
						],
						'meta_keys'         => [
							'seo_title' => self::$seo_title_meta_key,
							'seo_desc'  => self::$seo_desc_meta_key,
						],
						'register_controls' => [
							'seo' => ! $yoast_enabled,
						],
					]
				);
				wp_enqueue_script( 'nota-post-tools' );
				wp_enqueue_style( 'nota-post-tools-style', NOTA_PLUGIN_URL . 'dist/postTools.css', [], $tool_script_args['version'] );
		}
	}

	/**
	 * Adds meta boxes
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'nota-post-tools',
			__( 'Nota Tools', 'nota' ),
			array( $this, 'render_post_tools' ),
			$this->get_tools_supported_post_types(),
			'normal',
			'high',
			[ '__block_editor_compatible_meta_box' => true ]
		);
	}

	/**
	 * Renders the tool meta box
	 */
	public function render_post_tools() {
		include_once NOTA_PLUGIN_ABSPATH . 'templates/admin/post-tools-meta-box.php';
	}
	
	/**
	 * Determines whether Gutenberg is enabled
	 */
	public function is_gutenberg_enabled() {
		$current_screen = get_current_screen();
		return $current_screen->is_block_editor();
	}

	/**
	 * Registers meta fields on posts
	 */
	public function register_seo_meta_fields() {
		$post_types = $this->get_tools_supported_post_types();      
		foreach ( $post_types as $post_type ) {
			$meta_args = array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			);

			register_post_meta(
				$post_type,
				self::$seo_title_meta_key,
				$meta_args
			);  

			register_post_meta(
				$post_type,
				self::$seo_desc_meta_key,
				$meta_args
			);
		}
	}
}
