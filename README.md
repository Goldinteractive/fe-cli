# Gold Frontend CLI 👾

This CLI enables you to create and maintain projects using `facades`.

A `facade` is a part of an application providing some functionality. The goal is to easily setup a project using multiple facades and being able to udpate them individually.

## Dependencies

> Node v10, `yarn`, `curl`, `unzip`

## Setup

We've got good news for you: There is no need to download yet another global package 🎉

> Because `fe-cli` is dependency free it's really fast to download it.

One thing you have to configure however is your local `.goldclirc` file. It must be located in your home directory and must contain a registry link.

For the Gold Facades this would be:

`.goldclirc`
```
{
    "registry": "https://bitbucket.org/!api/2.0/snippets/goldinteractive/LenKoB/files/registry.json"
}
```

## Commands

The CLI has two main commands:
 - `setup` - to initialize or update a project
 - `build` - to build manifest information for a facade

### `setup`

This command initializes a project using the given facade. Check out the registry to see the available facades.

In order to set up the `sackmesser` facade (`sm`):

`npx gold-cli setup sm`

> If you want to set the working directory, pass it as second argument: `npx gold-cli setup sm new-project-directory`

### `build`

This command initializes a `manifest.json`. Please note, that you still have to do `whiteList` and `id` configuration by yourself.

Currently it only extracts the dependencies into the manifest.

`npx gold-cli build`

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

### Manifest

The manifest represents the meta information of a project as well as a facade (Facades act as projects as well)

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

```
{
    // XOR (only one of both)
    "whiteList" | "blackList": ["regex"],

    // optional -> copy only if it does not exist yet
    "preserveList": ["regex"]
}
```

#### Dependencies

The `build` script automatically generates the `dependencies` and `devDependencies` section of the given manifest.

On installation it will match the given dependencies and install the ones which are missing.

#### Merge

Merge specific snippets of a file

> this is not yet implemented!

```
{
    "snippets": {
        "frontend/js/main.js": {
            "import": "import xyz from 'test';"
        }
    }
}
```
