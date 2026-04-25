const User = require("../models/User");
const { encrypt } = require("./cryptoHelper");

function maskPhone(phone) {
  if (!phone || phone.length < 4) return "****";

  const first2 = phone.slice(0, 2);
  const last2 = phone.slice(-2);
  const middle = "*".repeat(phone.length - 4);

  return `${first2}${middle}${last2}`;
}

function calculateAge(dob) {
  const [day, month, year] = dob.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

async function updateProfileData(chatId, field, value) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`updateProfileData: User with chatId ${chatId} not found`);
      return null;
    }

    if (!user.profile) {
      user.profile = {
        name: "",
        dob: "",
        age: "",
        gender: "",
        phoneEncrypted: "",
        phoneMasked: "",
      };
    }

    // Auto-repair old structure
    if (typeof user.profile.name !== "string") user.profile.name = "";
    if (typeof user.profile.dob !== "string") user.profile.dob = "";
    if (typeof user.profile.age !== "string") user.profile.age = "";
    if (typeof user.profile.gender !== "string") user.profile.gender = "";
    if (typeof user.profile.phoneEncrypted !== "string")
      user.profile.phoneEncrypted = "";
    if (typeof user.profile.phoneMasked !== "string")
      user.profile.phoneMasked = "";

    // Remove old field if exists
    if ("phone" in user.profile) {
      user.profile.phone = "";
    }

    if (field === "phone") {
      user.profile.phoneEncrypted = value ? encrypt(value) : "";
      user.profile.phoneMasked = value ? maskPhone(value) : "";
    } else if (field === "dob") {
      user.profile.dob = encrypt(value);

      const age = calculateAge(value);
      user.profile.age = encrypt(String(age));
    } else {
      user.profile[field] = value ? encrypt(value) : "";
    }

    await user.save();

    console.log(`updateProfileData: ${field} updated for ${chatId}`);

    return user;
  } catch (err) {
    console.error("updateProfileData error:", err);
    return null;
  }
}

module.exports = updateProfileData;
