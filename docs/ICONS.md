# Icon Flexibility Guide

## Overview

Spotlight **does NOT require** `lucide-react` or any specific icon library. The `icon` prop accepts **any ReactNode**, giving you complete freedom to use:

- ✅ **Lucide React** (optional)
- ✅ **Material Icons** (@mui/icons-material)
- ✅ **Heroicons** (@heroicons/react)
- ✅ **Font Awesome** (@fortawesome/react-fontawesome)
- ✅ **Custom SVG files** from your assets
- ✅ **Emoji** or plain text
- ✅ **No icon at all** (just omit the prop)

## Examples

### 1. Using Lucide React (Optional)

```tsx
import { Calculator } from "lucide-react";
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    icon: <Calculator size={16} />,
  }),
];
```

### 2. Using Material Icons

```tsx
import CalculateIcon from "@mui/icons-material/Calculate";
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    icon: <CalculateIcon fontSize="small" />,
  }),
];
```

### 3. Using Heroicons

```tsx
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    icon: <CalculatorIcon className="w-4 h-4" />,
  }),
];
```

### 4. Using Custom SVG from Assets

```tsx
import { CalculatorPlugin } from "spotlight-omni-search";
import CalculatorSvg from "./assets/calculator.svg?react"; // Vite
// or
import { ReactComponent as CalculatorSvg } from "./assets/calculator.svg"; // CRA

const plugins = [
  CalculatorPlugin({
    icon: <CalculatorSvg width={16} height={16} />,
  }),
];
```

### 5. Using Inline SVG

```tsx
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 6l1.41 1.41L16.91 6l1.06 1.06-1.41 1.41 1.41 1.41-1.06 1.06-1.41-1.41-1.41 1.41-1.06-1.06 1.41-1.41-1.41-1.41zM11 6h5v2h-5V6zm0 4h5v2h-5v-2zM8 6h2v2H8V6zm0 4h2v2H8v-2zm-1 5h10v2H7v-2z" />
      </svg>
    ),
  }),
];
```

### 6. Using Emoji (No Library Needed!)

```tsx
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    icon: <span style={{ fontSize: "16px" }}>🧮</span>,
  }),
];
```

### 7. No Icon (Minimal)

```tsx
import { CalculatorPlugin } from "spotlight-omni-search";

const plugins = [
  CalculatorPlugin({
    // No icon prop = no icon displayed
    enableClipboardCopy: true,
  }),
];
```

## For SpotlightItems

The same flexibility applies to regular items:

```tsx
import { Home, Settings } from "lucide-react"; // Optional
import HomeIcon from "@mui/icons-material/Home"; // Or Material
import { ReactComponent as CustomIcon } from "./icon.svg"; // Or custom

const items = [
  {
    id: "1",
    label: "Home",
    icon: <Home size={16} />, // Lucide
    type: "page",
  },
  {
    id: "2",
    label: "Settings",
    icon: <HomeIcon fontSize="small" />, // Material
    type: "page",
  },
  {
    id: "3",
    label: "Custom",
    icon: <CustomIcon width={16} />, // Custom SVG
    type: "page",
  },
  {
    id: "4",
    label: "No Icon",
    // No icon prop
    type: "page",
  },
];
```

## Package.json Configuration

Since icons are optional, you only need to install what you use:

```json
{
  "dependencies": {
    "spotlight-omni-search": "^2.3.2"
    // NO lucide-react required!
    // Add only what you need:
    // "@mui/icons-material": "^5.x" (if using Material)
    // "@heroicons/react": "^2.x" (if using Heroicons)
    // etc.
  }
}
```

## Best Practices

1. **Consistency**: Use the same icon library across your app for visual consistency
2. **Size**: Keep icons around 14-18px for optimal display
3. **Color**: Icons inherit `currentColor` by default, matching the theme
4. **Performance**: SVG icons are lightweight and scale perfectly
5. **Accessibility**: Icons are decorative; labels provide the actual content

## Migration from v2.3.2

If you were using the old version with hardcoded Lucide icons:

**Before:**

```tsx
CalculatorPlugin(); // Used Lucide automatically
```

**After:**

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
