const User = require("../models/User");

async function getUserData(chatId) {
  try {
    const user = await User.findOne({ chatId });

    if (!user) {
      return null;
    }

    let updated = false;

    // Auto-repair old users
    if (!user.memory) {
      user.memory = {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      };
      updated = true;
    } else {
      if (typeof user.memory.firstMeet !== "string") {
        user.memory.firstMeet = "";
        updated = true;
      }
      if (typeof user.memory.firstChat !== "string") {
        user.memory.firstChat = "";
        updated = true;
      }
      if (typeof user.memory.specialMoment !== "string") {
        user.memory.specialMoment = "";
        updated = true;
      }
      if (typeof user.memory.photoUrl !== "string") {
        user.memory.photoUrl = "";
        updated = true;
      }
      if (typeof user.memory.gifUrl !== "string") {
        user.memory.gifUrl = "";
        updated = true;
      }
    }

    if (!Array.isArray(user.timeline)) {
      user.timeline = [];
      updated = true;
    }

    if (!user.profile) {
      user.profile = {
        name: "",
        dob: "",
        age: "",
        gender: "",
        phone: "",
        phoneEncrypted: "",
        phoneMasked: "",
      };
      updated = true;
    }

    if (typeof user.profileCompleted !== "boolean") {
      user.profileCompleted = false;
      updated = true;
    }

    if (updated) {
      await user.save();
    }

    return user;
  } catch (error) {
    console.error("Error reading user data for chatId:", chatId, error);
    return null;
  }
}

module.exports = getUserData;
