import { ReactNode } from 'react';
import { SpotlightPlugin } from '../types/plugin';
import { SpotlightItem } from '../types';
import { ScoredItem } from '../lib/fuzzySearch';

export interface UnitConverterOptions {
  /**
   * Enable currency conversion (requires API)
   * @default false
   */
  enableCurrency?: boolean;
  /**
   * Currency API endpoint (optional)
   */
  currencyAPI?: string;
  /**
   * Custom icon for converter results
   */
  icon?: ReactNode;
  /**
   * Enable clipboard copy on selection
   * @default true
   */
  enableClipboardCopy?: boolean;
}

interface ConversionRule {
  pattern: RegExp;
  convert: (value: number, from: string, to: string) => number | null;
  units: string[];
  category: string;
}

const conversionRules: ConversionRule[] = [
  // Length conversions
  {
    category: 'Length',
    units: ['km', 'kilometers', 'm', 'meters', 'cm', 'centimeters', 'mm', 'millimeters', 'mi', 'miles', 'ft', 'feet', 'in', 'inches', 'yd', 'yards'],
    pattern: /(\d+(?:\.\d+)?)\s*(km|kilometers?|m|meters?|cm|centimeters?|mm|millimeters?|mi|miles?|ft|feet|in|inches?|yd|yards?)\s+(?:to|in)\s+(\w+)/i,
    convert: (value, from, to) => {
      const toMeters: Record<string, number> = {
        km: 1000, kilometers: 1000, kilometer: 1000,
        m: 1, meters: 1, meter: 1,
        cm: 0.01, centimeters: 0.01, centimeter: 0.01,
        mm: 0.001, millimeters: 0.001, millimeter: 0.001,
        mi: 1609.34, miles: 1609.34, mile: 1609.34,
        ft: 0.3048, feet: 0.3048,
        in: 0.0254, inches: 0.0254, inch: 0.0254,
        yd: 0.9144, yards: 0.9144, yard: 0.9144,
      };
      
      const fromMeters = toMeters[from.toLowerCase()];
      const toMetersTarget = toMeters[to.toLowerCase()];
      
      if (!fromMeters || !toMetersTarget) return null;
      
      return (value * fromMeters) / toMetersTarget;
    },
  },
  
  // Weight conversions
  {
    category: 'Weight',
    units: ['kg', 'kilograms', 'g', 'grams', 'mg', 'milligrams', 'lb', 'pounds', 'oz', 'ounces', 'ton', 'tons'],
    pattern: /(\d+(?:\.\d+)?)\s*(kg|kilograms?|g|grams?|mg|milligrams?|lb|pounds?|oz|ounces?|tons?)\s+(?:to|in)\s+(\w+)/i,
    convert: (value, from, to) => {
      const toGrams: Record<string, number> = {
        kg: 1000, kilograms: 1000, kilogram: 1000,
        g: 1, grams: 1, gram: 1,
        mg: 0.001, milligrams: 0.001, milligram: 0.001,
        lb: 453.592, pounds: 453.592, pound: 453.592,
        oz: 28.3495, ounces: 28.3495, ounce: 28.3495,
        ton: 1000000, tons: 1000000,
      };
      
      const fromGrams = toGrams[from.toLowerCase()];
      const toGramsTarget = toGrams[to.toLowerCase()];
      
      if (!fromGrams || !toGramsTarget) return null;
      
      return (value * fromGrams) / toGramsTarget;
    },
  },
  
  // Temperature conversions
  {
    category: 'Temperature',
    units: ['c', 'celsius', 'f', 'fahrenheit', 'k', 'kelvin'],
    pattern: /(\d+(?:\.\d+)?)\s*([cf]|celsius|fahrenheit|k|kelvin)\s+(?:to|in)\s+([cf]|celsius|fahrenheit|k|kelvin)/i,
    convert: (value, from, to) => {
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();
      
      // Convert to Celsius first
      let celsius = value;
      if (fromLower === 'f' || fromLower === 'fahrenheit') {
        celsius = (value - 32) * 5 / 9;
      } else if (fromLower === 'k' || fromLower === 'kelvin') {
        celsius = value - 273.15;
      }
      
      // Convert from Celsius to target
      if (toLower === 'c' || toLower === 'celsius') {
        return celsius;
      } else if (toLower === 'f' || toLower === 'fahrenheit') {
        return celsius * 9 / 5 + 32;
      } else if (toLower === 'k' || toLower === 'kelvin') {
        return celsius + 273.15;
      }
      
      return null;
    },
  },
  
  // Volume conversions
  {
    category: 'Volume',
    units: ['l', 'liters', 'ml', 'milliliters', 'gal', 'gallons', 'qt', 'quarts', 'pt', 'pints', 'cup', 'cups', 'fl oz', 'fluid ounces'],
    pattern: /(\d+(?:\.\d+)?)\s*(l|liters?|ml|milliliters?|gal|gallons?|qt|quarts?|pt|pints?|cups?|fl\s*oz|fluid\s*ounces?)\s+(?:to|in)\s+(\w+(?:\s+\w+)?)/i,
    convert: (value, from, to) => {
      const toLiters: Record<string, number> = {
        l: 1, liters: 1, liter: 1,
        ml: 0.001, milliliters: 0.001, milliliter: 0.001,
        gal: 3.78541, gallons: 3.78541, gallon: 3.78541,
        qt: 0.946353, quarts: 0.946353, quart: 0.946353,
        pt: 0.473176, pints: 0.473176, pint: 0.473176,
        cup: 0.236588, cups: 0.236588,
        'fl oz': 0.0295735, 'fluid ounces': 0.0295735, 'fluid ounce': 0.0295735,
      };
      
      const fromLiters = toLiters[from.toLowerCase().replace(/\s+/g, ' ')];
      const toLitersTarget = toLiters[to.toLowerCase().replace(/\s+/g, ' ')];
      
      if (!fromLiters || !toLitersTarget) return null;
      
      return (value * fromLiters) / toLitersTarget;
    },
  },
];

function detectConversion(query: string): { value: number; from: string; to: string; rule: ConversionRule } | null {
  // Trim and normalize the query
  const normalizedQuery = query.trim().toLowerCase();
  
  for (const rule of conversionRules) {
    const match = normalizedQuery.match(rule.pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const from = match[2].trim();
      const to = match[3].trim();
      
      if (isNaN(value)) return null;
      
      return { value, from, to, rule };
    }
  }
  return null;
}

export const UnitConverterPlugin = (options: UnitConverterOptions = {}): SpotlightPlugin => {
  const {
    enableClipboardCopy = true,
    icon,
  } = options;

  // Store the last query and conversion result
  let lastQuery = '';
  let lastConversion: { value: number; from: string; to: string; rule: ConversionRule; result: number } | null = null;

  return {
    name: 'spotlight-unit-converter',
    version: '1.0.0',

    onBeforeSearch: (query, items) => {
      // Store query for onAfterSearch
      lastQuery = query;
      
      const conversion = detectConversion(query);

      if (!conversion) {
        lastConversion = null;
        return items;
      }

      const { value, from, to, rule } = conversion;
      const result = rule.convert(value, from, to);

      if (result === null) {
        lastConversion = null;
        return items;
      }

      // Store conversion for onAfterSearch
      lastConversion = { value, from, to, rule, result };
      
      // Return items unchanged - we'll add the result in onAfterSearch
      return items;
    },

    onAfterSearch: (results) => {
      if (!lastConversion) {
        return results;
      }

      const { value, from, to, rule, result } = lastConversion;
      
      // Format result nicely
      const formattedResult = result.toFixed(4).replace(/\.?0+$/, '');

      const converterItem: ScoredItem = {
        item: {
          id: 'unit-converter-result',
          label: `${formattedResult} ${to}`,
          description: `${value} ${from} = ${formattedResult} ${to} (${rule.category})`,
          type: 'action',
          group: 'Unit Converter',
          ...(icon && { icon }),
          action: () => {
            if (enableClipboardCopy && navigator.clipboard) {
              navigator.clipboard.writeText(formattedResult);
            }
          },
        },
        score: 1000, // High score to appear at top
        matches: []
      };

      return [converterItem, ...results];
    },
  };
};
