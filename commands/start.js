const registerUser = require("../utils/registerUser");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/start/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const result = registerUser(msg);
      const user = result.user || result;

      let welcomeMessage = "";

      if (result.newUser) {
        welcomeMessage = `Welcome ${user.firstName}!
    

Your profile has been created successfully.

 Before Using the all features below to explore the bot ✨`;
      } else if (!user.profileCompleted) {
        welcomeMessage = `Welcome Back ${user.firstName} ! ❤️
      
Your signup is not complete yet.
Please use /signup to continue ✨`;
      } else {
        welcomeMessage = `Welcome back ${user.firstName}! ❤️

Use the menu below to continue ✨`;
      }

      await sendWithTyping(bot, chatId, welcomeMessage, 1500);

      await bot.sendMessage(chatId, "💖 Choose an option:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Profile",
                callback_data: "profile",
              },
              { text: "Sign Up", callback_data: "signup" },
            ],
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
