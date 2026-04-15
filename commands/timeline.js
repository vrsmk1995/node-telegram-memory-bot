const fs = require("fs");
const path = require("path");
const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot) {
  bot.onText(/\/timeline/, (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      bot.sendMessage(chatId, "Please run /start first.");
      return;
    }

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!user.timeline || user.timeline.length === 0) {
      bot.sendMessage(
        chatId,
        "No timeline memories yet. Use /addtimeline to add one.",
      );
      return;
    }

    // sort timeline by year
    const timeline = user.timeline.sort((a, b) => a.year - b.year);

    let message = "📅 Your Memory Timeline\n\n";

    timeline.forEach((item) => {
      message += `📌 ${item.year}\n${item.event}\n\n`;
    });

    bot.sendMessage(chatId, message);
  });
};
