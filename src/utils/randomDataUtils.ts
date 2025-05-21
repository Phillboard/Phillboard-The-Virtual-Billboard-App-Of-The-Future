
// Generate random phillboard titles
export const generateRandomTitle = (): string => {
  const adjectives = ["Digital", "Future", "Neon", "Cyber", "Tech", "Virtual", "Smart", "Epic", "Urban", "Modern"];
  const nouns = ["Hub", "Space", "Zone", "Nexus", "Portal", "Avenue", "City", "District", "Square", "Center"];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun}`;
};

// Generate random usernames
export const generateRandomUsername = (): string => {
  const prefixes = ["Cyber", "Digital", "Tech", "Neon", "Code", "Pixel", "Data", "Net", "Web", "Virtual"];
  const suffixes = ["Rider", "Nomad", "Master", "Guru", "Pro", "Ninja", "Wizard", "Explorer", "Pioneer", "Hacker"];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}${suffix}`;
};
