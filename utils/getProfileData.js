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
  try {
    const filePath = path.join(usersDir, `${chatId}.json`);

    if (!fs.existsSync(filePath)) return null;

    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!user.profile) return null;

    const name = user.profile.name ? decrypt(user.profile.name) : "Not set";
    const dob = user.profile.dob ? decrypt(user.profile.dob) : "Not set";
    const gender = user.profile.gender
      ? decrypt(user.profile.gender)
      : "Not set";
    const phone = user.profile.phoneEncrypted
      ? decrypt(user.profile.phoneEncrypted)
      : "";
    const phoneMasked = user.profile.phoneMasked || "Not provided";
    let age = "Not set";
    if (dob !== "Not set") {
      age = decrypt(user.profile.age) || calculateAge(dob);
    } else if (dob !== "Not set" && age === "Invalid DOB") {
      age = calculateAge(dob);
    }

    return {
      name,
      dob,
      gender,
      age,
      phone,
      phoneMasked,
    };
  } catch (error) {
    console.error("Error getting profile data:", error);
    return null;
  }
}

module.exports = getProfileData;
