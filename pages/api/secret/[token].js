import db from "../../../lib/db";
import { decryptSecret, verifyPin } from "../../../lib/secretShare";

const MAX_ATTEMPTS = 5;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { token } = req.query;
  const { pin } = req.body || {};

  const record = await db.sharedSecret.findUnique({ where: { token } });

  if (!record || record.revoked || record.expiresAt < new Date()) {
    return res.status(410).json({ message: "Este link ya no está disponible" });
  }

  if (record.pinHash) {
    if (!pin) {
      return res.status(400).json({ message: "Falta el código" });
    }
    const valid = verifyPin(pin, record);
    if (!valid) {
      const failedAttempts = record.failedAttempts + 1;
      const lockedOut = failedAttempts >= MAX_ATTEMPTS;
      await db.sharedSecret.update({
        where: { id: record.id },
        data: { failedAttempts, revoked: lockedOut },
      });
      if (lockedOut) {
        return res.status(410).json({ message: "Demasiados intentos fallidos, link bloqueado" });
      }
      return res.status(401).json({
        message: "Código incorrecto",
        attemptsLeft: MAX_ATTEMPTS - failedAttempts,
      });
    }
  }

  await db.sharedSecret.update({
    where: { id: record.id },
    data: { viewCount: { increment: 1 }, lastViewedAt: new Date(), failedAttempts: 0 },
  });

  const value = decryptSecret(record);
  return res.status(200).json({ value });
}
