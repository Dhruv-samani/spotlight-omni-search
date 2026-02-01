import { SpotlightItem } from '../types';
import { SpotlightPlugin } from '../types/plugin';
import { CalculatorPlugin } from '../plugins/calculator';
import { UnitConverterPlugin } from '../plugins/unit-converter';
import { RecentSearchesPlugin } from '../plugins/recent-searches';
import { BookmarksPlugin } from '../plugins/bookmarks';
import { ShortcutsPanelPlugin } from '../plugins/shortcuts-panel';

/**
 * SaaS Dashboard Template
 * 
 * Pre-configured Spotlight setup for SaaS applications.
 * Includes common navigation, quick actions, and all v2.5.0 plugins.
 * 
 * @example
 * ```tsx
 * import { SaaSDashboardTemplate } from 'spotlight-omni-search/templates';
 * 
 * <SpotlightProvider {...SaaSDashboardTemplate}>
 *   {children}
 * </SpotlightProvider>
 * ```
 */

const items: SpotlightItem[] = [
  // Navigation
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'View your dashboard overview',
    type: 'page',
    route: '/',
    group: 'Navigation',
    keywords: ['home', 'overview', 'main'],
    aliases: ['home', 'overview']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View analytics and metrics',
    type: 'page',
    route: '/analytics',
    group: 'Navigation',
    keywords: ['metrics', 'stats', 'data'],
    aliases: ['metrics', 'stats']
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage users and team members',
    type: 'page',
    route: '/users',
    group: 'Navigation',
    keywords: ['team', 'members', 'people'],
    aliases: ['team', 'members', 'people']
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configure your account settings',
    type: 'page',
    route: '/settings',
    group: 'Navigation',
    keywords: ['config', 'preferences', 'options'],
    aliases: ['preferences', 'config', 'options', 'prefs']
  },

  // Quick Actions
  {
    id: 'new-project',
    label: 'New Project',
    description: 'Create a new project',
    type: 'action',
    group: 'Quick Actions',
    keywords: ['create', 'add'],
    action: () => {
      console.log('Create new project');
      // User should override this action
    }
  },
  {
    id: 'invite-user',
    label: 'Invite User',
    description: 'Invite a team member',
    type: 'action',
    group: 'Quick Actions',
    keywords: ['add', 'team', 'member'],
    action: () => {
      console.log('Invite user');
      // User should override this action
    }
  },
  {
    id: 'export-data',
    label: 'Export Data',
    description: 'Export your data as CSV',
    type: 'action',
    group: 'Quick Actions',
    keywords: ['download', 'csv', 'backup'],
    action: () => {
      console.log('Export data');
      // User should override this action
    }
  },

  // Billing
  {
    id: 'billing',
    label: 'Billing & Subscription',
    description: 'Manage your subscription and billing',
    type: 'page',
    route: '/billing',
    group: 'Account',
    keywords: ['payment', 'subscription', 'plan'],
    aliases: ['subscription', 'payment', 'plan']
  },
  {
    id: 'upgrade',
    label: 'Upgrade Plan',
    description: 'Upgrade to a premium plan',
    type: 'action',
    group: 'Account',
    keywords: ['premium', 'pro', 'subscription'],
    action: () => {
      console.log('Upgrade plan');
      // User should override this action
    }
  },

  // Theme Switcher
  {
    id: 'theme-light',
    label: 'Switch to Light Mode',
    description: 'Change theme to light mode',
    type: 'action',
    group: 'Appearance',
    keywords: ['theme', 'appearance'],
    action: () => {
      console.log('Switch to light theme');
      // User should override this action
    }
  },
  {
    id: 'theme-dark',
    label: 'Switch to Dark Mode',
    description: 'Change theme to dark mode',
    type: 'action',
    group: 'Appearance',
    keywords: ['theme', 'appearance'],
    action: () => {
      console.log('Switch to dark theme');
      // User should override this action
    }
  },

  // Help & Support
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'View product documentation',
    type: 'action',
    group: 'Help',
    keywords: ['docs', 'help', 'guide'],
    aliases: ['docs', 'help'],
    action: () => {
      window.open('https://docs.example.com', '_blank');
    }
  },
  {
    id: 'support',
    label: 'Contact Support',
    description: 'Get help from our support team',
    type: 'action',
    group: 'Help',
    keywords: ['help', 'contact', 'email'],
    action: () => {
      window.open('mailto:support@example.com', '_blank');
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
  })
];

export const SaaSDashboardTemplate = {
  items,
  plugins,
  theme: 'dark' as const,
  layout: 'center' as const,
  enableRecent: true,
  enableGoogleSearch: true
};
