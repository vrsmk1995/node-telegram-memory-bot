const fs = require("fs");
const path = require("path");
const getProfileData = require("../utils/getProfileData");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/profile/i, async (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      bot.sendMessage(chatId, "Please use /start first ❤️");
      return;
    }

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!user.profileCompleted) {
      bot.sendMessage(
        chatId,
        "Your profile is not completed yet ❤️\n\nPlease use /signup first.",
      );
      return;
    }

    const profile = getProfileData(chatId);

    const message = `👤 Your Profile ❤️

Name: ${profile.name}
Date of Birth: ${profile.dob}
Age: ${profile.age}
Gender: ${profile.gender}
Phone:${profile.phone}`;
  

    try {
      await sendWithTyping(bot, chatId, message, 1500);
    } catch (err) {
      console.error("Profile display error:", err);
      bot.sendMessage(chatId, "Failed to load your profile.");
    }
  });
};
