const sendWithTyping = require("./sendWithTyping");

async function sendMainMenu(bot, chatId, firstName = "there") {
  const welcomeMessage = `Welcome back ${firstName}! ❤️

✨ Love Bot Features Unlocked ✨

1️⃣ Use /profile to view your saved profile
2️⃣ Use /editprofile to update your details anytime
3️⃣ Use /setupmemory to save or update your memories
4️⃣ Use /memory to replay your saved memories
5️⃣ Use /addtimeline to save timeline memories
6️⃣ Use /timeline to view your memory timeline
7️⃣ Use the menu buttons below for quick access ✨`;

  const buttons = [
    [
      { text: "👤 Profile", callback_data: "profile" },
      { text: "✏️ Edit Profile", callback_data: "edit_profile" },
    ],
    [
      { text: "🧠 Memory", callback_data: "memory" },
      { text: "📝 Setup Memory", callback_data: "setup_memory" },
    ],
    [
      { text: "📅 Timeline", callback_data: "timeline" },
      { text: "➕ Add Timeline", callback_data: "add_timeline_help" },
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
