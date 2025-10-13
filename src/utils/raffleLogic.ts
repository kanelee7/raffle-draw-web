import { Participant } from "@/components/ParticipantTable";

class FenwickTree {
  private tree: number[];

  constructor(size: number) {
    this.tree = new Array(size + 1).fill(0);
  }

  update(index: number, delta: number) {
    for (let i = index; i < this.tree.length; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  query(index: number) {
    let sum = 0;
    for (let i = index; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  total() {
    return this.query(this.tree.length - 1);
  }

  findByPrefix(value: number) {
    let idx = 0;
    let bit = 1;

    while (bit < this.tree.length) {
      bit <<= 1;
    }
    bit >>= 1;

    let accumulated = 0;

    while (bit > 0) {
      const next = idx + bit;
      if (next < this.tree.length && accumulated + this.tree[next] <= value) {
        accumulated += this.tree[next];
        idx = next;
      }
      bit >>= 1;
    }

    const candidate = idx + 1;
    return candidate >= this.tree.length ? this.tree.length - 1 : candidate;
  }
}

function secureRandom() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 2 ** 32;
}

export function drawWinners(
  participants: Participant[],
  numberOfWinners: number
): Participant[] {
  if (participants.length === 0 || numberOfWinners === 0) {
    return [];
  }

  const validParticipants = participants.filter((participant) => participant.weight > 0);

  if (validParticipants.length === 0) {
    return [];
  }

  const tree = new FenwickTree(validParticipants.length);
  const weights = validParticipants.map((participant) => participant.weight);

  weights.forEach((weight, index) => {
    tree.update(index + 1, weight);
  });
  let totalTickets = tree.total();
  const winners: Participant[] = [];
  const maxWinners = Math.min(numberOfWinners, validParticipants.length);

  while (winners.length < maxWinners && totalTickets > 0) {
    const randomTicket = secureRandom() * totalTickets;
    const epsilon = Number.EPSILON * totalTickets;
    const target = Math.max(Math.min(randomTicket, totalTickets - epsilon), 0);

    const index = tree.findByPrefix(target);
    const safeIndex = Math.min(index, validParticipants.length);
    const participant = validParticipants[safeIndex - 1];
    const weight = weights[safeIndex - 1];

    if (weight <= 0) {
      continue;
    }

    winners.push(participant);
    totalTickets -= weight;
    weights[safeIndex - 1] = 0;
    tree.update(safeIndex, -weight);
  }

  return winners;
}