const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

function updateUserData(chatId, field, value) {
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(filePath)) return null;

  const user = JSON.parse(fs.readFileSync(filePath));

    user.memory[field] = value;
   

  fs.writeFileSync(filePath, JSON.stringify(user, null, 2));

  return user;
}

module.exports = updateUserData;
