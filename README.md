# spotlight-omni-search 🔍 (v2.3.0)

A professional, **Tailwind-Native** Spotlight Search component for React and Next.js. Engineered to blend perfectly into your existing design system without shipping any global CSS resets or side effects.

## 🆕 What's New in v2.3 (Simplified API)

- **🎯 SpotlightProvider**: One-line setup - no manual state management
- **🔘 SearchTrigger**: Pre-styled button component with 3 variants
- **🪝 useGlobalSpotlight**: Simplified hook for programmatic control
- **📦 Framework Exports**: `/react` and `/next` for optimized imports
- **⚡ Auto Setup**: Cmd+K shortcut and CSS imports handled automatically
- **🔄 Backward Compatible**: Existing code works unchanged

**Result**: Setup reduced from **3+ files, 50+ lines** → **1 file, 5 lines**! 🎉

## 🆕 What's New in v2.2 (Performance)

- **🚀 Virtual Scrolling**: Handle 1000+ items smoothly with auto-enable at 500 items
- **📊 Performance**: 10x faster rendering for large lists
- **⌨️ Keyboard Nav**: Fully compatible with virtual scrolling

## 🆕 What's New in v2.1 (Advanced Features)

- **📡 Asynchronous Searching**: Built-in support for remote APIs with debouncing and result merging.
- **⌨️ Command Arguments**: Execute actions with dynamic parameters (e.g., `Google hello world`).
- **🛡️ Confirmation Modals**: Built-in safety for destructive actions with themed confirmation dialogs.

* **🍞 Internal Toast System**: Lightweight notifications for action feedback with external routing support.

- **🔄 Undo/Redo Support**: Deep search history tracking with `Cmd+Z` / `Cmd+Y`.
- **🛠️ Developer Tools**: Real-time search latency benchmarks and raw scoring overlays.
- **🎨 Theme System**: 10+ pre-built color schemes + CSS variable support.
- **📱 Responsive & Touch**: Mobile-optimized with touch gestures (swipe-to-close).
- **🔌 Plugin Architecture**: Build and inject custom middleware, custom search sources, and lifecycle hooks.
- **🔒 Privacy Mode**: Automatic Base64 obfuscation for all `localStorage` data (History, Recents, Analytics).

---

## 🏛 Architecture

This package is "Tailwind-Native". Instead of shipping a giant, compiled CSS file with internal resets, this library uses standard Tailwind classes that are compiled by **YOUR** application's Tailwind build.

### Key Benefits:

- **Zero Style Leaks**: No bundled resets. Your `body`, `button`, and `h1` styles remain yours.
- **Microscopic Bundle Size**: Only ~23 KB core logic. Your Tailwind build handles the styles.
- **Perfect Design Parity**: Inherits your fonts, colors, and layout rules natively.

---

## 📦 Installation

```bash
npm install spotlight-omni-search lucide-react
```

> **Note**: `lucide-react` is a peer dependency.

---

## 🚀 Quick Start (30 seconds)

### New Simplified API (v2.3+) ⭐ RECOMMENDED

**Next.js App Router**

```tsx
// app/layout.tsx
"use client";
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/next";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();

  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "about", label: "About", route: "/about" },
  ];

  return (
    <html>
      <body>
        <SpotlightProvider
          items={items}
          onNavigate={(path) => router.push(path)}
        >
          <nav>
            <SearchTrigger /> {/* ⌘K button - that's it! */}
          </nav>
          {children}
        </SpotlightProvider>
      </body>
    </html>
  );
}
```

**React / Vite**

```tsx
// App.tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";

function App() {
  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "about", label: "About", route: "/about" },
  ];

  return (
    <SpotlightProvider items={items}>
      <nav>
        <SearchTrigger /> {/* ⌘K button - that's it! */}
      </nav>
      {children}
    </SpotlightProvider>
  );
}
```

**That's it!** Press `Cmd+K` (or `Ctrl+K`) to test. No additional setup needed! ✨

---

## 🛠 Manual Setup (Advanced Users)

If you prefer more control or need the classic API:

### Step 1: Configure Tailwind Content Paths

Update your `tailwind.config.js` or `tailwind.config.ts`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}", // <--- ADD THIS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Step 2: Import Tailwind CSS

**For Tailwind CSS v3 (Most Common)**

In your main CSS file (e.g., `src/index.css` or `app/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**For Tailwind CSS v4 (Latest)**

```css
@import "tailwindcss";
```

> **Note**: If you're unsure which version you have, check your `package.json` for the `tailwindcss` version.

### Step 3: Import Spotlight Variables

In your main app file (e.g., `main.tsx`, `App.tsx`, or `layout.tsx`):

```tsx
import "spotlight-omni-search/style.css";
// or
import "spotlight-omni-search/spotlight-omni-search.css";
```

---

## 🚀 Usage Example

The most common way to use **Spotlight** is by using the `useSpotlight` hook to handle the keyboard shortcuts automatically.

```tsx
import { Spotlight, useSpotlight, SpotlightItem } from "spotlight-omni-search";
import { Home, Settings, Trash2, Search } from "lucide-react";

export default function App() {
  const { isOpen, toggle, close } = useSpotlight(); // ✨ Handles Cmd+K / Ctrl+K

  const items: SpotlightItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={18} />,
      type: "page",
      route: "/",
      group: "Navigation",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
      type: "page",
      route: "/settings",
      group: "Navigation",
    },
    {
      id: "delete-data",
      label: "Clear Cache",
      icon: <Trash2 size={18} />,
      type: "action",
      group: "Danger Zone",
      confirm: {
        title: "Clear Cache?",
        message: "This will reset your local application state.",
        type: "danger",
      },
      action: () => console.log("Cache Cleared!"),
    },
  ];

  return (
    <>
      <button onClick={toggle}>Open Search</button>

      <Spotlight
        isOpen={isOpen}
        onClose={close}
        items={items}
        onNavigate={(path) => router.push(path)}
        theme="dark"
        enableGoogleSearch={true} // 🔍 Built-in Google integration.
        enableNumberJump={true} // ⌨️ Alt+1/2/3 to jump groups
      />
    </>
  );
}
```

---

## ⚙️ API Reference

### Spotlight Props

| Prop                  | Type                     | Default     | Description                                   |
| :-------------------- | :----------------------- | :---------- | :-------------------------------------------- |
| `isOpen`              | `boolean`                | `required`  | Controls visibility                           |
| `onClose`             | `() => void`             | `required`  | Close callback                                |
| `items`               | `SpotlightItem[]`        | `required`  | List of items to search                       |
| `onNavigate`          | `(path: string) => void` | `required`  | Navigation callback                           |
| `theme`               | `string`                 | `'light'`   | Theme name (e.g., `dark`, `blue`, `red`)      |
| `layout`              | `string`                 | `'center'`  | Layout mode (`center`, `top`, `bottom`, etc.) |
| `enableGoogleSearch`  | `boolean`                | `false`     | Built-in "Search Google" option               |
| `onSearch`            | `(q) => Promise`         | `undefined` | Async search callback                         |
| `debounceTime`        | `number`                 | `300`       | Delay for async search in ms                  |
| `debug`               | `boolean`                | `false`     | Shows search scores and latency               |
| `onEvent`             | `(e, data) => void`      | `undefined` | Analytics/Event logging callback              |
| `enableRecent`        | `boolean`                | `true`      | Show recently used items                      |
| `enableVimNavigation` | `boolean`                | `false`     | Support `j`/`k` navigation                    |
| `enableNumberJump`    | `boolean`                | `false`     | Jump to groups via number keys                |

### SpotlightItem Options

| Option             | Type                     | Description                               |
| :----------------- | :----------------------- | :---------------------------------------- |
| `id`               | `string`                 | Unique identifier (required)              |
| `label`            | `string`                 | Primary display text (required)           |
| `description`      | `string`                 | Secondary subtile text                    |
| `icon`             | `ReactNode`              | Left-side icon                            |
| `type`             | `string`                 | Metadata tag (e.g., "page", "action")     |
| `group`            | `string`                 | Header category for sorting               |
| `action`           | `(args: string) => void` | Function to run on selection              |
| `route`            | `string`                 | Path to navigate to                       |
| `confirm`          | `ConfirmOptions`         | Adds a confirmation step before action    |
| `expectsArguments` | `boolean`                | Capture trailing text as action arguments |

---

## 🔒 Privacy & Storage

Spotlight automatically **obfuscates** data stored in `localStorage` (like search history and recent items). This ensures that user data is not human-readable when inspecting the browser's "Application" tab, providing an extra layer of privacy for your users.

- **Non-Readable**: Search queries are encoded to prevent casual inspection.
- **Zero Dependencies**: Uses native browser APIs for lightweight obfuscation.
- **Plugin Support**: Data stored via the Plugin API is also automatically obfuscated.

---

## 🎯 Simplified API Reference (v2.3+)

### SpotlightProvider

Wrapper component that handles all the complexity for you.

```tsx
<SpotlightProvider
  items={items}                    // Required: Your search items
  onNavigate={(path) => ...}       // Optional: Navigation handler
  theme="dark"                     // Optional: Theme
  layout="center"                  // Optional: Layout
  shortcutKey="k"                  // Optional: Custom shortcut (default: 'k')
  disableShortcut={false}          // Optional: Disable Cmd+K
  // All other Spotlight props supported
>
  {children}
</SpotlightProvider>
```

### SearchTrigger

Pre-styled button component with 3 variants.

```tsx
<SearchTrigger
  variant="default" // 'default' | 'minimal' | 'icon-only'
  showShortcut={true} // Show ⌘K hint
  className="..." // Custom classes
/>
```

### useGlobalSpotlight

Hook to programmatically control Spotlight.

```tsx
const { open, close, toggle, isOpen } = useGlobalSpotlight();

<button onClick={open}>Custom Search Button</button>;
```

### Comparison: Simplified vs Classic API

| Feature                 | Simplified API | Classic API |
| ----------------------- | -------------- | ----------- |
| **Setup Time**          | 30 seconds     | 10 minutes  |
| **Files to Modify**     | 1 file         | 3+ files    |
| **Lines of Code**       | ~5 lines       | ~50 lines   |
| **Auto Cmd+K**          | ✅ Yes         | ❌ Manual   |
| **Auto CSS Import**     | ✅ Yes         | ❌ Manual   |
| **Event System**        | ✅ Built-in    | ❌ Manual   |
| **Backward Compatible** | ✅ Yes         | ✅ Yes      |

---

## 🚀 Advanced Features Quick Reference

### 1. Asynchronous Search

Fetch data from your API as the user types.

```tsx
<Spotlight
  onSearch={async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return await res.json();
  }}
  debounceTime={500}
/>
```

### 2. Command Arguments

Allow items to receive parameters from the search query.

```tsx
const items = [
  {
    id: "google",
    label: "Google Search",
    expectsArguments: true,
    action: (args) => window.open(`https://google.com/search?q=${args}`),
  },
];
```

### 3. Action Confirmation

Safeguard destructive actions like "Delete".

```tsx
{
  id: "delete",
  label: "Delete App Data",
  confirm: {
    title: "Are you sure?",
    message: "This cannot be undone.",
    confirmLabel: "Delete Everything",
    type: "danger"
  },
  action: () => resetData()
}
```

### 4. Plugin System

Extend Spotlight with custom logic or external integrations.

```tsx
import { AnalyticsPlugin } from "spotlight-omni-search/plugins";

<Spotlight
  plugins={[
    AnalyticsPlugin({
      onSelect: (id, type) => console.log(`Selected ${id}`),
    }),
  ]}
/>;
```

---

## 🎨 Themes & Customization

**Available Themes**: `light`, `dark`, `slate`, `red`, `rose`, `orange`, `amber`, `yellow`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `ocean`, `forest`, `sunset`, `midnight`.

---

## 📐 Layouts

Choose from 7 different layout modes:
| Layout | Description |
| :----------- | :--------------------------------- |
| `center` | Standard centered modal (Default) |
| `top` | Aligned to the top of the viewport |
| `bottom` | Mobile-friendly bottom sheet |
| `side-left` | Slide-in panel from the left |
| `side-right` | Slide-in panel from the right |
| `fullscreen` | Takes up the entire screen |
| `compact` | Minimalist, smaller footprint |

---

## ⌨️ Shortcuts

- **Cmd+K / Ctrl+K**: Open Spotlight
- **Cmd+Z**: Undo search text
- **Cmd+Shift+Z / Cmd+Y**: Redo search text
- **Up/Down / Tab / Shift+Tab**: Navigate items
- **Enter**: Select / Confirm action
- **Esc**: Close / Cancel

---

## � Troubleshooting

### Styles Not Appearing / Component Looks Unstyled

**Problem**: The Spotlight component appears but has no styling or looks broken.

**Solution**: This usually means Tailwind CSS is not configured correctly. Follow these steps:

1. **Check Tailwind Content Path**: Make sure you've added the library to your `tailwind.config.js`:

   ```javascript
   content: ["./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}"];
   ```

2. **Check Tailwind Directives**: Ensure your main CSS file includes Tailwind directives:

   **For Tailwind v3**:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   **For Tailwind v4**:

   ```css
   @import "tailwindcss";
   ```

3. **Import Spotlight CSS**: Make sure you've imported the Spotlight variables:

   ```tsx
   import "spotlight-omni-search/style.css";
   ```

4. **Restart Dev Server**: After making config changes, restart your development server.

### TypeScript Errors

If you see TypeScript errors related to `lucide-react`, make sure it's installed:

```bash
npm install lucide-react
```

### Module Not Found Errors

If you see errors like `Cannot find module 'spotlight-omni-search'`, try:

```bash
npm install
# or
rm -rf node_modules package-lock.json && npm install
```

---

## �📄 License

MIT © Dhruv
