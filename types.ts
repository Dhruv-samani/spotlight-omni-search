import { ReactNode } from "react";

export type SpotlightItemType = "page" | "action" | "user" | "tenant" | string;

export interface SpotlightItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  type: SpotlightItemType;
  /**
   * Group identifier for sectioning results (e.g., "Pages", "Actions")
   */
  group?: string;
  /**
   * Keywords for fuzzy search
   */
  keywords?: string[];
  disabled?: boolean;
  /**
   * For navigation items
   */
  route?: string;
  /**
   * For executable items. Can optionally receive an argument string.
   */
  action?: (args?: string) => void;
  /**
   * Whether this item expects an argument (e.g., "Google [query]")
   */
  expectsArguments?: boolean;
  /**
   * Optional confirmation requirements before executing the action
   */
  confirm?: ConfirmationOptions;
  /**
   * Keyboard shortcut hint (e.g., "⌘K", "Ctrl+S")
   */
  shortcut?: string;
  /**
   * Child items for nested navigation
   */
  items?: SpotlightItem[];
}

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface SpotlightToast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

/**
 * Custom class names for all Spotlight elements
 * Allows complete styling control in headless mode
 */
export interface SpotlightClassNames {
  /** Outer backdrop/overlay container */
  backdrop?: string;
  /** Inner modal/dialog container */
  container?: string;
  /** Search header wrapper */
  header?: string;
  /** Search icon */
  searchIcon?: string;
  /** Search input field */
  input?: string;
  /** Clear button (X icon) */
  clearButton?: string;
  /** Filters bar container */
  filtersBar?: string;
  /** Regex toggle button */
  regexButton?: string;
  /** Group filter button */
  groupButton?: string;
  /** Active group filter button */
  groupButtonActive?: string;
  /** Results list container */
  listContainer?: string;
  /** Loading state container */
  loading?: string;
  /** Empty state container */
  empty?: string;
  /** Group header */
  groupHeader?: string;
  /** Individual result item */
  item?: string;
  /** Selected/active result item */
  itemSelected?: string;
  /** Item icon container */
  itemIcon?: string;
  /** Item label/title */
  itemLabel?: string;
  /** Item description */
  itemDescription?: string;
  /** Item keyboard shortcut badge */
  itemShortcut?: string;
  /** Footer container */
  footer?: string;
  /** Confirmation modal overlay */
  confirmationOverlay?: string;
  /** Confirmation modal container */
  confirmationContainer?: string;
  /** Toast notification container */
  toastContainer?: string;
  /** Individual toast */
  toast?: string;
}

export interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  items: SpotlightItem[];
  /**
   * Callback to handle navigation.
   * This bridges the gap between different routers (Next, React Router).
   */
  onNavigate: (path: string) => void;
  searchPlaceholder?: string;
  /**
   * Enable recent items tracking and display
   * @default true
   */
  enableRecent?: boolean;
  /**
   * Maximum number of recent items to track
   * @default 10
   */
  maxRecentItems?: number;
  /**
   * Show loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Custom render function for items
   * If provided, this will be used instead of the default item rendering
   */
  renderItem?: (item: SpotlightItem, isSelected: boolean) => ReactNode;

  // Keyboard Navigation
  keyboardShortcuts?: KeyboardShortcuts;
  enableVimNavigation?: boolean;
  enableNumberJump?: boolean;
  onEscapeBehavior?: 'close' | 'clear' | 'custom';
  onEscapeCustom?: () => void;

  // Accessibility
  ariaLabel?: string;
  announceResults?: boolean;
  
  // Custom Rendering
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderHeader?: (searchBar: ReactNode) => ReactNode;
  renderFooter?: () => ReactNode;
  renderGroupHeader?: (group: string) => ReactNode;
  
  // Theme
  theme?: string | { variables: Record<string, string> };
  
  // Layout
  layout?: SpotlightLayout;
  
  // Responsive
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  enableTouchGestures?: boolean;
  
  // Plugins
  plugins?: import('./types/plugin').SpotlightPlugin[];

  /**
   * Optional async search callback.
   * If provided, this will be called when the query changes (debounced).
   */
  onSearch?: (query: string) => Promise<SpotlightItem[]>;
  /**
   * Delay in ms before triggering onSearch
   * @default 300
   */
  debounceTime?: number;
  /**
   * Enable debug mode (shows search scores)
   * @default false
   */
  debug?: boolean;

  /**
   * Callback for internal event logging (analytics, debugging)
   */
  onEvent?: (event: string, data?: any) => void;
  /**
   * External toast notification handler if the app has its own toast system.
   * If not provided, Spotlight will use its internal minimal toast system.
   */
  onToast?: (toast: SpotlightToast) => void;
  /**
   * If true, shows a "Search Google" option when a query is entered.
   * @default false
   */
  enableGoogleSearch?: boolean;
  
  /**
   * Enable headless mode - removes default styling, allowing full custom styling via classNames
   * @default false
   */
  headless?: boolean;
  
  /**
   * Custom class names for all component elements
   * In headless mode, these replace default classes. In normal mode, they merge with defaults.
   */
  classNames?: SpotlightClassNames;
  
  /**
   * Enable virtual scrolling for large lists
   * - true: Always use virtual scrolling
   * - false: Never use virtual scrolling
   * - 'auto': Auto-enable when items exceed threshold (default)
   * @default 'auto'
   */
  enableVirtualScrolling?: boolean | 'auto';
  
  /**
   * Threshold for auto-enabling virtual scrolling
   * @default 500
   */
  virtualScrollThreshold?: number;
  
  /**
   * Number of items to render outside visible area for smoother scrolling
   * @default 5
   */
  virtualScrollOverscan?: number;
}

export type SpotlightLayout =
  | 'center'
  | 'top'
  | 'side-left'
  | 'side-right'
  | 'bottom'
  | 'fullscreen'
  | 'compact';

export interface KeyboardShortcuts {
  up?: string[];
  down?: string[];
  select?: string[];
  close?: string[];
  clear?: string[];
  nextGroup?: string[];
  prevGroup?: string[];
}

