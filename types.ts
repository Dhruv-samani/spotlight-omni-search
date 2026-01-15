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

