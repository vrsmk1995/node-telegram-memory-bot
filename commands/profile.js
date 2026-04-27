const getProfileData = require("../utils/getProfileData");
const isProfileComplete = require("../utils/isProfileComplete");

module.exports = function (bot, sendWithTyping) {
  bot.onText(/\/profile/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const profileDone = await isProfileComplete(chatId);

      if (!profileDone) {
        await bot.sendMessage(
          chatId,
          "Your profile is not completed yet ❤️\n\nPlease use /signup first.",
        );
        return;
      }

      const profile = await getProfileData(chatId);

      if (!profile) {
        await bot.sendMessage(
          chatId,
          "Profile not found. Please use /start first ❤️",
        );
        return;
      }

      const message = `👤 Your Profile ❤️

Name: ${profile.name}
Date of Birth: ${profile.dob}
Age: ${profile.age}
Gender: ${profile.gender}
Phone: ${profile.phoneMasked || "Not provided"}`;

      await sendWithTyping(bot, chatId, message, 1200);
    } catch (err) {
      console.error("Profile command error:", err);
      await bot.sendMessage(chatId, "Failed to load your profile.");
    }
  });
};
