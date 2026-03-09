module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/timeline/, (msg) => {
    const chatId = msg.chat.id;

    const timeline = `Relationship Timeline ❤️
    

2022 → First conversation
2023 → Became closer
2024 → Strong bond
2025 → Still growing stronger 💕
2026 → Forever together ❤️`;

    sendWithTyping(bot, chatId, timeline, 2000);
  });
};
