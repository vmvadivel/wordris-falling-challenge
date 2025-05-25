// Dictionary service to provide efficient word validation
// Uses an English word list with comprehensive coverage

// Import the dictionary module for scoring functions
import dictionaryModule from './dictionary';
import { 
  loadCompressedDictionary,
  isWordInCompressedDictionary, 
  isPrefixInCompressedDictionary,
  getCompressedDictionaryStats
} from './compressedDictionary';
import { isPrefixValidCached, clearPrefixCache } from './prefixCache';

const { calculateWordScore, letterRarityPoints } = dictionaryModule;

// Fast cache for already validated words to prevent repeated lookups
const validWordsCache = new Set<string>();
const invalidWordsCache = new Set<string>();

// We'll use a trie data structure for efficient word lookups
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class DictionaryTrie {
  root: TrieNode;
  loaded: boolean;
  loading: boolean;
  wordCount: number;
  usingCompressedDictionary: boolean;

  constructor() {
    this.root = new TrieNode();
    this.loaded = false;
    this.loading = false;
    this.wordCount = 0;
    this.usingCompressedDictionary = false;
  }

  // Insert a word into the trie
  insert(word: string): void {
    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return;
    }
    
    let current = this.root;
    const lowerCaseWord = word.toLowerCase().trim();

    for (const char of lowerCaseWord) {
      let node = current.children.get(char);
      if (!node) {
        node = new TrieNode();
        current.children.set(char, node);
      }
      current = node;
    }
    
    // Mark the end of the word
    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      this.wordCount++;
    }
  }

  // Check if a word exists in the trie - optimized with caching
  search(word: string): boolean {
    if (!word || typeof word !== 'string') {
      return false;
    }
    
    const lowerCaseWord = word.toLowerCase().trim();
    
    // Check caches first for instant response
    if (validWordsCache.has(lowerCaseWord)) {
      return true;
    }
    
    if (invalidWordsCache.has(lowerCaseWord)) {
      return false;
    }
    
    // If using compressed dictionary, check that first
    if (this.usingCompressedDictionary) {
      const result = isWordInCompressedDictionary(word);
      if (result) {
        validWordsCache.add(lowerCaseWord);
      } else {
        invalidWordsCache.add(lowerCaseWord);
      }
      return result;
    }
    
    // Fall back to trie search
    let current = this.root;

    for (const char of lowerCaseWord) {
      const node = current.children.get(char);
      if (!node) {
        invalidWordsCache.add(lowerCaseWord);
        return false;
      }
      current = node;
    }

    const result = current.isEndOfWord;
    if (result) {
      validWordsCache.add(lowerCaseWord);
    } else {
      invalidWordsCache.add(lowerCaseWord);
    }
    return result;
  }

  // Check if prefix exists in the trie (useful for auto-complete features)
  searchPrefix(prefix: string): boolean {
    if (!prefix || typeof prefix !== 'string') {
      return false;
    }
    
    // If using compressed dictionary, check that first with cached lookup
    if (this.usingCompressedDictionary) {
      return isPrefixInCompressedDictionary(prefix);
    }
    
    // Otherwise use our caching utility with local trie search
    return isPrefixValidCached(prefix, (normalizedPrefix) => {
      let current = this.root;
      
      for (const char of normalizedPrefix) {
        const node = current.children.get(char);
        if (!node) {
          return false;
        }
        current = node;
      }
      
      return true;
    });
  }

  // Load the dictionary from a file with optimization for large dictionaries
  async loadDictionary(): Promise<void> {
    if (this.loaded || this.loading) return;
    
    this.loading = true;
    
    try {
      console.log('Loading compressed dictionary...');
      await loadCompressedDictionary();
      this.usingCompressedDictionary = true;
      
      const stats = getCompressedDictionaryStats();
      this.wordCount = stats.wordCount;
      console.log(`Dictionary loaded with ${this.wordCount.toLocaleString()} words`);
      this.loaded = true;
    } catch (error) {
      console.error('Error loading dictionary:', error);
      this.loaded = true;
    } finally {
      this.loading = false;
    }
  }
  
  // Get dictionary statistics
  getStats(): { loaded: boolean, wordCount: number } {
    if (this.usingCompressedDictionary) {
      return getCompressedDictionaryStats();
    }
    
    return {
      loaded: this.loaded,
      wordCount: this.wordCount
    };
  }

  // Clear cache method
  clearCache(): void {
    clearWordCache();
  }
}

// Create a singleton instance
const dictionaryTrie = new DictionaryTrie();

// Async function to check if a word is valid
export const isValidWordAsync = async (word: string): Promise<boolean> => {
  if (!dictionaryTrie.loaded) {
    await dictionaryTrie.loadDictionary();
  }
  return dictionaryTrie.search(word);
};

// Sync function that returns whether the word is valid
export const isValidWord = (word: string): boolean => {
  if (!dictionaryTrie.loaded) {
    // Return false if dictionary isn't loaded yet - simpler and more reliable
    return false;
  }
  return dictionaryTrie.search(word);
};

// Re-export the calculateWordScore function from the dictionary module
export { calculateWordScore, letterRarityPoints };

// Add a function to clear the word cache
export const clearWordCache = () => {
  validWordsCache.clear();
  invalidWordsCache.clear();
  clearPrefixCache();
};

// Load the dictionary when the module is imported
dictionaryTrie.loadDictionary().catch(console.error);

export default {
  isValidWord,
  isValidWordAsync,
  calculateWordScore,
  getWordCount: () => dictionaryTrie.wordCount,
  getDictionaryStats: () => dictionaryTrie.getStats(),
  isPrefixValid: (prefix: string) => dictionaryTrie.searchPrefix(prefix),
  clearCache: () => dictionaryTrie.clearCache()
};
