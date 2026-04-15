const fs = require("fs");
const path = require("path");
const sendWithTyping = require("../utils/sendWithTyping");
const getUserData = require("../utils/userData");

const USERS_DIR = path.join(__dirname, "..", "data", "users");

async function showResetConfirmation(bot, chatId) {
  await sendWithTyping(bot, chatId, "Opening reset options...", 700);

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
    const user = getUserData(chatId);

    if (!user) {
      await bot.sendMessage(
        chatId,
        "❌ No user profile found. Please use /start first ❤️",
      );
      return;
    }

    if (!user.memory) {
      await bot.sendMessage(
        chatId,
        "ℹ️ No saved memories found yet. Use /setupmemory to create special memories ❤️",
      );
      return;
    }

    // Safer for encrypted storage: remove whole memory object
    delete user.memory;

    const userFile = path.join(USERS_DIR, `${chatId}.json`);
    fs.writeFileSync(userFile, JSON.stringify(user, null, 2), "utf8");

    await bot.sendMessage(
      chatId,
      "🧠 *Your memories have been reset successfully!*\n\nYour profile is still safe 💖",
      {
        parse_mode: "Markdown",
      },
    );
  } catch (error) {
    console.error("Reset memories error:", error);
    await bot.sendMessage(
      chatId,
      "❌ Failed to reset memories. Please try again.",
    );
  }
}

async function handleResetConfirm(bot, chatId, userStates = {}) {
  try {
    const userFile = path.join(USERS_DIR, `${chatId}.json`);

    if (fs.existsSync(userFile)) {
      fs.unlinkSync(userFile);
    }

    // Clear temporary in-memory flow state
    if (userStates && userStates[chatId]) {
      delete userStates[chatId];
    }

    await bot.sendMessage(
      chatId,
      `✅ *Your Love Bot profile and memories have been fully reset!*

You can now start fresh anytime 💖`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "✨ Start Again", callback_data: "signup" }],
          ],
        },
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
