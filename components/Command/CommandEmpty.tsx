import React, { forwardRef } from 'react';
import { useCommand } from './CommandContext';
import { cn } from '../../lib/utils';

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(({
    className,
    children,
    ...props
}, ref) => {
    const { filteredIds, isFiltering } = useCommand();

    // Show only if filtering is active and no items match
    if (!isFiltering || (filteredIds && filteredIds.size > 0)) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={cn("py-6 text-center text-sm", className)}
            cmdk-empty=""
            role="presentation"
            {...props}
        >
            {children}
        </div>
    );
});

CommandEmpty.displayName = "CommandEmpty";
