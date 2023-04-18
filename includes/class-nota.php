<?php
/**
 * Nota setup
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main Nota class.
 */
class Nota {
	/**
	 * The single instance of the class
	 * 
	 * @var Nota
	 */
	protected static $_instance = null; // phpcs:ignore PSR2.Classes.PropertyDeclaration.Underscore

	/**
	 * Settings class
	 * 
	 * @var Nota_Settings
	 */
	public $settings;

	/**
	 * API class
	 * 
	 * @var Nota_API
	 */
	public $api;

	/**
	 * Main Nota Instance.
	 * Ensures only one instance of Nota is loaded or can be loaded.
	 * 
	 * @return Nota - Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Nota constructor
	 */
	public function __construct() {
		$this->define_constants();  
		$this->includes();
	}

	/**
	 * Defines constants
	 */
	private function define_constants() {
		define( 'NOTA_ABSPATH', dirname( NOTA_PLUGIN_FILE ) . '/' );
	}

	/**
	 * Includes files
	 */
	private function includes() {
		include_once NOTA_ABSPATH . 'includes/class-nota-logger.php';
		include_once NOTA_ABSPATH . 'includes/class-nota-settings.php';
		include_once NOTA_ABSPATH . 'includes/class-nota-api.php';

		$this->settings = new Nota_Settings();
		$this->api      = new Nota_Api( $settings );
	}

	/**
	 * Is the site in Nota debug mode?
	 */
	public static function is_debug_mode() {
		return defined( 'WP_NOTA_DEBUG' ) && WP_NOTA_DEBUG;
	}
}
Nota::instance();
