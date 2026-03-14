const getUserData = require("../utils/userData");

module.exports = function (bot, sendWithTyping) {
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
      switch (data) {
        case "love": {
          await sendWithTyping(
            bot,
            chatId,
            "You are the most special person in my life ❤️",
            1500,
          );
          break;
        }

        case "surprise": {
          const surprises = [
            "You are my favorite surprise every day ❤️",
            "You are my happy place 😊❤️",
            "You make my world more beautiful 🌍❤️",
            "You are the reason behind my smile 😘",
            "Even on bad days, thinking of you makes everything better 💕",
          ];

          const randomMessage =
            surprises[Math.floor(Math.random() * surprises.length)];

          await sendWithTyping(
            bot,
            chatId,
            `🎁 Surprise for you:\n\n${randomMessage}`,
            1500,
          );
          break;
        }

        case "memory": {
          const user = getUserData(chatId);

          const memory = user.memory || {
            firstMeet: "Not set",
            firstChat: "Not set",
            specialMoment: "Not set",
            photoUrl: "",
            gifUrl: "",
          };

          if (
            memory.firstMeet === "Not set" &&
            memory.firstChat === "Not set" &&
            memory.specialMoment === "Not set"
          ) {
            await bot.sendMessage(
              chatId,
              "It looks like you haven't set up your memories yet. Please use /setupmemory to create your special moments together ❤️",
            );
            break;
          }

          const message = `Our Memories ❤️

First Meet: ${memory.firstMeet}
First Chat: ${memory.firstChat}
Special Moment: ${memory.specialMoment}`;

          await sendWithTyping(bot, chatId, message, 1500);

          if (memory.photoUrl) {
            setTimeout(async () => {
              try {
                await bot.sendChatAction(chatId, "upload_photo");
                await bot.sendPhoto(chatId, memory.photoUrl, {
                  caption: "A special moment we captured together 📸",
                });
              } catch (err) {
                console.error("Photo send error:", err.message);
              }
            }, 2000);
          }

          if (memory.gifUrl) {
            setTimeout(async () => {
              try {
                await bot.sendChatAction(chatId, "upload_document");
                await bot.sendAnimation(chatId, memory.gifUrl, {
                  caption: "A fun memory we shared 🎉",
                });
              } catch (err) {
                console.error("GIF send error:", err.message);
              }
            }, 4500);
          }
          break;
        }

        case "help": {
          await bot.sendMessage(
            chatId,
            `✨ Available Commands ✨

/start
/help
/love
/surprise
/memory
/setupmemory
/reset
/reasons
/lovecode`,
          );
          break;
        }

        case "reasons": {
          await bot.sendMessage(chatId, "Use /reasons ❤️");
          break;
        }

        case "lovecode": {
          await bot.sendMessage(chatId, "Use /lovecode 🔢");
          break;
        }

        case "reset": {
          await bot.sendMessage(
            chatId,
            "Please type /reset to reset your profile 🔄",
          );
          break;
        }

        default:
          break;
      }

      await bot.answerCallbackQuery(query.id);
    } catch (err) {
      console.error("Inline button error:", err);
      await bot.answerCallbackQuery(query.id, {
        text: "Something went wrong!",
      });
    }
  });
};
