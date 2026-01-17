# TypeScript Types Reference

Complete TypeScript type definitions for the Spotlight Omni-Search simplified API.

---

## Core Types

### SpotlightProviderProps

Props for the `SpotlightProvider` component.

```typescript
interface SpotlightProviderProps
  extends Omit<SpotlightProps, "isOpen" | "onClose"> {
  children: ReactNode;

  /**
   * Custom keyboard shortcut to open Spotlight
   * @default 'k' (Cmd+K / Ctrl+K)
   * @example 'p' for Cmd+P
   */
  shortcutKey?: string;

  /**
   * Disable the default keyboard shortcut
   * @default false
   */
  disableShortcut?: boolean;

  // All SpotlightProps except isOpen and onClose
  items: SpotlightItem[];
  onNavigate?: (path: string) => void;
  theme?: string;
  layout?: SpotlightLayout;
  // ... (see SpotlightProps below)
}
```

### SearchTriggerProps

Props for the `SearchTrigger` button component.

```typescript
interface SearchTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'default'
   */
  variant?: "default" | "minimal" | "icon-only";

  /**
   * Show keyboard shortcut hint (⌘K)
   * @default true
   */
  showShortcut?: boolean;

  // Inherits all standard button props
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // ... all other button props
}
```

### useGlobalSpotlight Return Type

Return type of the `useGlobalSpotlight` hook.

```typescript
interface SpotlightContextValue {
  /**
   * Current open/closed state
   */
  isOpen: boolean;

  /**
   * Open Spotlight
   */
  open: () => void;

  /**
   * Close Spotlight
   */
  close: () => void;

  /**
   * Toggle Spotlight open/closed
   */
  toggle: () => void;
}
```

---

## Inherited Types

### SpotlightProps

All props available on `SpotlightProvider` (except `isOpen` and `onClose`).

```typescript
interface SpotlightProps {
  /**
   * Array of searchable items
   * @required
   */
  items: SpotlightItem[];

  /**
   * Navigation callback for route items
   * @required for route items
   */
  onNavigate?: (path: string) => void;

  /**
   * Visual theme
   * @default 'light'
   */
  theme?:
    | "light"
    | "dark"
    | "slate"
    | "red"
    | "rose"
    | "orange"
    | "amber"
    | "yellow"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "ocean"
    | "forest"
    | "sunset"
    | "midnight";

  /**
   * Layout mode
   * @default 'center'
   */
  layout?:
    | "center"
    | "top"
    | "bottom"
    | "side-left"
    | "side-right"
    | "fullscreen"
    | "compact";

  /**
   * Enable Google Search fallback
   * @default false
   */
  enableGoogleSearch?: boolean;

  /**
   * Async search callback
   */
  onSearch?: (query: string) => Promise<SpotlightItem[]>;

  /**
   * Debounce time for async search (ms)
   * @default 300
   */
  debounceTime?: number;

  /**
   * Show debug info (scores, latency)
   * @default false
   */
  debug?: boolean;

  /**
   * Event callback for analytics
   */
  onEvent?: (event: string, data: any) => void;

  /**
   * Enable recent items tracking
   * @default true
   */
  enableRecent?: boolean;

  /**
   * Enable Vim navigation (j/k)
   * @default false
   */
  enableVimNavigation?: boolean;

  /**
   * Enable number jump shortcuts
   * @default false
   */
  enableNumberJump?: boolean;

  /**
   * Headless mode (no default styles)
   * @default false
   */
  headless?: boolean;

  /**
   * Custom class names for headless mode
   */
  classNames?: {
    backdrop?: string;
    container?: string;
    header?: string;
    input?: string;
    listContainer?: string;
    item?: string;
    itemSelected?: string;
  };

  /**
   * Plugins array
   */
  plugins?: Plugin[];
}
```

### SpotlightItem

Individual search item type.

```typescript
interface SpotlightItem {
  /**
   * Unique identifier
   * @required
   */
  id: string;

  /**
   * Display label
   * @required
   */
  label: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Icon element
   */
  icon?: ReactNode;

  /**
   * Item type
   */
  type?: string;

  /**
   * Group header
   */
  group?: string;

  /**
   * Action callback
   */
  action?: (args?: string) => void;

  /**
   * Route path (for navigation items)
   */
  route?: string;

  /**
   * Confirmation options for dangerous actions
   */
  confirm?: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: "danger" | "warning" | "info";
  };

  /**
   * Whether this item expects arguments
   * @default false
   */
  expectsArguments?: boolean;

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>;
}
```

---

## Usage Examples

### Basic TypeScript Setup

```typescript
import {
  SpotlightProvider,
  SearchTrigger,
  useGlobalSpotlight,
} from "spotlight-omni-search/react";
import type { SpotlightItem } from "spotlight-omni-search";

// Define items with full type safety
const items: SpotlightItem[] = [
  {
    id: "home",
    label: "Home",
    route: "/",
    type: "page",
    group: "Navigation",
  },
];

function App() {
  return (
    <SpotlightProvider items={items}>
      <SearchTrigger />
    </SpotlightProvider>
  );
}
```

### Custom Component with Hook

```typescript
import { useGlobalSpotlight } from "spotlight-omni-search/react";

function CustomTrigger() {
  const { open, isOpen } = useGlobalSpotlight();

  return <button onClick={open}>{isOpen ? "Close" : "Open"} Search</button>;
}
```

### With Navigation Callback

```typescript
import { useRouter } from "next/navigation";
import type { SpotlightProviderProps } from "spotlight-omni-search/next";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleNavigate: SpotlightProviderProps["onNavigate"] = (path) => {
    router.push(path);
  };

  return (
    <SpotlightProvider items={items} onNavigate={handleNavigate}>
      {children}
    </SpotlightProvider>
  );
}
```

### Custom Item Type

```typescript
interface CustomItem extends SpotlightItem {
  customField: string;
  priority: number;
}

const items: CustomItem[] = [
  {
    id: "1",
    label: "Custom Item",
    customField: "value",
    priority: 1,
  },
];
```

---

## Type Exports

All types are exported from the main package and framework-specific exports:

```typescript
// From main package
import type {
  SpotlightItem,
  SpotlightProps,
  SpotlightLayout,
  SpotlightItemType,
} from "spotlight-omni-search";

// From simplified API
import type {
  SpotlightProviderProps,
  SearchTriggerProps,
} from "spotlight-omni-search/react";
// or
import type {
  SpotlightProviderProps,
  SearchTriggerProps,
} from "spotlight-omni-search/next";
```

---

## Type Guards

Useful type guards for working with Spotlight items:

```typescript
function isRouteItem(
  item: SpotlightItem
): item is SpotlightItem & { route: string } {
  return typeof item.route === "string";
}

function isActionItem(
  item: SpotlightItem
): item is SpotlightItem & { action: Function } {
  return typeof item.action === "function";
}

function hasConfirmation(
  item: SpotlightItem
): item is SpotlightItem & { confirm: NonNullable<SpotlightItem["confirm"]> } {
  return item.confirm !== undefined;
}
```

---

## Common Type Issues

### Issue: Type error with onNavigate

**Problem**:

```typescript
// Error: Type '(path: string) => void' is not assignable to type...
onNavigate={(path) => router.push(path)}
```

**Solution**:

```typescript
// Explicitly type the parameter
onNavigate={(path: string) => router.push(path)}
```

### Issue: Items not typed correctly

**Problem**:

```typescript
const items = [
  { id: "1", label: "Home" }, // Missing type annotation
];
```

**Solution**:

```typescript
import type { SpotlightItem } from "spotlight-omni-search";

const items: SpotlightItem[] = [{ id: "1", label: "Home" }];
```

### Issue: Custom props not recognized

**Problem**:

```typescript
<SpotlightProvider customProp="value" /> // Error
```

**Solution**:

```typescript
// Extend the props type
interface CustomProviderProps extends SpotlightProviderProps {
  customProp: string;
}
```

---

## IDE Support

### VSCode IntelliSense

All types include JSDoc comments for better IntelliSense:

```typescript
<SpotlightProvider
  items={items}
  shortcutKey="p" // Hover to see: "Custom keyboard shortcut to open Spotlight"
/>
```

### Auto-Import

TypeScript will auto-import types when you use them:

```typescript
// Type this:
const items: SpotlightItem[] = [];

// VSCode will auto-add:
import type { SpotlightItem } from "spotlight-omni-search";
```

---

## Next Steps

- See [Framework Guides](./FRAMEWORK_GUIDES.md) for setup examples
- Check [Migration Guide](./MIGRATION.md) for upgrading
- View [README](../README.md) for full documentation
