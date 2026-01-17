# Framework-Specific Setup Guides

Quick-start guides for integrating Spotlight Omni-Search with different React frameworks using the simplified API (v2.3+).

---

## Next.js App Router (30 seconds)

### 1. Install

```bash
npm install spotlight-omni-search lucide-react
```

### 2. Setup in Root Layout

```tsx
// app/layout.tsx
"use client";
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/next";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "about", label: "About", route: "/about" },
    { id: "dashboard", label: "Dashboard", route: "/dashboard" },
  ];

  return (
    <html lang="en">
      <body>
        <SpotlightProvider
          items={items}
          onNavigate={(path) => router.push(path)}
          theme="dark"
        >
          <nav>
            <SearchTrigger /> {/* ⌘K button */}
          </nav>
          {children}
        </SpotlightProvider>
      </body>
    </html>
  );
}
```

### 3. Done! ✨

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to test.

---

## Next.js Pages Router (30 seconds)

### 1. Install

```bash
npm install spotlight-omni-search lucide-react
```

### 2. Setup in \_app.tsx

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/next";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "about", label: "About", route: "/about" },
    { id: "contact", label: "Contact", route: "/contact" },
  ];

  return (
    <SpotlightProvider
      items={items}
      onNavigate={(path) => router.push(path)}
      theme="dark"
    >
      <nav>
        <SearchTrigger variant="default" />
      </nav>
      <Component {...pageProps} />
    </SpotlightProvider>
  );
}
```

### 3. Done! ✨

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to test.

---

## Vite + React (30 seconds)

### 1. Install

```bash
npm install spotlight-omni-search lucide-react
```

### 2. Setup in App.tsx

```tsx
// src/App.tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";
import { useNavigate } from "react-router-dom"; // if using React Router

function App() {
  const navigate = useNavigate(); // or your navigation method

  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "about", label: "About", route: "/about" },
    { id: "products", label: "Products", route: "/products" },
  ];

  return (
    <SpotlightProvider
      items={items}
      onNavigate={(path) => navigate(path)}
      theme="dark"
    >
      <nav>
        <SearchTrigger />
      </nav>
      {/* Your app content */}
    </SpotlightProvider>
  );
}

export default App;
```

### 3. Done! ✨

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to test.

---

## Create React App (30 seconds)

### 1. Install

```bash
npm install spotlight-omni-search lucide-react
```

### 2. Setup in App.js or App.tsx

```tsx
// src/App.tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";

function App() {
  const items = [
    { id: "home", label: "Home", route: "/" },
    { id: "features", label: "Features", route: "/features" },
    { id: "pricing", label: "Pricing", route: "/pricing" },
  ];

  const handleNavigate = (path: string) => {
    window.location.href = path; // or use your router
  };

  return (
    <SpotlightProvider items={items} onNavigate={handleNavigate} theme="dark">
      <header>
        <SearchTrigger variant="default" />
      </header>
      {/* Your app content */}
    </SpotlightProvider>
  );
}

export default App;
```

### 3. Done! ✨

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to test.

---

## Common Customizations

### Using Different SearchTrigger Variants

```tsx
{
  /* Default - Full button with text and shortcut */
}
<SearchTrigger variant="default" />;

{
  /* Minimal - Smaller, less prominent */
}
<SearchTrigger variant="minimal" />;

{
  /* Icon Only - Just the search icon */
}
<SearchTrigger variant="icon-only" />;

{
  /* Custom Styled */
}
<SearchTrigger variant="default" className="bg-blue-600 hover:bg-blue-500" />;
```

### Using useGlobalSpotlight Hook

```tsx
import { useGlobalSpotlight } from "spotlight-omni-search/react";

function CustomComponent() {
  const { open, close, toggle, isOpen } = useGlobalSpotlight();

  return <button onClick={open}>Open Search</button>;
}
```

### Custom Keyboard Shortcut

```tsx
<SpotlightProvider
  items={items}
  shortcutKey="p" // Cmd+P instead of Cmd+K
>
  {children}
</SpotlightProvider>
```

### Disable Keyboard Shortcut

```tsx
<SpotlightProvider
  items={items}
  disableShortcut={true} // No automatic Cmd+K
>
  {children}
</SpotlightProvider>
```

### Additional Props

```tsx
<SpotlightProvider
  items={items}
  onNavigate={(path) => router.push(path)}
  theme="dark" // Theme
  layout="center" // Layout mode
  enableGoogleSearch={true} // Google search fallback
  enableRecent={true} // Recent items
  debug={true} // Show search scores
>
  {children}
</SpotlightProvider>
```

---

## Troubleshooting

### Styles Not Appearing

If Spotlight appears unstyled, ensure Tailwind CSS is configured:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}", // Add this
  ],
  // ...
};
```

### TypeScript Errors

Make sure `lucide-react` is installed:

```bash
npm install lucide-react
```

### Keyboard Shortcut Not Working

1. Check if another extension/app is using Cmd+K
2. Try using a custom shortcut: `shortcutKey="p"`
3. Ensure `disableShortcut` is not set to `true`

---

## Next Steps

- See [README.md](../README.md) for full API documentation
- Check [Migration Guide](./MIGRATION.md) to upgrade from classic API
- View [Examples](../dev/test-simplified.tsx) for advanced usage
