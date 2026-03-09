module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/lovecode/, (msg) => {
    const chatId = msg.chat.id;

    sendWithTyping(
      bot,
      chatId,
      "🔐 Love Code Activated\n\nYou + Me = Forever ❤️",
      2000,
    );
  });
};
