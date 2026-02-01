import { SpotlightItem } from '../types';
import { SpotlightPlugin } from '../types/plugin';
import { CalculatorPlugin } from '../plugins/calculator';
import { UnitConverterPlugin } from '../plugins/unit-converter';
import { RecentSearchesPlugin } from '../plugins/recent-searches';
import { BookmarksPlugin } from '../plugins/bookmarks';
import { ShortcutsPanelPlugin } from '../plugins/shortcuts-panel';
import { AnalyticsPlugin } from '../plugins/analytics';

/**
 * Admin Panel Template
 * 
 * Pre-configured Spotlight setup for admin dashboards.
 * Includes user management, system settings, analytics, and danger zone actions.
 * 
 * @example
 * ```tsx
 * import { AdminPanelTemplate } from 'spotlight-omni-search/templates';
 * 
 * <SpotlightProvider {...AdminPanelTemplate}>
 *   {children}
 * </SpotlightProvider>
 * ```
 */

const items: SpotlightItem[] = [
  // Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Admin dashboard overview',
    type: 'page',
    route: '/admin',
    group: 'Navigation',
    keywords: ['home', 'overview'],
    aliases: ['home', 'overview']
  },

  // User Management
  {
    id: 'users',
    label: 'View All Users',
    description: 'Manage user accounts',
    type: 'page',
    route: '/admin/users',
    group: 'User Management',
    keywords: ['accounts', 'members'],
    aliases: ['accounts', 'members']
  },
  {
    id: 'add-user',
    label: 'Add New User',
    description: 'Create a new user account',
    type: 'action',
    group: 'User Management',
    keywords: ['create', 'new'],
    action: () => {
      console.log('Add new user');
      // User should override this action
    }
  },
  {
    id: 'roles',
    label: 'Manage Roles',
    description: 'Configure user roles and permissions',
    type: 'page',
    route: '/admin/roles',
    group: 'User Management',
    keywords: ['permissions', 'access'],
    aliases: ['permissions', 'access']
  },

  // System Settings
  {
    id: 'settings',
    label: 'System Settings',
    description: 'Configure system settings',
    type: 'page',
    route: '/admin/settings',
    group: 'System',
    keywords: ['config', 'configuration'],
    aliases: ['config', 'configuration']
  },
  {
    id: 'logs',
    label: 'System Logs',
    description: 'View system logs and errors',
    type: 'page',
    route: '/admin/logs',
    group: 'System',
    keywords: ['errors', 'debug', 'monitoring'],
    aliases: ['errors', 'debug']
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    description: 'System health and performance',
    type: 'page',
    route: '/admin/monitoring',
    group: 'System',
    keywords: ['health', 'performance', 'metrics'],
    aliases: ['health', 'performance']
  },

  // Analytics & Reports
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View analytics and insights',
    type: 'page',
    route: '/admin/analytics',
    group: 'Reports',
    keywords: ['stats', 'metrics', 'data'],
    aliases: ['stats', 'metrics']
  },
  {
    id: 'reports',
    label: 'Generate Report',
    description: 'Create custom reports',
    type: 'action',
    group: 'Reports',
    keywords: ['export', 'data'],
    action: () => {
      console.log('Generate report');
      // User should override this action
    }
  },

  // Database
  {
    id: 'database',
    label: 'Database Management',
    description: 'Manage database and backups',
    type: 'page',
    route: '/admin/database',
    group: 'Database',
    keywords: ['backup', 'restore', 'migration'],
    aliases: ['backup', 'restore']
  },
  {
    id: 'backup',
    label: 'Create Backup',
    description: 'Create database backup',
    type: 'action',
    group: 'Database',
    keywords: ['backup', 'export'],
    confirm: {
      title: 'Create Backup?',
      message: 'This will create a full database backup.',
      type: 'warning'
    },
    action: () => {
      console.log('Create backup');
      // User should override this action
    }
  },

  // Danger Zone
  {
    id: 'clear-cache',
    label: 'Clear Cache',
    description: 'Clear all system caches',
    type: 'action',
    group: 'Danger Zone',
    keywords: ['reset', 'clear'],
    confirm: {
      title: 'Clear Cache?',
      message: 'This will clear all system caches. This action cannot be undone.',
      type: 'warning'
    },
    action: () => {
      console.log('Clear cache');
      // User should override this action
    }
  },
  {
    id: 'reset-database',
    label: 'Reset Database',
    description: 'Reset database to default state',
    type: 'action',
    group: 'Danger Zone',
    keywords: ['reset', 'clear', 'delete'],
    confirm: {
      title: 'Reset Database?',
      message: 'This will DELETE ALL DATA and reset the database. This action CANNOT be undone!',
      type: 'danger'
    },
    action: () => {
      console.log('Reset database');
      // User should override this action
    }
  },
  {
    id: 'delete-all-users',
    label: 'Delete All Users',
    description: 'Remove all user accounts',
    type: 'action',
    group: 'Danger Zone',
    keywords: ['delete', 'remove', 'clear'],
    confirm: {
      title: 'Delete All Users?',
      message: 'This will permanently delete ALL user accounts. This action CANNOT be undone!',
      type: 'danger'
    },
    action: () => {
      console.log('Delete all users');
      // User should override this action
    }
  }
];

const plugins: SpotlightPlugin[] = [
  CalculatorPlugin({
    enableClipboardCopy: true,
    precision: 10
  }),
  UnitConverterPlugin({
    enableClipboardCopy: true
  }),
  RecentSearchesPlugin({
    maxSearches: 10,
    showInResults: true
  }),
  BookmarksPlugin({
    maxBookmarks: 20,
    showAtTop: true
  }),
  ShortcutsPanelPlugin({
    triggerKey: '?'
  }),
  AnalyticsPlugin({
    // User can configure analytics callbacks
  })
];

export const AdminPanelTemplate = {
  items,
  plugins,
  theme: 'slate' as const,
  layout: 'center' as const,
  enableRecent: true,
  enableGoogleSearch: false
};
