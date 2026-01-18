# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-01-18

### Added

- **🧮 Calculator Plugin**: Built-in math expression evaluator
  - Safe evaluation using Function constructor with strict validation
  - Supports operators: `+`, `-`, `*`, `/`, `%`, `^` (exponentiation)
  - Auto-copy results to clipboard
  - Configurable decimal precision
  - Security: Blocks dangerous patterns (function calls, object access, etc.)
- **🎭 Icon Flexibility**: Icons are now completely optional
  - Support for ANY icon library (Lucide, Material Icons, Heroicons, Font Awesome, etc.)
  - Support for custom SVG files from assets
  - Support for inline SVG elements
  - Support for emoji or plain text
  - Option to use no icons at all
- **📚 Documentation**: Added comprehensive `docs/ICONS.md` guide with examples for all major icon libraries
- **✨ UI/UX Polish**:
  - Enhanced footer with visual `<kbd>` keyboard shortcuts
  - Smooth animation keyframes (`spotlight-fade-in`, `spotlight-scale-in`, `spotlight-slide-down`)
  - Better spacing and organization
  - Conditional Vim navigation hints in footer

### Changed

- **Breaking**: `lucide-react` is no longer a required peer dependency (now optional)
- Updated `package.json` to mark `lucide-react` as optional via `peerDependenciesMeta`
- Updated README to reflect optional icons and showcase Calculator plugin
- Package description now mentions "Built-in Calculator"

### Fixed

- Calculator plugin no longer forces users to install `lucide-react`
- Icons can now be customized per plugin/item without library restrictions

## [2.3.2] - Previous Release

### Features

- SpotlightProvider simplified API
- SearchTrigger component
- Virtual scrolling for large datasets
- 20+ built-in themes
- Async search support
- Privacy obfuscation for localStorage
- Full keyboard navigation
- Vim navigation support
- Undo/Redo for search queries
- Confirmation dialogs for destructive actions
- Command arguments support
- Google Analytics plugin
- Analytics plugin

---

## Migration Guide: v2.3.2 → v2.4.0

### Icons (Optional Breaking Change)

If you were relying on default icons, you now need to explicitly provide them:

**Before (v2.3.2):**

```tsx
CalculatorPlugin(); // Used Lucide icons automatically
```

**After (v2.4.0):**

```tsx
// Option 1: Add Lucide icon explicitly
import { Calculator } from "lucide-react";
CalculatorPlugin({ icon: <Calculator size={16} /> });

// Option 2: Use your preferred library
import CalculateIcon from "@mui/icons-material/Calculate";
CalculatorPlugin({ icon: <CalculateIcon fontSize="small" /> });

// Option 3: No icon
CalculatorPlugin(); // Works fine without icon!
```

### Installation

**Before:**

```bash
npm install spotlight-omni-search lucide-react
```

**After:**

```bash
npm install spotlight-omni-search
# Optional: Install your preferred icon library
npm install lucide-react
# OR
npm install @mui/icons-material
# OR use custom SVGs
```

---

## Upgrade Instructions

```bash
npm install spotlight-omni-search@latest
```

If you use icons, ensure you have your preferred icon library installed. See [docs/ICONS.md](docs/ICONS.md) for examples.
