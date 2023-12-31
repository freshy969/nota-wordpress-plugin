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
	 * Nota settings class.
	 * 
	 * @var Nota_Settings
	 */
	private $settings;

	/**
	 * Meta keys used to save WP data
	 * 
	 * @var array
	 */
	private static $meta_keys = [
		'seo_title'                     => 'nota_seo_page_title',
		'seo_desc'                      => 'nota_seo_page_description',
		'social_hashtags_history'       => 'nota_hashtags_history',
		'headline_history'              => 'nota_headline_history',
		'slug_history'                  => 'nota_slug_history',
		'excerpt_history'               => 'nota_excerpt_history',
		'tag_history'                   => 'nota_tag_history',
		'seo_title_history'             => 'nota_seo_title_history',
		'seo_desc_history'              => 'nota_seo_desc_history',
		'social_post_facebook_history'  => 'nota_social_post_facebook_history',
		'social_post_linkedin_history'  => 'nota_social_post_linkedin_history',
		'social_post_instagram_history' => 'nota_social_post_instagram_history',
		'social_post_threads_history'   => 'nota_social_post_threads_history',
		'social_post_tiktok_history'    => 'nota_social_post_tiktok_history',
		'social_post_twitter_history'   => 'nota_social_post_twitter_history',
		'sms_history'                   => 'nota_sms_history',
	];

	/**
	 * Post tools constructor
	 * 
	 * @param Nota_Settings $settings The settings class.
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		add_action( 'init', array( $this, 'register_seo_meta_fields' ) );
		add_filter( 'single_post_title', array( $this, 'single_post_title' ), 10, 2 );
		add_action( 'wp_head', array( $this, 'add_meta_desc' ) );
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
				$yoast_enabled    = $this->is_yoast_active_for_post_type( $post->post_type );
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
							'hashtags'               => true,
							'categories'             => in_array( 'category', $taxonomies ),
							'meta_description'       => true,
							'meta_title'             => true,
							'tags'                   => in_array( 'post_tag', $taxonomies ),
							'social_posts_facebook'  => true,
							'social_posts_instagram' => true,
							'social_posts_linkedin'  => true,
							'social_posts_threads'   => true,
							'social_posts_tiktok'    => true,
							'social_posts_twitter'   => true,
							'sms'                    => true,
						],
						'meta_keys'         => self::$meta_keys,
						'post_title_suffix' => $this->get_post_title_suffix(),
						'register_controls' => [
							'seo' => ! $yoast_enabled,
						],
						'tools_active'      => ! empty( $this->settings->get_option( 'api_key' ) ),
					]
				);
				wp_enqueue_script( 'nota-post-tools' );
				wp_enqueue_style( 'nota-post-tools-style', NOTA_PLUGIN_URL . 'dist/postTools.css', [], $tool_script_args['version'] );
				wp_enqueue_style( 'nota-font-manrope', 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap', [], '1.0.0' );
		}
	}

	/**
	 * Returns the post title suffix.
	 * This is normally appended by Yoast, but if not WordPress will add their default.
	 * We want to display this to users so we'll show them the WordPress default if need be.
	 */
	private function get_post_title_suffix() {
		// extracted from wp_get_document_title.
		$sep        = apply_filters( 'document_title_separator', '-' );
		$site_title = get_bloginfo( 'name', 'display' );
		return $sep . ' ' . $site_title;
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

			foreach ( self::$meta_keys as $meta_key ) {
				register_post_meta(
					$post_type,
					$meta_key,
					$meta_args
				);
			}  
		}
	}

	/**
	 * Whether Yoast is active for a post type
	 * 
	 * @param string $post_type The post type to check.
	 */
	private function is_yoast_active_for_post_type( $post_type ) {
		$yoast_post_types = class_exists( 'WPSEO_Post_Type' ) ? WPSEO_Post_Type::get_accessible_post_types() : [];
		$yoast_enabled    = in_array( $post_type, $yoast_post_types );
		return $yoast_enabled;
	}

	/**
	 * Updates meta title if it exists
	 * 
	 * @param string $post_title The current post title.
	 * @param object $post The current post.
	 */
	public function single_post_title( $post_title, $post ) {
		// if Yoast is active, leave them to it.
		if ( $this->is_yoast_active_for_post_type( $post->post_type ) ) {
			return $post_title;
		}

		$nota_post_title = get_post_meta( $post->ID, self::$meta_keys['seo_title'], true );
		if ( ! $nota_post_title ) {
			return $post_title;
		}

		return $nota_post_title;
	}

	/**
	 * Adds the meta description to the page.
	 */
	public function add_meta_desc() {
		global $post;

		// if we're not on the single post page or yoast is enabled,
		// then just return.
		if ( ! is_singular() || $this->is_yoast_active_for_post_type( $post->post_type ) ) {
			return;
		}

		$meta_desc = get_post_meta( $post->ID, self::$meta_keys['seo_desc'], true );
		if ( ! $meta_desc ) {
			return;
		}
		
		echo '<meta name="description" content="' . esc_attr( $meta_desc ) . '" />';
	}
}
