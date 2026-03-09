const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

function registerUser(msg) {
  const chatId = msg.chat.id;
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const newUser = {
      chatId: chatId,
      firstName: msg.from.first_name || "",
      username: msg.from.username || "",
      joinedAt: new Date().toISOString(),

      memory: {
        firstMeet: "Not set",
        firstChat: "Not set",
        specialMoment: "Not set",
        photoUrl: "Not set",
        gifUrl: "Not set",
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(newUser, null, 2));

    return { newUser: true, user: newUser };
  }

  const user = JSON.parse(fs.readFileSync(filePath));

  return { newUser: false, user };
}

module.exports = registerUser;
