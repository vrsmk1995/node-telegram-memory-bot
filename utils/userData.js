const fs = require("fs");
const path = require("path");

const memoryFilePath = path.join(__dirname, "../data/users");

if (!fs.existsSync(memoryFilePath)) {
    fs.mkdirSync(memoryFilePath,{recursive: true});
}

function getUserFile(chatId) {
  return path.join(memoryFilePath, `${chatId}.json`);
}

function getUserData(chatId) {
  const file = getUserFile(chatId);
  if (!fs.existsSync(file)) {
    const newUser = {
      firstMeet: "not set",
      firstChat: "not set",
      specialMoment: "not set",
      gifUrl:
        "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmxvMDR1dXBlaHJ2cmNpZzlxeWkzN3BxZHRoM2plMWNnZjZ2eWJudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lF3EunMA9XpIY/giphy.gif",
      photoUrl:
        "https://imgs.search.brave.com/NadlfyqaO1-69xiNrcR1HjYQDgQtjjsXRQz0X9Ud5js/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFPeS1MNDlqc0wu/anBn",
    };

    fs.writeFileSync(file, JSON.stringify(newUser, null, 2));
    return newUser;
  }
  return JSON.parse(fs.readFileSync(file));
}
module.exports = getUserData;
