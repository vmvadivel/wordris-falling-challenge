
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload the dictionary for better user experience
import './utils/dictionaryService';

createRoot(document.getElementById("root")!).render(<App />);
