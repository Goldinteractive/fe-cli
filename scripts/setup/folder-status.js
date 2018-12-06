const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')

const folderStates = {
  NON_GIT: 'non_git',
  GIT_CLEAN: 'git_clean',
  GIT_WIP: 'git_wip'
}

const getFolderStatus = async cwd => {
  if (fs.existsSync(cwd)) {
    try {
      const repositoryStatus = await exec(`git status --porcelain=1`, {
        cwd
      })

      if (repositoryStatus.stdout.length === 0) {
        return folderStates.GIT_CLEAN
      } else {
        return folderStates.GIT_WIP
      }
    } catch (e) {
      return folderStates.NON_GIT
    }
  } else {
    return folderStates.NON_GIT
  }
}

module.exports = {
  getFolderStatus,
  folderStates
}
