# FE CLI

CLI to ease project setup and maintenance

## Dependencies

> Node v10

### How to Use

We've got good news for you: you don't have to download yet another global package 🎉

The CLI has two main commands:
 - `setup` - to initialize or update a project 
 - `build` - to build manifest information for a facade

One thing you have to configure however is your local `.goldclirc` file. It must be located in your home directory and shall contain a secured link to the registry.

For the Gold Facades this would be:

`.goldclirc`

```
{
    "registry": "https://bitbucket.org/!api/2.0/snippets/goldinteractive/LenKoB/files/registry.json"
}
```

### Structure

Registry:

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
      auth: 'basic',
      workspace: 'src' // <- location where the actual project is within the repo
    },
    "em": {
        ...
    }
}
```

Manifest:

```
{
    extends: ["sm", "bp", "em"]
}
```

#### Copy

These lists are regex! So make sure to escape where required...

```
{
    // exclusive
    "whiteList" | "blackList": ["globs"],

    // optional -> copy only if it does not exist yet
    "preserveList": ["globs"]
}
```

#### Dependencies

Read and parse package.json, extend where required

#### Merge

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
