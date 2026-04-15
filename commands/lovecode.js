const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/lovecode/, async (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    await sendWithTyping(
      bot,
      chatId,
      "🔐 Love Code Activated\n\nYou + Me = Forever ❤️",
      2000,
    );
  });
};
