<?php
/**
 * Nota Settings
 * 
 * @package NotaPlugin
 */

defined( 'ABSPATH' ) || exit;

/**
 * Nota Settings class
 */
class Nota_Settings {
	/**
	 * Key for the settings
	 * 
	 * @var string
	 */
	public $setting_field_key = 'nota_plugin_settings';

	/**
	 * Key for the general settings section
	 * 
	 * @var string
	 */
	public $general_settings_section_key = 'nota_general_settings';

	/**
	 * The settings page slug
	 * 
	 * @var string
	 */
	public $setting_page_slug = 'nota-settings';

	/**
	 * Nota Settings constructor
	 */
	public function __construct() {         
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Registers menus
	 */
	public function register_menu() {
		add_options_page( __( 'Nota settings', 'nota' ), __( 'Nota tools', 'nota' ), 'manage_options', $this->setting_page_slug, array( $this, 'render_settings_page' ) );
	}

	/**
	 * Registers settings
	 */
	public function register_settings() {
		add_settings_section( $this->general_settings_section_key, __( 'General settings', 'nota' ), '__return_false', $this->setting_page_slug );
		$this->add_setting_field(
			'api_key',
			__( 'API key', 'nota' ),
			array( $this, 'render_text_input' ),
			$this->general_settings_section_key
		);

			$this->add_setting_field(
				'api_url',
				__( 'API URL', 'nota' ),
				array( $this, 'render_text_input' ),
				$this->general_settings_section_key
			);

			$this->add_setting_field(
				'request_timeout_seconds',
				__( 'Request timeout in seconds', 'nota' ),
				array( $this, 'render_text_input' ),
				$this->general_settings_section_key,
				array(
					'description' => __( 'Leave empty to use the WordPress defaults. If you are experiencing timeout errors, try increasing this value.', 'nota' ),
				)
			);

		$this->add_setting_field(
			'debug',
			__( 'Debug', 'nota' ),
			array( $this, 'render_checkbox_input' ),
			$this->general_settings_section_key
		);

	}

	/**
	 * Adds a setting field
	 * 
	 * @param string   $name The name of the option.
	 * @param string   $label The option label.
	 * @param callable $callback The fn to render the input.
	 * @param string   $section The section ID to render into.
	 * @param array    $args Extra arguments to pass to the callback.
	 */
	private function add_setting_field( $name, $label, $callback, $section, $args = array() ) {

		// ensure the setting is registered with WP.
		register_setting( $this->setting_field_key, $this->get_option_name( $name ) );

		// set up some default args that every input will need.
		$input_id     = "nota_setting_{$name}";
		$default_args = array(
			'name'      => $name,
			'input_id'  => $input_id,
			'label_for' => $input_id,
		);

		// display the settings field.
		add_settings_field(
			'nota_' . $name,
			$label,
			$callback,
			$this->setting_page_slug,
			$section,
			array_merge( $default_args, $args )
		);
	}

	/**
	 * Renders the settings page
	 */
	public function render_settings_page() {
		// not used directly, but passed through to the template via include.
		$nota = array(
			'setting_field_key' => $this->setting_field_key,
			'setting_page_slug' => $this->setting_page_slug,
		);
		include_once NOTA_PLUGIN_ABSPATH . 'templates/admin/settings-page.php';
	}

	/**
	 * Gets the real option name
	 * 
	 * @param string $key The option name.
	 */
	public function get_option_name( $key ) {
		return "nota_{$key}";
	}

	/**
	 * Returns an option
	 * 
	 * @param string $key The name of the option, without the nota_ prefix.
	 * @param mixed  $default The default value.
	 */
	public function get_option( $key, $default = false ) {
		return get_option( $this->get_option_name( $key ), $default );
	}

	/**
	 * Renders a text input field
	 * 
	 * @param mixed $args Any args sent by the registering function.
	 */
	public function render_text_input( $args ) {
		$value      = $this->get_option( $args['name'] );
		$field_name = $this->get_option_name( $args['name'] );
		?>
		<input id='<?php echo esc_attr( $args['input_id'] ); ?>' name='<?php echo esc_attr( $field_name ); ?>' value='<?php echo esc_attr( $value ); ?>' />
		<?php
		if ( array_key_exists( 'description', $args ) && ! empty( $args['description'] ) ) {
			echo '<p>' . esc_html( $args['description'] ) . '</p>';
		}
	}

	/**
	 * Renders a checkbox field
	 * 
	 * @param mixed $args Any args sent by the registering function.
	 */
	public function render_checkbox_input( $args ) {
		$checked    = $this->get_option( $args['name'] ) ? 'checked' : '';
		$field_name = $this->get_option_name( $args['name'] );
		?>
		<input id='<?php echo esc_attr( $args['input_id'] ); ?>' name='<?php echo esc_attr( $field_name ); ?>' value='1' type="checkbox" <?php echo esc_attr( $checked ); ?> />
		<?php
	}

}
