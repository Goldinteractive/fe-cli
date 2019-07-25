const path = require('path')
const {
  getJsonFileContent,
  writeJsonFileContent
} = require('../helpers/common')
const { manifestFileName } = require('../config/constants')

module.exports = async (cwd = './') => {
  const manifestLocation = path.join(cwd, manifestFileName)
  const manifest = await getJsonFileContent(manifestLocation, {
    mustExist: false
  })

  writeJsonFileContent(manifestLocation, manifest)
}
