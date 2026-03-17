const fs = require("fs");
const path = require("path");
const updateProfileData = require("../utils/updateProfileData");

const signupStep = {};

function isValidDOB(dob) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  if (!regex.test(dob)) return false;

  const [day, month, year] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

module.exports = function (bot) {
  bot.onText(/\/signup/i, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      bot.sendMessage(chatId, "Please use /start first ❤️");
      return;
    }

    signupStep[chatId] = { step: 1 };

    bot.sendMessage(chatId, "❤️ Welcome to signup!\n\nPlease enter your name:");
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) return;
    if (msg.text.startsWith("/")) return;
    if (!signupStep[chatId]) return;

    const current = signupStep[chatId];

    try {
      // Step 1: Name
      if (current.step === 1) {
        updateProfileData(chatId, "name", msg.text);
        current.step = 2;

        bot.sendMessage(
          chatId,
          "📅 Great! Please enter your Date of Birth in DD-MM-YYYY format.\n\nExample: 14-08-1995",
        );
      }

      // Step 2: DOB
      else if (current.step === 2) {
        if (!isValidDOB(msg.text.trim())) {
          bot.sendMessage(
            chatId,
            "⚠️ Invalid date format.\nPlease enter DOB as DD-MM-YYYY.\n\nExample: 14-08-1995",
          );
          return;
        }

        updateProfileData(chatId, "dob", msg.text.trim());
        current.step = 3;

        bot.sendMessage(
          chatId,
          "⚧ Please enter your gender:\n\nMale / Female / Other\n\nOr type: Skip",
        );
      }

      // Step 3: Gender
      else if (current.step === 3) {
        const gender =
          msg.text.trim().toLowerCase() === "skip"
            ? "Prefer not to say"
            : msg.text.trim();

        updateProfileData(chatId, "gender", gender);

        const filePath = path.join(
          __dirname,
          "../data/users",
          `${chatId}.json`,
        );
        const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

        user.profileCompleted = true;

        fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

        delete signupStep[chatId];

        bot.sendMessage(
          chatId,
          "Signup completed successfully ❤️\n\nUse /profile to view your profile.",
        );
      } else if (current.step === 4) {
        updateProfileData(chatId, "phone", msg.text);
        current.step = 4;

        bot.sendMessage(
          chatId,
          "📅 Great! Please enter your 10 Digit Phone NUmber",
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      bot.sendMessage(chatId, "Something went wrong during signup.");
    }
  });
};
