const User = require("../models/user");

async function isProfileComplete(chatId) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`isProfileComplete: User with chatId ${chatId} not found`);
      return false;
    }

    if (user.profileComleted === true) {
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
