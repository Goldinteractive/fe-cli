const path = require('path')
const {
  getPackageJson,
  getJsonFileContent,
  writeJsonFileContent
} = require('./helpers/common')
const { manifestFileName } = require('./config/constants')

module.exports = async (cwd = './') => {
  const package = await getPackageJson(cwd)
  const manifestLocation = path.join(cwd, manifestFileName)
  const manifest = await getJsonFileContent(manifestLocation, {
    mustExist: false
  })

  manifest.dependencies = package.dependencies || {}
  manifest.devDependencies = package.devDependencies || {}

  writeJsonFileContent(manifestLocation, manifest)
}
