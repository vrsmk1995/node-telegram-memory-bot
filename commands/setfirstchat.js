const updateUserData = require("../utils/updateUserData");

module.exports = function (bot) {
  bot.onText(/\/setfirstchat (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1];

    updateUserData(chatId, "firstChat", value);

    bot.sendMessage(chatId, "First chat memory updated 💬");
  });
};
