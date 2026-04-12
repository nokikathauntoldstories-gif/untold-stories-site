export const CATEGORIES: Record<string, { slug: string; name: string; nameEn: string; emoji: string; description: string }> = {
  mysteries: { slug: "mysteries", name: "අභිරහස්", nameEn: "Mysteries", emoji: "🔍", description: "Unsolved cases, mysterious disappearances, unexplained events" },
  "true-crime": { slug: "true-crime", name: "සැබෑ අපරාධ", nameEn: "True Crime", emoji: "🔪", description: "Murders, criminal investigations, forensic cases" },
  historical: { slug: "historical", name: "ඉතිහාසය", nameEn: "Historical Events", emoji: "📜", description: "Civil rights, historical figures, wars, significant events" },
  geopolitics: { slug: "geopolitics", name: "භූ දේශපාලනය", nameEn: "Geopolitics", emoji: "🌍", description: "International politics, current affairs, diplomacy" },
  psychology: { slug: "psychology", name: "මනෝවිද්‍යාව", nameEn: "Psychology", emoji: "🧠", description: "Human behavior, social experiments, psychological phenomena" },
  other: { slug: "other", name: "වෙනත්", nameEn: "Other", emoji: "📰", description: "Other interesting stories" },
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([value, cat]) => ({
  value,
  label: `${cat.emoji} ${cat.name} — ${cat.nameEn}`,
}));
