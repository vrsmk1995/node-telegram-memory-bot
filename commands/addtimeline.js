const fs = require("fs");
const path = require("path");
const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot) {
  bot.onText(/\/addtimeline (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    const args = match[1].split(" ");

    const year = args[0];

    const event = args.slice(1).join(" ");

    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      bot.sendMessage(chatId, "Run /start first.");
      return;
    }

    const user = JSON.parse(fs.readFileSync(filePath));

    if (!user.timeline) {
      user.timeline = [];
    }

    user.timeline.push({
      year,
      event,
    });

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2));

    bot.sendMessage(chatId, `Timeline event added for ${year} ❤️`);
  });
};
