import React, { useRef } from 'react';
import { SpotlightItem } from '../types';
import { SpotlightPlugin, PluginContext } from '../types/plugin';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface NestedPluginOptions {
    backKey?: 'Backspace' | 'Escape';
}

export const NestedCommandsPlugin = (options: NestedPluginOptions = {}): SpotlightPlugin => {
    // Internal State (using ref pattern to persist across renders if needed, but plugin factory returns object so closure is fine)
    let context: PluginContext | null = null;
    let stack: SpotlightItem[] = [];

    // Force Update Logic: Since plugins are outside React render cycle, 
    // we strictly rely on setQuery to force re-renders for now 
    // or we assume the host component will re-evaluate renderHeader on specific triggers.
    // In our implementation, renderHeader is called on every render of Spotlight.
    // We need to ensure Spotlight re-renders when we push/pop. 
    // Calling setQuery('') does exactly that.

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!context || !context.isOpen) return;

        const backKey = options.backKey || 'Backspace';

        if (e.key === backKey && stack.length > 0) {
            if (backKey === 'Backspace' && context.query.length > 0) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            stack.pop();
            context.setQuery(''); // Trigger update
        }
    };

    return {
        name: 'spotlight-nested',
        version: '1.0.0',

        onInit: (ctx) => {
            context = ctx;
            if (typeof window !== 'undefined') {
                window.addEventListener('keydown', handleKeyDown, true);
            }
        },

        onBeforeSearch: (query, items) => {
            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                return parent.items || [];
            }
            return items;
        },

        onSelect: (item) => {
            if (item.items && item.items.length > 0) {
                stack.push(item);
                context?.setQuery('');
                return false;
            }
            return true;
        },

        renderHeader: () => {
            if (stack.length === 0 || !context) return null;

            // Render Custom Breadcrumb Header
            return (
                <div className="flex flex-col border-b border-border bg-muted/20">
                    {/* Breadcrumbs */}
                    <div className="flex items-center px-4 py-2 gap-1 text-xs text-muted-foreground overflow-hidden">
                        <span className="shrink-0 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                                stack = [];
                                context?.setQuery('');
                            }}>
                            Home
                        </span>
                        {stack.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <ChevronRight size={10} />
                                <span
                                    className={`shrink-0 truncate max-w-[100px] cursor-pointer hover:text-foreground transition-colors ${index === stack.length - 1 ? 'font-medium text-foreground' : ''}`}
                                    onClick={() => {
                                        // Navigate to this level
                                        stack = stack.slice(0, index + 1);
                                        context?.setQuery('');
                                    }}
                                >
                                    {item.label}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Input Field (Standard looking) */}
                    <div className="relative flex items-center h-10 px-4">
                        <ArrowLeft
                            className="h-4 w-4 text-muted-foreground mr-3 shrink-0 cursor-pointer hover:text-foreground"
                            onClick={() => {
                                stack.pop();
                                context?.setQuery('');
                            }}
                        />
                        <input
                            type="text"
                            autoFocus
                            value={context.query}
                            onChange={e => context?.setQuery(e.target.value)}
                            placeholder={`Search in ${stack[stack.length - 1].label}...`}
                            className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm h-full"
                            onKeyDown={e => e.stopPropagation()}
                        />
                    </div>
                </div>
            );
        },

        onClose: () => {
            stack = [];
        },

        onDestroy: () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', handleKeyDown, true);
            }
        }
    };
};
