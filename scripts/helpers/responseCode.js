const assert = require('assert')

const UNAUTHORIZED = 401
const NOT_FOUND = 404

const fail = message => ({
  failed: true,
  message
})

const handleResponseCode = responseCode => {
  let code
  try {
    code = parseInt(responseCode)
  } catch (e) {
    assert.fail(`expected response code to be integer, got ${responseCode}`)
  }
  if (code < 400) {
    return {
      failed: false
    }
  }
  switch (code) {
    case UNAUTHORIZED:
      return fail(
        `you're not authorized to access this resource. Make sure you passed the right credentials and the registry is using the corresponding 'auth' mode.`
      )
    case NOT_FOUND:
      return fail(
        `the requested resource is not present on the server. Check your manifest.`
      )
    default:
      return fail(`Unknown error occured, got response code: ${code}`)
  }
}

module.exports = {
  handleResponseCode
}
