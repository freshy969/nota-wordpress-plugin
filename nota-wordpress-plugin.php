<?php
/**
 * Plugin Name: Nota SUM
 * Description: Nota’s assistive AI tools help publishers create headlines, summaries, SEO keywords and more.
 * Version: 0.1.4
 * Author: Nota
 * Author URI: https://heynota.com
 * License: GPL2
 * Text Domain: nota_plugin
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

define( 'NOTA_PLUGIN_VERSION', '0.1.4' );

if ( ! defined( 'NOTA_PLUGIN_FILE' ) ) {
	define( 'NOTA_PLUGIN_FILE', __FILE__ );
}

if ( ! class_exists( 'Nota' ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-nota.php';
}
