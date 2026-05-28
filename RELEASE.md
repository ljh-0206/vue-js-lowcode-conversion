# Release Guide

This project uses a reusable manual release flow.

## Preferred Path

Prefer automated publishing with GitHub Actions workflow:

- `.github/workflows/release.yml`
- Workflow name: `Release VSIX`

Manual release remains available as a fallback.

## Automated Release (Recommended)

### Option A: Push tag to trigger

```powershell
git push origin main
```

### Option B: Run workflow manually

1. Open GitHub repository -> `Actions` -> `Release VSIX`.
2. Click `Run workflow`.
3. Optional: provide custom tag input (default is `latest`).

The workflow will:

- install dependencies
- compile extension
- package `.vsix`
- create/update GitHub Release (`latest` by default)
- upload `.vsix` as release asset

## Scope

- The root `SKILL.md` is the single source of truth for conversion rules.
- The extension version in `package.json` must match the Git tag and the `.vsix` file name.
- Release asset naming follows: `<extension-name>-<version>.vsix`

Run all commands from the repository root.

## Standard Release Steps

Use this section only when you intentionally run a manual release from local machine.

### 1. Update source files

Update files as needed:

- `SKILL.md` for rule changes
- `README.md` for user-facing behavior changes
- `CHANGELOG.md` for release notes

### 2. Bump version

Edit `package.json` and update:

- `version`

Example:

```json
"version": "0.0.2"
```

### 3. Rebuild the VSIX

```powershell
npm run compile
npm run package
```

Expected artifact:

```powershell
.\<extension-name>-0.0.2.vsix
```

### 4. Commit changes

```powershell
git add .
git commit -m "chore: release v0.0.2"
```

### 5. Create and push tag

```powershell
git tag -a v0.0.2 -m "Release v0.0.2"
git push origin main
git push origin v0.0.2
```

### 6. Create GitHub Release

```powershell
gh auth status
gh release create v0.0.2 '.\<extension-name>-0.0.2.vsix' --title 'v0.0.2' --notes 'See CHANGELOG.md for release details.'
```

## Release Checklist

- `SKILL.md` has the final rules
- `package.json` version is updated
- `CHANGELOG.md` is updated
- `npm run compile` passes
- `npm run package` produces the expected `.vsix`
- Git commit is created
- Commit is pushed to `main`
- GitHub Actions `Release VSIX` run succeeds (recommended path)
- GitHub Release is created with the `.vsix` asset

## Quick Template

When releasing a normal update, run:

```powershell
npm run compile
npm run package
git add .
git commit -m "chore: release update"
git push origin main
```

Optional custom tagged release:

```powershell
gh workflow run release.yml -f tag=v0.0.2
```
