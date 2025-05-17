
// Dictionary service to provide efficient word validation
// Uses an English word list with over 370,000 words

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

  constructor() {
    this.root = new TrieNode();
    this.loaded = false;
    this.loading = false;
    this.wordCount = 0;
  }

  // Insert a word into the trie
  insert(word: string): void {
    let current = this.root;
    const lowerCaseWord = word.toLowerCase();

    for (const char of lowerCaseWord) {
      let node = current.children.get(char);
      if (!node) {
        node = new TrieNode();
        current.children.set(char, node);
      }
      current = node;
    }
    
    // Mark the end of the word
    current.isEndOfWord = true;
    this.wordCount++;
  }

  // Check if a word exists in the trie
  search(word: string): boolean {
    let current = this.root;
    const lowerCaseWord = word.toLowerCase();

    for (const char of lowerCaseWord) {
      const node = current.children.get(char);
      if (!node) {
        return false;
      }
      current = node;
    }

    return current.isEndOfWord;
  }

  // Load the dictionary from a file
  async loadDictionary(): Promise<void> {
    if (this.loaded || this.loading) return;
    
    this.loading = true;
    
    try {
      console.log('Loading dictionary...');
      const response = await fetch('/english-words.txt');
      if (!response.ok) {
        throw new Error(`Failed to load dictionary: ${response.status}`);
      }
      
      const text = await response.text();
      const words = text.split('\n').filter(word => word.trim().length > 0);
      
      // Also add our existing common words to ensure compatibility
      const { commonWords } = await import('./dictionary');
      commonWords.forEach(word => {
        if (!words.includes(word)) {
          words.push(word);
        }
      });
      
      // Build the trie
      words.forEach(word => this.insert(word.trim()));
      
      console.log(`Dictionary loaded with ${this.wordCount.toLocaleString()} words`);
      this.loaded = true;
    } catch (error) {
      console.error('Error loading dictionary:', error);
      // Fallback to the original dictionary if loading fails
      const { commonWords } = await import('./dictionary');
      commonWords.forEach(word => this.insert(word));
      console.log(`Fallback dictionary loaded with ${this.wordCount} words`);
      this.loaded = true;
    } finally {
      this.loading = false;
    }
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
  if (!dictionaryTrie.loaded) {
    // If dictionary isn't loaded yet, use the original implementation as fallback
    const { isValidWord: originalValidator } = require('./dictionary');
    return originalValidator(word);
  }
  return dictionaryTrie.search(word);
};

// Load the dictionary when the module is imported
dictionaryTrie.loadDictionary().catch(console.error);

export default {
  isValidWord,
  isValidWordAsync,
  getWordCount: () => dictionaryTrie.wordCount
};
