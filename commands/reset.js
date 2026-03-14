const fs = require("fs");
const path = require("path");

module.exports = function (bot) {
  bot.onText(/\/reset/i, (msg) => {
    const chatId = msg.chat.id;

    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    try {
      if (!fs.existsSync(filePath)) {
        bot.sendMessage(
          chatId,
          "No profile data found. Use /start to begin ❤️",
        );
        return;
      }

      fs.unlinkSync(filePath);

      bot.sendMessage(
        chatId,
        `Your profile and memories have been reset successfully ❤️

Use /start to begin again.`,
      );
    } catch (err) {
      console.error("Reset command error:", err);
      bot.sendMessage(chatId, "Failed to reset your data. Please try again.");
    }
  });
};
