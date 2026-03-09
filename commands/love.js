

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/love/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId) {
      console.log(`Unauthorized access attempt from chat ID: ${chatId}`);
      return;
    }
    sendWithTyping(
      bot,
      chatId,
      "You are the most special person in my life ❤️",
      2000,
    );
  });
};
