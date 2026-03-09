require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");

const sendWithTyping = require("./utils/sendWithTyping");

const loveCommand = require("./commands/love");
const hugCommand = require("./commands/hug");
const lovemeterCommand = require("./commands/lovemeter");
const reasonsCommand = require("./commands/reasons");
const surpriseCommand = require("./commands/surprise");
const memoryCommand = require("./commands/memory");
const timelineCommand = require("./commands/timeline");
const lovecodeCommand = require("./commands/lovecode");
const startCommand = require("./commands/start");
const dailyMessages = require("./scheduler/dailyMessages");
const autoReply = require("./intelligence/autoReply");
const setupMemory = require("./commands/setupmemory");
const setfirstchat = require("./commands/setfirstchat");
const setfirstmeet = require("./commands/setfirstmeet");
const setspecialmoment = require("./commands/setspecialmoment");
const setmemoryphoto = require("./commands/setmemoryphoto");
const setmemorygif = require("./commands/setmemorygif");

const bot = new TelegramBot(config.token, { polling: true });

console.log("Love Bot Started ❤️");

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  console.log("Incoming message from Chat ID:", chatId, "| Text:", msg.text);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

loveCommand(bot, sendWithTyping);
hugCommand(bot, sendWithTyping);
lovemeterCommand(bot, sendWithTyping);
reasonsCommand(bot, sendWithTyping);
surpriseCommand(bot, sendWithTyping);
memoryCommand(bot, sendWithTyping);
timelineCommand(bot, sendWithTyping);
lovecodeCommand(bot, sendWithTyping);
autoReply(bot, sendWithTyping);
startCommand(bot, sendWithTyping);
setupMemory(bot, sendWithTyping);
setfirstchat(bot, sendWithTyping);
setfirstmeet(bot, sendWithTyping);
setspecialmoment(bot, sendWithTyping);
setmemoryphoto(bot, sendWithTyping);
setmemorygif(bot, sendWithTyping);

dailyMessages(bot, config.chatId);

bot.on("polling_error", (error) => {

console.log("Polling error:", error.message);

if(error.code === "ETELEGRAM"){
console.log("Another instance detected.");
}

});

