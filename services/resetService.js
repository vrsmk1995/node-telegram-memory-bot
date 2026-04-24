const sendWithTyping = require("../utils/sendWithTyping");
const getUserData = require("../utils/getUserData");
const User = require("../models/User");

async function showResetConfirmation(bot, chatId) {
  await sendWithTyping(bot, chatId, "Opening reset options...", 2000);

  await bot.sendMessage(
    chatId,
    "⚙️ *Reset Options*\n\nChoose what you want to reset:",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🧠 Reset Memories Only",
              callback_data: "reset_memories_only",
            },
          ],
          [
            {
              text: "💔 Reset Full Profile",
              callback_data: "reset_full_profile",
            },
          ],
          [{ text: "❌ Cancel", callback_data: "confirm_reset_no" }],
        ],
      },
    },
  );
}

async function showFullResetConfirmation(bot, chatId) {
  const message = `⚠️ *Final Confirmation*

This will permanently delete:
• Your profile
• Your saved memories
• Your encrypted data

This action cannot be undone 💔`;

  await bot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ Yes, Delete Everything",
            callback_data: "confirm_reset_yes",
          },
          { text: "❌ Cancel", callback_data: "confirm_reset_no" },
        ],
      ],
    },
  });
}

async function handleResetMemories(bot, chatId) {
  try {
    const user = await getUserData(chatId);

    if (!user) {
      await bot.sendMessage(
        chatId,
        "❌ No user profile found. Please use /start first ❤️",
      );
      return;
    }
    const hashMemory =
      user.memory &&
      (user.memory.firstMeet ||
        user.memory.firstChat ||
        user.memory.specialMoment ||
        user.memory.photoUrl ||
        user.memory.gifUrl);
    if (!hashMemory) {
      await bot.sendMessage(
        chatId,
        "⚠️ No memories found to reset. use /setupmemory to create your special moments here ❤️",
      );
      return;
    }
    user.memory = {
      firstMeet: "",
      firstChat: "",
      specialMoment: "",
      photoUrl: "",
      gifUrl: "",
    };
    await user.save();
    await bot.sendMessage(
      chatId,
      "✅ Your memories have been reset. You can create new ones using /setupmemory ❤️",
    );
  } catch (error) {
    console.error("Error resetting memories for chatId:", chatId, error);
    await bot.sendMessage(
      chatId,
      "❌ Something went wrong while resetting your memories. Please try again.",
    );
  }
}

async function handleResetConfirm(bot, chatId, userStates = {}) {
  try {
    await User.deleteOne({ chatId });

    if (userStates && userStates[chatId]) {
      delete userStates[chatId];
    }

    await bot.sendMessage(
      chatId,
      `✅ *Your Love Bot profile and memories have been fully reset!*

You can now start fresh anytime 💖`,
      {
        parse_mode: "Markdown",
      },
    );
  } catch (error) {
    console.error("Full reset error:", error);
    await bot.sendMessage(
      chatId,
      "❌ Something went wrong while resetting your data. Please try again.",
    );
  }
}

async function handleResetCancel(bot, chatId) {
  await bot.sendMessage(
    chatId,
    "👍 Reset cancelled. Your memories are safe 💕",
  );
}

module.exports = {
  showResetConfirmation,
  showFullResetConfirmation,
  handleResetMemories,
  handleResetConfirm,
  handleResetCancel,
};
