import { SpotlightPlugin } from '../types/plugin';
import { SpotlightItem } from '../types';
import { File, FileText, FileJson, Image, Code, Palette } from 'lucide-react';
import React from 'react';

/**
 * File Search Plugin
 * 
 * Enables fuzzy file searching with trigger prefix, file icons, and metadata.
 * 
 * @example
 * ```tsx
 * FileSearchPlugin({
 *   files: myFileList,
 *   onFileSelect: (file) => openFile(file.path),
 *   triggerPrefix: '@',
 *   showMetadata: true
 * })
 * ```
 */

export interface FileItem {
  id: string;
  path: string;
  name: string;
  extension?: string;
  size?: number;
  lastModified?: Date;
  directory?: string;
}

export interface FileSearchOptions {
  files?: FileItem[];
  onSearch?: (query: string) => Promise<FileItem[]>;
  onFileSelect?: (file: FileItem) => void;
  triggerPrefix?: string;
  maxResults?: number;
  showMetadata?: boolean;
  showIcons?: boolean;
  recentFiles?: boolean;
  icon?: React.ReactNode;
}

const STORAGE_KEY = 'spotlight_recent_files';
const MAX_RECENT = 10;

// File icon mapping based on extension
const getFileIcon = (extension?: string): React.ReactNode => {
  if (!extension) return React.createElement(File, { size: 16, className: 'text-slate-500' });

  const ext = extension.toLowerCase().replace('.', '');
  
  const iconMap: Record<string, React.ReactNode> = {
    // Code files
    'ts': React.createElement(Code, { size: 16, className: 'text-blue-500' }),
    'tsx': React.createElement(Code, { size: 16, className: 'text-blue-500' }),
    'js': React.createElement(Code, { size: 16, className: 'text-yellow-500' }),
    'jsx': React.createElement(Code, { size: 16, className: 'text-yellow-500' }),
    'py': React.createElement(Code, { size: 16, className: 'text-blue-400' }),
    'java': React.createElement(Code, { size: 16, className: 'text-red-500' }),
    'cpp': React.createElement(Code, { size: 16, className: 'text-blue-600' }),
    'c': React.createElement(Code, { size: 16, className: 'text-blue-600' }),
    
    // Style files
    'css': React.createElement(Palette, { size: 16, className: 'text-blue-400' }),
    'scss': React.createElement(Palette, { size: 16, className: 'text-pink-500' }),
    'sass': React.createElement(Palette, { size: 16, className: 'text-pink-500' }),
    'less': React.createElement(Palette, { size: 16, className: 'text-blue-500' }),
    
    // Config/Data files
    'json': React.createElement(FileJson, { size: 16, className: 'text-yellow-600' }),
    'yaml': React.createElement(FileJson, { size: 16, className: 'text-purple-500' }),
    'yml': React.createElement(FileJson, { size: 16, className: 'text-purple-500' }),
    'xml': React.createElement(FileJson, { size: 16, className: 'text-orange-500' }),
    
    // Documentation
    'md': React.createElement(FileText, { size: 16, className: 'text-blue-600' }),
    'mdx': React.createElement(FileText, { size: 16, className: 'text-blue-600' }),
    'txt': React.createElement(FileText, { size: 16, className: 'text-slate-500' }),
    'pdf': React.createElement(FileText, { size: 16, className: 'text-red-500' }),
    
    // Images
    'png': React.createElement(Image, { size: 16, className: 'text-purple-500' }),
    'jpg': React.createElement(Image, { size: 16, className: 'text-purple-500' }),
    'jpeg': React.createElement(Image, { size: 16, className: 'text-purple-500' }),
    'svg': React.createElement(Image, { size: 16, className: 'text-orange-500' }),
    'gif': React.createElement(Image, { size: 16, className: 'text-green-500' }),
    'webp': React.createElement(Image, { size: 16, className: 'text-blue-500' }),
  };

  return iconMap[ext] || React.createElement(File, { size: 16, className: 'text-slate-500' });
};

// Format file size
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Format date
const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

// Recent files storage
const getRecentFiles = (): FileItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(atob(stored));
  } catch {
    return [];
  }
};

const saveRecentFile = (file: FileItem): void => {
  try {
    const recent = getRecentFiles();
    const updated = [file, ...recent.filter(f => f.id !== file.id)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(updated)));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const FileSearchPlugin = (options: FileSearchOptions = {}): SpotlightPlugin => {
  const {
    files = [],
    onSearch,
    onFileSelect,
    triggerPrefix = '@',
    maxResults = 10,
    showMetadata = true,
    showIcons = true,
    recentFiles = true,
    icon
  } = options;

  let cachedFiles: FileItem[] = files;
  let isSearching = false;

  // Pre-fetch files if async search is provided
  if (onSearch && files.length === 0) {
    onSearch('').then(results => {
      cachedFiles = results;
    }).catch(err => {
      console.error('File search initialization error:', err);
    });
  }

  return {
    name: 'file-search',
    
    onBeforeSearch: (query, items) => {
      // Only activate if query starts with trigger prefix
      if (!query.startsWith(triggerPrefix)) {
        return items;
      }

      // Remove trigger prefix from query
      const searchQuery = query.slice(triggerPrefix.length).trim();

      // If no query, show recent files
      if (!searchQuery && recentFiles) {
        const recent = getRecentFiles();
        return recent.slice(0, maxResults).map(file => fileToSpotlightItem(file, showIcons, showMetadata, onFileSelect, recentFiles));
      }

      // Trigger async search if provided
      if (onSearch && searchQuery && !isSearching) {
        isSearching = true;
        onSearch(searchQuery).then(results => {
          cachedFiles = results;
          isSearching = false;
        }).catch(err => {
          console.error('File search error:', err);
          isSearching = false;
        });
      }

      // Filter files based on query (using cached results)
      const matchedFiles = cachedFiles
        .filter(file => {
          if (!searchQuery) return true;
          const lowerQuery = searchQuery.toLowerCase();
          return (
            file.name.toLowerCase().includes(lowerQuery) ||
            file.path.toLowerCase().includes(lowerQuery) ||
            (file.directory && file.directory.toLowerCase().includes(lowerQuery))
          );
        })
        .slice(0, maxResults);

      // Convert to SpotlightItems
      return matchedFiles.map(file => fileToSpotlightItem(file, showIcons, showMetadata, onFileSelect, recentFiles));
    },

    onInit: () => {
      // Plugin initialized
    }
  };
};

// Helper to convert FileItem to SpotlightItem
const fileToSpotlightItem = (
  file: FileItem,
  showIcons: boolean,
  showMetadata: boolean,
  onFileSelect?: (file: FileItem) => void,
  trackRecent?: boolean
): SpotlightItem => {
  let description = file.directory || file.path;
  
  if (showMetadata) {
    const metadata: string[] = [];
    if (file.size) metadata.push(formatSize(file.size));
    if (file.lastModified) metadata.push(formatDate(file.lastModified));
    if (metadata.length > 0) {
      description = `${description} • ${metadata.join(' • ')}`;
    }
  }

  return {
    id: `file-${file.id}`,
    label: file.name,
    description,
    type: 'action',
    group: 'Files',
    icon: showIcons ? getFileIcon(file.extension) : undefined,
    action: () => {
      if (trackRecent) {
        saveRecentFile(file);
      }
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };
};
