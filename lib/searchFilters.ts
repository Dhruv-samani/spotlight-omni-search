import { SpotlightItem } from '../types';

export type FilterType = 'all' | 'type' | 'group';

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * Get unique types from items
 */
export function getUniqueTypes(items: SpotlightItem[]): FilterOption[] {
  const typeCounts = items.reduce((acc, item) => {
    const type = item.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeCounts).map(([value, count]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
    count,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Get unique groups from items
 */
export function getUniqueGroups(items: SpotlightItem[]): FilterOption[] {
  const groupCounts = items.reduce((acc, item) => {
    const group = item.group || 'Other';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(groupCounts).map(([value, count]) => ({
    value,
    label: value,
    count,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Filter items by specific criteria
 */
export function filterItems(
  items: SpotlightItem[], 
  criteria: { type?: string; group?: string }
): SpotlightItem[] {
  return items.filter(item => {
    if (criteria.type && item.type !== criteria.type) return false;
    if (criteria.group && (item.group || 'Other') !== criteria.group) return false;
    return true;
  });
}
