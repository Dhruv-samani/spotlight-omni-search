import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import { Trash, Download, Archive, CheckSquare, Square, X } from 'lucide-react';
import type { SpotlightItem, MultiSelectAction } from '../types';
import '../dev/index.css';

const meta: Meta = {
    title: 'Features/Multi-Select Mode',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Sample items
const sampleItems: SpotlightItem[] = [
    { id: '1', label: 'User: John Doe', description: 'john@example.com', type: 'user', group: 'Users' },
    { id: '2', label: 'User: Jane Smith', description: 'jane@example.com', type: 'user', group: 'Users' },
    { id: '3', label: 'User: Bob Johnson', description: 'bob@example.com', type: 'user', group: 'Users' },
    { id: '4', label: 'File: Report.pdf', description: '/documents/report.pdf', type: 'action', group: 'Files' },
    { id: '5', label: 'File: Presentation.pptx', description: '/documents/presentation.pptx', type: 'action', group: 'Files' },
    { id: '6', label: 'File: Spreadsheet.xlsx', description: '/documents/spreadsheet.xlsx', type: 'action', group: 'Files' },
    { id: '7', label: 'Task: Review PR #123', description: 'Code review needed', type: 'action', group: 'Tasks' },
    { id: '8', label: 'Task: Update Documentation', description: 'Add new features', type: 'action', group: 'Tasks' },
];

// Multi-Select Component
const MultiSelectSpotlight = ({ items, actions }: { items: SpotlightItem[], actions: MultiSelectAction[] }) => {
    const [query, setQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [lastAction, setLastAction] = useState<string>('');

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

    // Execute bulk action
    const executeBulkAction = useCallback((action: MultiSelectAction) => {
        const selectedItems = items.filter(item => selectedIds.has(item.id));
        action.action(selectedItems);
        setLastAction(`${action.label}: ${selectedItems.length} items`);
        setSelectedIds(new Set());
    }, [selectedIds, items]);

    // Group items
    const groupedItems = filteredItems.reduce((acc, item) => {
        const group = item.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, SpotlightItem[]>);

    return (
        <div className="w-[600px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search items... (Ctrl+Click to select)"
                        className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>

                {/* Selection controls */}
                <div className="flex items-center justify-between text-xs">
                    <div className="text-slate-600 dark:text-slate-400">
                        {selectedIds.size > 0 ? (
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {selectedIds.size} selected
                            </span>
                        ) : (
                            <span>No items selected</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={selectAll}
                            className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                            Select All
                        </button>
                        {selectedIds.size > 0 && (
                            <button
                                onClick={deselectAll}
                                className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="max-h-[400px] overflow-y-auto">
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                    <div key={group}>
                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
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
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-2 border-transparent'
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <div className={`transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                        {isSelected ? (
                                            <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <Square size={18} className="text-slate-400 dark:text-slate-600" />
                                        )}
                                    </div>

                                    {/* Item content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                            {item.label}
                                        </div>
                                        {item.description && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex gap-2">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => executeBulkAction(action)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${action.variant === 'danger'
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
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-800 dark:text-green-200 flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        {lastAction}
                    </div>
                </div>
            )}

            {/* Help text */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    💡 Click on any item to toggle selection • Use "Select All" to select all items at once
                </div>
            </div>
        </div>
    );
};

// Stories
export const FullyFunctional: Story = {
    render: () => {
        const bulkActions: MultiSelectAction[] = [
            {
                id: 'delete',
                label: 'Delete',
                icon: React.createElement(Trash, { size: 14 }),
                variant: 'danger',
                action: (items) => {
                    console.log('Deleting:', items);
                    alert(`Deleted ${items.length} items:\n${items.map(i => i.label).join('\n')}`);
                }
            },
            {
                id: 'export',
                label: 'Export',
                icon: React.createElement(Download, { size: 14 }),
                action: (items) => {
                    console.log('Exporting:', items);
                    alert(`Exported ${items.length} items`);
                }
            },
            {
                id: 'archive',
                label: 'Archive',
                icon: React.createElement(Archive, { size: 14 }),
                action: (items) => {
                    console.log('Archiving:', items);
                    alert(`Archived ${items.length} items`);
                }
            }
        ];

        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Multi-Select Mode - Fully Functional
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Complete implementation with checkboxes, selection, and bulk actions
                    </p>
                </div>
                <MultiSelectSpotlight items={sampleItems} actions={bulkActions} />
            </div>
        );
    }
};

export const WithSearch: Story = {
    render: () => {
        const bulkActions: MultiSelectAction[] = [
            {
                id: 'delete',
                label: 'Delete Selected',
                icon: React.createElement(Trash, { size: 14 }),
                variant: 'danger',
                action: (items) => alert(`Deleted ${items.length} items`)
            }
        ];

        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Multi-Select with Search
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Try searching for "user" or "file" and selecting items
                    </p>
                </div>
                <MultiSelectSpotlight items={sampleItems} actions={bulkActions} />
            </div>
        );
    }
};

export const BulkDelete: Story = {
    render: () => {
        const [items, setItems] = useState(sampleItems);

        const bulkActions: MultiSelectAction[] = [
            {
                id: 'delete',
                label: 'Delete Selected',
                icon: React.createElement(Trash, { size: 14 }),
                variant: 'danger',
                action: (selectedItems) => {
                    const selectedIds = new Set(selectedItems.map(i => i.id));
                    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
                }
            }
        ];

        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Bulk Delete Demo
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Select items and delete them - they'll actually be removed!
                    </p>
                    <div className="mt-2">
                        <button
                            onClick={() => setItems(sampleItems)}
                            className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                            Reset Items
                        </button>
                    </div>
                </div>
                <MultiSelectSpotlight items={items} actions={bulkActions} />
            </div>
        );
    }
};

export const CustomBulkActions: Story = {
    render: () => {
        const [items, setItems] = useState(sampleItems);
        const [lastCustomAction, setLastCustomAction] = useState<string>('');

        // Users can define their own custom bulk actions!
        const customBulkActions: MultiSelectAction[] = [
            {
                id: 'email',
                label: 'Send Email',
                icon: React.createElement('span', {}, '📧'),
                action: (selectedItems) => {
                    const emails = selectedItems
                        .filter(item => item.description?.includes('@'))
                        .map(item => item.description);
                    setLastCustomAction(`Sending email to: ${emails.join(', ')}`);
                    console.log('Emails:', emails);
                }
            },
            {
                id: 'tag',
                label: 'Add Tag',
                icon: React.createElement('span', {}, '🏷️'),
                action: (selectedItems) => {
                    setLastCustomAction(`Added "Important" tag to ${selectedItems.length} items`);
                    console.log('Tagged items:', selectedItems);
                }
            },
            {
                id: 'move',
                label: 'Move to Folder',
                icon: React.createElement('span', {}, '📁'),
                action: (selectedItems) => {
                    setLastCustomAction(`Moved ${selectedItems.length} items to "Archive" folder`);
                    console.log('Moved items:', selectedItems);
                }
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: React.createElement(Trash, { size: 14 }),
                variant: 'danger',
                action: (selectedItems) => {
                    const selectedIds = new Set(selectedItems.map(i => i.id));
                    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
                    setLastCustomAction(`Deleted ${selectedItems.length} items`);
                }
            }
        ];

        return (
            <div className="p-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Custom Bulk Actions
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Users can easily add their own custom bulk actions!
                    </p>
                    {lastCustomAction && (
                        <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                            ✨ {lastCustomAction}
                        </div>
                    )}
                    <div className="mt-2">
                        <button
                            onClick={() => {
                                setItems(sampleItems);
                                setLastCustomAction('');
                            }}
                            className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <MultiSelectSpotlight items={items} actions={customBulkActions} />

                {/* Code example */}
                <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Example Code:
                    </h3>
                    <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
                        {`const customBulkActions: MultiSelectAction[] = [
  {
    id: 'email',
    label: 'Send Email',
    icon: <Mail size={14} />,
    action: (selectedItems) => {
      // Your custom logic here
      sendEmailToItems(selectedItems);
    }
  },
  {
    id: 'tag',
    label: 'Add Tag',
    icon: <Tag size={14} />,
    action: (selectedItems) => {
      addTagToItems(selectedItems, 'Important');
    }
  }
];

<SpotlightProvider
  multiSelect={true}
  multiSelectActions={customBulkActions}
>
  <SearchTrigger />
</SpotlightProvider>`}
                    </pre>
                </div>
            </div>
        );
    }
};
