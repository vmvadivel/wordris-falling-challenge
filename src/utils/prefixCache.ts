
/**
 * A cache for word prefixes to avoid redundant dictionary lookups
 * Helps optimize word validation during gameplay
 */

// Using a Map for O(1) lookup efficiency
const validPrefixCache = new Map<string, boolean>();
const invalidPrefixCache = new Map<string, boolean>();

// Maximum size to prevent memory issues
const MAX_CACHE_SIZE = 2000;

/**
 * Check if a prefix is valid, using cached results when available
 */
export const isPrefixValidCached = (
  prefix: string,
  checkFn: (prefix: string) => boolean
): boolean => {
  // Normalize input
  const normalizedPrefix = prefix.toLowerCase().trim();
  
  // Check caches first for quick response
  if (validPrefixCache.has(normalizedPrefix)) {
    return true;
  }
  
  if (invalidPrefixCache.has(normalizedPrefix)) {
    return false;
  }
  
  // If not in cache, do the actual check
  const isValid = checkFn(normalizedPrefix);
  
  // Cache the result
  if (isValid) {
    // Manage cache size
    if (validPrefixCache.size >= MAX_CACHE_SIZE) {
      // Clear some entries when limit is reached
      const keysIterator = validPrefixCache.keys();
      for (let i = 0; i < 200; i++) {
        const { value, done } = keysIterator.next();
        if (done) break;
        validPrefixCache.delete(value);
      }
    }
    validPrefixCache.set(normalizedPrefix, true);
  } else {
    // Manage cache size
    if (invalidPrefixCache.size >= MAX_CACHE_SIZE) {
      // Clear some entries when limit is reached
      const keysIterator = invalidPrefixCache.keys();
      for (let i = 0; i < 200; i++) {
        const { value, done } = keysIterator.next();
        if (done) break;
        invalidPrefixCache.delete(value);
      }
    }
    invalidPrefixCache.set(normalizedPrefix, true);
  }
  
  return isValid;
};

/**
 * Clear the cache (useful when resetting game or changing dictionary)
 */
export const clearPrefixCache = (): void => {
  validPrefixCache.clear();
  invalidPrefixCache.clear();
};
