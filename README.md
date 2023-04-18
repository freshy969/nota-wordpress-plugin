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

## Local development
When developing locally, you'll want to override some defaults:
```
WP_DEBUG=true // enables WP debugging
WP_DEBUG_LOG=true // logs errors etc to a file
WP_DEBUG_DISPLAY=false // stops WP displaying error logs etc in the UI
WP_NOTA_DEBUG=true // enables Nota debugging
WP_NOTA_API_URL=http://localhost:3010/ // URL for your local API
```