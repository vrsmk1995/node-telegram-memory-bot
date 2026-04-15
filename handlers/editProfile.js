const updateProfileData = require("../utils/updateProfileData");
const getUserData = require("../utils/userData");
const getProfileData = require("../utils/getProfileData");
const isProfileComplete = require("../utils/isProfileComplete");
const sendMainMenu = require("../utils/sendMainMenu");
const { isValidDOB, clearSignupStep } = require("../services/signupService");
const { setupStep } = require("../state/setupMemoryState");
const { editProfileStep } = require("../state/editProfileState");

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function normalizePhone(phone) {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

  // Convert +91xxxxxxxxxx or 91xxxxxxxxxx -> xxxxxxxxxx
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

function formatGender(text) {
  const normalized = text.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function clearEditProfileFlow(chatId) {
  if (editProfileStep[chatId]) {
    delete editProfileStep[chatId];
  }
}

async function showEditProfileMenu(bot, chatId) {
  clearSignupStep(chatId);

  if (setupStep[chatId]) {
    delete setupStep[chatId];
  }

  const profile = getProfileData(chatId);

  if (!profile) {
    await bot.sendMessage(chatId, "❌ Could not load your profile.");
    return;
  }

  await bot.sendMessage(
    chatId,
    `✏️ *Edit Profile*

Current Details:
• Name: ${profile.name}
• DOB: ${profile.dob}
• Age: ${profile.age}
• Gender: ${profile.gender}
• Phone: ${profile.phoneMasked || "Not provided"}

Choose what you want to update:`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✏️ Update Name", callback_data: "edit_name" }],
          [{ text: "📅 Update DOB", callback_data: "edit_dob" }],
          [{ text: "⚧️ Update Gender", callback_data: "edit_gender" }],
          [{ text: "📱 Update Phone", callback_data: "edit_phone" }],
          [{ text: "❌ Cancel", callback_data: "edit_cancel" }],
        ],
      },
    },
  );
}

function editProfileHandler(bot, sendWithTyping) {
  // =========================
  // /editprofile command
  // =========================
  bot.onText(/\/editprofile/i, async (msg) => {
    const chatId = msg.chat.id;

    if (!isProfileComplete(chatId)) {
      await bot.sendMessage(
        chatId,
        "⚠️ Please complete signup first using /signup ❤️",
      );
      return;
    }

    // Clear conflicting flows before opening edit menu
    clearSignupStep(chatId);

    if (setupStep[chatId]) {
      delete setupStep[chatId];
    }

    clearEditProfileFlow(chatId);

    await showEditProfileMenu(bot, chatId);
  });

  // =========================
  // Handle text messages for edit flow
  // =========================
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (!editProfileStep[chatId]) return;
    if (!msg.text) return;
    if (msg.text.startsWith("/")) return;

    let current = editProfileStep[chatId];
    const text = msg.text.trim();

    // Auto-repair old/wrong shape if any
    if (typeof current === "string") {
      editProfileStep[chatId] = { field: current };
      current = editProfileStep[chatId];
    } else if (current && current.step && !current.field) {
      editProfileStep[chatId] = { field: current.step };
      current = editProfileStep[chatId];
    }

    try {
      switch (current.field) {
        case "name": {
          if (text.length < 2) {
            await bot.sendMessage(
              chatId,
              "⚠️ Please enter a valid name (minimum 2 characters).",
            );
            return;
          }

          updateProfileData(chatId, "name", text);

          clearEditProfileFlow(chatId);

          await sendWithTyping(
            bot,
            chatId,
            "✅ Your name has been updated successfully ❤️",
            900,
          );

          const user = getUserData(chatId);
          await sendMainMenu(bot, chatId, user?.firstName || "there");
          return;
        }

        case "dob": {
          if (!isValidDOB(text)) {
            await bot.sendMessage(
              chatId,
              "⚠️ Invalid date format.\nPlease enter DOB as DD-MM-YYYY.\n\nExample: 14-08-1995",
            );
            return;
          }

          updateProfileData(chatId, "dob", text);

          clearEditProfileFlow(chatId);

          await sendWithTyping(
            bot,
            chatId,
            "✅ Your Date of Birth has been updated successfully ❤️",
            900,
          );

          const user = getUserData(chatId);
          await sendMainMenu(bot, chatId, user?.firstName || "there");
          return;
        }

        case "gender": {
          const normalized = text.toLowerCase();

          if (!["male", "female", "other"].includes(normalized)) {
            await bot.sendMessage(
              chatId,
              "⚠️ Please type exactly:\n\nMale / Female / Other",
            );
            return;
          }

          updateProfileData(chatId, "gender", formatGender(text));

          clearEditProfileFlow(chatId);

          await sendWithTyping(
            bot,
            chatId,
            "✅ Your gender has been updated successfully ❤️",
            900,
          );

          const user = getUserData(chatId);
          await sendMainMenu(bot, chatId, user?.firstName || "there");
          return;
        }

        case "phone": {
          if (text.toLowerCase() === "skip") {
            updateProfileData(chatId, "phone", "");

            clearEditProfileFlow(chatId);

            await bot.sendMessage(
              chatId,
              "✅ Your phone number has been removed successfully ❤️",
              {
                reply_markup: {
                  remove_keyboard: true,
                },
              },
            );

            const user = getUserData(chatId);
            await sendMainMenu(bot, chatId, user?.firstName || "there");
            return;
          }

          const phone = normalizePhone(text);

          if (!isValidPhone(phone)) {
            await bot.sendMessage(
              chatId,
              "⚠️ Please either:\n\n• Share your phone using the button\n• OR type a valid 10-digit number\n• OR type Skip to remove/skip phone",
              {
                reply_markup: {
                  keyboard: [
                    [{ text: "📱 Share Phone Number", request_contact: true }],
                    [{ text: "Skip" }],
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true,
                },
              },
            );
            return;
          }

          updateProfileData(chatId, "phone", phone);

          clearEditProfileFlow(chatId);

          await bot.sendMessage(
            chatId,
            "✅ Your phone number has been updated successfully ❤️",
            {
              reply_markup: {
                remove_keyboard: true,
              },
            },
          );

          const user = getUserData(chatId);
          await sendMainMenu(bot, chatId, user?.firstName || "there");
          return;
        }

        default: {
          clearEditProfileFlow(chatId);

          await bot.sendMessage(
            chatId,
            "⚠️ Edit profile flow reset. Please use /editprofile again.",
            {
              reply_markup: {
                remove_keyboard: true,
              },
            },
          );
          return;
        }
      }
    } catch (err) {
      console.error("Edit profile text error:", err);

      clearEditProfileFlow(chatId);

      await bot.sendMessage(
        chatId,
        "❌ Something went wrong while updating profile.",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        },
      );
    }
  });

  // =========================
  // Handle contact share for phone update
  // =========================
  bot.on("contact", async (msg) => {
    const chatId = msg.chat.id;

    if (!editProfileStep[chatId]) return;

    let current = editProfileStep[chatId];

    // Auto-repair old/wrong shape if any
    if (typeof current === "string") {
      editProfileStep[chatId] = { field: current };
      current = editProfileStep[chatId];
    } else if (current && current.step && !current.field) {
      editProfileStep[chatId] = { field: current.step };
      current = editProfileStep[chatId];
    }

    if (current.field !== "phone") return;

    try {
      const contact = msg.contact;

      // Ensure user shares their own number
      if (contact.user_id && contact.user_id !== msg.from.id) {
        await bot.sendMessage(
          chatId,
          "⚠️ Please share your own phone number using the button.",
        );
        return;
      }

      const phone = normalizePhone(contact.phone_number || "");

      if (!isValidPhone(phone)) {
        await bot.sendMessage(
          chatId,
          "⚠️ Invalid phone number received. Please try again or type Skip.",
          {
            reply_markup: {
              keyboard: [
                [{ text: "📱 Share Phone Number", request_contact: true }],
                [{ text: "Skip" }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
        return;
      }

      updateProfileData(chatId, "phone", phone);

      clearEditProfileFlow(chatId);

      await bot.sendMessage(
        chatId,
        "✅ Your phone number has been updated successfully ❤️",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        },
      );

      const user = getUserData(chatId);
      await sendMainMenu(bot, chatId, user?.firstName || "there");
    } catch (err) {
      console.error("Edit profile contact error:", err);

      clearEditProfileFlow(chatId);

      await bot.sendMessage(chatId, "❌ Failed to update your phone number.", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    }
  });
}

module.exports = editProfileHandler;
module.exports.showEditProfileMenu = showEditProfileMenu;

