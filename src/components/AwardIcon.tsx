const AWARD_ICON: Record<string, string> = {
  "signal-finder": "target",
  "most-guesses": "computer",
  "most-wrong": "travel",
  "furthest-guess": "moon",
  "fewest-guesses": "battery",
  "best-average": "trophy",
  "most-hints": "bulb",
  "most-breakthroughs": "fire",
  "biggest-leap": "flash",
  "first-contact": "megaphone",
  "closest-miss": "rocket",
  "fallback-cosmic-wildcard": "star",
  "fallback-backup-brain": "lab",
  "fallback-dark-matter": "sphere",
  "fallback-moon-shot": "tool",
  fallback: "star",
};

export function AwardIcon({ awardId }: { awardId: string }) {
  const icon = AWARD_ICON[awardId] || AWARD_ICON.fallback;

  return (
    <img
      src={`/award-icons/${icon}.webp`}
      alt=""
      width="48"
      height="48"
      decoding="async"
      className="debrief-award-icon"
      aria-hidden="true"
    />
  );
}
