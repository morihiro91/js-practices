import { MemoDatabase } from "./memo-database.js";
import { ConsoleCommand } from "./console-command.js";

export class MemoApp {
  constructor() {
    this.db = new MemoDatabase();
    this.command = new ConsoleCommand();
  }

  /**
   * メモの一覧を使用して実行する
   * @param {*} action メモを選択したさいの処理
   */
  async executeWithMemos(action) {
    this.db.all(async (err, rows) => {
      if (err) {
        console.error("メモの取得に失敗しました:", err.message);
      } else if (rows.length === 0) {
        console.error("メモが見つかりませんでした");
      } else {
        const choices = rows.map((memo) => ({
          name: memo.content.split("\n")[0],
          value: memo.id,
        }));

        try {
          const answer = await this.command.selectMemo(choices);
          if (answer.selectedItem) {
            action(answer.selectedItem);
          } else {
            console.error("選択したメモが見つかりませんでした");
          }
        } catch (error) {
          console.error("選択処理に失敗しました:", error.message);
        }
      }
    });
  }

  /**
   * メモを追加する
   */
  async addMemo() {
    try {
      const memoContent = await this.command.readLines();
      await this.db.add(memoContent);
      console.log("メモが追加されました");
    } catch (err) {
      console.error("メモの追加に失敗しました:", err.message);
    }
  }

  /**
   * メモの一覧を取得
   */
  listMemos() {
    this.db.all((err, rows) => {
      if (err) {
        console.error("メモの取得に失敗しました:", err.message);
      } else {
        rows.forEach((row) => {
          console.log(row.content.split("\n")[0]);
        });
      }
    });
  }

  /**
   * 選択したメモを参照する
   */
  async referMemo() {
    await this.executeWithMemos((id) => {
      this.db.get(id, (_, memo) => {
        if (memo) {
          console.log(memo.content);
        } else {
          console.log("メモが見つかりませんでした");
        }
      });
    });
  }

  /**
   * 選択したメモを削除する
   */
  async deleteMemo() {
    await this.executeWithMemos((id) => {
      this.db.delete(id, (err) => {
        if (err) {
          console.error("メモの削除に失敗しました:", err.message);
        } else {
          console.log("メモが削除されました");
        }
      });
    });
  }

  async handleArgs(args) {
    const option = args[0];
    if (!args.length) {
      await this.addMemo();
    } else if (option === "-l") {
      this.listMemos();
    } else if (option === "-r") {
      await this.referMemo();
    } else if (option === "-d") {
      await this.deleteMemo();
    }
    this.command.dispose();
  }

  run() {
    this.db.create();
    this.handleArgs(process.argv.slice(2));
  }
}

const app = new MemoApp();
app.run();
