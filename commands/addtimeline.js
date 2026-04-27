const User = require("../models/User");
const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot) {
  bot.onText(/\/addtimeline (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    const args = match[1].split(" ");

    const year = args[0];

    const event = args.slice(1).join(" ");

    try {
      const user = await User.findOne({ chatId });

      if (!user) {
        bot.sendMessage(chatId, "User not found. Please sign up first.");
        return;
      }

      const yearNum = parseInt(year);
      if (isNaN(yearNum)) {
        bot.sendMessage(chatId, "Invalid year. Please provide a valid year.");
        return;
      }

      if (!event.trim()) {
        bot.sendMessage(chatId, "Please provide an event description.");
        return;
      }

      if (!user.timeline) {
        user.timeline = [];
      }

      user.timeline.push({
        year: yearNum,
        event,
      });

      await user.save();

      bot.sendMessage(chatId, `Timeline event added for ${yearNum} ❤️`);
    } catch (error) {
      console.error("Error adding timeline event:", error);
      await bot.sendMessage(
        chatId,
        "An error occurred while adding the timeline event. Please try again later ❤️",
      );
    }
  });
};
