import { createInterface } from "readline";
import enquirer from "enquirer";

export class ConsoleCommand {
  constructor() {
    this.readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async selectMemo(choices) {
    return enquirer.prompt({
      type: "select",
      message: "Choose a note you want to see:",
      name: "selectedItem",
      choices,
      result() {
        return this.focused.value;
      },
    });
  }

  async readLines() {
    return new Promise((resolve) => {
      let lines = "";
      this.readline.on("line", (line) => {
        lines += line + "\n";
      });
      this.readline.on("close", () => {
        resolve(lines);
      });
    });
  }

  dispose() {
    this.readline.close();
  }
}
