async function sendWithTyping(
  bot,
  chatId,

  text,
  delay = 2000,
) {
  try {
    await bot.sendChatAction(chatId, "typing");

    setTimeout(async () => {
      await bot.sendMessage(chatId, text);
    }, delay);
  } catch (error) {
    console.log("Typing send error:", error.message);
  }
}

module.exports = sendWithTyping;
