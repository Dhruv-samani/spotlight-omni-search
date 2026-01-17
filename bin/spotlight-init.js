#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('spotlight-init')
    .description('Initialize Spotlight Omni-Search in your project')
    .version('2.3.1')
    .option('-f, --force', 'Overwrite existing files')
    .option('--theme <theme>', 'Set default theme')
    .option('--no-demo', 'Do not include demo items')
    .action(async (options) => {
        console.log(pc.cyan(pc.bold('\n🔦 Spotlight Omni-Search Initializer\n')));

        try {
            await runInit(options);
        } catch (error) {
            console.error(pc.red('\n❌ Error:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

async function runInit(options) {
    // 1. Detect Framework
    const framework = await detectFramework();
    console.log(pc.blue(`ℹ Detected framework: ${pc.bold(framework)}`));

    // 2. User Prompts
    const response = await prompts([
        {
            type: 'confirm',
            name: 'addWrapper',
            message: 'Would you like to generate a SpotlightWrapper component?',
            initial: true
        },
        {
            type: 'confirm',
            name: 'addDemo',
            message: 'Include demo search items?',
            initial: true
        }
    ]);

    if (response.addWrapper === undefined) return; // User cancelled

    // 3. Scaffolding
    console.log(pc.dim('\n🛠  Scaffolding files...'));

    await createWrapperComponent(framework, response.addDemo);

    // 4. Update Configuration
    console.log(pc.dim('\n⚙️  Updating configuration...'));

    await updateTailwindConfig();
    await injectCSS(framework);

    console.log(pc.green(pc.bold('\n✅ Setup complete!')));
    console.log(`\nNext steps:`);
    console.log(`1. Import ${pc.cyan('SpotlightWrapper')} in your App or Layout`);
    console.log(`2. Wrap your application with it`);
    console.log(`3. Press ${pc.bold('Cmd+K')} to search\n`);
}

async function detectFramework() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(pkgPath)) return 'unknown';

    const pkg = await fs.readJson(pkgPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps.next) return 'next';
    if (deps.vite) return 'vite';
    if (deps['react-scripts']) return 'cra';
    return 'unknown';
}

async function createWrapperComponent(framework, includeDemo) {
    const targetDir = path.join(process.cwd(), 'src', 'components');
    await fs.ensureDir(targetDir);

    const targetFile = path.join(targetDir, 'SpotlightWrapper.tsx');

    // Decide imports based on framework
    const importSource = framework === 'next'
        ? 'spotlight-omni-search/next'
        : 'spotlight-omni-search/react';

    const demoItemsCode = includeDemo ? `
  const items = [
    { id: 'home', label: 'Home', route: '/', type: 'page' },
    { id: 'docs', label: 'Documentation', route: '/docs', type: 'page' },
    { id: 'dashboard', label: 'Dashboard', route: '/dashboard', type: 'page' },
  ];` : `
  const items = [];`;

    const content = `import { SpotlightProvider, SearchTrigger } from '${importSource}';
${framework === 'next' ? `import { useRouter } from 'next/navigation';` : framework === 'vite' ? `import { useNavigate } from 'react-router-dom';` : `// import router hook here`}

export function SpotlightWrapper({ children }: { children: React.ReactNode }) {
  ${framework === 'next' ? 'const router = useRouter();' : framework === 'vite' ? 'const navigate = useNavigate();' : 'const navigate = (path: string) => window.location.href = path;'}

  ${demoItemsCode}

  return (
    <SpotlightProvider 
      items={items} 
      onNavigate={(path) => ${framework === 'next' ? 'router.push(path)' : framework === 'vite' ? 'navigate(path)' : 'navigate(path)'}}
      theme="dark"
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <SearchTrigger />
      </div>
    </SpotlightProvider>
  );
}
`;

    await fs.writeFile(targetFile, content);
    console.log(pc.green(`   Created ${targetFile}`));
}

async function updateTailwindConfig() {
    const configPath = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs']
        .find(file => fs.existsSync(path.join(process.cwd(), file)));

    if (!configPath) {
        console.log(pc.yellow('   ⚠️  No tailwind.config found. Skipping update.'));
        return;
    }

    const fullPath = path.join(process.cwd(), configPath);
    let content = await fs.readFile(fullPath, 'utf-8');

    const spotlightPath = '"./node_modules/spotlight-omni-search/**/*.{js,ts,jsx,tsx}"';

    if (!content.includes('spotlight-omni-search')) {
        if (content.includes('content: [')) {
            content = content.replace('content: [', `content: [\n    ${spotlightPath},`);
            await fs.writeFile(fullPath, content);
            console.log(pc.green(`   Updated ${configPath}`));
        } else {
            console.log(pc.yellow(`   ⚠️  Could not automatically update content array in ${configPath}`));
        }
    } else {
        console.log(pc.dim(`   (Tailwind config already updated)`));
    }
}

async function injectCSS(framework) {
    const cssLocations = [
        'src/index.css',
        'src/main.css',
        'app/globals.css',
        'styles/globals.css'
    ];

    const cssFile = cssLocations.find(file => fs.existsSync(path.join(process.cwd(), file)));

    if (cssFile) {
        console.log(pc.dim(`   (CSS should be auto-imported by SpotlightProvider, skipping manual import)`));
    } else {
        console.log(pc.yellow('   ⚠️  No global CSS file found.'));
    }
}

program.parse();
