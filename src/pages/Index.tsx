import { useState } from "react";
import { ParticipantTable, Participant } from "@/components/ParticipantTable";
import { DrawSettings } from "@/components/DrawSettings";
import { WinnerModal } from "@/components/WinnerModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { drawWinners } from "@/utils/raffleLogic";
import { Dices, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const validParticipants = participants.filter((p) => p.name.trim());
  const maxWinners = validParticipants.length;
  const canDraw = validParticipants.length > 0 && numberOfWinners <= maxWinners;

  const handleDraw = async () => {
    if (!canDraw) {
      toast.error("Please add participants with valid names");
      return;
    }

    setIsDrawing(true);
    setWinners([]);
    setShowWinnerModal(false);

    // Simulate drawing animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const selectedWinners = drawWinners(validParticipants, numberOfWinners);
    setWinners(selectedWinners);
    setIsDrawing(false);
    setShowWinnerModal(true);

    toast.success(`${selectedWinners.length} winner${selectedWinners.length > 1 ? 's' : ''} selected!`);
  };

  const handleReset = () => {
    setParticipants([]);
    setWinners([]);
    setNumberOfWinners(1);
    setShowWinnerModal(false);
    toast.success("Reset complete");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Raffle Draw</h1>
            <p className="text-muted-foreground">
              Weighted random selection made simple
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          <ParticipantTable
            participants={participants}
            onParticipantsChange={setParticipants}
          />

          {/* Draw Controls */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <DrawSettings
                numberOfWinners={numberOfWinners}
                maxWinners={maxWinners}
                onNumberOfWinnersChange={setNumberOfWinners}
              />

              <div className="flex gap-3 ml-auto">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={participants.length === 0 && winners.length === 0}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset All
                </Button>
                <Button
                  onClick={handleDraw}
                  disabled={!canDraw || isDrawing}
                  size="lg"
                  className="min-w-[160px]"
                >
                  <Dices className="mr-2 h-5 w-5" />
                  {isDrawing ? "Drawing..." : "Draw Winners"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        winners={winners}
        isOpen={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
      />
    </div>
  );
};

export default Index;
