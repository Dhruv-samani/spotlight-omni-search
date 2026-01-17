# spotlight-omni-search 🔍 (v2.3.2)

🔗 **[Live Demo & Documentation](https://spotlight-omni-search-docs.netlify.app/)**

A professional, **Tailwind-Native** Spotlight Search component for React and Next.js. Engineered to blend perfectly into your existing design system without shipping any global CSS resets or side effects.

---

## 🚀 Features

- **🎯 Simple Setup**: One-line integration with `SpotlightProvider`.
- **🔘 Pre-styled Components**: Includes a beautiful `SearchTrigger` button.
- **⚡ Performance**: Virtual scrolling for 1000+ items and instant search.
- **🎨 Theming**: 20+ pre-built themes (Dark, Light, Slate, Blue, etc.).
- **🛠️ Advanced**: Async search, command arguments, and undo/redo support.
- **🔒 Privacy**: Built-in data obfuscation for history and recent items.
- **⌨️ Accessibility**: Full keyboard navigation (`Cmd+K`, Arrow keys).

---

## 📦 Installation

```bash
npm install spotlight-omni-search lucide-react
```

> **Note**: `lucide-react` is a required peer dependency for icons.

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

## 🔒 Privacy & Security

Spotlight automatically **obfuscates** sensitive data stored in `localStorage` (like search history and recent items) using Base64 encoding. This prevents casual inspection of user data in the browser dev tools.

---

## 📄 License

MIT © Dhruv
