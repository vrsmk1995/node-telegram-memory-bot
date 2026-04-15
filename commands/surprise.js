const requireSignup = require("../utils/requireSignUp");

module.exports = function (bot, sendWithTyping) {
  const surprises = [
    "Surprise! You are amazing just the way you are! 🌟",
    "Here's a little surprise for you: You are loved and appreciated! ❤️",
    "Surprise! You have a heart of gold and a smile that lights up the world! ✨",
    "Here's a surprise: You are the reason someone smiles every day! 😊",
    "Surprise! Your kindness and love make the world a better place! 🌍❤️",
    "I was just thinking about you ❤️",
    "Hope your day is going amazing 😘",
    "You mean a lot to me 💕",
    "Sending you virtual hugs 🤗",
    "Just a reminder that I love you 💖",
  ];
  bot.onText(/\/surprise/, (msg) => {
    const chatId = msg.chat.id;
    if (!requireSignup(bot, chatId)) return;

    const randomSurprise =
      surprises[Math.floor(Math.random() * surprises.length)];
    sendWithTyping(bot, chatId, randomSurprise, 2000);
  });
};
