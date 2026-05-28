# vue-js-lowcode-conversion

A minimal VS Code extension that packages and installs the `vue-js-lowcode-conversion` Copilot skill into the current user's `~/.copilot/skills` directory.

The root `SKILL.md` is the single source of truth for the bundled Copilot skill.

## Features

- Install or update the bundled Copilot skill
- Open the installed skill folder in your OS file explorer
- Open the bundled `SKILL.md` shipped inside the extension

## Commands

- `VueToJS: Install or Update Copilot Skill`
- `VueToJS: Open Installed Skill Folder`
- `VueToJS: Open Bundled Skill File`

## Development

```powershell
npm install
npm run compile
```

## Package VSIX

```powershell
npm install
npm run package
```

The generated `.vsix` file can be uploaded to a GitHub Release and installed on another machine with:

```powershell
code --install-extension .\<extension-name>-<version>.vsix
```

## Release Process

See [RELEASE.md](RELEASE.md) for the generic version bump, packaging, tag, and GitHub Release steps.

## Automated Release

This repository includes [release.yml](.github/workflows/release.yml) for automated publishing.

- Push a tag like `v0.0.2` to trigger auto release.
- Or run the workflow manually and provide a tag.
- The workflow compiles, packages the `.vsix`, creates/updates the GitHub Release, and uploads the `.vsix` asset.

## Publish to Visual Studio Marketplace

This repository includes [marketplace-publish.yml](.github/workflows/marketplace-publish.yml).

Prerequisites:

- You have created a Publisher in Visual Studio Marketplace.
- `package.json` `publisher` matches your Marketplace Publisher ID.
- GitHub repository secret `VSCE_PAT` is configured (a Marketplace Personal Access Token).

How to trigger:

- Push a tag like `v0.0.2`, or
- Run `Publish to VS Marketplace` manually in GitHub Actions.
