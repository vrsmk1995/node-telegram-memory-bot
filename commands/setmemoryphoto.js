const updateUserData = require("../utils/updateUserData");

const waitingForPhoto = {};

module.exports = function (bot) {
  // Step 1: user runs command
  bot.onText(/\/setmemoryphoto/i, (msg) => {
    const chatId = msg.chat.id;

    waitingForPhoto[chatId] = true;

    bot.sendMessage(chatId, "Please upload the memory photo (JPG/PNG) 📸");
  });

  // Step 2: user uploads photo
  bot.on("photo", async (msg) => {
    const chatId = msg.chat.id;

    if (!waitingForPhoto[chatId]) return;

    try {
      // highest resolution photo

      const photo = msg.photo[msg.photo.length - 1];

      const file = photo.file_id;

      //   const photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      updateUserData(chatId, "photoUrl", file);

      delete waitingForPhoto[chatId];

      bot.sendMessage(chatId, "Memory photo saved successfully ❤️");

    } catch (err) {
      console.error("Photo save error:", err);

      bot.sendMessage(chatId, "Failed to save photo.");
    }
  });
};
