/// <reference path="../vite-env.d.ts" />
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../index.css'; // Library CSS variables
import { Spotlight } from '../Spotlight';
import { SpotlightItem, SpotlightLayout } from '../types';
import { AnalyticsPlugin } from '../plugins/analytics';
import { GoogleAnalyticsPlugin } from '../plugins/google-analytics';
import { CalculatorPlugin } from '../plugins/calculator';
import {
    Layout,
    Palette,
    Settings,
    Monitor,
    Smartphone,
    Github,
    ExternalLink,
    Copy,
    Check,
    Shield,
    History,
    Zap,
    Code
} from 'lucide-react';

const themes = [
    { name: 'light', color: '#ffffff', bg: 'bg-white' },
    { name: 'dark', color: '#0f172a', bg: 'bg-slate-900' },
    { name: 'slate', color: '#475569', bg: 'bg-slate-600' },
    { name: 'rose', color: '#e11d48', bg: 'bg-rose-600' },
    { name: 'violet', color: '#7c3aed', bg: 'bg-violet-600' },
    { name: 'amber', color: '#d97706', bg: 'bg-amber-600' },
    { name: 'midnight', color: '#020617', bg: 'bg-blue-950' },
];

const layouts: { id: SpotlightLayout; name: string; description: string }[] = [
    { id: 'center', name: 'Center', description: 'Classic floating modal' },
    { id: 'top', name: 'Top', description: 'Aligned to screen top' },
    { id: 'side-right', name: 'Right Side', description: 'Slide-out panel' },
    { id: 'bottom', name: 'Bottom', description: 'Mobile bottom sheet' },
    { id: 'fullscreen', name: 'Fullscreen', description: 'Cover all content' },
    { id: 'compact', name: 'Compact', description: 'Minimalist footprint' },
];

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<string>('dark');
    const [layout, setLayout] = useState<SpotlightLayout>('center');
    const [debug, setDebug] = useState(false);
    const [enableGoogle, setEnableGoogle] = useState(true);
    const [enableVim, setEnableVim] = useState(false);
    const [enableRecent, setEnableRecent] = useState(true);
    const [headless, setHeadless] = useState(false);
    const [useLargeDataset, setUseLargeDataset] = useState(false);
    const [copied, setCopied] = useState(false);

    const items: SpotlightItem[] = useMemo(() => [
        { id: '1', label: 'Dashboard', type: 'page', group: 'Navigation' },
        { id: '2', label: 'Analytics', type: 'page', group: 'Navigation' },
        { id: '3', label: 'User Settings', type: 'page', group: 'System' },
        { id: '4', label: 'Billing & Plans', type: 'page', group: 'System' },

        // Theme Actions
        { id: 'theme-light', label: 'Switch to Light Mode', type: 'action', group: 'Theme', action: () => setTheme('light') },
        { id: 'theme-dark', label: 'Switch to Dark Mode', type: 'action', group: 'Theme', action: () => setTheme('dark') },
        { id: 'theme-slate', label: 'Switch to Slate Theme', type: 'action', group: 'Theme', action: () => setTheme('slate') },
        { id: 'theme-rose', label: 'Switch to Rose Theme', type: 'action', group: 'Theme', action: () => setTheme('rose') },
        { id: 'theme-violet', label: 'Switch to Violet Theme', type: 'action', group: 'Theme', action: () => setTheme('violet') },
        { id: 'theme-amber', label: 'Switch to Amber Theme', type: 'action', group: 'Theme', action: () => setTheme('amber') },
        { id: 'theme-midnight', label: 'Switch to Midnight Theme', type: 'action', group: 'Theme', action: () => setTheme('midnight') },

        { id: '6', label: 'Google Recent News', type: 'action', group: 'External', action: (args?: string) => window.open(`https://google.com/search?q=\${args}`) },
        {
            id: '7',
            label: 'Delete User Profile',
            type: 'action',
            group: 'Danger',
            confirm: { title: 'Delete Profile?', message: 'This cannot be undone.', type: 'danger' },
            action: () => alert('Deleted!')
        },
    ], []);

    // Generate large dataset for virtual scrolling testing
    const largeDataset: SpotlightItem[] = useMemo(() => {
        const items: SpotlightItem[] = [];
        const groups = ['Navigation', 'System', 'Quick Actions', 'External', 'Reports', 'Settings', 'Tools'];
        const types = ['page', 'action', 'user', 'tenant'];

        for (let i = 1; i <= 1000; i++) {
            items.push({
                id: `item-${i}`,
                label: `Item ${i} - ${['Dashboard', 'Analytics', 'Settings', 'Profile', 'Reports', 'Tools'][i % 6]}`,
                description: `Description for item ${i}`,
                type: types[i % types.length],
                group: groups[i % groups.length],
            });
        }
        return items;
    }, []);

    const activeItems = useLargeDataset ? largeDataset : items;

    const plugins = useMemo(() => [
        CalculatorPlugin({
            enableClipboardCopy: true,
            precision: 10,
            icon: <Code size={16} /> // Using Lucide icon, but could be any icon library
        }),
        AnalyticsPlugin({
            // onSelect: (id, type) => console.log(`[Analytics] Selected ${id} (${type})`),
            // onSearch: (q) => console.log(`[Analytics] Searched for: ${q}`)
        }),
        GoogleAnalyticsPlugin({
            measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
            enableDebug: false,
            loadScript: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
        })
    ], []);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ⌨️ Global Keyboard Shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const codeSnippet = `
<Spotlight
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  theme="${theme}"
  layout="${layout}"
  debug={${debug}}
  enableGoogleSearch={${enableGoogle}}
  enableVimNavigation={${enableVim}}
  enableRecent={${enableRecent}}
  headless={${headless}}
  items={items}
/>`;

    return (
        <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' || theme === 'midnight' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <header className="border-b border-white/5 px-8 py-6 backdrop-blur-md sticky top-0 z-10 glass-card rounded-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Zap className="text-white fill-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Spotlight <span className="gradient-text">Playground</span></h1>
                            <p className="text-xs opacity-50 font-mono">v2.1.4 Production v.11</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* <a href="https://github.com/Dhruv-samani/spotlight-omni-search" target="_blank" className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100">
                            <Github size={20} />
                        </a> */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Open Spotlight (Cmd + K)
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left side: Controls */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Theme Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Palette size={20} className="text-pink-500" />
                                <h2 className="text-lg font-semibold">Visual Themes</h2>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {themes.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setTheme(t.name)}
                                        className={`swatch ${t.bg} ${theme === t.name ? 'active' : ''}`}
                                        title={t.name}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Layout Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Layout size={20} className="text-blue-500" />
                                <h2 className="text-lg font-semibold">Layout Modes</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {layouts.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => setLayout(l.id)}
                                        className={`layout-option text-left glass-card ${layout === l.id ? 'active' : ''}`}
                                    >
                                        <div className="font-medium mb-1">{l.name}</div>
                                        <div className="text-xs opacity-50">{l.description}</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Features Grid */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Settings size={20} className="text-emerald-500" />
                                <h2 className="text-lg font-semibold">Interaction Logic</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'debug', label: 'Debug Mode', desc: 'Display search scores and latency', icon: <Monitor size={18} />, value: debug, setter: setDebug },
                                    { id: 'google', label: 'Google Search', desc: 'Allow direct web search fallback', icon: <Smartphone size={18} />, value: enableGoogle, setter: setEnableGoogle },
                                    { id: 'history', label: 'Record History', desc: 'Persist search queries locally', icon: <History size={18} />, value: enableRecent, setter: setEnableRecent },
                                    { id: 'vim', label: 'Vim Navigation', desc: 'Support h, j, k, l movement', icon: <Zap size={18} />, value: enableVim, setter: setEnableVim },
                                    { id: 'headless', label: 'Headless Mode', desc: 'Remove default styling (bring your own CSS)', icon: <Code size={18} />, value: headless, setter: setHeadless },
                                    { id: 'largedata', label: 'Large Dataset (1000 items)', desc: 'Test virtual scrolling performance', icon: <Monitor size={18} />, value: useLargeDataset, setter: setUseLargeDataset },
                                ].map((f) => (
                                    <div key={f.id} className="glass-card p-6 flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500 mt-1">
                                                {f.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium">{f.label}</div>
                                                <div className="text-xs opacity-50 max-w-[180px] mt-1">{f.desc}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => f.setter(!f.value)}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${f.value ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${f.value ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right side: Code & Stats */}
                    <div className="lg:col-span-4 space-y-8">

                        <div className="glass-card overflow-hidden">
                            <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium opacity-70">
                                    <Code size={14} />
                                    <span>COMPONENT_CONFIG.TSX</span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                                >
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    {copied && <span className="text-[10px] font-medium text-emerald-500">Copied!</span>}
                                </button>
                            </div>
                            <div className="p-6">
                                <pre className="custom-scrollbar overflow-x-auto text-blue-500 dark:text-blue-400">
                                    {codeSnippet}
                                </pre>
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-blue-600/5 border-blue-500/20">
                            <h3 className="text-sm font-semibold opacity-70 mb-4 uppercase tracking-wider">Quick Highlights</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span>Privacy Obfuscation Enabled</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Zap size={16} className="text-amber-500" />
                                    <span>Adaptive Zero-Lag Filter</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <Monitor size={16} className="text-blue-500" />
                                    <span>Tailwind-Native Responsive</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Backdrop floating glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <Spotlight
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onNavigate={(p) => console.log('Navigate:', p)}
                theme={theme as any}
                layout={layout}
                debug={debug}
                enableGoogleSearch={enableGoogle}
                enableVimNavigation={enableVim}
                enableRecent={enableRecent}
                headless={headless}
                classNames={headless ? {
                    backdrop: 'fixed inset-0 bg-black/50',
                    container: 'bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl mx-auto mt-20 p-4',
                    header: 'flex items-center gap-2 mb-4',
                    input: 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
                    listContainer: 'max-h-96 overflow-y-auto',
                    item: 'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded',
                    itemSelected: 'px-4 py-2 bg-blue-500 text-white cursor-pointer rounded',
                } : undefined}
                items={activeItems}
                plugins={plugins}
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
