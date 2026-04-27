const requireSignup = require("../utils/requireSignUp");
const updateUserData = require("../utils/updateUserData");
const { clearSignupStep } = require("../services/signupService");
const { editProfileStep } = require("../state/editProfileState");
const { setupStep } = require("../state/setupMemoryState");

function setupmemoryHandler(bot) {
  // Start full memory setup
  bot.onText(/\/setupmemory/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      if (!(await requireSignup(bot, chatId))) return;

      // Clear conflicting flows
      clearSignupStep(chatId);

      if (editProfileStep[chatId]) {
        delete editProfileStep[chatId];
      }

      // Reset any old memory flow before starting fresh
      delete setupStep[chatId];
      setupStep[chatId] = { step: 1 };

      console.log("SetupMemory started for", chatId);

      await bot.sendMessage(
        chatId,
        "❤️ Let's set up your full memory journey!\n\nWhen did you first meet?",
      );
    } catch (err) {
      console.error("SetupMemory start error:", err);
      await bot.sendMessage(chatId, "Failed to start memory setup.");
    }
  });

  // Handle text steps
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) return;
    if (msg.text.startsWith("/")) return;
    if (!setupStep[chatId]) return;

    const current = setupStep[chatId];
    const text = msg.text.trim();

    console.log(
      "SetupMemory TEXT step:",
      current.step,
      "| ChatId:",
      chatId,
      "| Text:",
      text,
    );

    try {
      // Step 1: first meet
      if (current.step === 1) {
        await updateUserData(chatId, "firstMeet", text);
        current.step = 2;

        await bot.sendMessage(chatId, "💬 Nice! When did you first chat?");
        return;
      }

      // Step 2: first chat
      else if (current.step === 2) {
        await updateUserData(chatId, "firstChat", text);
        current.step = 3;

        await bot.sendMessage(
          chatId,
          "✨ Beautiful! Tell me your special moment.",
        );
        return;
      }

      // Step 3: special moment
      else if (current.step === 3) {
        await updateUserData(chatId, "specialMoment", text);
        current.step = 4;

        await bot.sendMessage(
          chatId,
          "📸 Great! Now please upload your memory photo (JPG/PNG).\n\nOr type *Skip* to continue without photo.",
          { parse_mode: "Markdown" },
        );
        return;
      }

      // Step 4: photo skip only if user typed Skip
      else if (current.step === 4) {
        if (text.toLowerCase() === "skip") {
          await updateUserData(chatId, "photoUrl", "");
          current.step = 5;

          await bot.sendMessage(
            chatId,
            "🎞 Great! Now please upload your memory GIF.\n\nOr type *Skip* to finish without GIF.",
            { parse_mode: "Markdown" },
          );
          return;
        }

        await bot.sendMessage(
          chatId,
          "⚠️ Please either:\n\n• Upload a photo\nOR\n• Type *Skip*",
          { parse_mode: "Markdown" },
        );
        return;
      }

      // Step 5: gif skip only if user typed Skip
      else if (current.step === 5) {
        if (text.toLowerCase() === "skip") {
          await updateUserData(chatId, "gifUrl", "");
          delete setupStep[chatId];

          await bot.sendMessage(
            chatId,
            "✅ Your full memory setup is complete ❤️\n\nUse /memory to see your beautiful memories.",
          );
          return;
        }

        await bot.sendMessage(
          chatId,
          "⚠️ Please either:\n\n• Upload a GIF\nOR\n• Type *Skip*",
          { parse_mode: "Markdown" },
        );
        return;
      }
    } catch (err) {
      console.error("SetupMemory text error:", err);
      await bot.sendMessage(
        chatId,
        "Something went wrong while saving text memory.",
      );
    }
  });

  // Handle photo step
  bot.on("photo", async (msg) => {
    const chatId = msg.chat.id;

    if (!setupStep[chatId]) return;
    if (setupStep[chatId].step !== 4) return;

    try {
      const photo = msg.photo[msg.photo.length - 1];
      const fileId = photo.file_id;

      await updateUserData(chatId, "photoUrl", fileId);
      setupStep[chatId].step = 5;

      console.log("SetupMemory PHOTO saved for", chatId, "| fileId:", fileId);

      await bot.sendMessage(
        chatId,
        "🎞 Awesome! Now please upload your memory GIF.\n\nOr type *Skip* to finish without GIF.",
        { parse_mode: "Markdown" },
      );
    } catch (err) {
      console.error("SetupMemory photo error:", err);
      await bot.sendMessage(
        chatId,
        "Failed to save memory photo. Please try again.",
      );
    }
  });

  // Handle GIF step
  bot.on("animation", async (msg) => {
    const chatId = msg.chat.id;

    if (!setupStep[chatId]) return;
    if (setupStep[chatId].step !== 5) return;

    try {
      const fileId = msg.animation.file_id;

      await updateUserData(chatId, "gifUrl", fileId);

      console.log("SetupMemory GIF saved for", chatId, "| fileId:", fileId);

      delete setupStep[chatId];

      await bot.sendMessage(
        chatId,
        "✅ Your full memory setup is complete ❤️\n\nUse /memory to see your beautiful memories.",
      );
    } catch (err) {
      console.error("SetupMemory GIF error:", err);
      await bot.sendMessage(
        chatId,
        "Failed to save memory GIF. Please try again.",
      );
    }
  });
}

module.exports = setupmemoryHandler;
