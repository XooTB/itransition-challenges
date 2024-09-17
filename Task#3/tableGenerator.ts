import CliTable3 from "cli-table3";
import Rules from "./rules";

class TableGenerator {
  static generateTable(moves: string[]): string {
    let table = new CliTable3();
    const rules = new Rules(moves);
    table.push(["v PC/user >", ...moves]);

    moves.forEach((move1) => {
      const row: string[] = [];

      moves.forEach((move2) => {
        const winner = rules.decideWinner(move1, move2);
        let cell = "Draw";
        if (winner === move1) cell = "Lose";
        if (winner === move2) cell = "Win";
        row.push(cell);
      });

      table.push([move1, ...row]);
    });

    return table.toString();
  }
}

export default TableGenerator;
