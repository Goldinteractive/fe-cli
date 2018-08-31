#!/usr/bin/env node

const command = process.argv[2]
const arguments = process.argv.slice(3)

switch (command) {
  case 'setup':
    require('./setup')(...arguments)
    break

  case 'build':
    require('./build')(...arguments)
    break

  default:
    console.log('Available Commands:')
    console.log('setup <facade> [working directory]')
    console.log('build [working directory]')
    break
}
