const path = require("path");
console.log(path.resolve(__dirname, "../models/user"));
const signupStep = {};

function isValidDOB(dob) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  if (!regex.test(dob)) return false;

  const [day, month, year] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

async function completeSignup(chatId) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`completeSignup: User with chatId ${chatId} not found`);
      return null;
    }
    user.profileCompleted = true;

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

    delete signupStep[chatId];
    console.log(`completeSignup: Profile completed for ${chatId}`);

    return user;
  } catch (error) {
    console.error("Error completing signup for chatId:", chatId);
    return null;
  }
}

async function startSignupFlow(bot, chatId) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`startSignupFlow: User with chatId ${chatId} not found`);
      bot.sendMessage(
        chatId,
        "An error occurred while starting the signup process. Please try again later.",
      );
      return;
    }

    signupStep[chatId] = { step: 1 };

    bot.sendMessage(chatId, "❤️ Welcome to signup!\n\nPlease enter your name:");
  } catch (error) {
    console.error("Error starting signup flow for chatId:", chatId, error);
    bot.sendMessage(
      chatId,
      "An error occurred while starting the signup process. Please try again later.",
    );
  }
}

function getSignupStep(chatId) {
  return signupStep[chatId];
}

function clearSignupStep(chatId) {
  delete signupStep[chatId];
}

module.exports = {
  signupStep,
  isValidDOB,
  completeSignup,
  startSignupFlow,
  getSignupStep,
  clearSignupStep,
};
