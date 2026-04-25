const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" }, // encrypted
    dob: { type: String, default: "" }, // encrypted
    age: { type: String, default: "" }, // optional legacy
    gender: { type: String, default: "" }, // encrypted
    phone: { type: String, default: "" }, // legacy
    phoneEncrypted: { type: String, default: "" },
    phoneMasked: { type: String, default: "" },
  },
  { _id: false },
);

const memorySchema = new mongoose.Schema(
  {
    firstMeet: { type: String, default: "" }, // encrypted
    firstChat: { type: String, default: "" }, // encrypted
    specialMoment: { type: String, default: "" }, // encrypted
    photoUrl: { type: String, default: "" },
    gifUrl: { type: String, default: "" },
  },
  { _id: false },
);

const timelineSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    date: { type: String, default: "" },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    chatId: { type: Number, required: true, unique: true, index: true },
    firstName: { type: String, default: "User" },
    username: { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },

    // keep both for safety during migration
    profileCompleted: { type: Boolean, default: false },
    
    profile: {
      type: profileSchema,
      default: () => ({
        name: "",
        dob: "",
        age: "",
        gender: "",
        phone: "",
        phoneEncrypted: "",
        phoneMasked: "",
      }),
    },

    memory: {
      type: memorySchema,
      default: () => ({
        firstMeet: "",
        firstChat: "",
        specialMoment: "",
        photoUrl: "",
        gifUrl: "",
      }),
    },

    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
