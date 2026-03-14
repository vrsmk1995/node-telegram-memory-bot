module.exports = function (bot) {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpMessage = `✨ Available Commands ✨

/start - Register and create your profile
/help - Show all available commands
/memory - View your saved memory
/setupmemory - Setup your memory details

/reset - Reset your profile and start fresh
/love - Get a sweet love message ❤️

💡 Suggested Flow:
1. /start
2. /setupmemory
3. /memory
4. /timeline`;

    bot.sendMessage(chatId, helpMessage);
  });
};
