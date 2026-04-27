const User = require("../models/User");
const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot) {
  bot.onText(/\/timeline/, async (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    try {
      const user = await User.findOne({ chatId });

      if (!user.timeline || user.timeline.length === 0) {
        bot.sendMessage(
          chatId,
          "No timeline memories yet. Use /addtimeline to add one.",
        );
        return;
      }

      // sort timeline by year
      const timeline = user.timeline.sort((a, b) => a.year - b.year);

      let message = "📅 Your Memory Timeline\n\n";

      timeline.forEach((item) => {
        message += `📌 ${item.year}\n${item.event}\n\n`;
      });

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      await bot.sendMessage(
        chatId,
        "An error occurred while fetching your timeline. Please try again later ❤️",
      );
    }
  });
};
