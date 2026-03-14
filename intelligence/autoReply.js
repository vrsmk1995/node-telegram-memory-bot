module.exports = function (bot, sendWithTyping) {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) return;
    const text = msg.text.toLowerCase();
    if (text.startsWith("/")) return; // ignore commands
    if (
      text.includes("i love you") ||
      text.includes("love you") ||
      text.includes("i like you")
    ) {
      sendWithTyping(bot, chatId, "I love you too ❤️", 2000);
    } else if (text.includes("miss you") || text.includes("miss u")) {
      sendWithTyping(bot, chatId, "I miss you too ❤️", 2000);
    } else if (text.includes("good morning") || text.includes("gm")) {
      sendWithTyping(bot, chatId, "Good morning my love! ☀️❤️", 2000);
    } else if (text.includes("good night") || text.includes("gn")) {
      sendWithTyping(bot, chatId, "Good night my love! 🌙❤️", 2000);
    } else if (text.includes("how are you") || text.includes("how r u")) {
      sendWithTyping(
        bot,
        chatId,
        "I'm doing great, especially when I talk to you! 😊❤️",
        2000,
      );
    } else if (text.includes("i'm sad") || text.includes("i am sad")) {
      sendWithTyping(
        bot,
        chatId,
        "I'm here for you. Remember, tough times don't last, but tough people do. ❤️",
        2000,
      );
    } else if (text.includes("i'm happy") || text.includes("i am happy")) {
      sendWithTyping(
        bot,
        chatId,
        "That's wonderful to hear! Your happiness means the world to me! 😊❤️",
        2000,
      );
    } else if (text.includes("i'm tired") || text.includes("i am tired")) {
      sendWithTyping(
        bot,
        chatId,
        "Make sure to get some rest, my love. Your well-being is important to me! 😴❤️",
      );
    } else if (text.includes("i'm bored") || text.includes("i am bored")) {
      sendWithTyping(
        bot,
        chatId,
        "Let's find something fun to do together! Maybe we can chat or plan a surprise for each other! 🎉❤️",
      );
    } else if (text.includes("iam hungry") || text.includes("i'm hungry")) {
      sendWithTyping(
        bot,
        chatId,
        "How about we cook something together or order your favorite food? 🍕❤️",
      );
    } else if (
      text.includes("i'm stressed") ||
      text.includes("i am stressed")
    ) {
      sendWithTyping(
        bot,
        chatId,
        "Take a deep breath, my love. Remember, I'm here for you and we can get through anything together! 💪❤️",
      );
    } else if (text.includes("i'm excited") || text.includes("i am excited")) {
      sendWithTyping(
        bot,
        chatId,
        "That's fantastic! I'm excited too! Let's make some amazing memories together! 🎉❤️",
      );
    } else if (text.includes("i'm sorry") || text.includes("i am sorry")) {
      sendWithTyping(
        bot,
        chatId,
        "It's okay, my love. We all make mistakes. What matters is that we learn and grow together. I forgive you ❤️",
      );
    } else if (
      text.includes("i'm grateful") ||
      text.includes("i am grateful")
    ) {
      sendWithTyping(
        bot,
        chatId,
        "I'm grateful for you too! You bring so much joy and love into my life! 🙏❤️",
      );
    } else if (text.includes("i'm proud") || text.includes("i am proud")) {
      sendWithTyping(
        bot,
        chatId,
        "You should be proud! You are amazing and I am so proud of you! 🌟❤️",
      );
    } else if (text.includes("i'm lucky") || text.includes("i am lucky")) {
      sendWithTyping(
        bot,
        chatId,
        "We are both lucky to have each other! I cherish every moment with you! 🍀❤️",
      );
    } else if (text.includes("i'm blessed") || text.includes("i am blessed")) {
      sendWithTyping(
        bot,
        chatId,
        "I feel blessed to have you in my life! You are a true blessing! 🙏❤️",
      );
    } else if (text.includes("i'm in love") || text.includes("i am in love")) {
      sendWithTyping(
        bot,
        chatId,
        "I am in love with you too! You are the love of my life! ❤️",
      );
    } else if (text.includes("i'm yours") || text.includes("i am yours")) {
      sendWithTyping(
        bot,
        chatId,
        "I am yours too! You have my heart and soul! ❤️",
      );
    } else if (
      text.includes("i'm thinking of you") ||
      text.includes("i am thinking of you")
    ) {
      sendWithTyping(
        bot,
        chatId,
        "I am thinking of you too! You are always on my mind! 💭❤️",
      );
    } else if (
      text.includes("i'm here for you") ||
      text.includes("i am here for you")
    ) {
      sendWithTyping(
        bot,
        chatId,
        "I know you are, and I am here for you too! We can support each other through anything! 🤗❤️",
      );
    } else if (/^(hi|hai|hello|hey)\b/.test(text)) {
      sendWithTyping(
        bot,
        chatId,
        "Hello my friend! How are you today? 😊❤️",
        2000,
      );
    } else if (/^(good morning|gm)\b/.test(text)) {
      sendWithTyping(
        bot,
        chatId,
        "Good morning my love! I hope you have a wonderful day! ☀️❤️",
        2000,
      );
    }
  });
};
