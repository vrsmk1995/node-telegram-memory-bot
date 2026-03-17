const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = "aes-256-cbc";

// Create fixed 32-byte key
const key = crypto.createHash("sha256").update(SECRET_KEY).digest();

function encrypt(text) {
  if (!text) return "";

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedText) {
  if (!encryptedText) return "";

  try {
      if (!encryptedText.includes(":")) {
       return encryptedText
      }
      const parts = encryptedText.split(":")
      if (parts.length !== 2) {
          return encryptedText
      }
       const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
      console.log("Decrypt error:", err.message);
      return encryptedText;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
