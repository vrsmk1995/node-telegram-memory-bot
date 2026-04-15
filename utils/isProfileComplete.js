const fs = require("fs");
const path = require("path");

const userDirectory = path.join(__dirname, "../data/users");

function isProfileComplete(chatId) {
  try {
    const filePath = path.join(userDirectory, `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return user.profileCompleted === true;
  } catch (error) {
    console.error("isProfileComplete error:", error);
    return false;
  }
}

module.exports = isProfileComplete;
