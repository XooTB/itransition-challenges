import Game from "./game";

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
