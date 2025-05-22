
// Collection of phrases, adjectives, and nouns for generating random phillboard sayings
const phrases = [
  "Just saw the most amazing",
  "Never miss a chance to see",
  "Can't believe there's",
  "You haven't lived until you've seen",
  "This spot has the best",
  "Discover the hidden",
  "Everyone should experience",
  "Don't forget to check out",
  "Take a photo with",
  "I finally found the perfect",
];

const adjectives = [
  "breathtaking", "stunning", "incredible", "vibrant", "peaceful",
  "magical", "unforgettable", "hidden", "iconic", "charming",
  "historic", "authentic", "artistic", "cozy", "majestic",
];

const nouns = [
  "sunrise", "sunset", "view", "landmark", "skyline",
  "atmosphere", "architecture", "street art", "cafe", "bistro",
  "garden", "park", "museum", "gallery", "neighborhood",
  "bridge", "alley", "path", "waterfall", "marketplace",
];

// Generate a random username for dummy users
export function generateRandomUsername(): string {
  const firstNames = ["Alex", "Jordan", "Morgan", "Taylor", "Casey", "Riley", "Dakota", "Quinn", "Jamie", "Avery"];
  const lastNames = ["Smith", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson"];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
}

// Generate a random unique saying for phillboards
export function generateRandomSaying(): string {
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${phrase} ${adjective} ${noun}!`;
}

// Generate a random number between min and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
