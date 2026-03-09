module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/hug/, (msg) => {
    const chatId = msg.chat.id;

    try {
      sendWithTyping(bot, chatId, "Sending you a big virtual hug! 🤗❤️", 2000);
      setTimeout(() => {
        bot.sendAnimation(
          chatId,
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmxvMDR1dXBlaHJ2cmNpZzlxeWkzN3BxZHRoM2plMWNnZjZ2eWJudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lF3EunMA9XpIY/giphy.gif",
        );
      }, 4000);
    } catch (error) {
      console.error("Error sending hug:", error);
      bot.sendMessage(
        chatId,
        "Sorry, something went wrong while sending the hug.",
      );
    }
  });
};
