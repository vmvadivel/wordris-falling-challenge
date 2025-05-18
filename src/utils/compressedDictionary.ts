
/**
 * Dictionary Compression Utility
 * Implements an efficient trie-based dictionary structure for word lookups
 */

// Compressed trie node structure (more memory efficient than class instances)
interface CompressedTrieNode {
  [key: string]: CompressedTrieNode | boolean;
}

let compressedDictionary: CompressedTrieNode = {};
let dictionaryLoaded = false;

/**
 * Build a compressed trie from a list of words
 */
const buildTrie = (words: string[]): CompressedTrieNode => {
  const trie: CompressedTrieNode = {};
  
  for (const word of words) {
    if (!word || typeof word !== 'string' || word.trim().length === 0) continue;
    
    let current = trie;
    const lowerCaseWord = word.toLowerCase().trim();
    
    for (const char of lowerCaseWord) {
      if (!current[char]) {
        current[char] = {};
      }
      current = current[char] as CompressedTrieNode;
    }
    
    // Mark end of word
    current['#'] = true;
  }
  
  return trie;
};

/**
 * Load and process the dictionary during runtime
 */
export const loadCompressedDictionary = async (): Promise<void> => {
  if (dictionaryLoaded) return;
  
  try {
    console.log('Loading and compressing dictionary...');
    const response = await fetch('/english-words.txt');
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status}`);
    }
    
    const text = await response.text();
    // Filter out comment lines and empty lines
    const words = text.split('\n')
      .filter(line => !line.startsWith('//') && line.trim().length > 0);
    
    // Process in chunks to avoid blocking UI
    const chunkSize = 5000;
    let processedWords: string[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      processedWords = [...processedWords, ...chunk];
      
      // Allow UI to update occasionally during large processing
      if (i % 20000 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    // Build the trie with all processed words
    compressedDictionary = buildTrie(processedWords);
    dictionaryLoaded = true;
    console.log('Dictionary compressed and loaded successfully');
    
  } catch (error) {
    console.error('Error loading and compressing dictionary:', error);
    // Create an empty dictionary to prevent further load attempts
    compressedDictionary = {};
    dictionaryLoaded = true;
  }
};

/**
 * Check if a word exists in the compressed dictionary
 */
export const isWordInCompressedDictionary = (word: string): boolean => {
  if (!word || typeof word !== 'string' || !dictionaryLoaded) {
    return false;
  }
  
  const lowerCaseWord = word.toLowerCase().trim();
  let current = compressedDictionary;
  
  for (const char of lowerCaseWord) {
    if (!current[char]) {
      return false;
    }
    current = current[char] as CompressedTrieNode;
  }
  
  return current['#'] === true;
};

/**
 * Check if a prefix exists in the compressed dictionary (useful for autocomplete)
 */
export const isPrefixInCompressedDictionary = (prefix: string): boolean => {
  if (!prefix || typeof prefix !== 'string' || !dictionaryLoaded) {
    return false;
  }
  
  const lowerCasePrefix = prefix.toLowerCase().trim();
  let current = compressedDictionary;
  
  for (const char of lowerCasePrefix) {
    if (!current[char]) {
      return false;
    }
    current = current[char] as CompressedTrieNode;
  }
  
  return true;
};

/**
 * Get dictionary statistics
 */
export const getCompressedDictionaryStats = (): { loaded: boolean, wordCount: number } => {
  // Count words in the trie (approximation)
  let wordCount = 0;
  
  const countWords = (node: CompressedTrieNode): void => {
    if (node['#'] === true) {
      wordCount++;
    }
    
    for (const key in node) {
      if (key !== '#' && typeof node[key] === 'object') {
        countWords(node[key] as CompressedTrieNode);
      }
    }
  };
  
  if (dictionaryLoaded) {
    countWords(compressedDictionary);
  }
  
  return {
    loaded: dictionaryLoaded,
    wordCount
  };
};
