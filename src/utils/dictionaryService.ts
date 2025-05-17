
// Dictionary service to provide efficient word validation
// Uses an English word list with over 100,000 words

// Import the dictionary module and explicitly extract what's exported
import dictionaryModule from './dictionary';
const { isValidWord: originalValidator, calculateWordScore, letterRarityPoints } = dictionaryModule;

// Access commonWords through the default export - this type-checks correctly
const commonWords = 'commonWords' in dictionaryModule ? dictionaryModule.commonWords : new Set<string>();

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
  additionalCommonWords: Set<string>;

  constructor() {
    this.root = new TrieNode();
    this.loaded = false;
    this.loading = false;
    this.wordCount = 0;
    
    // Add essential common words that should never be missing
    this.additionalCommonWords = new Set([
      'pin', 'pins', 'pincode', 'fasting', 'fast', 'dictionary',
      'code', 'coding', 'computer', 'program', 'programming',
      // Add more essential words that should always be recognized
    ]);
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

  // Check if a word exists in the trie
  search(word: string): boolean {
    if (!word || typeof word !== 'string') {
      return false;
    }
    
    // Check essential common words first for immediate response
    if (this.additionalCommonWords.has(word.toLowerCase())) {
      return true;
    }
    
    let current = this.root;
    const lowerCaseWord = word.toLowerCase().trim();

    for (const char of lowerCaseWord) {
      const node = current.children.get(char);
      if (!node) {
        return false;
      }
      current = node;
    }

    return current.isEndOfWord;
  }

  // Check if prefix exists in the trie (useful for auto-complete features)
  searchPrefix(prefix: string): boolean {
    if (!prefix || typeof prefix !== 'string') {
      return false;
    }
    
    let current = this.root;
    const lowerCasePrefix = prefix.toLowerCase().trim();

    for (const char of lowerCasePrefix) {
      const node = current.children.get(char);
      if (!node) {
        return false;
      }
      current = node;
    }

    return true;
  }

  // Load the dictionary from a file with optimization for large dictionaries
  async loadDictionary(): Promise<void> {
    if (this.loaded || this.loading) return;
    
    this.loading = true;
    
    try {
      console.log('Loading comprehensive dictionary...');
      const response = await fetch('/english-words.txt');
      if (!response.ok) {
        throw new Error(`Failed to load dictionary: ${response.status}`);
      }
      
      const text = await response.text();
      // Filter out comment lines and empty lines
      const words = text.split('\n')
        .filter(line => !line.startsWith('//') && line.trim().length > 0);
      
      // Also add our existing common words to ensure compatibility
      if (commonWords && typeof commonWords !== 'undefined') {
        if (commonWords instanceof Set) {
          commonWords.forEach(word => {
            if (typeof word === 'string' && word.trim().length > 0) {
              this.insert(word);
            }
          });
        } else if (Array.isArray(commonWords)) {
          commonWords.forEach(word => {
            if (typeof word === 'string' && word.trim().length > 0) {
              this.insert(word);
            }
          });
        }
      }
      
      // Add essential common words
      this.additionalCommonWords.forEach(word => this.insert(word));
      
      // Process the main dictionary in chunks to avoid UI blocking
      const chunkSize = 5000; // Process 5000 words at a time
      const processChunk = (startIndex: number) => {
        const endIndex = Math.min(startIndex + chunkSize, words.length);
        for (let i = startIndex; i < endIndex; i++) {
          this.insert(words[i]);
        }
        
        if (endIndex < words.length) {
          // Schedule next chunk processing with setTimeout to avoid blocking UI
          setTimeout(() => processChunk(endIndex), 0);
        } else {
          // All chunks processed
          console.log(`Dictionary loaded with ${this.wordCount.toLocaleString()} words`);
          this.loaded = true;
        }
      };
      
      // Start processing the first chunk
      processChunk(0);
    } catch (error) {
      console.error('Error loading dictionary:', error);
      // Fallback to the original dictionary if loading fails
      if (commonWords && typeof commonWords !== 'undefined') {
        if (commonWords instanceof Set) {
          commonWords.forEach(word => {
            if (typeof word === 'string') {
              this.insert(word);
            }
          });
        } else if (Array.isArray(commonWords)) {
          commonWords.forEach(word => {
            if (typeof word === 'string') {
              this.insert(word);
            }
          });
        }
      }
      
      // Add essential common words in the fallback case too
      this.additionalCommonWords.forEach(word => this.insert(word));
      
      console.log(`Fallback dictionary loaded with ${this.wordCount} words`);
      this.loaded = true;
    } finally {
      this.loading = false;
    }
  }
  
  // Get dictionary statistics
  getStats(): { loaded: boolean, wordCount: number } {
    return {
      loaded: this.loaded,
      wordCount: this.wordCount
    };
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
// Uses the existing dictionary as fallback if the new one isn't loaded yet
export const isValidWord = (word: string): boolean => {
  // Check essential common words directly for immediate response
  if (dictionaryTrie.additionalCommonWords.has(word.toLowerCase())) {
    return true;
  }
  
  if (!dictionaryTrie.loaded) {
    // If dictionary isn't loaded yet, use the original implementation as fallback
    return originalValidator(word);
  }
  return dictionaryTrie.search(word);
};

// Re-export the calculateWordScore function from the dictionary module
export { calculateWordScore, letterRarityPoints };

// Load the dictionary when the module is imported
dictionaryTrie.loadDictionary().catch(console.error);

export default {
  isValidWord,
  isValidWordAsync,
  calculateWordScore,
  getWordCount: () => dictionaryTrie.wordCount,
  getDictionaryStats: () => dictionaryTrie.getStats(),
  isPrefixValid: (prefix: string) => dictionaryTrie.searchPrefix(prefix)
};
