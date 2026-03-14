const updateUserData = require("../utils/updateUserData");

const setupStep = {};

module.exports = function (bot) {
  // Start full memory setup
  bot.onText(/\/setupmemory/i, (msg) => {
    const chatId = msg.chat.id;

    setupStep[chatId] = { step: 1 };

    console.log("SetupMemory started for", chatId);

    bot.sendMessage(
      chatId,
      "❤️ Let's set up your full memory journey!\n\nWhen did you first meet?",
    );
  });

  // Handle text steps
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) return;
    if (msg.text.startsWith("/")) return;
    if (!setupStep[chatId]) return;

    const current = setupStep[chatId];

    console.log(
      "SetupMemory TEXT step:",
      current.step,
      "| ChatId:",
      chatId,
      "| Text:",
      msg.text,
    );

    try {
      // Step 1: first meet
      if (current.step === 1) {
        updateUserData(chatId, "firstMeet", msg.text);
        current.step = 2;

        bot.sendMessage(chatId, "💬 Nice! When did you first chat?");
      }

      // Step 2: first chat
      else if (current.step === 2) {
        updateUserData(chatId, "firstChat", msg.text);
        current.step = 3;

        bot.sendMessage(chatId, "✨ Beautiful! Tell me your special moment.");
      }

      // Step 3: special moment
      else if (current.step === 3) {
        updateUserData(chatId, "specialMoment", msg.text);
        current.step = 4;

        bot.sendMessage(
          chatId,
          "📸 Great! Now please upload your memory photo (JPG/PNG).",
        );
      }
    } catch (err) {
      console.error("SetupMemory text error:", err);
      bot.sendMessage(chatId, "Something went wrong while saving text memory.");
    }
  });

  // Handle photo step
  bot.on("photo", (msg) => {
    const chatId = msg.chat.id;

    if (!setupStep[chatId]) return;
    if (setupStep[chatId].step !== 4) return;

    try {
      const photo = msg.photo[msg.photo.length - 1]; // highest resolution
      const fileId = photo.file_id;

      updateUserData(chatId, "photoUrl", fileId);

      setupStep[chatId].step = 5;

      console.log("SetupMemory PHOTO saved for", chatId, "| fileId:", fileId);

      bot.sendMessage(chatId, "🎞 Awesome! Now please upload your memory GIF.");
    } catch (err) {
      console.error("SetupMemory photo error:", err);
      bot.sendMessage(chatId, "Failed to save memory photo. Please try again.");
    }
  });

  // Handle GIF step
  bot.on("animation", (msg) => {
    const chatId = msg.chat.id;

    if (!setupStep[chatId]) return;
    if (setupStep[chatId].step !== 5) return;

    try {
      const fileId = msg.animation.file_id;

      updateUserData(chatId, "gifUrl", fileId);

      console.log("SetupMemory GIF saved for", chatId, "| fileId:", fileId);

      delete setupStep[chatId];

      bot.sendMessage(
        chatId,
        "Your full memory setup is complete ❤️\n\nUse /memory to see your beautiful memories.",
      );
    } catch (err) {
      console.error("SetupMemory GIF error:", err);
      bot.sendMessage(chatId, "Failed to save memory GIF. Please try again.");
    }
  });
};
