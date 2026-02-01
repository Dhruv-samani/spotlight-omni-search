# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-01

### 🎉 Major Features

This is the **biggest update yet** with 4 major new features!

#### 1. Command Palette Templates

Pre-built templates for instant setup:

- **SaaS Dashboard Template** - Complete command palette for SaaS applications
- **Documentation Site Template** - Perfect for docs sites with search
- **Admin Panel Template** - Full-featured admin dashboard commands

Get started in 30 seconds with ready-to-use templates!

#### 2. Fuzzy File Search Plugin

VSCode-style file search built-in:

- Fuzzy matching on file paths
- File icons and metadata (size, last modified)
- Trigger with `@` prefix
- Customizable file selection handler

#### 3. Multi-Select Mode

Bulk actions made easy:

- Click to select multiple items
- Select All / Deselect All functionality
- Custom bulk actions support
- Visual feedback with checkboxes
- Action confirmation messages

#### 4. Tags & Categories System

Advanced filtering and organization:

- Tag-based filtering with `tag:name` syntax
- Visual tag badges with custom colors
- Category-based grouping
- Combined tag filtering (AND logic)
- Per-item and global tag color customization

### Added

- `SaaSDashboardTemplate` - Pre-built template for SaaS apps
- `DocsTemplate` - Pre-built template for documentation sites
- `AdminPanelTemplate` - Pre-built template for admin panels
- `FileSearchPlugin` - File search with fuzzy matching
- `multiSelect` prop to enable multi-select mode
- `onMultiSelect` callback for bulk actions
- `multiSelectActions` prop for custom bulk actions
- `MultiSelectAction` type export
- `tags` field to `SpotlightItem` type
- `category` field to `SpotlightItem` type
- `tagColors` field to `SpotlightItem` type (per-item)
- `tagColors` prop to `SpotlightProps` (global)
- `showTags` prop to control tag badge visibility
- `tagFilterPrefix` prop for custom tag filter syntax
- `TagConfig` type export
- Multi-Select demo in dev playground (`#multiselect`)
- Tags & Categories demo in dev playground (`#tags`)

### Changed

- Updated README with comprehensive documentation for all new features
- Enhanced Storybook with new stories for templates, file search, multi-select, and tags
- Improved dev playground with hash-based routing for demos

### Documentation

- Added Command Palette Templates section to README
- Added File Search Plugin section to README
- Added Multi-Select Mode section to README
- Added Tags & Categories section to README
- Created comprehensive Storybook stories for all new features
- Added interactive demos in dev playground

---

## [2.5.0] - 2025-01-XX

### Added

- Recent Searches Plugin - Track and display search history
- Unit Converter Plugin - Convert units (length, weight, temperature, currency)
- Bookmarks Plugin - Bookmark favorite commands
- Shortcuts Panel Plugin - Display keyboard shortcuts
- Command aliases support - Multiple names for same command

### Changed

- Improved fuzzy search algorithm
- Enhanced keyboard navigation
- Better mobile responsiveness

---

## [2.0.0] - 2024-XX-XX

### Added

- Initial public release
- 20+ pre-built themes
- Calculator plugin
- Virtual scrolling
- Async search support
- Nested commands
- Analytics plugin
- Google Analytics integration
- TypeScript support
- Keyboard navigation
- Confirmation dialogs
- Recent items tracking

---

## Links

- [GitHub Repository](https://github.com/Dhruv-samani/spotlight-omni-search)
- [NPM Package](https://www.npmjs.com/package/spotlight-omni-search)
- [Documentation](https://spotlight-omni-search-docs.netlify.app/)
