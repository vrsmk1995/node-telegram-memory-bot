

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/love/, (msg) => {
    const chatId = msg.chat.id;

    sendWithTyping(
      bot,
      chatId,
      "You are the most special person in my life ❤️",
      2000,
    );
  });
};
