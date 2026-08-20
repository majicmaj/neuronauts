import { useMemo } from "react";

interface CelebrationProps {
  active: boolean;
}

const COLORS = ["#14b8a6", "#22d3ee", "#8b5cf6", "#d946ef", "#f8fafc"];

export function Celebration({ active }: CelebrationProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        delay: ((index * 17) % 25) / 10,
        duration: 3.2 + ((index * 13) % 18) / 10,
        color: COLORS[index % COLORS.length],
        rotation: (index * 47) % 180,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="neuron-confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color,
            rotate: `${piece.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
