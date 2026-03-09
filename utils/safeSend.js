async function safeSend(bot, chatId, text, options = {}) {
  try {
    await bot.sendMessage(chatId, text, options);
  } catch (error) {
    console.log("Message send error:", error.message);
  }
}

module.exports = safeSend;
