class Rules {
  private moves: string[];

  constructor(moves: string[]) {
    this.moves = moves;
  }

  public decideWinner(move1: string, move2: string) {
    if (move1 === move2) return "Draw";

    const halfMoves = Math.floor(this.moves.length / 2);
    const index1 = this.moves.indexOf(move1);
    const index2 = this.moves.indexOf(move2);

    if (
      (index2 > index1 && index2 <= index1 + halfMoves) ||
      (index2 < index1 && index2 <= index1 + halfMoves - this.moves.length)
    ) {
      return move2;
    }

    return move1;
  }
}

export default Rules;
