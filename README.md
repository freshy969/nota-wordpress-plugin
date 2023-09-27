# Nota WordPress Plugin

## Installation

### WordPress

The easiest way to get WordPress installed is to use [LocalWP](https://localwp.com/). Download it and create a new site.

You'll likely want to create a symlink to the plugin from your WordPress installation. e.g.:

```
cd ~/Local/nota/app/public/wp-content/plugins
ln -s /path/to/development/files ./nota
```

### PHP

It's important to note that you'll probably end up running a few different versions or instances of PHP:

- You'll need a WordPress installation which runs on PHP. This will likely be its own instance ( e.g. by installing LocalWP above ).
- You'll need PHP to run linting and beautifier tools, composer, etc

Install php. Note that there are currently some incompatibilities between PHPCS ( our code standards tool ) and newer versions of PHP. If you're on a mac and using Homebrew, you can use [this tap](https://github.com/shivammathur/homebrew-php) to get things going:

```
brew tap shivammathur/php
brew install shivammathur/php/php@7.4
brew link --overwrite --force shivammathur/php/php@7.4
```

Once you have PHP running, [install composer](https://getcomposer.org/doc/00-intro.md).

Composer is a package manager for PHP. Once installed, run `composer install` to install dependencies.

```
composer install
```

### VS Code

You'll need the following extensions to get VS Code playing nicely with PHP and to conform to our coding standards. If you're not using VS Code, ensure your editor is linting and formatting on save.

- [PHP Extension Pack](https://marketplace.visualstudio.com/items?itemName=xdebug.php-pack)
- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
- [PHP IntelliSense](https://marketplace.visualstudio.com/items?itemName=zobo.php-intellisense)
- [PHP Sniffer & Beautifier](https://marketplace.visualstudio.com/items?itemName=ValeryanM.vscode-phpsab)

Then disable the builtin PHP language features:

- Go to Extensions
- Search for `@builtin php`
- Disable `PHP Language Features`. Leave `PHP Language Basics` enabled for syntax highlighting.

Update Intelephense Stubs to include `wordpress`:

1. Search settings for "intelephense.stubs"
2. Add "wordpress" to the list of included stubs.

## TypeScript & React

Run `yarn` to install all dependencies.

## Local development

### PHP

When developing locally, you'll want to override some defaults. Add these to your `wp-config.php` file.

```
define( 'WP_DEBUG', true ); // enables WP debugging
define( 'WP_DEBUG_LOG', true ); // logs errors etc to a file
define( 'WP_DEBUG_DISPLAY', false ); // stops WP displaying error logs etc in the UI
define( 'WP_NOTA_DEBUG', true ); // enables Nota debugging
define( 'WP_NOTA_API_URL', 'http://localhost:3010/' ); // URL for your local API
```

### JS / TS

All front-end assets ( JS, CSS ) are compiled and the compiled versions are not checked in to version control. You'll need to start the development server to compile the assets and watch for changes.

```
yarn start
```

### Configuration

The plugin requires API URL, key, and timeout settings which may be configured via the WordPress admin _Settings_ → _Nota Tools_ page. For developing locally against the development gateway:

- API key: Obtain an API key from the dev.heynota.com environment.
- API URL: https://nota-api-gateway-integration-develop.azure-api.net
- Request timeout: 30

## Deploying to production

WordPress uses SVN to manage plugin releases and they have some [ great documentation ](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/) on how that works. We use a GitHub action to manage our releases which builds and pushes code to the WordPress SVN repository.

Before running them you'll need to ensure that the `SVN_USERNAME` and `SVN_PASSWORD` secrets are set in the GitHub actions settings. These should be set to the Nota WordPress username and password used to log in to WordPress.org ( note: not the email address ).

### Deploying a new plugin version

1. Ensure all code has been merged to `main` and that the `main` branch has been tagged with the appropriate version. The tag should match the version specified in the `nota-wordpress-plugin.php` file. This means that `v1.1.1` is invalid, instead use `1.1.1`.
2. Head over to the Actions tab in GitHub and choose "Deploy to WordPress". Dropdown the "Use workflow from" dropdown and select the tag you want to deploy.
3. Sit back, relax, and enjoy the show.

### Deploying new assets

If you only need to update the `readme.txt` or any of the assets in `.wordpress-org/` then you can run the "Plugin asset/readme update" action. This will only push assets and no new code.
