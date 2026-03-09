const fs = require("fs");
const path = require("path");
const getUserData = require("../utils/userData");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/memory/, async (msg) => {
    const chatId = msg.chat.id;

   
    const user = getUserData(chatId);

    const memory = user.memory;

    const message = `Our Memories ❤️

First Meet: ${memory.firstMeet}
First Chat: ${memory.firstChat}
Special Moment: ${memory.specialMoment}`;

    try {
      await sendWithTyping(bot, chatId, message, 2000);

      if (memory.photoUrl) {
        setTimeout(async () => {
          await bot.sendChatAction(chatId, "upload_photo");
          bot.sendPhoto(chatId, memory.photoUrl, {
            caption: "A special moment we captured together 📸",
          });
        }, 2500);
      }

      if (memory.gifUrl) {
        setTimeout(async () => {
           await bot.sendChatAction(chatId, "upload_document");
          bot.sendAnimation(chatId, memory.gifUrl, {
            caption: "A fun memory we shared 🎉",
          });
        }, 6000);
      }
    } catch (err) {
      console.error("Memory display error:", err);
      bot.sendMessage(chatId, "Failed to load memory.");
    }
  });
};
