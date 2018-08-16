const readline = require('readline')
const Writable = require('stream').Writable

module.exports = async ({ question = 'Please enter ', isMuted = false }) => {
  const mutableStdout = new Writable({
    write: function(chunk, encoding, callback) {
      if (!this.muted) process.stdout.write(chunk, encoding)
      callback()
    }
  })

  mutableStdout.muted = false

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: isMuted ? mutableStdout : process.stdout,
      terminal: true
    })
    rl.question(question, answer => {
      rl.close()
      resolve(answer)
    })
    mutableStdout.muted = true
  })
}
