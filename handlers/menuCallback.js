const User = require("../models/User");
const getUserData = require("../utils/getUserData");
const getProfileData = require("../utils/getProfileData");
const { decrypt } = require("../utils/cryptoHelper");
const isProfileComplete = require("../utils/isProfileComplete");
const sendMainMenu = require("../utils/sendMainMenu");
const {
  startSignupFlow,
  clearSignupStep,
} = require("../services/signupService");
const { showEditProfileMenu } = require("./editProfile");
const { editProfileStep } = require("../state/editProfileState");
const { setupStep } = require("../state/setupMemoryState");
const {
  showResetConfirmation,
  showFullResetConfirmation,
  handleResetMemories,
  handleResetConfirm,
  handleResetCancel,
} = require("../services/resetService");

const publicActions = [
  "signup",
  "profile",
  "help",
  "reset",
  "reset_memories_only",
  "reset_full_profile",
  "confirm_reset_yes",
  "confirm_reset_no",

  // Edit profile actions
  "edit_profile",
  "edit_name",
  "edit_dob",
  "edit_gender",
  "edit_phone",
  "edit_cancel",

  // Feature buttons
  "setup_memory",
  "memory",
  "timeline",
  "add_timeline_help",
];

module.exports = function (bot, sendWithTyping, userStates = {}) {
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
      // Block protected buttons before signup
      if (!publicActions.includes(data) && !(await isProfileComplete(chatId))) {
        await bot.answerCallbackQuery(query.id, {
          text: "Please complete signup first ❤️",
          show_alert: false,
        });
        return;
      }

      switch (data) {
        // =========================
        // PUBLIC ACTIONS
        // =========================

        case "signup": {
          const user = await User.findOne({ chatId });

          if (!user) {
            await bot.sendMessage(chatId, "Please use /start first ❤️");
            break;
          }

          if (user.profileCompleted === true || user.profileComleted === true) {
            await bot.sendMessage(
              chatId,
              "✅ Your profile is already completed ❤️",
            );
            break;
          }

          // Clear conflicting flows before starting signup
          clearSignupStep(chatId);

          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          if (editProfileStep[chatId]) {
            delete editProfileStep[chatId];
          }

          await startSignupFlow(bot, chatId);
          break;
        }

        case "profile": {
          const profile = await getProfileData(chatId);

          if (!profile) {
            await bot.sendMessage(chatId, "Please use /start first ❤️");
            break;
          }

          const message = `👤 Your Profile ❤️

Name: ${profile.name || "Not set"}
Date of Birth: ${profile.dob || "Not set"}
Age: ${profile.age || "Not set"}
Gender: ${profile.gender || "Not set"}
Phone: ${profile.phoneMasked || "Not provided"}`;

          await sendWithTyping(bot, chatId, message, 1200);
          break;
        }

        case "edit_profile": {
          clearSignupStep(chatId);

          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          if (editProfileStep[chatId]) {
            delete editProfileStep[chatId];
          }

          await showEditProfileMenu(bot, chatId);
          break;
        }

        case "edit_name": {
          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          clearSignupStep(chatId);
          editProfileStep[chatId] = { field: "name" };

          await bot.sendMessage(chatId, "✏️ Please enter your new name:");
          break;
        }

        case "edit_dob": {
          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          clearSignupStep(chatId);
          editProfileStep[chatId] = { field: "dob" };

          await bot.sendMessage(
            chatId,
            "📅 Please enter your new date of birth in DD-MM-YYYY format.\n\nExample: 14-08-1995",
          );
          break;
        }

        case "edit_gender": {
          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          clearSignupStep(chatId);
          editProfileStep[chatId] = { field: "gender" };

          await bot.sendMessage(
            chatId,
            "⚧️ Please enter your gender:\n\nMale / Female / Other",
          );
          break;
        }

        case "edit_phone": {
          if (setupStep[chatId]) {
            delete setupStep[chatId];
          }

          clearSignupStep(chatId);
          editProfileStep[chatId] = { field: "phone" };

          await bot.sendMessage(
            chatId,
            "📱 Update your phone number:\n\n• Share your phone using the button below\n• OR type a valid 10-digit number\n• OR type Skip to remove/skip phone",
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
          break;
        }

        case "edit_cancel": {
          if (editProfileStep[chatId]) {
            delete editProfileStep[chatId];
          }

          await bot.sendMessage(chatId, "✅ Edit profile cancelled.", {
            reply_markup: {
              remove_keyboard: true,
            },
          });

          const user = await getUserData(chatId);
          const profile = await getProfileData(chatId);

          await sendMainMenu(
            bot,
            chatId,
            profile?.name || user?.firstName || "there",
          );
          break;
        }

        case "help": {
          const profileDone = await isProfileComplete(chatId);

          const helpText = profileDone
            ? `✨ *Love Bot Help* ✨

*Available Commands:*
/start - Open the welcome menu
/help - Show all available commands
/profile - View your saved profile
/editprofile - Update your profile details
/setupmemory - Save or update your memories
/memory - View your saved memories
/addtimeline - Add a timeline memory
/timeline - View your timeline memories
/reset - Reset memories or full profile

💡 *Suggested Flow:*
1. /profile
2. /editprofile (if needed)
3. /setupmemory
4. /memory
5. /addtimeline Title | Date | Note
6. /timeline`
            : `✨ *Love Bot Help* ✨

*Available Commands Before Signup:*
/start - Open the welcome menu
/help - Show available commands
/signup - Complete your profile setup
/reset - Reset your data if needed

⚠️ *Important:*
Complete /signup first to unlock profile, memory, and timeline features ❤️`;

          await bot.sendMessage(chatId, helpText, {
            parse_mode: "Markdown",
          });
          break;
        }

        case "reset": {
          if (editProfileStep[chatId]) {
            delete editProfileStep[chatId];
          }

          await showResetConfirmation(bot, chatId);
          break;
        }

        case "reset_memories_only": {
          await handleResetMemories(bot, chatId);
          break;
        }

        case "reset_full_profile": {
          await showFullResetConfirmation(bot, chatId);
          break;
        }

        case "confirm_reset_yes": {
          await handleResetConfirm(bot, chatId, userStates);
          break;
        }

        case "confirm_reset_no": {
          await handleResetCancel(bot, chatId);

          const user = await getUserData(chatId);
          const profile = await getProfileData(chatId);

          if (user) {
            await sendMainMenu(
              bot,
              chatId,
              profile?.name || user?.firstName || "there",
            );
          }
          break;
        }

        // =========================
        // FEATURE BUTTONS
        // =========================

        case "setup_memory": {
          clearSignupStep(chatId);

          if (editProfileStep[chatId]) {
            delete editProfileStep[chatId];
          }

          delete setupStep[chatId];
          setupStep[chatId] = { step: 1 };

          await bot.sendMessage(
            chatId,
            "❤️ Let's set up your full memory journey!\n\nWhen did you first meet?",
          );
          break;
        }

        case "memory": {
          const user = await getUserData(chatId);

          if (!user || !user.memory) {
            await bot.sendMessage(
              chatId,
              "It looks like you haven't set up your memories yet. Please use /setupmemory ❤️",
            );
            break;
          }

          const memory = user.memory;

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
              "It looks like you haven't set up your memories yet. Please use /setupmemory to create your special moments together ❤️",
            );
            break;
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
                console.error("Photo send error:", err.message);
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
                console.error("GIF send error:", err.message);
              }
            }, 4500);
          }

          break;
        }

        case "timeline": {
          const user = await User.findOne({ chatId });

          if (!user) {
            await bot.sendMessage(chatId, "Please use /start first ❤️");
            break;
          }

          if (!Array.isArray(user.timeline) || user.timeline.length === 0) {
            await bot.sendMessage(
              chatId,
              "📭 No timeline memories yet.\n\nUse /addtimeline to add your first special memory ❤️",
            );
            break;
          }

          const timeline = [...user.timeline].sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
          );

          let message = "📅 *Your Memory Timeline* ❤️\n\n";

          timeline.forEach((item, index) => {
            message += `${index + 1}️⃣ *${item.title || "Untitled Memory"}*\n`;
            message += `📆 ${item.date || "No date"}\n`;
            message += `📝 ${item.note || "No note"}\n\n`;
          });

          await sendWithTyping(bot, chatId, message.trim(), 1200);
          break;
        }

        case "add_timeline_help": {
          await bot.sendMessage(
            chatId,
            "📝 To add a timeline memory, use this format:\n\n/addtimeline Title | Date | Note\n\nExample:\n/addtimeline First Meet | 14-02-2024 | We met for the first time ❤️",
          );
          break;
        }

        default: {
          await bot.sendMessage(chatId, "Unknown action.");
          break;
        }
      }
    } catch (err) {
      console.error("Inline button error:", err);

      try {
        await bot.answerCallbackQuery(query.id, {
          text: "Something went wrong!",
          show_alert: false,
        });
      } catch (e) {}
      return;
    }

    // Always close callback spinner
    try {
      await bot.answerCallbackQuery(query.id);
    } catch (e) {}
  });
};
