import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const hex = process.env.SECRET_SHARE_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("SECRET_SHARE_KEY debe ser un hex de 32 bytes (64 caracteres)");
  }
  return Buffer.from(hex, "hex");
}

export function encryptSecret(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decryptSecret({ ciphertext, iv, authTag }) {
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  const plainText = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "hex")),
    decipher.final(),
  ]);
  return plainText.toString("utf8");
}

export function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, 64);
  return { pinSalt: salt.toString("hex"), pinHash: hash.toString("hex") };
}

export function verifyPin(pin, { pinSalt, pinHash }) {
  const hash = crypto.scryptSync(pin, Buffer.from(pinSalt, "hex"), 64);
  const expected = Buffer.from(pinHash, "hex");
  return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
}
