const User = require("../models/User");
const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot) {
  bot.onText(/\/addtimeline\s+(.+)/i, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!(await requireSignup(bot, chatId))) return;

    try {
      const user = await User.findOne({ chatId });

      if (!user) {
        await bot.sendMessage(chatId, "Please use /start first ❤️");
        return;
      }

      const input = match[1].trim();

      // Format: /addtimeline Title | Date | Note
      const parts = input.split("|").map((part) => part.trim());

      if (parts.length < 3) {
        await bot.sendMessage(
          chatId,
          "⚠️ Invalid format.\n\nUse:\n/addtimeline Title | Date | Note\n\nExample:\n/addtimeline First Meet | 14-02-2024 | We met for the first time ❤️",
        );
        return;
      }

      const [title, date, note] = parts;

      if (!title || !date || !note) {
        await bot.sendMessage(
          chatId,
          "⚠️ Please provide all 3 values.\n\nUse:\n/addtimeline Title | Date | Note",
        );
        return;
      }

      if (!Array.isArray(user.timeline)) {
        user.timeline = [];
      }

      user.timeline.push({
        title,
        date,
        note,
        createdAt: new Date(),
      });

      await user.save();

      await bot.sendMessage(
        chatId,
        `✅ Timeline memory added successfully ❤️\n\n📌 ${title}\n📆 ${date}\n📝 ${note}`,
      );
    } catch (error) {
      console.error("Error adding timeline event:", error);
      await bot.sendMessage(
        chatId,
        "❌ An error occurred while adding the timeline memory. Please try again later ❤️",
      );
    }
  });
};
