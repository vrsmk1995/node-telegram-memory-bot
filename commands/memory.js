const fs = require("fs");
const path = require("path");
const getUserData = require("../utils/userData");
const { decrypt } = require("../utils/cryptoHelper");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/memory/, async (msg) => {
    const chatId = msg.chat.id;

    const filePath = path.join(__dirname, "../data/users", `${chatId}`);
    if (!fs.existsSync(filePath)) {
      // bot.sendMessage(chatId, "please run /start first");
      return;
    }

    const user = getUserData(chatId);

    const memory = user.memory || {};
    const firstMeet = memory.firstMeet ? decrypt(memory.firstMeet) : "Not set";
    const firstChat = memory.firstChat ? decrypt(memory.firstChat) : "Not set";
    const specialMoment = memory.specialMoment
      ? decrypt(memory.specialMoment)
      : "Not set";

    const message = `Our Memories ❤️

First Meet: ${firstMeet}
First Chat: ${firstChat}
Special Moment: ${specialMoment}`;

    try {
      await sendWithTyping(bot, chatId, message, 2000);

      if (memory.photoUrl) {
        setTimeout(async () => {
          // await bot.sendChatAction(chatId, "upload_photo");
          bot.sendPhoto(chatId, memory.photoUrl, {
            caption: "A special moment we captured together 📸",
          });
        }, 2500);
      }

      if (memory.gifUrl) {
        setTimeout(async () => {
          // await bot.sendChatAction(chatId, "upload_document");
          bot.sendAnimation(chatId, memory.gifUrl, {
            caption: "A fun memory we shared 🎉",
          });
        }, 4500);
      }
    } catch (err) {
      console.error("Memory display error:", err);
      bot.sendMessage(chatId, "Failed to load memory.");
    }
  });
};
