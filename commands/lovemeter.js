const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/lovemeter/, (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    const percent = Math.floor(Math.random() * 20) + 80;

    sendWithTyping(bot, chatId, `❤️ Love Compatibility: ${percent}%`, 2000);
  });
};
