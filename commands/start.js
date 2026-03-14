const registerUser = require("../utils/registerUser");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/start/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const result = registerUser(msg);
      const user = result.user || result;

      const welcomeMessage = result.newUser
        ? `Welcome ${user.firstName}! ❤️

Your profile has been created successfully.

Use the buttons below to explore the bot ✨`
        : `Welcome back ${user.firstName}! ❤️

Use the buttons below to continue ✨`;

      await sendWithTyping(bot, chatId, welcomeMessage, 1500);

      await bot.sendMessage(chatId, "💖 Choose an option:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "❤️ Love", callback_data: "love" },
              { text: "🎁 Surprise", callback_data: "surprise" },
            ],
            [
              { text: "🧠 Memory", callback_data: "memory" },
              { text: "❓ Help", callback_data: "help" },
            ],
            [
              { text: "💌 Reasons", callback_data: "reasons" },
              { text: "🔢 Love Code", callback_data: "lovecode" },
            ],

            [{ text: "🔄 Reset", callback_data: "reset" }],
          ],
        },
      });
    } catch (err) {
      console.error("Start command error:", err);
      bot.sendMessage(chatId, "Something went wrong while starting the bot.");
    }
  });
};
