import crypto from "crypto";

class KeyGenerator {
  static generateKey(KEY_LENGTH: number) {
    return crypto.randomBytes(KEY_LENGTH).toString("hex");
  }

  static generateHMAC(key: string, move: string) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(move);
    return hmac.digest("hex");
  }
}

export default KeyGenerator;
