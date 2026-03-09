module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/lovemeter/, (msg) => {
    const chatId = msg.chat.id;

    const percent = Math.floor(Math.random() * 20) + 80;

    sendWithTyping(bot, chatId, `❤️ Love Compatibility: ${percent}%`, 2000);
  });
};
