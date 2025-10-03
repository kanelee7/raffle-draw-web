import { Participant } from "@/components/ParticipantTable";

export function drawWinners(
  participants: Participant[],
  numberOfWinners: number
): Participant[] {
  if (participants.length === 0 || numberOfWinners === 0) {
    return [];
  }

  // Calculate total tickets
  const totalTickets = participants.reduce((sum, p) => sum + p.weight, 0);

  // Create cumulative ranges for each participant
  const ranges: { participant: Participant; start: number; end: number }[] = [];
  let currentSum = 0;

  participants.forEach((participant) => {
    ranges.push({
      participant,
      start: currentSum,
      end: currentSum + participant.weight,
    });
    currentSum += participant.weight;
  });

  // Draw winners
  const winners: Participant[] = [];
  const selectedIds = new Set<string>();

  while (winners.length < numberOfWinners && selectedIds.size < participants.length) {
    const randomTicket = Math.random() * totalTickets;
    
    const selectedRange = ranges.find(
      (range) => randomTicket >= range.start && randomTicket < range.end
    );

    if (selectedRange && !selectedIds.has(selectedRange.participant.id)) {
      winners.push(selectedRange.participant);
      selectedIds.add(selectedRange.participant.id);
    }
  }

  return winners;
}