const assert = require('assert')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const question = require('../helpers/question')
const { handleResponseCode } = require('../helpers/responseCode')
const { facadeDownloadPath } = require('../config/constants')

const HTTPS_PREFIX = 'https://'

const curlZip = async ({ destination, url, additionalParam = '' }) => {
  assert.notStrictEqual(destination, undefined)
  assert.notStrictEqual(url, undefined)
  assert.ok(
    url.includes(HTTPS_PREFIX),
    `facade url must start with ${HTTPS_PREFIX}`
  )
  const curlCommand = `curl -s -L -w "%{http_code}" -o ${destination} ${additionalParam} ${url}`

  const { stdout } = await exec(curlCommand)

  const { success, message } = handleResponseCode(stdout)
  const failed = !success
  if (failed) {
    assert.fail(
      `there is an error fetching the zip, tried to fetch ${url}. ${message}`
    )
  }
}

const buildAuthHeader = (username, password) => {
  const base64 = Buffer.from(`${username}:${password}`).toString('base64')
  return `-H "Authorization: Basic ${base64}"`
}

const readBasicAuthFile = async url => {
  console.log(`Authentication is required for '${url}'.`)
  const username = await question({ question: 'Username: ' })
  const password = await question({ question: 'Password: ', isMuted: true })
  console.log('loading with credentials')
  const headers = buildAuthHeader(username, password)
  await curlZip({
    destination: facadeDownloadPath,
    url,
    additionalParam: headers
  })
}

const readNoneAuthFile = async url => {
  await curlZip({ destination: facadeDownloadPath, url })
}

const downloadFacadeConfiguration = async ({ auth, url }) => {
  console.info('download facade')
  switch (auth) {
    case 'basic':
      await readBasicAuthFile(url)
      break
    case 'none':
      await readNoneAuthFile(url)
      break
    default:
      assert.fail(`'${auth}' is an unknown auth method`)
  }
}

module.exports = {
  downloadFacadeConfiguration
}
