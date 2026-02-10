import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    heading?: React.ReactNode;
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(({
    className,
    children,
    heading,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                className
            )}
            cmdk-group=""
            role="group"
            {...props}
        >
            {heading && (
                <div cmdk-group-heading="" aria-hidden="true">
                    {heading}
                </div>
            )}
            <div role="presentation" cmdk-group-items="">
                {children}
            </div>
        </div>
    );
});

CommandGroup.displayName = "CommandGroup";
