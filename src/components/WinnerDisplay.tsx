import { Participant } from "./ParticipantTable";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface WinnerDisplayProps {
  winners: Participant[];
}

export function WinnerDisplay({ winners }: WinnerDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (winners.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [winners]);

  if (winners.length === 0) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">Winners!</h2>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fade-in"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {winners.map((winner, index) => (
          <div
            key={winner.id}
            className="bg-card border rounded-lg p-6 animate-scale-in shadow-md hover:shadow-lg transition-shadow"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold truncate">{winner.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Weight: {winner.weight}x
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
