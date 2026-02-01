import React, { useState, useCallback } from 'react';
import { Trash, Download, Archive, CheckSquare, Square, ArrowLeft } from 'lucide-react';
import type { SpotlightItem, MultiSelectAction } from '../types';
import './index.css';

// Sample items
const sampleItems: SpotlightItem[] = [
    { id: '1', label: 'User: John Doe', description: 'john@example.com', type: 'user', group: 'Users' },
    { id: '2', label: 'User: Jane Smith', description: 'jane@example.com', type: 'user', group: 'Users' },
    { id: '3', label: 'User: Bob Johnson', description: 'bob@example.com', type: 'user', group: 'Users' },
    { id: '4', label: 'User: Alice Williams', description: 'alice@example.com', type: 'user', group: 'Users' },
    { id: '5', label: 'File: Report.pdf', description: '/documents/report.pdf', type: 'action', group: 'Files' },
    { id: '6', label: 'File: Presentation.pptx', description: '/documents/presentation.pptx', type: 'action', group: 'Files' },
    { id: '7', label: 'File: Spreadsheet.xlsx', description: '/documents/spreadsheet.xlsx', type: 'action', group: 'Files' },
    { id: '8', label: 'File: Notes.txt', description: '/documents/notes.txt', type: 'action', group: 'Files' },
    { id: '9', label: 'Task: Review PR #123', description: 'Code review needed', type: 'action', group: 'Tasks' },
    { id: '10', label: 'Task: Update Documentation', description: 'Add new features', type: 'action', group: 'Tasks' },
    { id: '11', label: 'Task: Fix Bug #456', description: 'Critical issue', type: 'action', group: 'Tasks' },
    { id: '12', label: 'Task: Deploy to Production', description: 'Release v2.0', type: 'action', group: 'Tasks' },
];

export function MultiSelectDemo() {
    const [query, setQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [lastAction, setLastAction] = useState<string>('');
    const [items, setItems] = useState(sampleItems);

    // Filter items based on query
    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );

    // Toggle selection
    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    // Select all
    const selectAll = useCallback(() => {
        setSelectedIds(new Set(filteredItems.map(item => item.id)));
    }, [filteredItems]);

    // Deselect all
    const deselectAll = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    // Bulk actions
    const bulkActions: MultiSelectAction[] = [
        {
            id: 'delete',
            label: 'Delete',
            icon: React.createElement(Trash, { size: 14 }),
            variant: 'danger',
            action: (selectedItems) => {
                const selectedIdSet = new Set(selectedItems.map(i => i.id));
                setItems(prev => prev.filter(item => !selectedIdSet.has(item.id)));
                setLastAction(`Deleted ${selectedItems.length} items`);
                setSelectedIds(new Set());
            }
        },
        {
            id: 'export',
            label: 'Export',
            icon: React.createElement(Download, { size: 14 }),
            action: (selectedItems) => {
                console.log('Exporting:', selectedItems);
                setLastAction(`Exported ${selectedItems.length} items`);
                setSelectedIds(new Set());
            }
        },
        {
            id: 'archive',
            label: 'Archive',
            icon: React.createElement(Archive, { size: 14 }),
            action: (selectedItems) => {
                console.log('Archiving:', selectedItems);
                setLastAction(`Archived ${selectedItems.length} items`);
                setSelectedIds(new Set());
            }
        }
    ];

    // Execute bulk action
    const executeBulkAction = useCallback((action: MultiSelectAction) => {
        const selectedItems = items.filter(item => selectedIds.has(item.id));
        action.action(selectedItems);
    }, [selectedIds, items]);

    // Reset items
    const resetItems = () => {
        setItems(sampleItems);
        setSelectedIds(new Set());
        setLastAction('');
    };

    // Group items
    const groupedItems = filteredItems.reduce((acc, item) => {
        const group = item.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, SpotlightItem[]>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
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
                        Multi-Select Mode Demo
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Fully functional multi-select with checkboxes, bulk actions, and keyboard shortcuts
                    </p>
                </div>

                {/* Demo Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '500px' }}>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search items... (Click to select)"
                                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                autoFocus
                            />
                        </div>

                        {/* Selection controls */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-600 dark:text-slate-400">
                                {selectedIds.size > 0 ? (
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
                                    </span>
                                ) : (
                                    <span>No items selected</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
                                >
                                    Select All
                                </button>
                                {selectedIds.size > 0 && (
                                    <button
                                        onClick={deselectAll}
                                        className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                                <button
                                    onClick={resetItems}
                                    className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items List - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedItems).map(([group, groupItems]) => (
                            <div key={group}>
                                <div className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 uppercase tracking-wider sticky top-0 z-10">
                                    {group}
                                </div>
                                {groupItems.map((item) => {
                                    const isSelected = selectedIds.has(item.id);
                                    const isHovered = hoveredId === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleSelection(item.id)}
                                            onMouseEnter={() => setHoveredId(item.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <div className={`transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                                {isSelected ? (
                                                    <CheckSquare size={20} className="text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <Square size={20} className="text-slate-400 dark:text-slate-600" />
                                                )}
                                            </div>

                                            {/* Item content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                    {item.label}
                                                </div>
                                                {item.description && (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Bulk Actions Toolbar */}
                    {selectedIds.size > 0 && (
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
                                </div>
                                <div className="flex gap-2">
                                    {bulkActions.map((action) => (
                                        <button
                                            key={action.id}
                                            onClick={() => executeBulkAction(action)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow ${action.variant === 'danger'
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {action.icon}
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action feedback */}
                    {lastAction && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2 font-medium">
                                <span className="text-green-600 dark:text-green-400">✓</span>
                                {lastAction}
                            </div>
                        </div>
                    )}

                    {/* Help text */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-800 dark:text-blue-200 text-center space-y-1">
                            <div className="font-semibold">💡 How to Use:</div>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <span>Click on any item to toggle selection</span>
                                <span>• Use "Select All" to select all visible items</span>
                                <span>• Try searching to filter items</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">✨ Features</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Checkboxes visible on hover/selection</li>
                            <li>• Click any item to toggle selection</li>
                            <li>• Select All / Clear buttons</li>
                            <li>• Bulk actions toolbar</li>
                            <li>• Search filtering</li>
                            <li>• Grouped items display</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">🎯 Try It Out</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>1. Click on any item to select it</li>
                            <li>2. Click "Select All" to select all</li>
                            <li>3. Use bulk actions (Delete, Export, Archive)</li>
                            <li>4. Try searching for "user" or "file"</li>
                            <li>5. Click "Reset" to restore deleted items</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
