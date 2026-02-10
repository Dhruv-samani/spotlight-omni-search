import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CommandLoadingProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CommandLoading = forwardRef<HTMLDivElement, CommandLoadingProps>(({
    className,
    children,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn("py-6 text-center text-sm text-muted-foreground", className)}
            cmdk-loading=""
            role="progressbar"
            {...props}
        >
            {children}
        </div>
    );
});

CommandLoading.displayName = "CommandLoading";
