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
    console.error('unknown command, use either setup or build')
    break
}
