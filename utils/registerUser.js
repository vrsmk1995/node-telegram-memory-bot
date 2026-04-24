const User = require("../models/User");

async function registerUser(msg) {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId });
  let newUser = false;

  if (!user) {
    user = await User.create({
      chatId,
      firstName: msg.from.first_name || "User",
      username: msg.from.username || "",
      joinedAt: new Date().toISOString(),
      profileCompleted: false,
      profile: {
        name: "",
        dob: "",
        age: "",
        gender: "",
        phone: "",
        phoneEncrypted: "",
        phoneMasked: "",
      },
      memory: {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      },
      timeline: [],
    });

    newUser = true;
  } else {
    user.firstName = msg.from.first_name || user.firstName || "User";
    user.username = msg.from.username || user.username || "";

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
    }

    // Auto-repair old users memory object
    if (!user.memory) {
      user.memory = {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      };
    }

    // Ensure timeline exists
    if (!user.timeline) {
      user.timeline = [];
    }

    if (typeof user.profileCompleted !== "boolean") {
      user.profileCompleted = !!user.profileCompleted;
    }

    await user.save();
  }

  return { newUser, user };
}

module.exports = registerUser;
