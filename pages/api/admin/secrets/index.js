import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";
import { encryptSecret, generateToken, hashPin } from "../../../../lib/secretShare";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "GET") {
    const secrets = await db.sharedSecret.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        token: true,
        label: true,
        createdBy: true,
        createdAt: true,
        expiresAt: true,
        revoked: true,
        viewCount: true,
        lastViewedAt: true,
        pinHash: true,
        failedAttempts: true,
      },
    });
    const entitydata = secrets.map(({ pinHash, ...rest }) => ({ ...rest, hasPin: !!pinHash }));
    return res.status(200).json({ entitydata });
  }

  if (req.method === "POST") {
    const { label, value, days, pin } = req.body || {};
    if (!label?.trim() || !value?.trim()) {
      return res.status(400).json({ message: "Falta label o value" });
    }
    if (pin && !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "El código debe ser de 4 dígitos" });
    }

    const ttlDays = Number(days) > 0 ? Number(days) : 14;
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    const token = generateToken();
    const { ciphertext, iv, authTag } = encryptSecret(value.trim());
    const { pinHash, pinSalt } = pin ? hashPin(pin) : { pinHash: null, pinSalt: null };

    const created = await db.sharedSecret.create({
      data: {
        token,
        label: label.trim(),
        ciphertext,
        iv,
        authTag,
        pinHash,
        pinSalt,
        createdBy: session.user?.email || null,
        expiresAt,
      },
    });

    return res.status(201).json({ token: created.token, expiresAt: created.expiresAt });
  }

  return res.status(405).end();
}
