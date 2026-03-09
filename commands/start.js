const registerUser = require("../utils/registerUser");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const { newUser, user } = registerUser(msg);

    if (newUser) {
      await sendWithTyping(
        bot,
        chatId,
        `Welcome ${user.firstName}! ❤️

Your love memory profile has been created.

You can now use commands like:
/memory
/timeline
/lovecode`,
        2000,
      );
    } else {
      bot.sendMessage(chatId, `Welcome back ${user.firstName}! ❤️`);
    }
  });
};
