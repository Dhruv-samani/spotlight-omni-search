# Migration Guide: Classic API → Simplified API

Upgrade from the classic Spotlight API to the new simplified API (v2.3+) in minutes.

---

## Why Migrate?

The simplified API offers:

- ✅ **90% less code** - 5 lines instead of 50+
- ✅ **Automatic keyboard shortcuts** - No manual setup
- ✅ **Auto CSS imports** - No configuration needed
- ✅ **Pre-styled components** - SearchTrigger button included
- ✅ **Better TypeScript support** - Improved type inference
- ✅ **Backward compatible** - Classic API still works

---

## Quick Migration (5 minutes)

### Before (Classic API)

```tsx
// App.tsx
import { useState, useEffect } from "react";
import { Spotlight } from "spotlight-omni-search";
import "spotlight-omni-search/style.css"; // Manual CSS import

function App() {
  const [isOpen, setIsOpen] = useState(false);

  // Manual keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Search</button>
      <Spotlight
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onNavigate={(path) => router.push(path)}
        theme="dark"
      />
    </>
  );
}
```

### After (Simplified API)

```tsx
// App.tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";

function App() {
  return (
    <SpotlightProvider
      items={items}
      onNavigate={(path) => router.push(path)}
      theme="dark"
    >
      <SearchTrigger /> {/* That's it! */}
      {/* Your app content */}
    </SpotlightProvider>
  );
}
```

**Changes**:

1. ❌ Remove manual `useState` for `isOpen`
2. ❌ Remove manual `useEffect` for keyboard shortcuts
3. ❌ Remove manual CSS import
4. ✅ Wrap app in `<SpotlightProvider>`
5. ✅ Use `<SearchTrigger>` instead of custom button
6. ✅ Import from `/react` or `/next`

---

## Step-by-Step Migration

### Step 1: Update Imports

**Before**:

```tsx
import { Spotlight } from "spotlight-omni-search";
import "spotlight-omni-search/style.css";
```

**After**:

```tsx
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/react";
// or for Next.js:
import { SpotlightProvider, SearchTrigger } from "spotlight-omni-search/next";
```

### Step 2: Remove Manual State Management

**Before**:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

**After**:

```tsx
// Not needed! SpotlightProvider handles this
```

### Step 3: Remove Manual Keyboard Shortcuts

**Before**:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

**After**:

```tsx
// Not needed! SpotlightProvider handles this automatically
```

### Step 4: Wrap App in SpotlightProvider

**Before**:

```tsx
function App() {
  return (
    <>
      <Spotlight isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
      {/* app content */}
    </>
  );
}
```

**After**:

```tsx
function App() {
  return (
    <SpotlightProvider
      items={items}
      onNavigate={handleNavigate}
      {...otherProps}
    >
      {/* app content */}
    </SpotlightProvider>
  );
}
```

### Step 5: Replace Custom Button with SearchTrigger

**Before**:

```tsx
<button onClick={() => setIsOpen(true)}>
  <SearchIcon /> Search
</button>
```

**After**:

```tsx
<SearchTrigger variant="default" />
```

---

## Advanced Migration Scenarios

### Scenario 1: Custom Trigger Button

If you have a custom trigger button and want to keep it:

```tsx
import { useGlobalSpotlight } from "spotlight-omni-search/react";

function CustomTrigger() {
  const { open } = useGlobalSpotlight();

  return (
    <button onClick={open} className="my-custom-button">
      <MyIcon /> Search
    </button>
  );
}

// In your app:
<SpotlightProvider items={items}>
  <CustomTrigger />
  {children}
</SpotlightProvider>;
```

### Scenario 2: Programmatic Control

If you need to open/close Spotlight programmatically:

```tsx
import { useGlobalSpotlight } from "spotlight-omni-search/react";

function MyComponent() {
  const { open, close, toggle, isOpen } = useGlobalSpotlight();

  // Open on some event
  useEffect(() => {
    if (someCondition) {
      open();
    }
  }, [someCondition, open]);

  return <div>Status: {isOpen ? "Open" : "Closed"}</div>;
}
```

### Scenario 3: Custom Keyboard Shortcut

If you were using a custom shortcut:

**Before**:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "p") {
      // Cmd+P
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };
  // ...
}, []);
```

**After**:

```tsx
<SpotlightProvider
  items={items}
  shortcutKey="p" // Cmd+P instead of Cmd+K
>
  {children}
</SpotlightProvider>
```

### Scenario 4: Conditional Rendering

If you were conditionally rendering Spotlight:

**Before**:

```tsx
{
  isAuthenticated && (
    <Spotlight isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
  );
}
```

**After**:

```tsx
{
  isAuthenticated && (
    <SpotlightProvider items={items} {...props}>
      {children}
    </SpotlightProvider>
  );
}
```

---

## Props Mapping

All props from the classic `Spotlight` component work with `SpotlightProvider`:

| Classic API           | Simplified API | Notes              |
| --------------------- | -------------- | ------------------ |
| `isOpen`              | ❌ Not needed  | Handled internally |
| `onClose`             | ❌ Not needed  | Handled internally |
| `items`               | ✅ Same        | Required           |
| `onNavigate`          | ✅ Same        | Required           |
| `theme`               | ✅ Same        | Optional           |
| `layout`              | ✅ Same        | Optional           |
| `debug`               | ✅ Same        | Optional           |
| `enableGoogleSearch`  | ✅ Same        | Optional           |
| `enableRecent`        | ✅ Same        | Optional           |
| `enableVimNavigation` | ✅ Same        | Optional           |
| All other props       | ✅ Same        | Pass through       |

**New Props**:

- `shortcutKey` - Custom keyboard shortcut (default: 'k')
- `disableShortcut` - Disable automatic Cmd+K (default: false)

---

## Backward Compatibility

**Good news**: The classic API still works! You don't have to migrate immediately.

```tsx
// This still works in v2.3+
import { Spotlight } from "spotlight-omni-search";

<Spotlight isOpen={isOpen} onClose={onClose} items={items} />;
```

Both APIs can coexist in the same project during migration.

---

## Migration Checklist

- [ ] Update imports to use `/react` or `/next`
- [ ] Remove manual `useState` for `isOpen`
- [ ] Remove manual `useEffect` for keyboard shortcuts
- [ ] Remove manual CSS import
- [ ] Wrap app in `<SpotlightProvider>`
- [ ] Replace custom button with `<SearchTrigger>` (or use `useGlobalSpotlight`)
- [ ] Test Cmd+K / Ctrl+K shortcut
- [ ] Test all SearchTrigger variants
- [ ] Test navigation callback
- [ ] Verify all props work as expected
- [ ] Remove old Tailwind config (if using simplified API exclusively)

---

## Need Help?

- Check [Framework Guides](./FRAMEWORK_GUIDES.md) for specific setup instructions
- See [README.md](../README.md) for full API documentation
- Review [test-simplified.tsx](../dev/test-simplified.tsx) for examples
- Open an issue on GitHub if you encounter problems

---

## Benefits Summary

After migration, you'll have:

- ✅ **90% less boilerplate code**
- ✅ **Automatic keyboard shortcuts**
- ✅ **No manual CSS imports**
- ✅ **Pre-styled trigger button**
- ✅ **Better developer experience**
- ✅ **Easier maintenance**

Happy migrating! 🚀
