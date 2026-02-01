import React, { useState, useMemo } from 'react';
import { ArrowLeft, Tag, Shield, Zap, Star, AlertCircle, Clock } from 'lucide-react';
import type { SpotlightItem } from '../types';
import './index.css';

// Sample items with tags and categories
const sampleItems: SpotlightItem[] = [
    // Administration
    { id: '1', label: 'User Management', description: 'Manage users and permissions', type: 'page', category: 'Administration', tags: ['admin', 'users', 'security'] },
    { id: '2', label: 'Role Settings', description: 'Configure user roles', type: 'page', category: 'Administration', tags: ['admin', 'security', 'roles'] },
    { id: '3', label: 'System Settings', description: 'Configure system preferences', type: 'page', category: 'Administration', tags: ['admin', 'settings'] },

    // Content
    { id: '4', label: 'Create Post', description: 'Write a new blog post', type: 'action', category: 'Content', tags: ['content', 'editor', 'new'] },
    { id: '5', label: 'View Analytics', description: 'View content analytics', type: 'page', category: 'Content', tags: ['content', 'stats', 'analytics'] },
    { id: '6', label: 'Media Library', description: 'Manage images and videos', type: 'page', category: 'Content', tags: ['content', 'media'] },

    // Development
    { id: '7', label: 'API Documentation', description: 'View API docs', type: 'page', category: 'Development', tags: ['dev', 'docs', 'api'] },
    { id: '8', label: 'Debug Console', description: 'Open debug console', type: 'action', category: 'Development', tags: ['dev', 'debug', 'beta'] },
    { id: '9', label: 'Database Explorer', description: 'Browse database', type: 'page', category: 'Development', tags: ['dev', 'database', 'beta'] },

    // Urgent items
    { id: '10', label: 'Security Alert', description: 'Critical security issue', type: 'action', category: 'Alerts', tags: ['urgent', 'security', 'admin'] },
    { id: '11', label: 'System Update', description: 'Update available', type: 'action', category: 'Alerts', tags: ['urgent', 'system'] },
];

// Default tag colors
const DEFAULT_TAG_COLORS: Record<string, string> = {
    // Status
    'urgent': '#ef4444',
    'important': '#f59e0b',
    'beta': '#ec4899',
    'new': '#14b8a6',

    // Roles
    'admin': '#8b5cf6',
    'user': '#10b981',
    'dev': '#3b82f6',

    // Categories
    'security': '#dc2626',
    'content': '#059669',
    'analytics': '#0891b2',
    'stats': '#0891b2',
};

// Tag Badge Component
const TagBadge = ({ tag, color }: { tag: string; color?: string }) => {
    const bgColor = color || DEFAULT_TAG_COLORS[tag.toLowerCase()] || '#6b7280';

    // Calculate contrast color
    const getContrastColor = (hexColor: string) => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    };

    return (
        <span
            className="inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium"
            style={{
                backgroundColor: bgColor,
                color: getContrastColor(bgColor)
            }}
        >
            {tag}
        </span>
    );
};

export function TagsCategoriesDemo() {
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter items by query and tags
    const filteredItems = useMemo(() => {
        if (!query) return sampleItems;

        const lowerQuery = query.toLowerCase();

        // Extract tag filters (e.g., "tag:admin")
        const tagMatches = query.match(/tag:(\w+)/g);
        const requiredTags = tagMatches
            ? tagMatches.map(match => match.replace('tag:', '').toLowerCase())
            : [];

        // Remove tag filters from search query
        const searchQuery = query.replace(/tag:\w+/g, '').trim().toLowerCase();

        return sampleItems.filter(item => {
            // Check tag filters
            if (requiredTags.length > 0) {
                if (!item.tags) return false;
                const itemTags = item.tags.map(t => t.toLowerCase());
                const hasAllTags = requiredTags.every(tag => itemTags.includes(tag));
                if (!hasAllTags) return false;
            }

            // Check search query
            if (searchQuery) {
                const matchesLabel = item.label.toLowerCase().includes(searchQuery);
                const matchesDescription = item.description?.toLowerCase().includes(searchQuery);
                const matchesCategory = item.category?.toLowerCase().includes(searchQuery);
                return matchesLabel || matchesDescription || matchesCategory;
            }

            return true;
        });
    }, [query]);

    // Group by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, SpotlightItem[]> = {};
        filteredItems.forEach(item => {
            const group = item.category || 'Other';
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
        });
        return groups;
    }, [filteredItems]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Playground
                    </a>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Tags & Categories Demo
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Organize and filter items using tags and categories
                    </p>
                </div>

                {/* Demo Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '500px' }}>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='Try: "tag:admin" or "tag:urgent" or "user tag:admin"'
                                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                autoFocus
                            />
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                            {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                            {query && ` for "${query}"`}
                        </div>
                    </div>

                    {/* Items List - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <div key={category}>
                                <div className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 uppercase tracking-wider sticky top-0 z-10">
                                    {category}
                                </div>
                                {categoryItems.map((item) => {
                                    const isSelected = selectedId === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedId(item.id)}
                                            className={`px-6 py-4 cursor-pointer transition-colors border-l-4 ${isSelected
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                                        {item.label}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                    {/* Tags */}
                                                    {item.tags && item.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {item.tags.map((tag) => (
                                                                <TagBadge
                                                                    key={tag}
                                                                    tag={tag}
                                                                    color={item.tagColors?.[tag] || DEFAULT_TAG_COLORS[tag.toLowerCase()]}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {filteredItems.length === 0 && (
                            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                                <div className="text-4xl mb-2">🔍</div>
                                <div className="text-sm">No items found</div>
                                <div className="text-xs mt-1">Try a different search or tag filter</div>
                            </div>
                        )}
                    </div>

                    {/* Help text - Always visible at bottom */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800 flex-shrink-0">
                        <div className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
                            <div className="font-semibold">💡 Tag Filtering Tips:</div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div><code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">tag:admin</code> - Filter by single tag</div>
                                <div><code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">tag:admin tag:urgent</code> - Multiple tags (AND)</div>
                                <div><code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">user tag:admin</code> - Search + tag filter</div>
                                <div><code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">tag:beta</code> - Find beta features</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">✨ Features</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Tag-based filtering with <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">tag:</code> syntax</li>
                            <li>• Multiple tag filtering (AND logic)</li>
                            <li>• Combined search + tag filtering</li>
                            <li>• Color-coded tag badges</li>
                            <li>• Category-based grouping</li>
                            <li>• Automatic contrast calculation</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">🎯 Try It Out</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>1. Type <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">tag:admin</code> to see admin items</li>
                            <li>2. Try <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">tag:urgent</code> for urgent alerts</li>
                            <li>3. Combine: <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">tag:dev tag:beta</code></li>
                            <li>4. Search + tag: <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">user tag:admin</code></li>
                            <li>5. Browse by category grouping</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
