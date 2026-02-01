import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { FileSearchPlugin, type FileItem } from '../plugins/file-search';
import '../dev/index.css';

const meta: Meta<typeof SpotlightProvider> = {
    title: 'Plugins/File Search',
    component: SpotlightProvider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpotlightProvider>;

// Sample file data
const sampleFiles: FileItem[] = [
    { id: '1', path: '/src/App.tsx', name: 'App.tsx', extension: 'tsx', size: 2048, lastModified: new Date('2024-01-30'), directory: '/src' },
    { id: '2', path: '/src/components/Button.tsx', name: 'Button.tsx', extension: 'tsx', size: 1024, lastModified: new Date('2024-01-29'), directory: '/src/components' },
    { id: '3', path: '/src/components/Input.tsx', name: 'Input.tsx', extension: 'tsx', size: 1536, lastModified: new Date('2024-01-28'), directory: '/src/components' },
    { id: '4', path: '/src/styles/main.css', name: 'main.css', extension: 'css', size: 3072, lastModified: new Date('2024-01-27'), directory: '/src/styles' },
    { id: '5', path: '/src/utils/helpers.ts', name: 'helpers.ts', extension: 'ts', size: 2560, lastModified: new Date('2024-01-26'), directory: '/src/utils' },
    { id: '6', path: '/package.json', name: 'package.json', extension: 'json', size: 4096, lastModified: new Date('2024-01-25'), directory: '/' },
    { id: '7', path: '/README.md', name: 'README.md', extension: 'md', size: 8192, lastModified: new Date('2024-01-24'), directory: '/' },
    { id: '8', path: '/public/logo.svg', name: 'logo.svg', extension: 'svg', size: 512, lastModified: new Date('2024-01-23'), directory: '/public' },
    { id: '9', path: '/src/assets/hero.png', name: 'hero.png', extension: 'png', size: 102400, lastModified: new Date('2024-01-22'), directory: '/src/assets' },
    { id: '10', path: '/tsconfig.json', name: 'tsconfig.json', extension: 'json', size: 1024, lastModified: new Date('2024-01-21'), directory: '/' },
];

// Helper Container
const Container = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => (
    <div className="w-[600px] h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col relative shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
            {children}
        </div>
    </div>
);

// Basic File Search
export const BasicFileSearch: Story = {
    render: () => {
        const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

        return (
            <Container
                title="Basic File Search"
                description="Type @ to search for files"
            >
                <SpotlightProvider
                    items={[]}
                    plugins={[
                        FileSearchPlugin({
                            files: sampleFiles,
                            onFileSelect: (file) => {
                                setSelectedFile(file);
                                alert(`Opening: ${file.path}`);
                            }
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Try typing:</p>
                        <p>• <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">@app</code> - Search for App.tsx</p>
                        <p>• <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">@button</code> - Search for Button.tsx</p>
                        <p>• <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">@</code> - Show recent files</p>
                        {selectedFile && (
                            <p className="text-green-600 dark:text-green-400 mt-2">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// With File Icons
export const WithFileIcons: Story = {
    render: () => {
        return (
            <Container
                title="File Search with Icons"
                description="File type icons based on extension"
            >
                <SpotlightProvider
                    items={[]}
                    plugins={[
                        FileSearchPlugin({
                            files: sampleFiles,
                            showIcons: true,
                            onFileSelect: (file) => console.log('Open:', file.path)
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">File type icons:</p>
                        <p>• TypeScript/JavaScript - Blue/Yellow code icon</p>
                        <p>• CSS/SCSS - Palette icon</p>
                        <p>• JSON/YAML - FileJson icon</p>
                        <p>• Images - Image icon</p>
                        <p>• Markdown - FileText icon</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// With Metadata
export const WithMetadata: Story = {
    render: () => {
        return (
            <Container
                title="File Search with Metadata"
                description="Shows file size and last modified date"
            >
                <SpotlightProvider
                    items={[]}
                    plugins={[
                        FileSearchPlugin({
                            files: sampleFiles,
                            showIcons: true,
                            showMetadata: true,
                            onFileSelect: (file) => console.log('Open:', file.path)
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Metadata includes:</p>
                        <p>• File size (B, KB, MB)</p>
                        <p>• Last modified (Today, Yesterday, X days ago)</p>
                        <p>• Directory path</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// Async File Search
export const AsyncFileSearch: Story = {
    render: () => {
        const searchFiles = async (query: string): Promise<FileItem[]> => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter files based on query
            return sampleFiles.filter(file =>
                file.name.toLowerCase().includes(query.toLowerCase()) ||
                file.path.toLowerCase().includes(query.toLowerCase())
            );
        };

        return (
            <Container
                title="Async File Search"
                description="Simulates API file search with delay"
            >
                <SpotlightProvider
                    items={[]}
                    plugins={[
                        FileSearchPlugin({
                            onSearch: searchFiles,
                            showIcons: true,
                            showMetadata: true,
                            onFileSelect: (file) => console.log('Open:', file.path)
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Features:</p>
                        <p>• Async file search (300ms delay)</p>
                        <p>• Dynamic results</p>
                        <p>• Loading states</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// Recent Files
export const RecentFiles: Story = {
    render: () => {
        return (
            <Container
                title="Recent Files Tracking"
                description="Tracks recently opened files"
            >
                <SpotlightProvider
                    items={[]}
                    plugins={[
                        FileSearchPlugin({
                            files: sampleFiles,
                            showIcons: true,
                            showMetadata: true,
                            recentFiles: true,
                            onFileSelect: (file) => {
                                console.log('Open:', file.path);
                                alert(`Opened: ${file.name}\n\nThis file will now appear in recent files!`);
                            }
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Try it:</p>
                        <p>1. Type <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">@app</code> and select a file</p>
                        <p>2. Type <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">@</code> to see recent files</p>
                        <p>• Recent files stored in localStorage</p>
                        <p>• Max 10 recent files</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};
