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

// Memory / Timeline Commands
const memoryCommand = require("./commands/memory");
const setupMemoryCommand = require("./commands/setupmemory");
const timelineCommand = require("./commands/timeline");
const addTimelineCommand = require("./commands/addtimeline");

// Inline Button Callbacks
const menuCallbacks = require("./handlers/menuCallback");

// Optional shared state object if needed by callbacks
const userStates = {};

// Global process error handlers
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

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in environment variables");
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

    /* =========================
       REGISTER COMMANDS
       Order matters
    ========================= */

    // 1️⃣ Core commands first
    startCommand(bot, sendWithTyping);
    helpCommand(bot, sendWithTyping);
    resetCommand(bot);

    // 2️⃣ Signup / profile flows
    signupCommand(bot);
    profileCommand(bot, sendWithTyping);
    editProfile(bot, sendWithTyping);

    // 3️⃣ Memory setup BEFORE memory display
    setupMemoryCommand(bot, sendWithTyping);

    // 4️⃣ Memory + timeline commands
    memoryCommand(bot, sendWithTyping);
    timelineCommand(bot);
    addTimelineCommand(bot);

    // 5️⃣ Inline callbacks AFTER commands
    menuCallbacks(bot, sendWithTyping, userStates);

    // Bot-level error handlers
    bot.on("polling_error", (error) => {
      console.error("❌ Polling error:", error.message);

      if (error.code === "ETELEGRAM") {
        console.log("⚠️ Another bot instance may be running (409 conflict).");
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
