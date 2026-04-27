const isProfileComplete = require("../utils/isProfileComplete");

module.exports = function (bot) {
  bot.onText(/\/help/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const profileDone = await isProfileComplete(chatId);

      const helpMessage = profileDone
        ? `✨ *Love Bot Help* ✨

*Available Commands:*
/start - Open the welcome menu
/help - Show all available commands
/profile - View your saved profile
/editprofile - Update your profile details
/setupmemory - Save or update your memories
/memory - View your saved memories
/addtimeline - Add a timeline memory
/timeline - View your timeline memories
/reset - Reset memories or full profile

💡 *Suggested Flow:*
1. /profile
2. /editprofile (if needed)
3. /setupmemory
4. /memory
5. /addtimeline Title | Date | Note
6. /timeline`
        : `✨ *Love Bot Help* ✨

*Available Commands Before Signup:*
/start - Open the welcome menu
/help - Show available commands
/signup - Complete your profile setup
/reset - Reset your data if needed

⚠️ *Important:*
Complete /signup first to unlock profile, memory, and timeline features ❤️`;

      await bot.sendMessage(chatId, helpMessage, {
        parse_mode: "Markdown",
      });
    } catch (error) {
      console.error("Help command error:", error);
      await bot.sendMessage(
        chatId,
        "❌ Failed to load help menu. Please try again.",
      );
    }
  });
};
