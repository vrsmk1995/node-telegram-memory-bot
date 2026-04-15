const fs = require("fs");
const path = require("path");

const usersDir = path.join(__dirname, "../data/users");

// Ensure users folder exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

function registerUser(msg) {
  const chatId = msg.chat.id;
  const filePath = path.join(usersDir, `${chatId}.json`);

  let newUser = false;
  let user;

  if (!fs.existsSync(filePath)) {
    user = {
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
      },
      memory: {
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      },
      timeline: [],
    };

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
    newUser = true;
  } else {
    user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 🔥 Auto-fix old typo field
    if (
      typeof user.profileCompleted !== "boolean" &&
      typeof user.profileCompleted === "boolean"
    ) {
      user.profileCompleted = user.profileCompleted;
      delete user.profileCompleted;
    }

    // Ensure profileCompleted exists
    if (typeof user.profileCompleted !== "boolean") {
      user.profileCompleted = false;
    }

    // Ensure profile object exists
    if (!user.profile) {
      user.profile = {
        name: "",
        dob: "",
        age: "",
        gender: "",
        phone: "",
      };
    } else {
      // Auto-repair missing profile fields
      if (typeof user.profile.name !== "string") user.profile.name = "";
      if (typeof user.profile.dob !== "string") user.profile.dob = "";
      if (typeof user.profile.age !== "string") user.profile.age = "";
      if (typeof user.profile.gender !== "string") user.profile.gender = "";
      if (typeof user.profile.phone !== "string") user.profile.phone = "";
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
    } else {
      if (typeof user.memory.firstMeet !== "string") user.memory.firstMeet = "";
      if (typeof user.memory.firstChat !== "string") user.memory.firstChat = "";
      if (typeof user.memory.specialMoment !== "string")
        user.memory.specialMoment = "";
      if (typeof user.memory.photoUrl !== "string") user.memory.photoUrl = "";
      if (typeof user.memory.gifUrl !== "string") user.memory.gifUrl = "";
    }

    // Ensure timeline exists
    if (!Array.isArray(user.timeline)) {
      user.timeline = [];
    }

    // Keep Telegram profile info updated
    user.firstName = msg.from.first_name || user.firstName || "User";
    user.username = msg.from.username || user.username || "";

    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), "utf8");
  }

  return { newUser, user };
}

module.exports = registerUser;
