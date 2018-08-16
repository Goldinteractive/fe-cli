const fs = require('fs')
const path = require('path')
const assert = require('assert')

const ENCODING = 'utf8'

const parseJson = ({string, jsonParseDetailMessage = null}) => {
  try {
    return JSON.parse(string)
  } catch (e) {
    // TODO: readable message
    assert.fail(!!jsonParseDetailMessage ? `${jsonParseDetailMessage}\n${e}` : e)
  }
}

const getJsonFileContent = async (file, message, { mustExist, jsonParseDetailMessage } = {}) => {
  const exists = await assertFileExists(file, { message, mustExist })
  return exists ? parseJson({ string: fs.readFileSync(file, ENCODING), jsonParseDetailMessage }) : {}
}

const writeJsonFileContent = async (file, object) => {
  fs.writeFileSync(file, JSON.stringify(object, null, 2), ENCODING)
}

const assertFileExists = async (file, { message, mustExist = false }) => {
  try {
    fs.accessSync(file, fs.constants.R_OK)
    return true
  } catch (e) {
    if (mustExist) {
      assert.fail(
        message ||
          `${file} does not exist. Make sure you you've set it up correctly.`
      )
    }
    return false
  }
}

const getPackageJson = async directory => {
  return await getJsonFileContent(
    path.join(directory, 'package.json'),
    `the project must have a package.json, check: ${directory}`
  )
}

module.exports = {
  parseJson,
  getJsonFileContent,
  writeJsonFileContent,
  getPackageJson
}
