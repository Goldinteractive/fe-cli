const path = require('path')

const tmpDir = 'tmp'
const facadeDownloadName = 'facadeDownload.zip'

module.exports = {
  configFileName: '.goldclirc',
  tmpDir,
  manifestFileName: 'manifest.json',
  facadeDownloadPath: path.join(tmpDir, facadeDownloadName),
  // TODO: currently these are unused
  snippetDefinition: {
    PREFIX: '@snippet',
    BEGIN_SUFFIX: 'begin',
    END_SUFFIX: 'end',
    SEPARATOR: ':'
  }
}
