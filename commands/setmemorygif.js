const updateUserData = require("../utils/updateUserData");

const waitingForGif = {};

module.exports = function (bot) {
  bot.onText(/\/setmemorygif/i, (msg) => {
    const chatId = msg.chat.id;

    waitingForGif[chatId] = true;

    bot.sendMessage(chatId, "Please upload the memory GIF 🎞");
  });

  bot.on("animation", async (msg) => {
    const chatId = msg.chat.id;

    if (!waitingForGif[chatId]) return;

    try {
      const fileId = msg.animation.file_id;

      updateUserData(chatId, "gifUrl", fileId);

      delete waitingForGif[chatId];

      bot.sendMessage(chatId, "Memory GIF saved successfully 🎉");
    } catch (err) {
      console.error("GIF save error:", err);

      bot.sendMessage(chatId, "Failed to save GIF.");
    }
  });
};
