const { showResetConfirmation } = require("../services/resetService");

module.exports = function (bot) {
  bot.onText(/\/reset/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      await showResetConfirmation(bot, chatId);
    } catch (err) {
      console.error("Reset command error:", err);
      await bot.sendMessage(
        chatId,
        "Failed to reset your data. Please try again.",
      );
    }
  });
};
