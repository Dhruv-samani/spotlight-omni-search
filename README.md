# spotlight-omni-search 🔍 (v2.1.0)

A professional, **Tailwind-Native** Spotlight Search component for React and Next.js. Engineered to blend perfectly into your existing design system without shipping any global CSS resets or side effects.

## 🆕 What's New in v2.0 (The Advanced Release)

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

## 🛠 Integration (Required)

Because v2 uses standard Tailwind classes, you **must** tell Tailwind to scan the library for styles.

### 1. Update `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}", // <--- ADD THIS
  ],
};
```

### 2. Import Default Variables

```tsx
import "spotlight-omni-search/dist/style.css";
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

## 📄 License

MIT © Dhruv
