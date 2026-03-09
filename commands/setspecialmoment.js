module.exports = (bot, sendWithTyping) => {
  bot.onText(/\/setspecialmoment (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1];

    updateUserData(chatId, "specialMoment", value);
    sendWithTyping(chatId, "Special moment updated ❤️");
  });
};
