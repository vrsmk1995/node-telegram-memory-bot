const updateProfileData = require("../utils/updateProfileData");
const sendMainMenu = require("../utils/sendMainMenu");
const { editProfileStep } = require("../state/editProfileState");
const { setupStep } = require("../state/setupMemoryState");
const {
  signupStep,
  isValidDOB,
  completeSignup,
  startSignupFlow,
  clearSignupStep,
} = require("../services/signupService");

function isValidGender(text) {
  const normalized = text.toLowerCase();
  return ["male", "female", "other", "skip"].includes(normalized);
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

module.exports = function (bot) {
  // /signup command starts shared signup flow
  bot.onText(/\/signup/i, async (msg) => {
    const chatId = msg.chat.id;

    // Reset any previous signup flow first
    clearSignupStep(chatId);

    // Clear setup memory flow if active
    if (setupStep[chatId]) {
      delete setupStep[chatId];
    }

    // Clear edit profile flow if active
    if (editProfileStep[chatId]) {
      delete editProfileStep[chatId];
    }

    startSignupFlow(bot, chatId);
  });

  // Handle text messages for signup flow
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (!signupStep[chatId]) return;
    if (!msg.text) return;
    if (msg.text.startsWith("/")) return;

    const current = signupStep[chatId];
    const text = msg.text.trim();

    try {
      // Step 1: Name
      if (current.step === 1) {
        if (text.length < 2) {
          await bot.sendMessage(
            chatId,
            "⚠️ Please enter a valid name (minimum 2 characters).",
          );
          return;
        }

        await updateProfileData(chatId, "name", text);
        current.step = 2;

        await bot.sendMessage(
          chatId,
          "📅 Great! Please enter your Date of Birth in DD-MM-YYYY format.\n\nExample: 14-08-1995",
        );
        return;
      }

      // Step 2: DOB
      else if (current.step === 2) {
        if (!isValidDOB(text)) {
          await bot.sendMessage(
            chatId,
            "⚠️ Invalid date format.\nPlease enter DOB as DD-MM-YYYY.\n\nExample: 14-08-1995",
          );
          return;
        }

        await updateProfileData(chatId, "dob", text);

        current.step = 3;

        await bot.sendMessage(
          chatId,
          "⚧️ Please enter your gender:\n\nMale / Female / Other\n\nOr type: Skip",
        );
        return;
      }

      // Step 3: Gender
      else if (current.step === 3) {
        if (!isValidGender(text)) {
          await bot.sendMessage(
            chatId,
            "⚠️ Please type exactly:\n\nMale / Female / Other\n\nOr type: Skip",
          );
          return;
        }

        const gender =
          text.toLowerCase() === "skip"
            ? "Prefer not to say"
            : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

        await updateProfileData(chatId, "gender", gender);
        current.step = 4;

        await bot.sendMessage(
          chatId,
          "📱 Phone number is optional.\n\nYou can:\n• Tap the button below to share your phone number securely\n• OR type Skip to continue without phone",
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

      // Step 4: Optional phone via text skip only
      else if (current.step === 4) {
        if (text.toLowerCase() === "skip") {
          const user = completeSignup(chatId);

          await bot.sendMessage(
            chatId,
            "Signup completed successfully ❤️\n\n🎉 Welcome to Love Bot!\n\nYour profile is now complete. All features are unlocked ✨",
            {
              reply_markup: {
                remove_keyboard: true,
              },
            },
          );

          await sendMainMenu(bot, chatId, user?.firstName || "there");
          return;
        }

        // If user typed random text instead of using contact button or Skip
        await bot.sendMessage(
          chatId,
          "⚠️ Please either:\n\n• Tap 📱 Share Phone Number\nOR\n• Type Skip",
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
    } catch (err) {
      console.error("Signup text error:", err);
      clearSignupStep(chatId);

      await bot.sendMessage(chatId, "❌ Something went wrong during signup.", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    }
  });

  // Handle contact share
  bot.on("contact", async (msg) => {
    const chatId = msg.chat.id;

    if (!signupStep[chatId]) return;
    if (signupStep[chatId].step !== 4) return;

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

      const phone = normalizePhone(contact.phone_number);

      if (!/^[6-9]\d{9}$/.test(phone)) {
        await bot.sendMessage(
          chatId,
          "⚠️ Invalid phone number received. Please try again or tap Skip.",
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

      await updateProfileData(chatId, "phone", phone);

      const user = completeSignup(chatId);

      await bot.sendMessage(
        chatId,
        "Signup completed successfully ❤️\n\n🎉 Welcome to Love Bot!\n\nYour profile is now complete. All features are unlocked ✨",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        },
      );

      await sendMainMenu(bot, chatId, user?.firstName || "there");
    } catch (err) {
      console.error("Signup contact error:", err);
      clearSignupStep(chatId);

      await bot.sendMessage(chatId, "❌ Failed to save your phone number.", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    }
  });
};
