/**
 * Simple obfuscation for localStorage data to prevent casual inspection.
 * Note: This is not encryption, but it makes the data non-human-readable in DevTools.
 */

/**
 * Encodes a string to UTF-8 safe Base64
 */
function encode(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (e) {
    return str; // Fallback to raw string if encoding fails
  }
}

/**
 * Decodes a UTF-8 safe Base64 string
 */
function decode(str: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map.call(atob(str), (c: string) => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
  } catch (e) {
    return str; // Fallback if data isn't Base64 encoded (legacy data)
  }
}

export const spotlightStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const json = JSON.stringify(value);
      const obfuscated = encode(json);
      localStorage.setItem(key, obfuscated);
    } catch (e) {
      // Silent fail
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      // Try decoding first
      const decoded = decode(stored);
      try {
        return JSON.parse(decoded) as T;
      } catch (e) {
        // If JSON parse fails, it might be legacy raw JSON data
        return JSON.parse(stored) as T;
      }
    } catch (e) {
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Silent fail
    }
  }
};
