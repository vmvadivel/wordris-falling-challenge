/**
 * Dictionary Compression Utility
 * Implements an efficient trie-based dictionary structure for word lookups
 */

// Import the dictionary file directly
import dictionaryData from '../data/english-words.txt?raw';
import { isPrefixValidCached } from './prefixCache';

// Compressed trie node structure (more memory efficient than class instances)
interface CompressedTrieNode {
  [key: string]: CompressedTrieNode | boolean;
}

let compressedDictionary: CompressedTrieNode = {};
let dictionaryLoaded = false;

// Cache common words for immediate response
const commonWordsCache = new Set<string>([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
]);

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
    
    // Instead of fetching from public, we use the imported dictionary data
    const text = dictionaryData;
    
    // Filter out comment lines and empty lines
    const words = text.split('\n')
      .filter(line => !line.startsWith('//') && line.trim().length > 0);
    
    // Process in chunks to avoid blocking UI
    const chunkSize = 5000;
    let processedWords: string[] = [];
    
    // Using a promise-based approach for better UI responsiveness
    await new Promise<void>((resolve) => {
      let i = 0;
      
      function processChunk() {
        const end = Math.min(i + chunkSize, words.length);
        const chunk = words.slice(i, end);
        processedWords = [...processedWords, ...chunk];
        
        i += chunkSize;
        
        if (i < words.length) {
          // Schedule next chunk
          setTimeout(processChunk, 0);
        } else {
          resolve();
        }
      }
      
      processChunk();
    });
    
    // Build the trie with all processed words
    compressedDictionary = buildTrie(processedWords);
    dictionaryLoaded = true;
    
    // Pre-cache common words
    processedWords.forEach(word => {
      if (word.length <= 5) {
        commonWordsCache.add(word.toLowerCase().trim());
      }
    });
    
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
  if (!word || typeof word !== 'string') {
    return false;
  }
  
  const lowerCaseWord = word.toLowerCase().trim();
  
  // First check the common words cache for instant response
  if (commonWordsCache.has(lowerCaseWord)) {
    return true;
  }
  
  if (!dictionaryLoaded) {
    return false;
  }
  
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
 * Now using the prefix cache for better performance
 */
export const isPrefixInCompressedDictionary = (prefix: string): boolean => {
  return isPrefixValidCached(prefix, (normalizedPrefix) => {
    if (!dictionaryLoaded) {
      return false;
    }
    
    let current = compressedDictionary;
    
    for (const char of normalizedPrefix) {
      if (!current[char]) {
        return false;
      }
      current = current[char] as CompressedTrieNode;
    }
    
    return true;
  });
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
