const registerUser = require("../utils/registerUser");
const sendMainMenu = require("../utils/sendMainMenu");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/start/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const result = registerUser(msg);
      const user = result.user || result;

      // If profile is completed, show full unlocked menu
      if (user.profileCompleted) {
        await sendMainMenu(bot, chatId, user.firstName || "there");
        return;
      }

      // If profile is NOT completed, show onboarding + limited menu
      const welcomeMessage = `Welcome ${user.firstName || "there"}! ❤️

✨ How to use Love Bot ✨

1️⃣ First, complete your signup using /signup
2️⃣ After signup, all bot features will unlock
3️⃣ Then use /setupmemory to save your special memories
4️⃣ Use /memory anytime to view your saved memories
5️⃣ Use the menu buttons below for quick access

⚠️ Important: Without signup, other features will not work.`;

      const buttons = [
        [
          { text: "📝 Signup", callback_data: "signup" },
          { text: "👤 Profile", callback_data: "profile" },
        ],
        [
          { text: "❓ Help", callback_data: "help" },
          { text: "🔄 Reset", callback_data: "reset" },
        ],
      ];

      await sendWithTyping(bot, chatId, welcomeMessage, 1500);

      await bot.sendMessage(chatId, "💖 Choose an option:", {
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    } catch (err) {
      console.error("Start command error:", err);
      bot.sendMessage(chatId, "Something went wrong while starting the bot.");
    }
  });
};
