const question = require('./question')

const YES = 'y'
const NO = 'n'

module.exports = async ({ sentence }) => {
  let response = ''
  while (response != YES && response !== NO) {
    response = await question({
      question: sentence + ` (${YES}/${NO}) >`
    })
  }
  return response === YES
}
