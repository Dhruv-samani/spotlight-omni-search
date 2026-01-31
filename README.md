# spotlight-omni-search 🔍

[![npm version](https://img.shields.io/npm/v/spotlight-omni-search.svg?style=flat-square)](https://www.npmjs.com/package/spotlight-omni-search)
[![npm downloads](https://img.shields.io/npm/dm/spotlight-omni-search.svg?style=flat-square)](https://www.npmjs.com/package/spotlight-omni-search)
[![bundle size](https://img.shields.io/bundlephobia/minzip/spotlight-omni-search?style=flat-square)](https://bundlephobia.com/package/spotlight-omni-search)
[![license](https://img.shields.io/npm/l/spotlight-omni-search.svg?style=flat-square)](https://github.com/Dhruv-samani/spotlight-omni-search/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Dhruv-samani/spotlight-omni-search?style=flat-square)](https://github.com/Dhruv-samani/spotlight-omni-search)

🔗 **[Live Demo & Documentation](https://spotlight-omni-search-docs.netlify.app/)** | [GitHub](https://github.com/Dhruv-samani/spotlight-omni-search)

A professional, **Tailwind-Native** Spotlight Search component for React and Next.js. Engineered to blend perfectly into your existing design system without shipping any global CSS resets or side effects.

---

## 🚀 Features

- **🎯 Simple Setup**: One-line integration with `SpotlightProvider`.
- **🔘 Pre-styled Components**: Includes a beautiful `SearchTrigger` button.
- **🧮 Built-in Calculator**: Type `2 + 2` and get instant results!
- **🔄 Unit Converter** (NEW): Convert `100 km to miles`, `32 F to C`, and more!
- **🔍 Recent Searches** (NEW): Track and re-run previous searches.
- **⭐ Bookmarks** (NEW): Star your favorite commands for quick access.
- **⌨️ Shortcuts Panel** (NEW): Press `?` to view all keyboard shortcuts.
- **🏷️ Command Aliases** (NEW): Find commands with alternative names (e.g., "prefs" → "Settings").
- **⚡ Performance**: Virtual scrolling for 1000+ items and instant search.
- **🎨 Theming**: 20+ pre-built themes (Dark, Light, Slate, Blue, etc.).
- **🛠️ Advanced**: Async search, command arguments, and undo/redo support.
- **🔒 Privacy**: Built-in data obfuscation for history and recent items.
- **⌨️ Accessibility**: Full keyboard navigation (`Cmd+K`, Arrow keys).
- **🎭 Icon Flexibility**: Use any icon library (Lucide, Material, Heroicons) or custom SVGs.

---

## 📊 Why Choose spotlight-omni-search?

| Feature                   | spotlight-omni-search           | cmdk              | kbar              |
| ------------------------- | ------------------------------- | ----------------- | ----------------- |
| **Built-in Calculator**   | ✅ Math expressions             | ❌                | ❌                |
| **Unit Converter** (NEW)  | ✅ Length, weight, temp, volume | ❌                | ❌                |
| **Recent Searches** (NEW) | ✅ Smart history                | ❌                | ❌                |
| **Bookmarks** (NEW)       | ✅ Star favorites               | ❌                | ❌                |
| **Shortcuts Panel** (NEW) | ✅ Press `?` to view            | ❌                | ❌                |
| **Command Aliases** (NEW) | ✅ Alternative names            | ❌                | ❌                |
| **Pre-built Themes**      | ✅ 20+ themes                   | ❌ Manual styling | ❌ Manual styling |
| **Tailwind-Native**       | ✅ No CSS conflicts             | ⚠️ Custom CSS     | ⚠️ Custom CSS     |
| **Virtual Scrolling**     | ✅ Built-in                     | ❌                | ❌                |
| **Trigger Button**        | ✅ Pre-styled                   | ❌ Build your own | ❌ Build your own |
| **Async Search**          | ✅                              | ✅                | ✅                |
| **Nested Commands**       | ✅ Plugin                       | ✅                | ✅                |
| **Analytics Plugin**      | ✅ Built-in                     | ❌                | ❌                |
| **Bundle Size**           | ~15KB gzipped                   | ~12KB             | ~10KB             |
| **TypeScript**            | ✅                              | ✅                | ✅                |

**Perfect for:** Teams who want a **ready-to-use** command palette with minimal setup and beautiful defaults.

---

## �📦 Installation

```bash
npm install spotlight-omni-search
```

> **Note**: Icons are optional! Use any icon library you prefer (Lucide, Material Icons, Heroicons, custom SVGs, or no icons). See [Icon Guide](docs/ICONS.md) for examples.

---

## ⚡ Quick Start

### Next.js App Router (Recommended)

```tsx
// app/layout.tsx
"use client";
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/next";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();

  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "docs", label: "Documentation", route: "/docs" },
    {
      id: "theme",
      label: "Toggle Theme",
      action: () => console.log("Theme toggled"),
    },
  ];

  return (
    <html lang="en">
      <body>
        <SpotlightProvider
          items={items}
          onNavigate={(path) => router.push(path)}
          theme="dark" // Try: 'light', 'slate', 'blue', 'rose'
        >
          <nav className="p-4 border-b">
            <SearchTrigger /> {/* Auto-wired Cmd+K button */}
          </nav>
          {children}
        </SpotlightProvider>
      </body>
    </html>
  );
}
```

### React / Vite

```tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const items = [{ id: "dashboard", label: "Dashboard", route: "/dashboard" }];

  return (
    <SpotlightProvider items={items} onNavigate={navigate}>
      <div className="p-4">
        <SearchTrigger />
      </div>
    </SpotlightProvider>
  );
}
```

---

## 🧩 Advanced Usage

### Asynchronous Search (APIs)

Fetch results dynamically as the user types.

```tsx
<SpotlightProvider
  items={staticItems}
  onSearch={async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return await response.json(); // Returns SpotlightItem[]
  }}
  onNavigate={navigate}
>
  {/* ... */}
</SpotlightProvider>
```

### Destructive Actions with Confirmation

Prevent accidental actions with built-in confirmation dialogs.

```tsx
const items = [
  {
    id: "delete-account",
    label: "Delete Account",
    group: "Danger Zone",
    confirm: {
      title: "Are you sure?",
      message: "This action cannot be undone.",
      type: "danger", // Red color theme
    },
    action: () => deleteAccount(),
  },
];
```

### Command Arguments

Create powerful commands that accept user input (e.g., "Google [query]").

```tsx
{
  id: "google-search",
  label: "Search Google",
  expectsArguments: true, // Captures text after the command
  action: (query) => window.open(`https://google.com/search?q=${query}`)
}
```

### Built-in Calculator Plugin 🧮

Evaluate math expressions directly in the search bar!

```tsx
import { SpotlightProvider } from "spotlight-omni-search/next";
import { CalculatorPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    CalculatorPlugin({
      enableClipboardCopy: true, // Auto-copy result to clipboard
      precision: 10, // Decimal precision
      icon: <YourIconComponent /> // Optional: any icon library
    })
  ]}
  onNavigate={navigate}
>
```

**Try it:**

- Type `2 + 2` → Get `4`
- Type `(10 + 5) * 2` → Get `30`
- Type `2 ^ 8` → Get `256`
- Press Enter to copy result to clipboard!

**Supported operators:** `+`, `-`, `*`, `/`, `%`, `^` (exponentiation)

**Security:** Safe evaluation - blocks dangerous code like `alert()`, `window`, etc.

### 🔄 Unit Converter Plugin (NEW in v2.5.0)

Convert units on the fly - length, weight, temperature, and volume!

```tsx
import { UnitConverterPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    UnitConverterPlugin({
      enableClipboardCopy: true,
      icon: <RulerIcon />
    })
  ]}
>
```

**Try it:**

- Type `100 km to miles` → Get `62.14 miles`
- Type `32 F to C` → Get `0°C`
- Type `5 kg to pounds` → Get `11.02 lb`
- Type `2 liters to gallons` → Get `0.53 gal`

**Supported conversions:** Length, Weight, Temperature, Volume

### 🔍 Recent Searches Plugin (NEW in v2.5.0)

Track and display search history for quick access.

```tsx
import { RecentSearchesPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    RecentSearchesPlugin({
      maxSearches: 10,
      showInResults: true,
      enableObfuscation: true // Privacy protection
    })
  ]}
>
```

**Features:**

- Shows recent searches when input is empty
- Click to re-run previous searches
- Privacy-protected with obfuscation
- "Clear Recent Searches" action

### ⭐ Bookmarks Plugin (NEW in v2.5.0)

Star your favorite commands for quick access!

```tsx
import { BookmarksPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    BookmarksPlugin({
      maxBookmarks: 20,
      showAtTop: true,
      bookmarkIcon: <StarIcon />
    })
  ]}
>
```

**Features:**

- Bookmark frequently used commands
- Bookmarks appear at top of results
- Manage and clear bookmarks
- Persistent across sessions

### ⌨️ Keyboard Shortcuts Panel (NEW in v2.5.0)

Never forget a shortcut again!

```tsx
import { ShortcutsPanelPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    ShortcutsPanelPlugin({
      triggerKey: '?',
      customShortcuts: [
        { key: 'Ctrl+B', description: 'Bookmark item', category: 'Actions' }
      ]
    })
  ]}
>
```

**Features:**

- Press `?` to view all shortcuts
- Organized by category
- Add custom shortcuts
- Searchable reference

### 🏷️ Command Aliases (NEW in v2.5.0)

Make commands easier to find with alternative names!

```tsx
const items = [
  {
    id: "settings",
    label: "Settings",
    aliases: ["preferences", "config", "options", "prefs"],
    route: "/settings",
  },
];
```

**Benefits:**

- Type "prefs" → finds "Settings"
- Type "config" → finds "Settings"
- More forgiving search
- Better discoverability

---

### Built-in Calculator Plugin 🧮

Evaluate math expressions directly in the search bar!

```tsx
import { SpotlightProvider } from "spotlight-omni-search/next";
import { CalculatorPlugin } from "spotlight-omni-search";

<SpotlightProvider
  items={items}
  plugins={[
    CalculatorPlugin({
      enableClipboardCopy: true, // Auto-copy result to clipboard
      precision: 10, // Decimal precision
      icon: <YourIconComponent /> // Optional: any icon library
    })
  ]}
  onNavigate={navigate}
>
```

**Try it:**

- Type `2 + 2` → Get `4`
- Type `(10 + 5) * 2` → Get `30`
- Type `2 ^ 8` → Get `256`
- Press Enter to copy result to clipboard!

**Supported operators:** `+`, `-`, `*`, `/`, `%`, `^` (exponentiation)

**Security:** Safe evaluation - blocks dangerous code like `alert()`, `window`, etc.

### 📊 Analytics Plugin

Track searches and selections locally.

```tsx
import { AnalyticsPlugin } from "spotlight-omni-search";

const analytics = AnalyticsPlugin({
  enableSessionTracking: true,
  onSearch: (query) => console.log("Searching:", query),
  onSelect: (id, type) => console.log("Selected:", id),
});

// ... inside plugins prop
plugins: [analytics];

// Export data later
console.log(analytics.exportData("csv"));
```

### 📈 Google Analytics 4

seamless integration with GA4.

```tsx
import { GoogleAnalyticsPlugin } from "spotlight-omni-search";

plugins: [
  GoogleAnalyticsPlugin({
    measurementId: "G-XXXXXXXXXX",
    enableDebug: true, // Log events to console
    loadScript: true, // Auto-inject GA script
  }),
];
```

### 🪜 Nested Commands Plugin

Create folder-like navigation structures. When an item with `items` array is selected, it "zooms in" to those items.

```tsx
import { NestedCommandsPlugin } from "spotlight-omni-search";
import { NestedPlugin } from "spotlight-omni-search/plugins/nested"; // or from main export if available

plugins: [
  NestedCommandsPlugin({
    backKey: "Backspace", // 'Backspace' or 'Escape' to go up a level
  }),
];

// Item Structure
const items = [
  {
    id: "settings",
    label: "Settings",
    items: [
      // Children
      { id: "profile", label: "Profile" },
      { id: "billing", label: "Billing" },
    ],
  },
];
```

### ⚡ Virtual Scrolling Plugin

Optimize performance for large lists by rendering only a window of results.

```tsx
import { VirtualScrollingPlugin } from "spotlight-omni-search";

plugins: [
  VirtualScrollingPlugin({
    windowSize: 20, // Only render 20 items at a time
    itemHeight: 40,
  }),
];
```

---

## 🎨 Layouts & Themes

**Themes**: `light` `dark` `slate` `rose` `blue` `orange` `emerald` `violet` ... (and many more)

**Layouts**:

- `center`: Classic modal (default)
- `top`: Command palette style
- `fullscreen`: Immersive search
- `side-right`: Drawer style

```tsx
<SpotlightProvider
  theme="midnight"
  layout="top"
  items={items}
>
```

---

## 💅 Custom Styling

You can granularly style every part of the component using `classNames` or specific props like `headerClassName`.

```tsx
<SpotlightProvider
  // ... other props
  className="shadow-2xl rounded-xl border-blue-100" // Main container style
  headerClassName="z-[9999] border-b-2 border-primary" // Header style
  itemClassName="hover:bg-primary/10 transition-colors" // Default item style

  // Advanced: Granular overrides still available
  classNames={{
    itemSelected: 'bg-primary/20'
  }}
>
```

---

## 🔒 Privacy & Security

Spotlight automatically **obfuscates** sensitive data stored in `localStorage` (like search history and recent items) using Base64 encoding. This prevents casual inspection of user data in the browser dev tools.

---

## 📄 License

MIT © Dhruv
