const sendWithTyping = require("./sendWithTyping");

async function sendMainMenu(bot, chatId, firstName = "there") {
  const welcomeMessage = `Welcome back ${firstName}! ❤️

✨ Love Bot Features Unlocked ✨

1️⃣ Use /setupmemory to save or update your memories
2️⃣ Use /memory to replay your saved memories
3️⃣ Try fun features like /love, /surprise, /reasons, /lovecode
4️⃣ Use /profile to view your profile
5️⃣ Use the menu buttons below for quick access ✨`;

  const buttons = [
    [
      { text: "👤 Profile", callback_data: "profile" },
      { text: "✏️ Edit Profile", callback_data: "edit_profile" },
    ],
    [
      { text: "❤️ Love", callback_data: "love" },
      { text: "🎁 Surprise", callback_data: "surprise" },
      { text: "🧠 Memory", callback_data: "memory" },
    ],
    [
      { text: "💌 Reasons", callback_data: "reasons" },
      { text: "🔢 Love Code", callback_data: "lovecode" },
    ],
    [
      { text: "❓ Help", callback_data: "help" },
      { text: "🔄 Reset", callback_data: "reset" },
    ],
  ];

  await sendWithTyping(bot, chatId, welcomeMessage, 1200);

  await bot.sendMessage(chatId, "💖 Choose an option:", {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

module.exports = sendMainMenu;
