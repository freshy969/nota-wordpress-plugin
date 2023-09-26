const fs = require('fs')

const checkVersions = (versions, version) => versions.includes(version)

const run = () => {
  const packageVersion = process.env.npm_package_version
  const versions = [packageVersion]

  // get the version in the readme
  const readmeContent = fs.readFileSync('readme.txt', 'utf-8')
  if (!readmeContent) {
    throw new Error('Empty readme content')
  }
  const readmeRegex = /(?<=Stable tag: )(\d*.\d*.\d*)$/m
  const readmeVersion = readmeRegex.exec(readmeContent)
  if (!readmeVersion || !readmeVersion[0]) {
    throw new Error('Could not get readme version')
  }
  if (!checkVersions(versions, readmeVersion[0])) {
    throw new Error('Readme version does not match')
  }
  versions.push(readmeVersion[0])

  // get the version from the plugin file
  // we actually have two versions declared here, so need to make sure they both match
  const pluginFileContent = fs.readFileSync(
    'nota-wordpress-plugin.php',
    'utf-8',
  )
  if (!pluginFileContent) {
    throw new Error('Empty plugin file')
  }
  const pluginHeadRegex = /(?<=Version: )(\d*.\d*.\d*)$/m
  const pluginHeadVersion = pluginHeadRegex.exec(pluginFileContent)
  if (!pluginHeadVersion || !pluginHeadVersion[0]) {
    throw new Error('Could not get plugin header version')
  }
  if (!checkVersions(versions, pluginHeadVersion[0])) {
    throw new Error('plugin header version does not match')
  }
  versions.push(pluginHeadVersion[0])

  // this is the version number
  const pluginRegex = /(?<=define\( 'NOTA_PLUGIN_VERSION', ')(\d*.\d*.\d*)/m
  const pluginVersion = pluginRegex.exec(pluginFileContent)
  if (!pluginVersion || !pluginVersion[0]) {
    throw new Error('Could not get plugin version')
  }
  if (!checkVersions(versions, pluginVersion[0])) {
    throw new Error('Plugin version does not match')
  }
}
run()
