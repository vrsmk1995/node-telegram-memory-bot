const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

// Ensure users folder exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function registerUser(msg) {
  const chatId = msg.chat.id;
  const filePath = path.join(usersDir, `${chatId}.json`);

  let newUser = false;
  let user;

  if (!fs.existsSync(filePath)) {
    user = {
      chatId,
      firstName: msg.from.first_name || "User",
      username: msg.from.username || "",
      joinedAt: new Date().toISOString(),
      memory: {
        firstMeet: "Not set",
        firstChat: "Not set",
        specialMoment: "Not set",
        photoUrl: "",
        gifUrl: "",
      },
      timeline: [],
    };

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
    newUser = true;
  } else {
    user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Auto-repair old users
    if (!user.memory) {
      user.memory = {
        firstMeet: "Not set",
        firstChat: "Not set",
        specialMoment: "Not set",
        photoUrl: "",
        gifUrl: "",
      };
    }

    if (!user.timeline) {
      user.timeline = [];
    }

    // keep firstName / username updated from Telegram profile
    user.firstName = msg.from.first_name || user.firstName || "User";
    user.username = msg.from.username || user.username || "";

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
  }

  return { newUser, user };
}

module.exports = registerUser;
