import React, { forwardRef } from 'react';
import { useCommand } from './CommandContext';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: string) => void;
    wrapperClassName?: string;
    disableIcon?: boolean;
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(({
    className,
    onValueChange,
    wrapperClassName,
    disableIcon = false,
    ...props
}, ref) => {
    const { query, setQuery, listId, activeItemId } = useCommand();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setQuery(newVal);
        onValueChange?.(newVal);
    };

    return (
        <div className={cn("flex items-center border-b px-3", wrapperClassName)} cmdk-input-wrapper="">
            {!disableIcon && <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
            <input
                ref={ref}
                value={query}
                onChange={handleChange}
                className={cn(
                    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                cmdk-input=""
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-autocomplete="list"
                role="combobox"
                aria-expanded={true}
                aria-controls={listId}
                aria-activedescendant={activeItemId}
                {...props}
            />
        </div>
    );
});

CommandInput.displayName = "CommandInput";
