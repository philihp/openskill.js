# CLAUDE.md

## Dependency Versioning

All dependencies in `package.json` must be pinned to exact versions (no caret `^` or tilde `~` prefixes). This is important because:

- Prevents unintended minor/patch version changes
- Allows Renovate to manage updates deterministically
- Keeps version control clean with explicit version bumps

When updating dependencies:
1. Use `npm install package@version` to install a specific version
2. Remove any `^` or `~` prefixes in package.json
3. Verify tests pass before committing
