const { validateManifest } = require('../../scripts/setup/validate')

test('fails if manifest contains no id', () => {
  expect(() => {
    validateManifest({})
  }).toThrow()
})

test('fails if whitelist and blacklist are configured', () => {
  expect(() => {
    validateManifest({
      id: 'id',
      whiteList: [],
      blackList: []
    })
  }).toThrow()
})

test('fails if neither blackList nor whiteList is configured', () => {
  expect(() => {
    validateManifest({
      id: 'id'
    })
  }).toThrow()
})

test('succeeds if valid manifest has been passed', () => {
  expect(
    validateManifest({
      id: 'id',
      whiteList: []
    })
  )
})

test('fails if invalid whiteList has been passed', () => {
  expect(() => {
    validateManifest({
      id: 'id',
      whiteList: null
    })
  }).toThrow()
})

test('fails if whiteList with invalid data has been passed', () => {
  expect(() => {
    validateManifest({
      id: 'id',
      whiteList: [1]
    })
  }).toThrow()
})

test('succeeds if whiteList with valid data has been passed', () => {
  expect(
    validateManifest({
      id: 'id',
      whiteList: ['regex']
    })
  )
})
