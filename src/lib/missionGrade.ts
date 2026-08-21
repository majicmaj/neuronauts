export type MissionGradeLetter = "S" | "A" | "B" | "C" | "D";

export interface MissionGrade {
  letter: MissionGradeLetter;
  score: number;
  label: string;
  summary: string;
  factorScores: {
    time: number | null;
    guesses: number;
    hints: number;
  };
}

interface MissionGradeInput {
  elapsedSeconds: number | null;
  totalGuesses: number;
  totalHints: number;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function decliningScore(value: number, excellentAt: number, depletedAt: number) {
  if (value <= excellentAt) return 100;
  if (value >= depletedAt) return 0;
  return 100 * (1 - (value - excellentAt) / (depletedAt - excellentAt));
}

const GRADE_COPY: Record<
  MissionGradeLetter,
  Pick<MissionGrade, "label" | "summary">
> = {
  S: {
    label: "Legendary lock",
    summary: "Fast, focused, and nearly untouched by navigator assistance.",
  },
  A: {
    label: "Precision flight",
    summary: "A sharp route through semantic space with little fuel wasted.",
  },
  B: {
    label: "Clean approach",
    summary: "A solid mission with a few extra orbits around the target.",
  },
  C: {
    label: "Long orbit",
    summary: "The crew got there, but the flight path wandered along the way.",
  },
  D: {
    label: "Deep-space detour",
    summary: "Signal found. Flight efficiency is a story for the debrief.",
  },
};

function letterForScore(score: number): MissionGradeLetter {
  if (score >= 90) return "S";
  if (score >= 78) return "A";
  if (score >= 64) return "B";
  if (score >= 48) return "C";
  return "D";
}

export function calculateMissionGrade({
  elapsedSeconds,
  totalGuesses,
  totalHints,
}: MissionGradeInput): MissionGrade {
  const timeScore = elapsedSeconds === null
    ? null
    : decliningScore(Math.max(0, elapsedSeconds), 10 * 60, 40 * 60);
  const guessScore = decliningScore(Math.max(0, totalGuesses), 100, 650);
  const hintScore = clamp(100 - Math.max(0, totalHints) * 30);

  const weightedFactors = [
    timeScore === null ? null : { score: timeScore, weight: 35 },
    { score: guessScore, weight: 45 },
    { score: hintScore, weight: 20 },
  ].filter((factor): factor is { score: number; weight: number } => factor !== null);
  const totalWeight = weightedFactors.reduce((sum, factor) => sum + factor.weight, 0);
  const score = Math.round(
    weightedFactors.reduce(
      (sum, factor) => sum + factor.score * factor.weight,
      0
    ) / totalWeight
  );
  const letter = letterForScore(score);

  return {
    letter,
    score,
    ...GRADE_COPY[letter],
    factorScores: {
      time: timeScore === null ? null : Math.round(timeScore),
      guesses: Math.round(guessScore),
      hints: Math.round(hintScore),
    },
  };
}
