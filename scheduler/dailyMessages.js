const cron = require("node-cron");
const loveMessages = require("../messages/loveMessages");
const safeSend = require("../utils/safeSend");

module.exports = function (bot, chatId) {
  function randomMessage() {
    return loveMessages[Math.floor(Math.random() * loveMessages.length)];
  }

  cron.schedule("0 8 * * *", () => {
    safeSend(chatId, "Good Morning ☀️❤️\n\n" + randomMessage());
  });

  cron.schedule("0 23 * * *", () => {
    safeSend(chatId, "Good Night 😴❤️ Sweet dreams.");
  });
};
