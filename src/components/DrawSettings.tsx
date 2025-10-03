import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DrawSettingsProps {
  numberOfWinners: number;
  maxWinners: number;
  onNumberOfWinnersChange: (value: number) => void;
}

export function DrawSettings({
  numberOfWinners,
  maxWinners,
  onNumberOfWinnersChange,
}: DrawSettingsProps) {
  const handleChange = (value: string) => {
    const num = parseInt(value) || 1;
    const clamped = Math.max(1, Math.min(num, maxWinners));
    onNumberOfWinnersChange(clamped);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="winners">Number of Winners</Label>
      <Input
        id="winners"
        type="number"
        min="1"
        max={maxWinners}
        value={numberOfWinners}
        onChange={(e) => handleChange(e.target.value)}
        className="w-32"
      />
      {maxWinners > 0 && (
        <p className="text-xs text-muted-foreground">
          Maximum: {maxWinners}
        </p>
      )}
    </div>
  );
}