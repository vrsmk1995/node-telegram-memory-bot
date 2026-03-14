const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

// Ensure users folder exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function getUserData(chatId) {
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Auto-repair old users
  if (!user.memory) {
    user.memory = {
      firstMeet: "Not set",
      firstChat: "Not set",
      specialMoment: "Not set",
      photoUrl: "",
      gifUrl: "",
    };

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
  }

  if (!user.timeline) {
    user.timeline = [];
    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
  }

  return user;
}

module.exports = getUserData;
