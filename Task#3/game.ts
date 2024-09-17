import TableGenerator from "./tableGenerator";
import KeyGenerator from "./keyGenerator";
import Rules from "./rules";
import * as readline from "node:readline";

class Game {
  private moves: string[];
  private rules: Rules;

  constructor(moves: string[]) {
    this.moves = moves;
    this.rules = new Rules(moves);
  }

  play() {
    const key = KeyGenerator.generateKey(32);
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

export default Game;
