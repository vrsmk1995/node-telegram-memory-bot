const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

// Ensure users folder exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function updateUserData(chatId, field, value) {
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(filePath)) {
    console.log("updateUserData: user file not found for", chatId);
    return null;
  }

  const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Ensure memory exists
  if (!user.memory) {
    user.memory = {
      firstMeet: "Not set",
      firstChat: "Not set",
      specialMoment: "Not set",
      photoUrl: "",
      gifUrl: "",
    };
  }

  // Update only memory fields
  user.memory[field] = value;

  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

  console.log(`updateUserData: ${field} updated for ${chatId} => ${value}`);

  return user;
}

module.exports = updateUserData;
