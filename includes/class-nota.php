<?php
/**
 * Nota setup
 * 
 * @package Nota
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
	}

	/**
	 * Defines constants
	 */
	private function define_constants() {
		define( 'NOTA_ABSPATH', dirname( NOTA_PLUGIN_FILE ) . '/' );
	}
}
Nota::instance();
