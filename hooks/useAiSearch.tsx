import { useState, useEffect, useRef } from 'react';
import { SpotlightItem } from '../types';
import { Sparkles, Bot, Zap } from 'lucide-react';
import React from 'react';

interface AiSearchOptions {
    query: string;
    enabled?: boolean;
    debounceTime?: number;
    onShowAnswer?: (title: string, content: string) => void;
    /**
     * Custom handler for AI search.
     * If provided, overrides the default simulation.
     */
    onAiSearch?: (query: string) => Promise<string | SpotlightItem[]>;
}

export function useAiSearch({ query, enabled = true, debounceTime = 500, onShowAnswer, onAiSearch }: AiSearchOptions) {
    const [results, setResults] = useState<SpotlightItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Use a ref for the callback to avoid re-triggering the effect
    const onShowAnswerRef = useRef(onShowAnswer);
    const onAiSearchRef = useRef(onAiSearch);

    // Update the ref whenever the callback changes
    useEffect(() => {
        onShowAnswerRef.current = onShowAnswer;
        onAiSearchRef.current = onAiSearch;
    }, [onShowAnswer, onAiSearch]);

    useEffect(() => {
        if (!enabled || !query.trim() || query.length < 3) {
            setResults(prev => prev.length === 0 ? prev : []);
            setIsLoading(false);
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setIsLoading(true);

        timeoutRef.current = setTimeout(async () => {

            // CUSTOM AI HANDLER (Production Mode)
            if (onAiSearchRef.current) {
                try {
                    const result = await onAiSearchRef.current(query);

                    if (typeof result === 'string') {
                        // AI returned an answer (string) -> Show Answer UI
                        setResults([{
                            id: 'ai-custom-answer',
                            label: `AI Answer for "${query}"`,
                            description: 'Click to view answer',
                            type: 'action',
                            group: 'AI Suggestions',
                            icon: <Bot className="w-4 h-4 text-emerald-500" />,
                            action: () => {
                                onShowAnswerRef.current?.(`Answer to "${query}"`, result);
                            }
                        }]);
                    } else if (Array.isArray(result)) {
                        // AI returned items (array) -> Show List
                        setResults(result);
                    }
                } catch (error) {
                    console.error("AI Search Failed:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            // DEFAULT SIMULATION (Demo Mode)
            // Only runs if no custom handler is provided.

            // Simulate AI Processing Delay (0.5s - 1s)

            const lowerQuery = query.toLowerCase();
            const aiResults: SpotlightItem[] = [];

            // 1. Intent Detection: Creation
            if (lowerQuery.includes('create') || lowerQuery.includes('add') || lowerQuery.includes('new')) {
                if (lowerQuery.includes('user') || lowerQuery.includes('account')) {
                    aiResults.push({
                        id: 'ai-create-user',
                        label: 'Create New User',
                        description: 'AI detected intent: Open User Creation Wizard',
                        type: 'action',
                        group: 'AI Suggestions',
                        icon: <Sparkles className="w-4 h-4 text-purple-500" />,
                        keywords: ['create', 'user', 'add', 'new', 'account', query],
                        action: () => alert('AI Action: Opening User Creation Wizard...')
                    });
                }
                if (lowerQuery.includes('project') || lowerQuery.includes('repo')) {
                    aiResults.push({
                        id: 'ai-create-project',
                        label: 'Create New Project',
                        description: 'AI detected intent: Initialize Project Workflow',
                        type: 'action',
                        group: 'AI Suggestions',
                        icon: <Sparkles className="w-4 h-4 text-blue-500" />,
                        keywords: ['create', 'project', 'new', 'repo', query],
                        action: () => alert('AI Action: Starting New Project...')
                    });
                }
            }

            // 2. Intent Detection: Questions (Q&A)
            if (lowerQuery.startsWith('ask ') || lowerQuery.endsWith('?')) {
                const mockAnswer = "Time is the indefinite continued progress of existence and events that occur in an apparently irreversible succession from the past, through the present, into the future. It is a component quantity of various measurements used to sequence events, to compare the duration of events or the intervals between them, and to quantify rates of change of quantities in material reality or in the conscious experience.";

                aiResults.push({
                    id: 'ai-answer',
                    label: `AI Answer for "${query}"`,
                    description: 'Simulated generic response from LLM...',
                    type: 'action', // or 'text' if we had a text type
                    group: 'AI Answer',
                    icon: <Bot className="w-4 h-4 text-emerald-500" />,
                    keywords: ['ai', 'ask', 'question', 'answer', query],
                    action: () => {
                        if (onShowAnswerRef.current) {
                            onShowAnswerRef.current(
                                `Answer to "${query}"`,
                                mockAnswer
                            );
                        } else {
                            alert('This would show the full AI answer in a modal.');
                        }
                    }
                });
            }

            // 3. Intent Detection: Navigation Shortcuts (Fuzzy++)
            if (lowerQuery.includes('settings') || lowerQuery.includes('config')) {
                aiResults.push({
                    id: 'ai-nav-settings',
                    label: 'Go to Settings',
                    description: 'High confidence navigation prediction',
                    type: 'page',
                    group: 'AI Suggestions',
                    icon: <Zap className="w-4 h-4 text-yellow-500" />,
                    keywords: ['settings', 'config', 'preferences', query],
                    route: '/settings'
                });
            }

            setResults(aiResults);
            setIsLoading(false);

        }, debounceTime);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [query, enabled, debounceTime]); // Removed onShowAnswer dependency

    return { results, isLoading };
}
