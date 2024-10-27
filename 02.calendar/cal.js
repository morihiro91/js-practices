import minimist from "minimist";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import "dayjs/locale/ja.js";

dayjs.locale("ja");
// ロケールデータを拡張するためのプラグイン
dayjs.extend(localeData);
// 月初と月末を取得するためのプラグイン
dayjs.extend(advancedFormat);

const now = dayjs();
const arg = minimist(process.argv.slice(2), {
  default: {
    y: now.year(),
    m: now.month() + 1, // 0to11のため+1する
  },
});

// 月初の日付
const firstDayOfMonth = dayjs(`${arg.y}-${arg.m}-01`, "YYYY-MM-DD");
// 月末の日付
const lastDayOfMonth = firstDayOfMonth.endOf("month").date();
// 月初の曜日を取得 (0 = Sunday, 6 = Saturday)
const startDay = firstDayOfMonth.day();

// カレンダー配列を作成
let calendar = [];

// 最初の週を埋める（1日が始まるまでの空白を挿入）
let week = new Array(startDay).fill("  ");

// 日付を埋める
for (let day = 1; day <= lastDayOfMonth; day++) {
  week.push(day.toString().padStart(2, " "));

  // 土曜日で週が終わるため、土曜日の場合は次の週に進む
  if (week.length === 7) {
    calendar.push(week);
    week = [];
  }
}

// 最後の週が埋まっていない場合、そのまま追加
if (week.length > 0) {
  while (week.length < 7) {
    week.push("  "); // 残りを空白で埋める
  }
  calendar.push(week);
}

// カレンダーを表示
// ヘッダーを表示
console.log(`      ${firstDayOfMonth.format("MM月 YYYY")}`);
console.log(dayjs.weekdaysShort().join(" "));
// 各週を表示
for (let i = 0; i < calendar.length; i++) {
  console.log(calendar[i].join(" "));
}
