import { SpotlightItem } from '../types';
import { SpotlightPlugin } from '../types/plugin';
import { CalculatorPlugin } from '../plugins/calculator';
import { UnitConverterPlugin } from '../plugins/unit-converter';
import { ShortcutsPanelPlugin } from '../plugins/shortcuts-panel';

/**
 * Documentation Site Template
 * 
 * Pre-configured Spotlight setup for documentation websites.
 * Includes documentation navigation, search, and helpful plugins.
 * 
 * @example
 * ```tsx
 * import { DocsTemplate } from 'spotlight-omni-search/templates';
 * 
 * <SpotlightProvider {...DocsTemplate}>
 *   {children}
 * </SpotlightProvider>
 * ```
 */

const items: SpotlightItem[] = [
  // Main Documentation
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'Quick start guide and installation',
    type: 'page',
    route: '/docs/getting-started',
    group: 'Documentation',
    keywords: ['intro', 'setup', 'install', 'quickstart'],
    aliases: ['intro', 'quickstart', 'setup']
  },
  {
    id: 'api-reference',
    label: 'API Reference',
    description: 'Complete API documentation',
    type: 'page',
    route: '/docs/api',
    group: 'Documentation',
    keywords: ['api', 'methods', 'functions', 'reference'],
    aliases: ['api', 'reference']
  },
  {
    id: 'guides',
    label: 'Guides & Tutorials',
    description: 'Step-by-step guides',
    type: 'page',
    route: '/docs/guides',
    group: 'Documentation',
    keywords: ['tutorial', 'how-to', 'examples'],
    aliases: ['tutorials', 'examples', 'how-to']
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Component library documentation',
    type: 'page',
    route: '/docs/components',
    group: 'Documentation',
    keywords: ['ui', 'library', 'elements'],
    aliases: ['ui', 'library']
  },
  {
    id: 'changelog',
    label: 'Changelog',
    description: 'Version history and updates',
    type: 'page',
    route: '/docs/changelog',
    group: 'Documentation',
    keywords: ['updates', 'releases', 'versions', 'history'],
    aliases: ['updates', 'releases', 'versions']
  },

  // Examples
  {
    id: 'examples',
    label: 'Code Examples',
    description: 'Browse code examples',
    type: 'page',
    route: '/examples',
    group: 'Resources',
    keywords: ['code', 'samples', 'snippets'],
    aliases: ['samples', 'snippets', 'demos']
  },
  {
    id: 'playground',
    label: 'Interactive Playground',
    description: 'Try it in the browser',
    type: 'page',
    route: '/playground',
    group: 'Resources',
    keywords: ['demo', 'try', 'interactive'],
    aliases: ['demo', 'try']
  },

  // Community
  {
    id: 'github',
    label: 'View on GitHub',
    description: 'Star us on GitHub',
    type: 'action',
    group: 'Community',
    keywords: ['source', 'code', 'repository'],
    action: () => {
      window.open('https://github.com/username/repo', '_blank');
    }
  },
  {
    id: 'discord',
    label: 'Join Discord',
    description: 'Join our Discord community',
    type: 'action',
    group: 'Community',
    keywords: ['chat', 'community', 'help'],
    action: () => {
      window.open('https://discord.gg/example', '_blank');
    }
  },

  // Version Switcher
  {
    id: 'version-latest',
    label: 'Switch to Latest Version',
    description: 'View latest documentation',
    type: 'action',
    group: 'Version',
    keywords: ['version', 'latest'],
    action: () => {
      console.log('Switch to latest version');
      // User should override this action
    }
  },
  {
    id: 'version-v1',
    label: 'Switch to v1.x',
    description: 'View v1.x documentation',
    type: 'action',
    group: 'Version',
    keywords: ['version', 'v1', 'legacy'],
    action: () => {
      console.log('Switch to v1');
      // User should override this action
    }
  },

  // Theme
  {
    id: 'theme-light',
    label: 'Light Theme',
    description: 'Switch to light mode',
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
    label: 'Dark Theme',
    description: 'Switch to dark mode',
    type: 'action',
    group: 'Appearance',
    keywords: ['theme', 'appearance'],
    action: () => {
      console.log('Switch to dark theme');
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
  ShortcutsPanelPlugin({
    triggerKey: '?'
  })
];

export const DocsTemplate = {
  items,
  plugins,
  theme: 'light' as const,
  layout: 'center' as const,
  enableRecent: true,
  enableGoogleSearch: false
};
