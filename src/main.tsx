
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload the dictionary for better user experience
import './utils/dictionaryService';

// Start loading the dictionary as early as possible
import { loadCompressedDictionary } from './utils/compressedDictionary';
loadCompressedDictionary().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
