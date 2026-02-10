import React, { useState } from 'react';
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
    CommandLoading,
    CommandVirtualList
} from '../components/Command';
import { User, CreditCard, Settings, Calculator, Calendar, ArrowLeft } from 'lucide-react';

export function CommandDemo() {
    const [open, setOpen] = useState(false);

    // Generate large dataset for virtual testing
    const largeItems = React.useMemo(() => {
        return Array.from({ length: 1000 }, (_, i) => ({
            value: `item-${i}`,
            label: `Virtual Item ${i + 1}`
        }));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.hash = ''}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">New Command Primitives</h1>
                        <p className="text-slate-400">Headless, composable, virtualized.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Standard Usage */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg text-blue-400">Standard Usage</h2>
                        <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden h-[400px]">
                            <Command className="h-full bg-transparent">
                                <CommandInput placeholder="Type a command or search..." className="text-white placeholder:text-slate-500 border-slate-800" wrapperClassName="border-slate-800" />
                                <CommandList className="custom-scrollbar">
                                    <CommandEmpty className="text-slate-500">No results found.</CommandEmpty>
                                    <CommandGroup heading="Suggestions" className="text-slate-200">
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <span>Calendar</span>
                                        </CommandItem>
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Search Emoji</span>
                                        </CommandItem>
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <Calculator className="mr-2 h-4 w-4" />
                                            <span>Calculator</span>
                                        </CommandItem>
                                    </CommandGroup>
                                    <div className="h-px bg-slate-800 my-1 mx-1" />
                                    <CommandGroup heading="Settings" className="text-slate-200">
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </CommandItem>
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Billing</span>
                                        </CommandItem>
                                        <CommandItem onSelect={(v) => console.log('Selected:', v)} className="aria-selected:bg-blue-600 aria-selected:text-white">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                    </div>

                    {/* Virtualized Usage */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg text-purple-400">Virtualized (1000 items)</h2>
                        <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden h-[400px]">
                            <Command className="h-full bg-transparent" shouldFilter={false}>
                                <CommandInput placeholder="Search 1000 items..." className="text-white placeholder:text-slate-500 border-slate-800" wrapperClassName="border-slate-800" />
                                <CommandVirtualList
                                    data={largeItems}
                                    estimateSize={36}
                                    className="custom-scrollbar"
                                    renderItem={(item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={() => console.log(item.value)}
                                            className="aria-selected:bg-purple-600 aria-selected:text-white"
                                        >
                                            {item.label}
                                        </CommandItem>
                                    )}
                                />
                            </Command>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
