export const APROOF_DOMAINS = [
  { code: "b1300", name: "Energie", nameEn: "Energy level", repo: "ENR", maxLevel: 4, color: "#F59E0B", description: "Energieniveau en vermoeidheid" },
  { code: "b140", name: "Aandacht", nameEn: "Attention functions", repo: "ATT", maxLevel: 4, color: "#8B5CF6", description: "Concentratie en aandachtsfuncties" },
  { code: "b152", name: "Emotioneel", nameEn: "Emotional functions", repo: "STM", maxLevel: 4, color: "#EC4899", description: "Emotionele functies en stemming" },
  { code: "b440", name: "Ademhaling", nameEn: "Respiration functions", repo: "ADM", maxLevel: 4, color: "#06B6D4", description: "Ademhalingsfuncties" },
  { code: "b455", name: "Inspanning", nameEn: "Exercise tolerance", repo: "INS", maxLevel: 5, color: "#10B981", description: "Inspanningstolerantie" },
  { code: "b530", name: "Gewicht", nameEn: "Weight maintenance", repo: "MBW", maxLevel: 4, color: "#F97316", description: "Gewichtshandhaving" },
  { code: "d450", name: "Lopen", nameEn: "Walking", repo: "FAC", maxLevel: 5, color: "#3B82F6", description: "Lopen en mobiliteit (FAC)" },
  { code: "d550", name: "Eten", nameEn: "Eating", repo: "ETN", maxLevel: 4, color: "#F43F5E", description: "Eten en voeding" },
  { code: "d840", name: "Werk", nameEn: "Work and employment", repo: "BER", maxLevel: 4, color: "#64748B", description: "Werk en werkgelegenheid" },
];

// Get severity label for a level
export function getSeverityLabel(level, maxLevel) {
  if (level === null || level === undefined) return { label: "Niet beoordeeld", color: "gray" };
  const ratio = level / maxLevel;
  if (ratio <= 0) return { label: "Geen probleem", color: "green" };
  if (ratio <= 0.25) return { label: "Licht probleem", color: "lime" };
  if (ratio <= 0.5) return { label: "Matig probleem", color: "amber" };
  if (ratio <= 0.75) return { label: "Ernstig probleem", color: "orange" };
  return { label: "Volledig probleem", color: "red" };
}

// Get bar fill percentage
export function getLevelPercentage(level, maxLevel) {
  if (level === null || level === undefined) return 0;
  return Math.min(100, Math.max(0, (level / maxLevel) * 100));
}
