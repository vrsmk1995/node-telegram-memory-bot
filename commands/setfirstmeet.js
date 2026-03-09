const updateUserData = require("../utils/updateUserData");

module.exports = function (bot) {
  bot.onText(/\/setfirstmeet (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1];

    updateUserData(chatId, "firstMeet", value);

    bot.sendMessage(chatId, "First meet memory updated ❤️");
  });
};
