const isProfileComplete = require("./isProfileComplete");

const signupReminderSentAt = {};
const REMINDER_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

function requireSignup(bot, chatId) {
  if (!isProfileComplete(chatId)) {
    const now = Date.now();
    const lastSent = signupReminderSentAt[chatId] || 0;

    // Send reminder only if cooldown passed
    if (now - lastSent > REMINDER_COOLDOWN_MS) {
      bot.sendMessage(
        chatId,
        "⚠️ Please complete signup first using /signup to use bot features ❤️",
      );

      signupReminderSentAt[chatId] = now;
    }

    return false;
  }

  // If signed up, clear cooldown cache
  if (signupReminderSentAt[chatId]) {
    delete signupReminderSentAt[chatId];
  }

  return true;
}

module.exports = requireSignup;
