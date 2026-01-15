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
  /**
   * For navigation items
   */
  route?: string;
  /**
   * For executable items
   */
  action?: () => void;
  /**
   * Keyboard shortcut hint (e.g., "⌘K", "Ctrl+S")
   */
  shortcut?: string;
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
}

