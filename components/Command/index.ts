/**
 * Command Component
 * 
 * A composable, unstyled command menu for React.
 * 
 * Core architecture inspired by cmdk by Paco Coursey.
 * Implementation built from scratch for Spotlight v3.
 * 
 * Licensed under MIT.
 */
import { Command as CommandRoot } from './Command';
import { CommandInput } from './CommandInput';
import { CommandList } from './CommandList';
import { CommandItem } from './CommandItem';
import { CommandGroup } from './CommandGroup';
import { CommandEmpty } from './CommandEmpty';
import { CommandLoading } from './CommandLoading';
import { CommandVirtualList } from './CommandVirtualList';

// Create Compound Component to match cmdk API
const Command = Object.assign(CommandRoot, {
    Input: CommandInput,
    List: CommandList,
    Item: CommandItem,
    Group: CommandGroup,
    Empty: CommandEmpty,
    Loading: CommandLoading,
    VirtualList: CommandVirtualList,
    // Aliases if needed, or just keep strict
});

export { Command };
export { CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty, CommandLoading, CommandVirtualList };
export { useCommand } from './CommandContext';
export type { CommandProps } from './Command';
