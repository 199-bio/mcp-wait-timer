# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2025-03-29

### Fixed
- Use `z.coerce.number()` for `duration_seconds` to handle string inputs from clients like Claude Desktop.

## [0.1.5] - 2025-03-29

### Added
- `CHANGELOG.md` file.

## [0.1.4] - 2025-03-29

### Fixed
- Removed comments from the example JSON configuration block in `README.md`.

## [0.1.3] - 2025-03-29

### Added
- MIT `LICENSE` file.
- License section in `README.md`.

### Changed
- Updated `license` field in `package.json` to "MIT".

## [0.1.2] - 2025-03-29

### Fixed
- Refactored server code (`src/index.ts`) to align with MCP SDK examples (`Server` class, `setRequestHandler`).
- Reverted build script in `package.json` to use `tsc` instead of `esbuild`.

## [0.1.1] - 2025-03-29

### Fixed
- Attempted fix for `npx` execution using `esbuild` bundling (later reverted).
- Updated `package.json` build script to use `esbuild`.

## [0.1.0] - 2025-03-29

### Added
- Initial release of the `mcp-wait-timer` server.
- Basic `wait` tool functionality.
- Configuration for `npx` execution via `package.json` `bin` field.
