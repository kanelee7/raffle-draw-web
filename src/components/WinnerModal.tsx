import { Participant } from "./ParticipantTable";
import { Trophy, X, Copy, Download, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WinnerModalProps {
  winners: Participant[];
  isOpen: boolean;
  onClose: () => void;
}

export function WinnerModal({ winners, isOpen, onClose }: WinnerModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && winners.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, winners]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleCopyCSV = () => {
    const csvContent = winners
      .map((w, i) => `${i + 1},${w.name},${w.weight}`)
      .join("\n");
    const fullCSV = "Rank,Name,Weight\n" + csvContent;
    
    navigator.clipboard.writeText(fullCSV);
    toast.success("Winners copied to clipboard!");
  };

  const handleExportCSV = () => {
    const csvContent = winners
      .map((w, i) => `${i + 1},${w.name},${w.weight}`)
      .join("\n");
    const fullCSV = "Rank,Name,Weight\n" + csvContent;
    
    const blob = new Blob([fullCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raffle-winners-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV file downloaded!");
  };

  if (!isOpen) return null;

  const topThree = winners.slice(0, 3);
  const restWinners = winners.slice(3);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 65%)`,
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-card via-card to-card/95 border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b-2 border-primary/20 px-6 py-5 flex items-center justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <Trophy className="h-8 w-8 text-primary animate-pulse" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-ping" />
              </div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                 당첨자 발표 
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-primary/10 relative z-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Top 3 Winners */}
            {topThree.length > 0 && (
              <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Top 3 Winners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topThree.map((winner, index) => (
                    <div
                      key={winner.id}
                      className="relative bg-gradient-to-br from-primary/10 via-card to-primary/5 border-2 border-primary/30 rounded-2xl p-6 animate-scale-in hover:scale-105 transition-transform shadow-lg"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="absolute -top-3 -right-3 text-5xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                        {medals[index]}
                      </div>
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-2xl shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold truncate mb-1">{winner.name}</h3>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1 inline-block">
                            Weight: {winner.weight}x
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of Winners */}
            {restWinners.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur py-2 z-10">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Other Winners ({restWinners.length})
                </h3>
                <div className="border rounded-xl overflow-hidden bg-card/50">
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted z-10">
                        <TableRow>
                          <TableHead className="w-[80px] font-bold">Rank</TableHead>
                          <TableHead className="font-bold">Name</TableHead>
                          <TableHead className="text-right font-bold w-[100px]">Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {restWinners.map((winner, index) => (
                          <TableRow
                            key={winner.id}
                            className="animate-fade-in hover:bg-primary/5"
                            style={{ animationDelay: `${(index + 3) * 0.05}s` }}
                          >
                            <TableCell className="font-semibold">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm">
                                {index + 4}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{winner.name}</TableCell>
                            <TableCell className="text-right">
                              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                {winner.weight}x
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {winners.length === 0 && (
              <div className="p-12 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No winners yet</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t-2 border-primary/20 px-6 py-4 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 hover:bg-primary/10 hover:border-primary/50 transition-colors"
              onClick={handleCopyCSV}
            >
              <Copy className="mr-2 h-4 w-4" />
              📋 Copy CSV
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              onClick={handleExportCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              ⬇ Export CSV
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
