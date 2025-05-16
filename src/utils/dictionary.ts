
// A basic dictionary of common English words
// This is a simplified version - could be expanded or replaced with an API
const commonWords: Set<string> = new Set([
  // 3-letter words
  "act", "add", "age", "ago", "air", "all", "and", "any", "arm", "art", "ask", "bad", "bag", "bar",
  "bed", "big", "bit", "box", "boy", "bus", "but", "buy", "can", "car", "cat", "cop", "cut", "dad",
  "day", "die", "dog", "dry", "due", "eat", "egg", "end", "eye", "far", "fat", "fee", "few", "fit",
  "fix", "fly", "for", "fun", "gap", "gas", "get", "god", "gun", "guy", "hat", "hit", "hot", "how",
  "ice", "ill", "job", "key", "kid", "lab", "law", "lay", "leg", "let", "lie", "lip", "lot", "low",
  "man", "map", "may", "mix", "mom", "mrs", "mud", "net", "new", "not", "now", "odd", "off", "oil",
  "old", "one", "out", "owe", "own", "pay", "pen", "per", "pie", "pig", "pin", "pop", "put", "red",
  "rid", "rip", "row", "run", "sad", "say", "sea", "see", "set", "sex", "she", "shy", "sin", "sir",
  "sit", "six", "sky", "son", "spy", "sum", "sun", "tax", "tea", "ten", "the", "tie", "tip", "toe",
  "too", "top", "try", "two", "use", "via", "war", "way", "web", "who", "why", "win", "yes", "yet",
  "you", "zip", "zoo",
  
  // 4-letter words
  "able", "acid", "aged", "also", "area", "army", "away", "baby", "back", "ball", "band", "bank", "base",
  "bath", "bear", "beat", "been", "beer", "bell", "belt", "best", "bird", "blow", "blue", "boat", "body",
  "bomb", "bond", "bone", "book", "boom", "born", "boss", "both", "bowl", "bulk", "burn", "bush", "busy",
  "call", "calm", "came", "camp", "card", "care", "case", "cash", "cast", "cell", "chat", "chip", "city",
  "club", "coal", "coat", "code", "cold", "come", "cook", "cool", "cope", "copy", "core", "cost", "crew",
  "crop", "dark", "data", "date", "dawn", "days", "dead", "deal", "dean", "dear", "debt", "deep", "deny",
  "desk", "dial", "diet", "dirt", "disc", "dish", "disk", "does", "done", "door", "dose", "down", "draw",
  "drop", "drug", "dual", "duke", "dust", "duty", "each", "earn", "ease", "east", "easy", "edge", "else",
  "even", "ever", "evil", "exit", "face", "fact", "fail", "fair", "fall", "farm", "fast", "fate", "fear",
  "feed", "feel", "feet", "fell", "felt", "file", "fill", "film", "find", "fine", "fire", "firm", "fish",
  "five", "flat", "flow", "food", "foot", "ford", "form", "fort", "four", "free", "from", "fuel", "full",
  "fund", "gain", "game", "gate", "gave", "gear", "gene", "gift", "girl", "give", "glad", "goal", "goes",
  "gold", "golf", "gone", "good", "gray", "grew", "grey", "grow", "gulf", "hair", "half", "hall", "hand",
  "hang", "hard", "harm", "hate", "have", "head", "hear", "heat", "held", "hell", "help", "here", "hero",
  "high", "hill", "hire", "hold", "hole", "holy", "home", "hope", "host", "hour", "huge", "hung", "hunt",
  "hurt", "idea", "inch", "into", "iron", "item", "jack", "jane", "jean", "john", "join", "jump", "jury",
  "just", "keen", "keep", "kent", "kept", "kick", "kill", "kind", "king", "knew", "know", "lack", "lady",
  "laid", "lake", "land", "lane", "last", "late", "lead", "left", "less", "life", "lift", "like", "line",
  "link", "list", "live", "load", "loan", "lock", "logo", "long", "look", "lord", "lose", "loss", "lost",
  "love", "luck", "made", "mail", "main", "make", "male", "many", "mark", "mass", "matt", "meal", "mean",
  "meat", "meet", "menu", "mere", "mike", "mile", "milk", "mill", "mind", "mine", "miss", "mode", "mood",
  "moon", "more", "most", "move", "much", "must", "name", "navy", "near", "neck", "need", "news", "next",
  "nice", "nick", "nine", "none", "nose", "note", "okay", "once", "only", "onto", "open", "oral", "over",
  "pace", "pack", "page", "paid", "pain", "pair", "palm", "park", "part", "pass", "past", "path", "peak",
  "pick", "pink", "pipe", "plan", "play", "plot", "plus", "poll", "pool", "poor", "port", "post", "pull",
  "pure", "push", "race", "rail", "rain", "rank", "rare", "rate", "read", "real", "rear", "rely", "rent",
  "rest", "rice", "rich", "ride", "ring", "rise", "risk", "road", "rock", "role", "roll", "roof", "room",
  "root", "rose", "rule", "rush", "ruth", "safe", "said", "sake", "sale", "salt", "same", "sand", "save",
  "seat", "seed", "seek", "seem", "seen", "self", "sell", "send", "sent", "sept", "ship", "shop", "shot",
  "show", "shut", "sick", "side", "sign", "site", "size", "skin", "slip", "slow", "snow", "soft", "soil",
  "sold", "sole", "some", "song", "soon", "sort", "soul", "spot", "star", "stay", "step", "stop", "such",
  "suit", "sure", "take", "tale", "talk", "tank", "tape", "task", "team", "tech", "tell", "tend", "term",
  "test", "text", "than", "that", "them", "then", "they", "thin", "this", "thus", "till", "time", "tiny",
  "told", "toll", "tone", "tony", "took", "tool", "tour", "town", "tree", "trip", "true", "tune", "turn",
  "twin", "type", "unit", "upon", "used", "user", "vary", "vast", "very", "vice", "view", "vote", "wage",
  "wait", "wake", "walk", "wall", "want", "ward", "warm", "wash", "wave", "ways", "weak", "wear", "week",
  "well", "went", "were", "west", "what", "when", "whom", "wide", "wife", "wild", "will", "wind", "wine",
  "wing", "wire", "wise", "wish", "with", "wood", "word", "wore", "work", "yard", "yeah", "year", "your",
  "zero", "zone",
  
  // 5+ letter words
  "about", "above", "abuse", "actor", "adapt", "admit", "adopt", "adult", "after", "again", "agent", "agree",
  "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone", "along", "alter", "among", "anger",
  "angle", "angry", "ankle", "apart", "apple", "apply", "areas", "arena", "argue", "arise", "armed", "armor",
  "array", "arrow", "aside", "asset", "avoid", "award", "aware", "awful", "bacon", "badge", "badly", "baker",
  "bases", "basic", "basis", "beach", "beard", "beast", "begin", "being", "below", "bench", "billy", "birth",
  "black", "blade", "blame", "blank", "blast", "bleed", "blend", "bless", "blind", "block", "blood", "board",
  "boast", "bonus", "boost", "booth", "brain", "brake", "brand", "brave", "bread", "break", "breed", "brick",
  "bride", "brief", "bring", "broad", "brown", "brush", "build", "built", "bunch", "bunny", "burst", "cabin",
  "cable", "camel", "candy", "canon", "cargo", "carry", "carve", "catch", "cause", "cease", "chain", "chair",
  "chalk", "charm", "chart", "chase", "cheap", "check", "cheer", "chess", "chest", "chief", "child", "china",
  "choir", "choke", "chord", "civil", "claim", "class", "clean", "clear", "click", "cliff", "climb", "clock",
  "close", "cloth", "cloud", "coach", "coast", "color", "comet", "comic", "coral", "couch", "cough", "could",
  "count", "court", "cover", "crack", "craft", "crane", "crash", "crawl", "crazy", "cream", "creek", "crest",
  "crime", "cross", "crowd", "crown", "crush", "crust", "curve", "cycle", "daily", "dairy", "dance", "datum",
  "death", "debit", "delay", "dense", "depth", "devil", "diary", "dirty", "diver", "dizzy", "dodge", "doing",
  "donor", "doubt", "dough", "draft", "drain", "drama", "drank", "drawl", "drawn", "dream", "dress", "drill",
  "drink", "drive", "drone", "drove", "drown", "drunk", "dusty", "dying", "eager", "eagle", "early", "earth",
  "eaten", "eight", "elbow", "elect", "elite", "empty", "enact", "ended", "enemy", "enjoy", "enter", "entry",
  "equal", "equip", "error", "event", "every", "exact", "excel", "exist", "extra", "faint", "fairy", "faith",
  "false", "fancy", "fault", "favor", "feast", "fence", "fever", "fewer", "fiber", "field", "fiery", "fifth",
  "fifty", "fight", "final", "first", "fixed", "flash", "fleet", "flesh", "float", "flock", "floor", "flour",
  "fluid", "flush", "focus", "force", "forth", "forty", "forum", "found", "frame", "frank", "fraud", "fresh",
  "front", "frost", "fruit", "fully", "funny", "ghost", "giant", "given", "glass", "globe", "glory", "going",
  "grace", "grade", "grain", "grand", "grant", "grape", "graph", "grasp", "grass", "grave", "great", "green",
  "greet", "grief", "gross", "group", "grove", "grown", "guard", "guess", "guest", "guide", "guild", "guilt",
  "habit", "hamlet", "handle", "happy", "harsh", "heart", "heath", "heavy", "hello", "hence", "henry", "elbow",
  "house", "human", "humor", "ideal", "image", "imply", "index", "inner", "input", "issue", "japan", "joint",
  "jones", "judge", "juice", "knife", "knock", "known", "label", "labor", "large", "laser", "later", "laugh",
  "layer", "learn", "least", "leave", "legal", "lemon", "level", "light", "limit", "linen", "links", "liver",
  "lives", "local", "logic", "loose", "lorry", "lower", "lucky", "lunch", "lying", "magic", "major", "maker",
  "march", "maria", "match", "maybe", "mayor", "meals", "means", "meant", "media", "metal", "meter", "might",
  "minor", "minus", "mixed", "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth", "movie",
  "music", "naked", "named", "nasty", "naval", "needs", "nerve", "never", "newer", "newly", "night", "ninth",
  "noble", "noise", "north", "noted", "novel", "nurse", "ocean", "offer", "often", "older", "olive", "onion",
  "opera", "orbit", "order", "other", "ought", "outer", "owner", "oxide", "paced", "pages", "paint", "panel",
  "panic", "paper", "party", "pasta", "paste", "patch", "motor", "mount", "mouse", "mouth", "movie", "music",
  "space", "shame", "shape", "share", "sharp", "sheep", "sheet", "shelf", "shell", "shift", "shine", "shirt",
  "shock", "shoes", "shone", "shoot", "shore", "short", "shown", "sight", "since", "skill", "skin", "sleep",
  "slice", "slide", "slope", "small", "smart", "smile", "smoke", "snake", "solar", "solid", "solve", "sorry",
  "sound", "south", "space", "spare", "speak", "speed", "spend", "spent", "spite", "split", "spoke", "sport",
  "squad", "staff", "stage", "stairs", "stamp", "stand", "stare", "start", "state", "steam", "steel", "steep",
  "steer", "stems", "still", "stock", "stone", "stood", "storm", "story", "strap", "straw", "strip", "stuck",
  "study", "stuff", "style", "sugar", "suite", "super", "sweet", "swing", "table", "taken", "tales", "talks",
  "tanks", "tapes", "tasks", "taste", "taxes", "teach", "teeth", "tells", "tends", "terms", "tests", "thank",
  "theft", "their", "theme", "there", "these", "thick", "thief", "thigh", "thing", "think", "third", "those",
  "three", "threw", "throw", "tight", "tiles", "timed", "timer", "times", "tired", "title", "today", "token",
  "tooth", "topic", "total", "touch", "tough", "tower", "track", "trade", "trail", "train", "treat", "trend",
  "trial", "tried", "tries", "truck", "truly", "trunk", "trust", "truth", "trying", "tubes", "tutor", "twice",
  "twist", "typed", "under", "undue", "union", "unity", "until", "upper", "upset", "urban", "urged", "urine",
  "usage", "users", "using", "usual", "vague", "valid", "value", "valve", "vapor", "vault", "vague", "valid",
  "value", "valve", "vapor", "vault", "video", "virus", "visit", "vital", "vivid", "voice", "voted", "voter",
  "wages", "wagon", "waist", "walls", "waste", "watch", "water", "watts", "waves", "wears", "weigh", "weird",
  "wells", "welsh", "whale", "wheat", "wheel", "where", "which", "while", "white", "whole", "whose", "wider",
  "widow", "width", "winds", "wines", "wings", "wiped", "wired", "wires", "witch", "witty", "wives", "woman",
  "women", "woods", "words", "works", "world", "worms", "worry", "worse", "worst", "worth", "would", "wound",
  "woven", "wraps", "wrath", "wreck", "wrist", "wrong", "wrote", "yards", "years", "yield", "young", "yours",
  "youth", "zeros",
]);

// Map to store letter rarity points for scoring
export const letterRarityPoints: { [letter: string]: number } = {
  // Rare: 3 points
  Q: 3, Z: 3, X: 3, J: 3,
  // Uncommon: 2 points
  K: 2, V: 2, B: 2, P: 2, W: 2, Y: 2, F: 2, G: 2, H: 2, M: 2,
  // Common: 1 point
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, R: 1, S: 1, T: 1, D: 1, C: 1
};

// Checks if a word is valid in our dictionary
export const isValidWord = (word: string): boolean => {
  return commonWords.has(word.toLowerCase());
};

// Calculate word score based on length and letter rarity
export const calculateWordScore = (word: string): {totalScore: number, baseScore: number, rarityBonus: number} => {
  const baseScore = calculateBaseScore(word.length);
  const rarityBonus = calculateRarityBonus(word);
  
  return {
    totalScore: baseScore + rarityBonus,
    baseScore,
    rarityBonus
  };
};

// Calculate base score based on word length
const calculateBaseScore = (length: number): number => {
  if (length < 3) return 0;
  if (length === 3) return 10;
  if (length === 4) return 20;
  if (length === 5) return 30;
  return 50; // 6+ letters
};

// Calculate bonus points for letter rarity
const calculateRarityBonus = (word: string): number => {
  return word.split('').reduce((bonus, letter) => {
    return bonus + (letterRarityPoints[letter.toUpperCase()] || 1);
  }, 0);
};

export default {
  isValidWord,
  calculateWordScore,
  letterRarityPoints
};
