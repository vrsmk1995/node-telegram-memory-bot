const fs = require("fs");
const path = require("path");

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

function completeSignup(chatId) {
  try {
    const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

    if (!fs.existsSync(filePath)) return null;

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));
    user.profileCompleted = true;

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

    delete signupStep[chatId];

    return user;
  } catch (error) {
    console.error("Error completing signup for chatId:", chatId);
    return null;
  }
}


function startSignupFlow(bot, chatId) {
  try{
  const filePath = path.join(__dirname, "../data/users", `${chatId}.json`);

  if (!fs.existsSync(filePath)) {
    bot.sendMessage(chatId, "Please use /start first ❤️");
    return;
  }

  signupStep[chatId] = { step: 1 };

  bot.sendMessage(chatId, "❤️ Welcome to signup!\n\nPlease enter your name:");
  } catch (error) {
    console.error("Error starting signup flow for chatId:", chatId, error);
    bot.sendMessage(chatId, "An error occurred while starting the signup process. Please try again later.");
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
