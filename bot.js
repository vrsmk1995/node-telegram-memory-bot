require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const sendWithTyping = require("./utils/sendWithTyping");

// Core commands
const startCommand = require("./commands/start");
const helpCommand = require("./commands/help");
const resetCommand = require("./commands/reset");

// Love / fun commands
const loveCommand = require("./commands/love");
const hugCommand = require("./commands/hug");
const lovemeterCommand = require("./commands/lovemeter");
const reasonsCommand = require("./commands/reasons");
const surpriseCommand = require("./commands/surprise");
const lovecodeCommand = require("./commands/lovecode");

// Memory / timeline commands
const memoryCommand = require("./commands/memory");
const setupMemoryCommand = require("./commands/setupmemory");


const timelineCommand = require("./commands/timeline");
const addTimelineCommand = require("./commands/addtimeline");

// Inline button callbacks
const menuCallbacks = require("./commands/menuCallback");

// Intelligence / auto reply
const autoReply = require("./intelligence/autoReply");

// Scheduler
const dailyMessages = require("./scheduler/dailyMessages");
const signupCommand = require("./commands/signup");
const profileCommand = require("./commands/profile");

// Create bot
const bot = new TelegramBot(config.token, { polling: true });

console.log("Love Bot Started ❤️");

// Debug incoming messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(
    "Incoming message from Chat ID:",
    chatId,
    "| Text:",
    msg.text || "[non-text message]",
  );
});

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

/* =========================
   REGISTER COMMANDS
   Load order matters
========================= */

// 1️⃣ Core / registration first
startCommand(bot, sendWithTyping);
helpCommand(bot, sendWithTyping);
resetCommand(bot, sendWithTyping);

//Profile
signupCommand(bot);
profileCommand(bot, sendWithTyping);

// 2️⃣ Memory setup flows BEFORE auto reply
setupMemoryCommand(bot, sendWithTyping);

// 3️⃣ Memory display + timeline
memoryCommand(bot, sendWithTyping);
timelineCommand(bot, sendWithTyping);
addTimelineCommand(bot, sendWithTyping);

// 4️⃣ Fun / love commands
loveCommand(bot, sendWithTyping);
hugCommand(bot, sendWithTyping);
lovemeterCommand(bot, sendWithTyping);
reasonsCommand(bot, sendWithTyping);
surpriseCommand(bot, sendWithTyping);
lovecodeCommand(bot, sendWithTyping);





// 5️⃣ Inline button callbacks AFTER commands
menuCallbacks(bot, sendWithTyping);

// 6️⃣ Auto reply LAST (important)
autoReply(bot, sendWithTyping);

// 7️⃣ Scheduler (optional)
// If you still use static CHAT_ID in .env, this will work only for one user.
// For public multi-user bots, this should be redesigned later.
if (config.chatId) {
  dailyMessages(bot, config.chatId);
}

// Polling error handling
bot.on("polling_error", (error) => {
  console.log("Polling error:", error.message);

  if (error.code === "ETELEGRAM") {
    console.log("Another bot instance may be running (409 conflict).");
  }
});
