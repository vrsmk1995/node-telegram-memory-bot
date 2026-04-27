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

    if (!user || !user.profile) {
      return null;
    }

    const name = user.profile.name ? decrypt(user.profile.name) : "Not set";
    const dob = user.profile.dob ? decrypt(user.profile.dob) : "Not set";
    const gender = user.profile.gender
      ? decrypt(user.profile.gender)
      : "Not set";

    const phone = user.profile.phoneEncrypted
      ? decrypt(user.profile.phoneEncrypted)
      : "";

    const phoneMasked = user.profile.phoneMasked || "Not provided";

    return {
      name,
      dob,
      gender,
      age: dob !== "Not set" ? calculateAge(dob) : "Not set",
      phone,
      phoneMasked,
    };
  } catch (error) {
    console.error("getProfileData error:", error);
    return null;
  }
}

module.exports = getProfileData;
