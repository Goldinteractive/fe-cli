const { handleResponseCode } = require('../../scripts/helpers/responseCode')

test('handles 200 as success', () => {
  expect(handleResponseCode('200')).toEqual({
    success: true
  })
})

test('handles 401 as failure', () => {
  expect(handleResponseCode('401')).toMatchObject({
    success: false
  })
})

test('handles 404 as failure', () => {
  expect(handleResponseCode('404')).toMatchObject({
    success: false
  })
})

test('handles 500 as failure', () => {
  expect(handleResponseCode('500')).toMatchObject({
    success: false
  })
})

test('fails if no parseable input has been received', () => {
  expect(() => {
    console.log(handleResponseCode('string'))
  }).toThrow()
})
