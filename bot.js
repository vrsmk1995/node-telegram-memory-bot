require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const connectDB = require("./config/db");
const sendWithTyping = require("./utils/sendWithTyping");


// Core Commands

const startCommand = require("./commands/start");
const helpCommand = require("./commands/help");
const resetCommand = require("./commands/reset");


// Profile / Signup

const signupCommand = require("./commands/signup");
const profileCommand = require("./commands/profile");
const editProfile = require("./handlers/editProfile");


// Love / Fun Commands

const loveCommand = require("./commands/love");
const hugCommand = require("./commands/hug");
const lovemeterCommand = require("./commands/lovemeter");
const reasonsCommand = require("./commands/reasons");
const surpriseCommand = require("./commands/surprise");
const lovecodeCommand = require("./commands/lovecode");


// Memory / Timeline Commands

const memoryCommand = require("./commands/memory");
const setupMemoryCommand = require("./commands/setupmemory");
const timelineCommand = require("./commands/timeline");
const addTimelineCommand = require("./commands/addtimeline");


// Inline Button Callbacks

const menuCallbacks = require("./handlers/menuCallback");

// Optional shared state object if needed by callbacks
const userStates = {};

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
    });

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Promise Rejection:", err);
    });

    async function startBot() {
      try {
        console.log("❤️ Love Bot is starting...");

        // Validate required env vars

        if (!config.token) {
          throw new Error("BOT_TOKEN is missing in config/env");
        }

        if (!process.env.SECRET_KEY) {
          throw new Error("SECRET_KEY is missing in environment variables");
        }

        console.log("BOT_TOKEN exists:", !!config.token);
        console.log("SECRET_KEY exists:", !!process.env.SECRET_KEY);
        console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

        // Connect MongoDB first

        await connectDB();

        // Create Telegram Bot

        const bot = new TelegramBot(config.token, { polling: true });

        console.log("🤖 Love Bot is online and polling...");

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

        // 1️⃣ Core / registration first
        startCommand(bot, sendWithTyping);
        helpCommand(bot, sendWithTyping);
        resetCommand(bot);

        // 2️⃣ Profile / signup
        signupCommand(bot);
        profileCommand(bot, sendWithTyping);
        editProfile(bot, sendWithTyping);

        // 3️⃣ Memory setup flows BEFORE memory display
        setupMemoryCommand(bot, sendWithTyping);

        // 4️⃣ Memory display + timeline
        memoryCommand(bot, sendWithTyping);
        timelineCommand(bot, sendWithTyping);
        addTimelineCommand(bot, sendWithTyping);

        // 5️⃣ Fun / love commands
        loveCommand(bot, sendWithTyping);
        hugCommand(bot, sendWithTyping);
        lovemeterCommand(bot, sendWithTyping);
        reasonsCommand(bot, sendWithTyping);
        surpriseCommand(bot, sendWithTyping);
        lovecodeCommand(bot, sendWithTyping);

        // 6️⃣ Inline button callbacks AFTER commands
        menuCallbacks(bot, sendWithTyping, userStates);

        // Bot error handlers

        bot.on("polling_error", (error) => {
          console.error("❌ Polling error:", error.message);

          if (error.code === "ETELEGRAM") {
            console.log(
              "⚠️ Another bot instance may be running (409 conflict).",
            );
          }
        });

        bot.on("webhook_error", (error) => {
          console.error("❌ Webhook error:", error.message);
        });

        console.log("✅ All commands and handlers registered successfully");
      } catch (err) {
        console.error("❌ Bot startup failed:", err.message);
        process.exit(1);
      }
    }

startBot();
