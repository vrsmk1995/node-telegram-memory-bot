const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/love/, async (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, sendWithTyping, chatId)) return;
    await sendWithTyping(
      bot,
      chatId,
      "You are the most special person in my life ❤️",
      2000,
    );
  });
};
