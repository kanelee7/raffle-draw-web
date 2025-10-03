import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export interface Participant {
  id: string;
  name: string;
  weight: number;
}

interface ParticipantTableProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
}

export function ParticipantTable({ participants, onParticipantsChange }: ParticipantTableProps) {
  const addParticipant = () => {
    onParticipantsChange([
      ...participants,
      { id: crypto.randomUUID(), name: "", weight: 1 },
    ]);
  };

  const removeParticipant = (id: string) => {
    onParticipantsChange(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number) => {
    onParticipantsChange(
      participants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split("\n").filter((row) => row.trim());
      
      const newParticipants: Participant[] = rows.map((row) => {
        // Split by tab or multiple spaces to handle Excel/CSV paste
        const parts = row.split(/[\t\s]+/).filter(p => p);
        const name = parts[0]?.trim() || "";
        const weight = parts[1] ? Math.max(1, parseInt(parts[1]) || 1) : 1;
        
        return {
          id: crypto.randomUUID(),
          name,
          weight,
        };
      }).filter(p => p.name);

      if (newParticipants.length > 0) {
        onParticipantsChange([...participants, ...newParticipants]);
        toast.success(`Added ${newParticipants.length} participants`);
      }
    } catch (error) {
      toast.error("Failed to paste. Please copy data from Excel/CSV.");
    }
  };

  const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Participants</h2>
          <p className="text-sm text-muted-foreground">
            {participants.length} participants · Total weight: {totalWeight}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePaste} variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Paste from Excel
          </Button>
          <Button onClick={addParticipant} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">Weight</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    No participants yet. Add one or paste from Excel.
                  </td>
                </tr>
              ) : (
                participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Input
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                        placeholder="Enter name"
                        className="border-0 focus-visible:ring-0 bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="1"
                        value={participant.weight}
                        onChange={(e) => updateParticipant(participant.id, "weight", Math.max(1, parseInt(e.target.value) || 1))}
                        className="border-0 focus-visible:ring-0 bg-transparent w-24"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
