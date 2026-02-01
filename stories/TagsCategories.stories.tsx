import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useMemo } from 'react';
import { Tag, Shield, Zap, Star, AlertCircle, Clock, Users, FileText } from 'lucide-react';
import type { SpotlightItem, TagConfig } from '../types';
import '../dev/index.css';

const meta: Meta = {
    title: 'Features/Tags & Categories',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

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

// Tags & Categories Component
const TagsSpotlight = ({ items, tagColors }: { items: SpotlightItem[], tagColors?: Record<string, string> }) => {
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter items by query and tags
    const filteredItems = useMemo(() => {
        if (!query) return items;

        const lowerQuery = query.toLowerCase();

        // Extract tag filters (e.g., "tag:admin")
        const tagMatches = query.match(/tag:(\w+)/g);
        const requiredTags = tagMatches
            ? tagMatches.map(match => match.replace('tag:', '').toLowerCase())
            : [];

        // Remove tag filters from search query
        const searchQuery = query.replace(/tag:\w+/g, '').trim().toLowerCase();

        return items.filter(item => {
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
    }, [items, query]);

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

    const mergedTagColors = { ...DEFAULT_TAG_COLORS, ...tagColors };

    return (
        <div className="w-[700px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Try: "tag:admin" or "tag:urgent" or "user tag:admin"'
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        autoFocus
                    />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                    {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                    {query && ` for "${query}"`}
                </div>
            </div>

            {/* Items List */}
            <div className="max-h-[500px] overflow-y-auto">
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
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
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
                                                            color={item.tagColors?.[tag] || mergedTagColors[tag.toLowerCase()]}
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

            {/* Help text */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <div className="font-semibold">💡 Tag Filtering Tips:</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div><code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">tag:admin</code> - Filter by single tag</div>
                        <div><code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">tag:admin tag:urgent</code> - Multiple tags (AND)</div>
                        <div><code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">user tag:admin</code> - Search + tag filter</div>
                        <div><code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">tag:beta</code> - Find beta features</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stories
export const BasicTags: Story = {
    render: () => {
        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Tags & Categories - Basic Demo
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Items organized with tags and categories
                    </p>
                </div>
                <TagsSpotlight items={sampleItems} />
            </div>
        );
    }
};

export const TagFiltering: Story = {
    render: () => {
        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Tag Filtering
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Use <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">tag:name</code> syntax to filter
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full">
                            Try: tag:admin
                        </span>
                        <span className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full">
                            Try: tag:urgent
                        </span>
                        <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                            Try: tag:dev tag:beta
                        </span>
                    </div>
                </div>
                <TagsSpotlight items={sampleItems} />
            </div>
        );
    }
};

export const CustomTagColors: Story = {
    render: () => {
        const customColors = {
            'admin': '#9333ea',      // purple
            'urgent': '#dc2626',     // red
            'beta': '#f97316',       // orange
            'new': '#10b981',        // green
            'security': '#ef4444',   // bright red
        };

        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Custom Tag Colors
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Customize tag colors to match your brand
                    </p>
                </div>
                <TagsSpotlight items={sampleItems} tagColors={customColors} />
            </div>
        );
    }
};
