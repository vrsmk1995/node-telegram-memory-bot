const User = require("../models/User");

async function isProfileComplete(chatId) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`isProfileComplete: User with chatId ${chatId} not found`);
      return false;
    }

    if (user.profileCompleted === true) {
      user.profileCompleted = true;
      await user.save();
      return true;
    }

    return false;
  } catch (error) {
    console.error("isProfileComplete error:", error);
    return false;
  }
}

module.exports = isProfileComplete;
