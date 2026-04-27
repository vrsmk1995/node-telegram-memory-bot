const getUserData = require("../utils/getUserData");
const { decrypt } = require("../utils/cryptoHelper");
const requireSignup = require("../utils/requireSignUp");
const { signupStep } = require("../services/signupService");
const { setupStep } = require("../state/setupMemoryState");
const { editProfileStep } = require("../state/editProfileState");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/memory/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      if (!(await requireSignup(bot, chatId))) return;

      // Block while another flow is active
      if (signupStep[chatId] || setupStep[chatId] || editProfileStep[chatId]) {
        await bot.sendMessage(
          chatId,
          "⚠️ Please complete your current flow first before using /memory ❤️",
        );
        return;
      }

      const user = await getUserData(chatId);

      if (!user) {
        await bot.sendMessage(chatId, "Please use /start first ❤️");
        return;
      }

      const memory = user.memory || {};

      const firstMeet = memory.firstMeet
        ? decrypt(memory.firstMeet)
        : "Not set";
      const firstChat = memory.firstChat
        ? decrypt(memory.firstChat)
        : "Not set";
      const specialMoment = memory.specialMoment
        ? decrypt(memory.specialMoment)
        : "Not set";

      const hasPhoto = !!memory.photoUrl;
      const hasGif = !!memory.gifUrl;

      if (
        firstMeet === "Not set" &&
        firstChat === "Not set" &&
        specialMoment === "Not set" &&
        !hasPhoto &&
        !hasGif
      ) {
        await bot.sendMessage(
          chatId,
          "It looks like you haven't set up your memories yet. Please use /setupmemory ❤️",
        );
        return;
      }

      const message = `Our Memories ❤️

First Meet: ${firstMeet}
First Chat: ${firstChat}
Special Moment: ${specialMoment}`;

      await sendWithTyping(bot, chatId, message, 1500);

      if (memory.photoUrl) {
        setTimeout(async () => {
          try {
            await bot.sendPhoto(chatId, memory.photoUrl, {
              caption: "A special moment we captured together 📸",
            });
          } catch (err) {
            console.error("Memory photo send error:", err.message);
          }
        }, 2000);
      }

      if (memory.gifUrl) {
        setTimeout(async () => {
          try {
            await bot.sendAnimation(chatId, memory.gifUrl, {
              caption: "A fun memory we shared 🎉",
            });
          } catch (err) {
            console.error("Memory GIF send error:", err.message);
          }
        }, 4500);
      }
    } catch (err) {
      console.error("Memory display error:", err);
      await bot.sendMessage(chatId, "Failed to load memory.");
    }
  });
};
