# spotlight-omni-search 🔍 (v1.0.2)

A professional, **Tailwind-Native** Spotlight Search component for React and Next.js. Engineered to blend perfectly into your existing design system without shipping any global CSS resets or side effects.

## 🆕 What's New in v1.0.2

- **📦 Bundle Size Optimization**: Removed unused `framer-motion` dependency, reducing bundle size by ~60-80 KB!
- **🧹 Code Cleanup**: Removed all debug console.log statements for production-ready code
- **🐛 Bug Fixes**: Fixed array mutation bug and sticky header issues
- **⌨️ Enhanced Navigation**: Added PageUp/PageDown keyboard support
- **🎯 Improved UX**: Better scroll behavior and mouse hover tracking

### Previous Updates (v1.0.1)

- **🎯 Fuzzy Search**: Intelligent VS Code-style character matching with relevance scoring
- **📜 Recent Items**: Automatic tracking and display of recently selected items
- **⚡ Built-in Actions**: Pre-built actions for theme toggle, navigation, utilities
- **🔌 Enhanced Router Integration**: Better Next.js and React Router support
- **⏳ Loading States**: Built-in skeleton loader for async data
- **⌨️ Keyboard Shortcuts**: Display shortcut hints on items
- **🎨 Custom Rendering**: Optional custom render function support
- **🪝 useSpotlight Hook**: Simplified state management with built-in Cmd+K support

---

## 🏛 Architecture

This package is "Tailwind-Native". Instead of shipping a giant, compiled CSS file with internal resets, this library uses standard Tailwind classes that are compiled by **YOUR** application's Tailwind build.

### Key Benefits:

- **Zero Style Leaks**: No bundled resets. Your `body`, `button`, and `h1` styles remain yours.
- **Microscopic Bundle Size**: Only ~9 KB total dependencies (clsx + tailwind-merge). Your Tailwind build handles the styles.
- **Perfect Design Parity**: Inherits your fonts, colors, and layout rules natively.

---

## 📦 Installation

```bash
npm install spotlight-omni-search lucide-react
```

> **Note**: `lucide-react` is a peer dependency. You need to install it separately to keep the bundle size small.

## 🛠 Integration (Required)

Because v3 uses standard Tailwind classes, you **must** tell Tailwind to scan the library for styles.

### 1. Update `tailwind.config.js`

Add the library path to your `content` array:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}", // <--- ADD THIS
  ],
  // ...
};
```

### 2. (Optional) Import Default Variables

If you want to use our default colors, import the minimal variable sheet in your `layout.tsx` or `index.css`:

```tsx
import "spotlight-omni-search/dist/style.css";
```

---

## 🌓 Customization

Since we use standard Tailwind, you can customize the theme using CSS variables in your global CSS:

```css
:root {
  --spotlight-primary: #3b82f6;
  --spotlight-background: #ffffff;
}

.dark {
  --spotlight-background: #0f172a;
}
```

---

## ✨ Features

- **🎯 Fuzzy Search**: Intelligent character-by-character matching (like VS Code's Cmd+P)
- **⚡ Smart Relevance**: Results sorted by match quality and position
- **📜 Recent Items**: Automatically tracks and shows recently selected items
- **⌨️ Keyboard Shortcuts**: Built-in Cmd+K / Ctrl+K support via `useSpotlight()` hook
- **🎨 Tailwind-Native**: Zero style conflicts, inherits your design system
- **📦 Tiny Bundle**: Only logic shipped, styles compiled by your Tailwind
- **🔌 Router Agnostic**: Works with Next.js, React Router, or any navigation system

---

## 🚀 Quick Start (Recommended)

The easiest way to use this package is with the `useSpotlight()` hook:

```tsx
"use client";

import { useSpotlight, Spotlight, SpotlightItem } from "spotlight-omni-search";
import { useRouter } from "next/navigation";
import { Home, Settings, User } from "lucide-react";

export function MyApp() {
  const router = useRouter();
  const { isOpen, close } = useSpotlight(); // ✨ Handles Cmd+K automatically!

  const items: SpotlightItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={20} />,
      type: "page",
      route: "/",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      type: "page",
      route: "/settings",
    },
  ];

  return (
    <Spotlight
      isOpen={isOpen}
      onClose={close}
      items={items}
      onNavigate={(path) => router.push(path)}
    />
  );
}
```

**That's it!** Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the spotlight.

### Hook Options

```tsx
const { isOpen, open, close, toggle } = useSpotlight({
  defaultOpen: false, // Initial state
  shortcut: "cmd+k", // Keyboard shortcut
  enableShortcut: true, // Enable/disable shortcut
});
```

---

## 💡 Manual Setup (Advanced)

If you need more control, you can manage state manually:

Here is a complete, copy-pasteable example of how to use this in a Next.js app with `lucide-react`.

### `components/CommandPalette.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Home, Settings, User, LogOut } from "lucide-react";

// Import the component and types
import { Spotlight, SpotlightItem } from "spotlight-omni-search";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // 1. Define your items
  const items: SpotlightItem[] = [
    {
      id: "home",
      label: "Home",
      description: "Go to dashboard",
      icon: <Home size={20} />,
      type: "page",
      group: "Navigation",
      route: "/dashboard",
    },
    {
      id: "profile",
      label: "Profile",
      description: "Manage your account",
      icon: <User size={20} />,
      type: "page",
      group: "Navigation",
      route: "/profile",
    },
    {
      id: "billing",
      label: "Billing",
      description: "View invoices and plans",
      icon: <CreditCard size={20} />,
      type: "page",
      group: "Navigation",
      route: "/billing",
    },
    {
      id: "settings",
      label: "Settings",
      description: "App configuration",
      icon: <Settings size={20} />,
      type: "page",
      group: "Navigation",
      route: "/settings",
    },
    {
      id: "logout",
      label: "Log Out",
      description: "Sign out of your account",
      icon: <LogOut size={20} />,
      type: "action",
      group: "Actions",
      action: () => {
        console.log("Logging out...");
        // perform logout logic
      },
    },
  ];

  // 2. Handle Keyboard Shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Render
  return (
    <Spotlight
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      items={items}
      onNavigate={(path) => router.push(path)} // Determine how to navigate
      searchPlaceholder="Type a command or search..."
    />
  );
}
```

Then simply drop `<CommandPalette />` into your root `layout.tsx` or `App.tsx`!

---

## 🔌 Router Integration

### Next.js with Manual Routes

```tsx
import {
  getSpotlightItemsFromRoutes,
  RouteConfig,
} from "spotlight-omni-search";
import { Home, Settings, Users } from "lucide-react";

const routes: RouteConfig[] = [
  {
    path: "/",
    label: "Home",
    icon: <Home size={20} />,
  },
  {
    path: "/settings",
    label: "Settings",
    description: "Manage your preferences",
    icon: <Settings size={20} />,
  },
  {
    path: "/admin",
    label: "Admin Panel",
    hidden: true, // Won't appear in spotlight
  },
];

const spotlightItems = getSpotlightItemsFromRoutes(routes);
```

### React Router v6

```tsx
import { createBrowserRouter } from "react-router-dom";
import {
  getSpotlightItemsFromRoutes,
  RouterHandle,
} from "spotlight-omni-search";

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    handle: {
      spotlight: {
        label: "Dashboard",
        description: "View your dashboard",
        icon: <HomeIcon />,
        keywords: ["home", "overview"],
      },
    } satisfies RouterHandle,
  },
];

const router = createBrowserRouter(routes);
const spotlightItems = getSpotlightItemsFromRoutes(routes);
```

---

## ⚡ Built-in Actions

Use pre-built actions for common functionality:

```tsx
import {
  createCommonActions,
  createThemeActions,
  createUtilityActions,
} from "spotlight-omni-search";

// All common actions at once
const actions = createCommonActions({
  currentTheme: theme,
  onToggle: (newTheme) => setTheme(newTheme),
});

// Or pick specific action groups
const themeActions = createThemeActions({
  currentTheme: theme,
  onToggle: setTheme,
});

const utilityActions = createUtilityActions(); // Copy URL, Print, Reload

// Combine with your pages
const allItems = [...pages, ...actions];
```

**Available Actions:**

- 🌓 Theme toggle (dark/light)
- ⬅️ Navigate back/forward
- ⬆️ Scroll to top/bottom
- 📋 Copy current URL
- 🖨️ Print page
- 🔄 Reload page

---

## ⏳ Loading States

Handle async data loading with built-in loading UI:

```tsx
const [items, setItems] = useState<SpotlightItem[]>([]);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  async function loadItems() {
    setIsLoading(true);
    const data = await fetchItemsFromAPI();
    setItems(data);
    setIsLoading(false);
  }
  loadItems();
}, []);

return (
  <Spotlight
    isOpen={isOpen}
    onClose={close}
    items={items}
    isLoading={isLoading} // Shows skeleton loader
    onNavigate={(path) => router.push(path)}
  />
);
```

---

## 📄 License

MIT © Dhruv
