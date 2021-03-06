# Gold Frontend CLI 👾
[![npm version](https://badge.fury.io/js/gold-cli.svg)](https://badge.fury.io/js/gold-cli)
[![Maintainability](https://api.codeclimate.com/v1/badges/7f8e0ed42be79c218158/maintainability)](https://codeclimate.com/github/Goldinteractive/fe-cli/maintainability)

This CLI enables you to create and maintain projects using `facades`.

A `facade` is a part of an application providing some functionality. The goal is to easily setup a project using multiple facades and being able to udpate them individually.

## Setup

### Dependencies

> Node v10, `yarn`, `git`, `curl`, `unzip`

### "Installation"

We've got good news for you: There is no need to download yet another global package 🎉

> Because `fe-cli` does not have any npm dependencies it's really fast to download.

One thing you have to configure however is your local `.goldclirc` file. *It must be located in your home directory and must contain a registry link*.

For the Gold Facades this would be:

`.goldclirc`
```
{
    "registry": "https://bitbucket.org/!api/2.0/snippets/goldinteractive/LenKoB/files/registry.json"
}
```

## Commands

The CLI has one main command:
 - `setup` - to initialize or update a project

### `setup`

This command initializes a project using the given facade. Check out the registry to see the available facades.

In order to set up the `sackmesser` facade (`sm`):

`npx gold-cli setup sm`

> If you want to set the working directory, pass it as second argument: `npx gold-cli setup sm new-project-directory`

## Structure

### Registry

A registry is an object containing children using this structure:

| property      | required      | example  | description |
| ------------- |:-------------:| ---------| ------------|
| `name`          | ➖             | sackmesser | the full name for the given facade |
| `url`           | ✅             | https://github.com/Goldinteractive/Sackmesser/archive/release.zip | a url where you can find the zip. |
| `auth`          | ✅             | `basic` or `none` | how to fetch the url |
| `workspace`     | ➖             | `anyDirectory/evenNested` | when the zip is extracted, where is the actual source of the repository? |

Note that the `key` of the given child represents the name one has to pass to the CLI.

In order to run `setup xyz` one has to configure the registry as:

```
{
    "xyz": { name, url, auth, workspace }
}
```

A more specific example:
```
{
    "sm": {
      name: 'sackmesser',
      url: 'https://github.com/Goldinteractive/Sackmesser/archive/release.zip',
      auth: 'none'
    },
    "bp": {
      name: 'blueprint',
      url: 'https://bitbucket.org/goldinteractive/craft-blueprint/get/master.zip',
      auth: 'basic', // <- prompt for username and password 
      workspace: 'src' // <- location where the actual project is within the repo
    },
    "em": {
        ...
    }
}
```
#### Authentication

##### Bitbucket

For Bitbucket you can not use your default credentials. Bitbucket uses a system called "App passwords".
If the CLI prompts you with an username and password for objects hosted on Bitbucket you need to use
your "App password" credentials.

To create such credentials follow the link: https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html

### Manifest

The manifest represents the meta information of a project as well as a facade (Facades act as projects as well)

This is a quick overview of the different properties. See the sections below for more detailed information.

| property      | required      | type  | info |
| ------------- |:-------------:| ---------| ------------|
| `id`          | ✅             | string | unique id matching the registry key |
| `extends`          | ➖            | string | See `extension` section |
| `blackList`           | (➖)            | regex array | See `copy` section |
| `whiteList`          | (➖)             | regex array | See `copy` section |
| `preserveList`     | (➖)             | regex array | See `copy` section |

The following sections explain the different parts of a manifest.


#### Extension

A project can use multiple facades, in order to set it up correctly apply them in the _logical_ order and it will generate the corresponding `extends` configuration for you.
```
{
    extends: ["sm", "bp", "em"]
}
```

#### Copy

A facade must configure the assets which shall be copied upon setup.

> The entries of the lists are treated as regex! So make sure to escape where required.

> All files are tested against these lists, so the file `/package.json` will be checked as `package.json`

If you want to copy a root directory, you can use the `^` syntax. So e.g. to copy the `frontend` use `^frontend` as regex.

```
{
    // XOR (only one of both)
    "whiteList" | "blackList": ["regex"],

    // optional -> copy only if it does not exist yet
    "preserveList": ["regex"]
}
```

## Development

### Execute local version
There is a npm script to run the cli locally: `npm run main setup xyz ...`

### Run tests
This project uses Jest for unit testing, simply run: `yarn run test`.

### Publish version

It's not required to run any build process before publishing.

Just be sure to run the tests before publishing.

This package is published using:

`yarn publish`

`git push --tags`

> Note that the last published version will automatically be used by all consumers. So be careful when publishing.