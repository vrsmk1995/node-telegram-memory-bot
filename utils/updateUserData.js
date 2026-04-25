const User = require("../models/User");
const { encrypt } = require("./cryptoHelper");

// Ensure users folder exists

async function updateUserData(chatId, field, value) {
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      console.error(`updateUserData: User with chatId ${chatId} not found`);
      return null;
    }

    // Ensure memory exists
    if (!user.memory) {
      user.memory = {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      };
    }

    const encryptedFields = ["firstMeet", "firstChat", "specialMoment"];

    if (encryptedFields.includes(field)) {
      user.memory[field] = value ? encrypt(value) : "";
    } else {
      user.memory[field] = value || "";
    }

    await user.save();
    console.log(`updateUserData: ${field} updated for ${chatId} => ${value}`);

    return user;
  } catch (err) {
    console.error("updateUserData error:", err);
    return null;
  }
}

module.exports = updateUserData;
