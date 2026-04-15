const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

// Ensure users folder exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function getUserData(chatId) {
  try {
    const filePath = path.join(usersDir, `${chatId}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));
    let updated = false;

    // Auto-repair old users
    if (!user.memory) {
      user.memory = {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      };
      updated = true;
    } else {
      if (!user.memory.firstMeet) {
        user.memory.firstMeet = "";
        updated = true;
      }
      if (!user.memory.firstChat) {
        user.memory.firstChat = "";
        updated = true;
      }
      if (!user.memory.specialMoment) {
        user.memory.specialMoment = "";
        updated = true;
      }
      if (!user.memory.photoUrl) {
        user.memory.photoUrl = "";
        updated = true;
      }
      if (!user.memory.gifUrl) {
        user.memory.gifUrl = "";
        updated = true;
      }
    }
    if (!Array.isArray(user.timeline)) {
      user.timeline = [];
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
    }

    return user;
  } catch (error) {
    console.error("Error reading user data for chatId:", chatId, error);
    return null;
  }
  


}

module.exports = getUserData;
