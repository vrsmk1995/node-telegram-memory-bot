const fs = require("fs");
const path = require("path");

const getUserData = require("../utils/userData");
const sendMainMenu = require("../utils/sendMainMenu");
const { encrypt } = require("../utils/cryptoHelper");

const {
  getSignupStep,
  clearSignupStep,
  completeSignup,
  isValidDOB,
} = require("../services/signupService");

const usersDir = path.join(__dirname, "../data/users");

// Separate step state for memory setup
const memoryStep = {};

function saveUser(chatId, user) {
  const filePath = path.join(usersDir, `${chatId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
}

function calculateAge(dob) {
  const [day, month, year] = dob.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function isValidUrl(text) {
  return /^https?:\/\/.+/i.test(text);
}

module.exports = function (bot, sendWithTyping) {
  // =========================
  // COMMAND: /signup
  // =========================
  bot.onText(/\/signup/i, async (msg) => {
    const chatId = msg.chat.id;
    const user = getUserData(chatId);

    if (!user) {
      await bot.sendMessage(chatId, "Please use /start first ❤️");
      return;
    }

    if (user.profileCompleted) {
      await bot.sendMessage(chatId, "✅ Your profile is already completed ❤️");
      return;
    }

    const { startSignupFlow } = require("../services/signupService");
    startSignupFlow(bot, chatId);
  });

  // =========================
  // COMMAND: /setupmemory
  // =========================
  bot.onText(/\/setupmemory/i, async (msg) => {
    const chatId = msg.chat.id;
    const user = getUserData(chatId);

    if (!user) {
      await bot.sendMessage(chatId, "Please use /start first ❤️");
      return;
    }

    if (!user.profileCompleted) {
      await bot.sendMessage(
        chatId,
        "Please complete signup first using /signup ❤️",
      );
      return;
    }

    memoryStep[chatId] = { step: 1 };

    await bot.sendMessage(
      chatId,
      "💖 Let's save your memories!\n\nTell me about your *First Meet*:",
      { parse_mode: "Markdown" },
    );
  });

  // =========================
  // MAIN MESSAGE HANDLER
  // =========================
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ignore commands here (handled separately)
    if (!text || text.startsWith("/")) return;

    try {
      // =========================
      // SIGNUP FLOW
      // =========================
      const signupState = getSignupStep(chatId);

      if (signupState) {
        const user = getUserData(chatId);

        if (!user) {
          await bot.sendMessage(chatId, "Please use /start first ❤️");
          clearSignupStep(chatId);
          return;
        }

        switch (signupState.step) {
          case 1: {
            // Name
            const name = text.trim();

            if (name.length < 2) {
              await bot.sendMessage(
                chatId,
                "Please enter a valid name (at least 2 characters) ❤️",
              );
              return;
            }

            user.profile = user.profile || {};
            user.profile.name = encrypt(name);

            saveUser(chatId, user);

            signupState.step = 2;
            await bot.sendMessage(
              chatId,
              "📅 Enter your Date of Birth in format:\nDD-MM-YYYY\n\nExample: 25-08-2000",
            );
            return;
          }

          case 2: {
            // DOB
            const dob = text.trim();

            if (!isValidDOB(dob)) {
              await bot.sendMessage(
                chatId,
                "❌ Invalid DOB format.\nPlease use DD-MM-YYYY\n\nExample: 25-08-2000",
              );
              return;
            }

            const age = calculateAge(dob);

            if (age < 10 || age > 100) {
              await bot.sendMessage(
                chatId,
                "❌ Please enter a valid DOB (age must be between 10 and 100).",
              );
              return;
            }

            user.profile.dob = encrypt(dob);
            user.profile.age = encrypt(String(age));

            saveUser(chatId, user);

            signupState.step = 3;
            await bot.sendMessage(
              chatId,
              "⚧️ Enter your gender:\n\nType one of these:\nMale / Female / Other",
            );
            return;
          }

          case 3: {
            // Gender
            const gender = text.trim();
            const normalized = gender.toLowerCase();

            if (!["male", "female", "other"].includes(normalized)) {
              await bot.sendMessage(
                chatId,
                "❌ Invalid gender.\nPlease type exactly:\nMale / Female / Other",
              );
              return;
            }

            user.profile.gender =
              normalized.charAt(0).toUpperCase() + normalized.slice(1);

            // Encrypt gender too (consistent with encrypted profile)
            user.profile.gender = encrypt(user.profile.gender);

            saveUser(chatId, user);

            signupState.step = 4;
            await bot.sendMessage(
              chatId,
              "📱 Enter your 10-digit phone number\n\nOr type *skip* to continue without phone.",
              { parse_mode: "Markdown" },
            );
            return;
          }

          case 4: {
            // Phone or skip
            const input = text.trim();

            if (input.toLowerCase() === "skip") {
              user.profile.phone = "";
              saveUser(chatId, user);

              const completedUser = completeSignup(chatId);

              if (!completedUser) {
                await bot.sendMessage(
                  chatId,
                  "❌ Something went wrong while completing signup.",
                );
                return;
              }

              await sendWithTyping(
                bot,
                chatId,
                "✅ Signup completed successfully! ❤️\n\nYour Love Bot features are now unlocked ✨",
                1200,
              );

              await sendMainMenu(
                bot,
                chatId,
                completedUser.firstName || user.firstName || "there",
              );
              return;
            }

            if (!isValidPhone(input)) {
              await bot.sendMessage(
                chatId,
                "❌ Invalid phone number.\nPlease enter a valid 10-digit Indian mobile number.\n\nOr type *skip*",
                { parse_mode: "Markdown" },
              );
              return;
            }

            user.profile.phone = encrypt(input);

            saveUser(chatId, user);

            const completedUser = completeSignup(chatId);

            if (!completedUser) {
              await bot.sendMessage(
                chatId,
                "❌ Something went wrong while completing signup.",
              );
              return;
            }

            await sendWithTyping(
              bot,
              chatId,
              "✅ Signup completed successfully! ❤️\n\nYour Love Bot features are now unlocked ✨",
              1200,
            );

            await sendMainMenu(
              bot,
              chatId,
              completedUser.firstName || user.firstName || "there",
            );
            return;
          }

          default: {
            clearSignupStep(chatId);
            await bot.sendMessage(
              chatId,
              "⚠️ Signup flow reset. Please type /signup to start again.",
            );
            return;
          }
        }
      }

      // =========================
      // MEMORY SETUP FLOW
      // =========================
      const memState = memoryStep[chatId];

      if (memState) {
        const user = getUserData(chatId);

        if (!user) {
          await bot.sendMessage(chatId, "Please use /start first ❤️");
          delete memoryStep[chatId];
          return;
        }

        user.memory = user.memory || {
          firstMeet: "",
          firstChat: "",
          specialMoment: "",
          photoUrl: "",
          gifUrl: "",
        };

        switch (memState.step) {
          case 1: {
            const firstMeet = text.trim();

            if (firstMeet.length < 2) {
              await bot.sendMessage(
                chatId,
                "Please enter a valid First Meet memory ❤️",
              );
              return;
            }

            user.memory.firstMeet = encrypt(firstMeet);
            saveUser(chatId, user);

            memState.step = 2;
            await bot.sendMessage(
              chatId,
              "💬 Now tell me about your *First Chat*:",
              {
                parse_mode: "Markdown",
              },
            );
            return;
          }

          case 2: {
            const firstChat = text.trim();

            if (firstChat.length < 2) {
              await bot.sendMessage(
                chatId,
                "Please enter a valid First Chat memory ❤️",
              );
              return;
            }

            user.memory.firstChat = encrypt(firstChat);
            saveUser(chatId, user);

            memState.step = 3;
            await bot.sendMessage(
              chatId,
              "✨ Tell me about your *Special Moment*:",
              { parse_mode: "Markdown" },
            );
            return;
          }

          case 3: {
            const specialMoment = text.trim();

            if (specialMoment.length < 2) {
              await bot.sendMessage(
                chatId,
                "Please enter a valid Special Moment ❤️",
              );
              return;
            }

            user.memory.specialMoment = encrypt(specialMoment);
            saveUser(chatId, user);

            memState.step = 4;
            await bot.sendMessage(
              chatId,
              "📸 Send a photo URL for your memory\n\nOr type *skip* to skip photo.",
              { parse_mode: "Markdown" },
            );
            return;
          }

          case 4: {
            const input = text.trim();

            if (input.toLowerCase() === "skip") {
              user.memory.photoUrl = "";
              saveUser(chatId, user);

              memState.step = 5;
              await bot.sendMessage(
                chatId,
                "🎉 Send a GIF URL for your memory\n\nOr type *skip* to skip GIF.",
                { parse_mode: "Markdown" },
              );
              return;
            }

            if (!isValidUrl(input)) {
              await bot.sendMessage(
                chatId,
                "❌ Please send a valid photo URL starting with http:// or https://\n\nOr type *skip*",
                { parse_mode: "Markdown" },
              );
              return;
            }

            user.memory.photoUrl = input;
            saveUser(chatId, user);

            memState.step = 5;
            await bot.sendMessage(
              chatId,
              "🎉 Send a GIF URL for your memory\n\nOr type *skip* to skip GIF.",
              { parse_mode: "Markdown" },
            );
            return;
          }

          case 5: {
            const input = text.trim();

            if (input.toLowerCase() === "skip") {
              user.memory.gifUrl = "";
              saveUser(chatId, user);

              delete memoryStep[chatId];

              await sendWithTyping(
                bot,
                chatId,
                "✅ Your memories have been saved successfully! ❤️",
                1200,
              );
              return;
            }

            if (!isValidUrl(input)) {
              await bot.sendMessage(
                chatId,
                "❌ Please send a valid GIF URL starting with http:// or https://\n\nOr type *skip*",
                { parse_mode: "Markdown" },
              );
              return;
            }

            user.memory.gifUrl = input;
            saveUser(chatId, user);

            delete memoryStep[chatId];

            await sendWithTyping(
              bot,
              chatId,
              "✅ Your memories have been saved successfully! ❤️",
              1200,
            );
            return;
          }

          default: {
            delete memoryStep[chatId];
            await bot.sendMessage(
              chatId,
              "⚠️ Memory setup reset. Please type /setupmemory to start again.",
            );
            return;
          }
        }
      }
    } catch (error) {
      console.error("Message handler error:", error);
      await bot.sendMessage(
        chatId,
        "❌ Something went wrong while processing your input. Please try again.",
      );
    }
  });
};
