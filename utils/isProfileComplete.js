const User = require("../models/User");

async function isProfileComplete(chatId) {
  try {
    const user = await User.findOne({ chatId });

    if (!user) {
      return false;
    }

    // Support legacy typo field during migration
    if (user.profileCompleted === true || user.profileComleted === true) {
      // Auto-heal old users
      if (user.profileCompleted !== true) {
        user.profileCompleted = true;
        await user.save();
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("isProfileComplete error:", error);
    return false;
  }
}

module.exports = isProfileComplete;
