const fs = require("fs");
const path = require("path");
const { encrypt } = require("./cryptoHelper");

const usersDir = path.join(__dirname, "../data/users");

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function updateProfileData(chatId, field, value) {
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(filePath)) {
    console.log("updateProfileData: user file not found for", chatId);
    return null;
  }

  const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!user.profile) {
    user.profile = {
      name: "",
      dob: "",
      gender: "",
      phone: "",
    };
  }

  // Encrypt all user-entered profile fields
  user.profile[field] = encrypt(value);

  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");

  console.log(`updateProfileData: ${field} updated for ${chatId}`);

  return user;
}

module.exports = updateProfileData;
