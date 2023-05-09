<?php
/**
 * Renders the post tools meta box
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

$screen = get_current_screen();
?>
<?php if ( $screen->is_block_editor() ) : ?>
<div id="nota-post-tools-meta-box-root"></div>
<?php else : ?>
<p>Nota currently only supports the block editor.</p>
<?php endif; ?>
