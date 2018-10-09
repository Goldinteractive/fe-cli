const util = require('util')
const exec = util.promisify(require('child_process').exec)
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const homedir = require('os').homedir()
const {
  getJsonFileContent,
  writeJsonFileContent,
  getPackageJson,
  parseJson
} = require('../helpers/common')
const question = require('../helpers/question')
const { buildEmptyManifest } = require('../helpers/manifest')
const {
  configFileName,
  tmpDir,
  manifestFileName,
  facadeDownloadPath
} = require('../config/constants')
const { downloadFacadeConfiguration } = require('./facade-download-helper')
const { validateManifest } = require('./validate')

const makeTmpDir = async () => {
  try {
    await exec(`mkdir ${tmpDir}`)
  } catch (e) {
    assert.fail(
      `folder '${tmpDir}' does already exist. This folder must be used by the cli as a tmp working directory and will be deleted after it finished. Please delete this folder.`
    )
  }
}

const deleteTmpDir = async () => {
  await exec(`rm -rf ${tmpDir}`)
}

const walk = async function(dir, root) {
  if (root === undefined) {
    root = dir
  }
  let results = []
  const list = await readdir(dir)
  for await (let file of list) {
    file = path.resolve(dir, file)
    const statResult = await stat(file)
    if (statResult && statResult.isDirectory()) {
      const res = await walk(file, root)
      results = results.concat(res)
    } else {
      const relative = path.relative(root, file)
      results.push(relative)
    }
  }
  return results
}

const fileExists = async file => {
  try {
    await exec(`test -f ${file}`)
    return true
  } catch (e) {
    return false
  }
}

const processStringListToRegexList = list => {
  return list.map(entry => new RegExp(entry))
}

const matchListOnEntry = (list, entry) => {
  return list.find(reg => entry.match(reg) !== null)
}

const processManifest = manifest => {
  return {
    ...manifest,
    blackList:
      manifest.blackList && processStringListToRegexList(manifest.blackList),
    whiteList:
      manifest.whiteList && processStringListToRegexList(manifest.whiteList),
    preserveList:
      manifest.preserveList &&
      processStringListToRegexList(manifest.preserveList)
  }
}

const mvFileIfNotInPreserve = async (
  file,
  { facadeLocation, fileLocation, preserveList }
) => {
  const currentVersionShouldBeKept =
    matchListOnEntry(preserveList, file) && (await fileExists(fileLocation))
  if (!currentVersionShouldBeKept) {
    await exec(`mkdir -p ${path.dirname(fileLocation)}`)
    // TODO: mv instead of cp
    await exec(`cp -f ${facadeLocation}/${file} ${fileLocation}`)
  }
}

const applyFacadeManifest = async (facadeLocation, cwd) => {
  const manifestLocation = path.join(facadeLocation, manifestFileName)
  const manifest = await getJsonFileContent(
    manifestLocation,
    `facade must contain a manifest. Check ${manifestLocation}`
  )

  validateManifest(manifest)
  const {
    blackList,
    whiteList,
    preserveList = [],
    dependencies,
    devDependencies
  } = processManifest(manifest)

  const files = await walk(facadeLocation)
  assert.notStrictEqual(
    files,
    undefined,
    'sorry, it seems as if there are no files in the release folder'
  )

  for await (let file of files) {
    const fileLocation = path.join(cwd, file)
    // TODO: refactor -> extract matcher to independent logic...
    if (file !== manifestFileName) {
      if (blackList !== undefined) {
        if (!matchListOnEntry(blackList, file)) {
          await mvFileIfNotInPreserve(file, {
            facadeLocation,
            fileLocation,
            preserveList
          })
        }
      } else {
        if (matchListOnEntry(whiteList, file)) {
          await mvFileIfNotInPreserve(file, {
            facadeLocation,
            fileLocation,
            preserveList
          })
        }
      }
    }
  }

  const destPackage = await getPackageJson(cwd)

  await installMissingDependencies(
    {
      dependencies,
      devDependencies
    },
    destPackage,
    cwd
  )

  await buildManifest({ cwd, appliedManifest: manifest })
}

const installMissingDependencies = async (
  sourceDependencies,
  destDependencies,
  destDir
) => {
  await installMismatchDependencies(
    sourceDependencies.devDependencies,
    destDependencies.devDependencies,
    '-D',
    destDir
  )
  await installMismatchDependencies(
    sourceDependencies.dependencies,
    destDependencies.dependencies,
    '',
    destDir
  )
}

const installMismatchDependencies = async (
  source,
  dest = {},
  flag,
  destDir
) => {
  let dependencyString = ''
  for (let dependency in source) {
    // TODO: check version & check if any dependencies exist at all...
    if (!dest[dependency]) {
      const version = source[dependency]
      dependencyString += ` ${dependency}@${version}`
    }
  }
  if (dependencyString.length > 0) {
    await exec(`yarn add ${flag} ${dependencyString}`, {
      cwd: destDir
    })
  }
}

const buildManifest = async ({ cwd, appliedManifest }) => {
  const manifestLocation = path.join(cwd, manifestFileName)
  const alreadyHasManifest = await fileExists(manifestLocation)
  const manifest = alreadyHasManifest
    ? await getJsonFileContent(manifestLocation)
    : await buildEmptyManifest()
  if (!manifest.extends) {
    manifest.extends = []
  }
  if (!manifest.extends.includes(appliedManifest.id)) {
    manifest.extends.push(appliedManifest.id)
  }

  writeJsonFileContent(manifestLocation, manifest)
}

const setupFacade = async (facadeConfiguration, cwd) => {
  await makeTmpDir()

  try {
    await downloadFacadeConfiguration(facadeConfiguration)

    console.info('unzip facade')
    const extractedFolderName = path.join(tmpDir, 'extracted')
    await exec(`unzip -q -o ${facadeDownloadPath} -d ${extractedFolderName}`)

    console.info('apply facade')
    const files = fs.readdirSync(extractedFolderName)
    assert.equal(
      files.length,
      1,
      `expected one file in extracted zip, found ${
        files.length
      } files. Make sure the ${tmpDir} is clean and the facade package contains only one root directory`
    )

    const folderName = path.join(
      extractedFolderName,
      files[0],
      facadeConfiguration.workspace || ''
    )

    await applyFacadeManifest(folderName, cwd)
  } finally {
    console.info('delete tmp folder')
    await deleteTmpDir()
  }
}

module.exports = async (facade, cwd = './') => {
  const fullWorkingDirectory = path.join(process.cwd(), cwd)
  const confirm = await question({
    question: `Do you want to install into '${fullWorkingDirectory}'? y/n >`
  })
  if (confirm !== 'y') {
    console.log('No setup executed.')
    return
  }

  // validation
  assert.notStrictEqual(facade, undefined, 'please provide a facade identifier')

  // read config
  const file = `${homedir}/${configFileName}`

  const config = await getJsonFileContent(
    file,
    `Did not find ${file}. Please create this file. (execute 'touch ${file}')`,
    {
      mustExist: true,
      jsonParseDetailMessage: `Could not parse ${file}. Make sure it contains valid JSON.`
    }
  )
  assert.notStrictEqual(
    config.registry,
    undefined,
    `${file} does not contain key 'registry'. Make sure you set a url to the registry.`
  )

  // fetch registry
  const registryResponse = await exec(`curl -L -q ${config.registry}`)
  const registry = parseJson({
    string: registryResponse.stdout,
    jsonParseDetailMessage: `The registry could not be read, please check it contains valid JSON formatted data. Tried to fetch ${
      config.registry
    }`
  })

  assert.notStrictEqual(
    registry,
    undefined,
    'registry must be at least an empty object ({})'
  )

  // read facade configuration
  const facadeConfiguration = registry[facade]

  assert.notStrictEqual(
    facadeConfiguration,
    undefined,
    `entry '${facade}' is unknown in registry ${config.registry}`
  )

  await setupFacade(facadeConfiguration, cwd)
}
