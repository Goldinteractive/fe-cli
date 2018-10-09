const assert = require('assert')

const validateManifest = manifest => {
  // TODO: check manifest.id is same as argv
  assert.notStrictEqual(
    manifest.id,
    undefined,
    'facade which is being applied does not contain any id - please make sure the facade has a proper manifest'
  )
  assert.ok(
    manifest.whiteList === undefined || manifest.blackList === undefined,
    'only either whiteList or blackList may be set - but not both'
  )
  assert.ok(
    manifest.whiteList !== undefined || manifest.blackList !== undefined,
    'either whiteList or blackList must be set (but not both)'
  )

  assert.ok(
    isUndefinedOrArray(manifest.whiteList),
    'whiteList must be an array of strings'
  )

  assert.ok(
    isUndefinedOrArray(manifest.blackList),
    'blackList must be an array of strings'
  )

  assert.ok(
    !manifest.whiteList || isContainingStrings(manifest.whiteList),
    'whiteList must only contain strings'
  )

  assert.ok(
    !manifest.blackList || isContainingStrings(manifest.blackList),
    'blackList must only contain strings'
  )
}

const isUndefinedOrArray = obj => obj === undefined || Array.isArray(obj)

const isContainingStrings = array => array.find(item => typeof item !== 'string') === undefined

module.exports = {
  validateManifest
}
