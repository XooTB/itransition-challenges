import crypto from "crypto";
import CliTable3 from "cli-table3";
import * as readline from "node:readline";

class KeyGenerator {
  static generateKey() {
    return crypto.randomBytes(16).toString("hex");
  }

  static generateHMAC(key: string, move: string) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(move);
    return hmac.digest("hex");
  }
}

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

class Game {
  private moves: string[];
  private rules: Rules;

  constructor(moves: string[]) {
    this.moves = moves;
    this.rules = new Rules(moves);
  }

  play() {
    const key = KeyGenerator.generateKey();
    const computerMove =
      this.moves[Math.floor(Math.random() * this.moves.length)];
    const hmac = KeyGenerator.generateHMAC(key, computerMove);

    console.log(`HMAC: ${hmac}`);
    this.displayOptions();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter your move: ", (answer) => {
      if (answer === "0") {
        console.log("Thanks for playing!");
        rl.close();
        return;
      }

      if (answer === "?") {
        console.log(TableGenerator.generateTable(this.moves));
        rl.close();
        this.play();
        return;
      }

      const userMove = this.moves[parseInt(answer) - 1];
      if (!userMove) {
        console.log("Invalid move, Please try again.");
        this.play();
        rl.close();
        return;
      }

      console.log(`Your move: ${userMove}`);
      console.log(`Computer move: ${computerMove}`);

      const winner = this.rules.decideWinner(userMove, computerMove);
      if (winner === userMove) {
        console.log("You win!");
      } else if (winner === computerMove) {
        console.log("You lose!");
      } else {
        console.log("It's a draw!");
      }

      console.log(`HMAC key: ${key}`);
      rl.close();
    });
  }

  displayOptions() {
    console.log("Available moves: (Press the number to select)");
    this.moves.forEach((move, index) => {
      console.log(`${index + 1}. ${move}`);
    });
    console.log("0. Exit");
    console.log("?. Help");
  }
}

function main() {
  const args: string[] = process.argv.slice(2);
  if (args.length < 3 || args.length % 2 === 0) {
    console.log("Please provide an odd number of moves (3 or more)");
    return;
  }

  if (new Set(args).size !== args.length) {
    console.log("All moves must be unique");
    return;
  }

  const game = new Game(args);
  game.play();
}

main();
