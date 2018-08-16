# FE CLI

Cli to ease project setup and maintenance

This is currently a **wip**

## Dependencies

> Node v10

### CLI

with optional custom working directory
`setup sm`
`build-manifest`

### Structure

`.goldclirc`

```
{
    "registry": "https://github.com/bliblablub"
}
```

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
