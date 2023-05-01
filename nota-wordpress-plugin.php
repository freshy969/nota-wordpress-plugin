<?php
/**
 * Plugin Name: Nota
 * Description: Nota uses AI tools to optimize the publishing process.
 * Version: 0.1.0
 * Author: Nota
 * Author URI: https://heynota.com
 * License: GPL2
 * Text Domain: nota_plugin
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

define( 'NOTA_PLUGIN_VERSION', '0.1.0' );

if ( ! defined( 'NOTA_PLUGIN_FILE' ) ) {
	define( 'NOTA_PLUGIN_FILE', __FILE__ );
}

if ( ! class_exists( 'Nota' ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-nota.php';
}
