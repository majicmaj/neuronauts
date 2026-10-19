import type { MissionCategory } from "../types.ts";

// Compatibility for servers that predate the catalog protocol.
const FALLBACK_CATEGORY: MissionCategory = {
  id: "all", label: "All words", difficulty: "hardest",
  description: "The full word map. No topic to narrow the search.",
};
export const DIFFICULTY_LABELS = {
  easy: "Easy", medium: "Medium", hard: "Hard", hardest: "Hardest",
} as const;

export function resolveMissionCategory(catalog: MissionCategory[], selectedId: string) {
  return catalog.find(category => category.id === selectedId)
    || catalog.find(category => category.id === "all")
    || FALLBACK_CATEGORY;
}

export function groupMissionCategories(catalog: MissionCategory[]) {
  return (["easy", "medium", "hard", "hardest"] as const)
    .map(difficulty => ({
      difficulty,
      label: DIFFICULTY_LABELS[difficulty],
      categories: catalog.filter(category => category.id !== "all" && category.difficulty === difficulty),
    }))
    .filter(group => group.categories.length > 0);
}
