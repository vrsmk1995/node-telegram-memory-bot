const updateUserData = require("../utils/updateUserData");

const memorySetupState = {};

module.exports = function (bot) {
  bot.onText(/\/setupmemory/, (msg) => {
    const chatId = msg.chat.id;

    memorySetupState[chatId] = { step: 1 };

    bot.sendMessage(chatId, "When did you first meet?");
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (!memorySetupState[chatId]) return;

    const text = msg.text;

    const state = memorySetupState[chatId];

    if (state.step === 1) {
      updateUserData(chatId, "firstMeet", text);

      state.step = 2;

      bot.sendMessage(chatId, "Where did you first chat?");
      return;
    }

    if (state.step === 2) {
      updateUserData(chatId, "firstChat", text);

      state.step = 3;

      bot.sendMessage(chatId, "What is your special moment?");
      return;
    }

    if (state.step === 3) {
      updateUserData(chatId, "specialMoment", text);

      delete memorySetupState[chatId];

      bot.sendMessage(chatId, "Memory saved successfully ❤️");
    }
  });
};
