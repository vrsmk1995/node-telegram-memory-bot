const fs = require("fs");
const path = require("path");
const { decrypt } = require("./cryptoHelper");

const usersDir = path.join(__dirname, "../data/users");

function calculateAge(dobString) {
  if (!dobString) return "Not set";

  const [day, month, year] = dobString.split("-").map(Number);

  if (!day || !month || !year) return "Invalid DOB";

  const dob = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

function getProfileData(chatId) {
  const filePath = path.join(usersDir, `${chatId}.json`);

  if (!fs.existsSync(filePath)) return null;

  const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!user.profile) return null;

  const name = user.profile.name ? decrypt(user.profile.name) : "Not set";
  const dob = user.profile.dob ? decrypt(user.profile.dob) : "Not set";
  const gender = user.profile.gender ? decrypt(user.profile.gender) : "Not set";
  const phone = user.profile.phone ? decrypt(user.profile, phone) : "Not set";

  return {
    name,
    dob,
    gender,
    age: dob !== "Not set" ? calculateAge(dob) : "Not set",
    phone,
  };
}

module.exports = getProfileData;
