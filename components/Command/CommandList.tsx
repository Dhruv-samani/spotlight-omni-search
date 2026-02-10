import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useCommand } from './CommandContext';

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
    loading?: boolean;
}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(({
    className,
    children,
    loading,
    ...props
}, ref) => {
    const { listId } = useCommand();

    return (
        <div
            ref={ref}
            id={listId}
            className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
            cmdk-list=""
            role="listbox"
            tabIndex={-1} // Not focusable itself, items are
            {...props}
        >
            <div role="presentation" className="min-h-[1px]">
                {children}
            </div>
        </div>
    );
});

CommandList.displayName = "CommandList";
