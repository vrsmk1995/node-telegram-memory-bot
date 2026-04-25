const User = require("../models/User");
const { decrypt } = require("./cryptoHelper");

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

async function getProfileData(chatId) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`getProfileData: User with chatId ${chatId} not found`);
      return null;
    }
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
