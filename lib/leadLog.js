import db from "./db";

export async function logLead({ formulario, suborigen, nombre, email, telefono, ciudad }) {
  try {
    await db.leadLog.create({
      data: { formulario, suborigen, nombre, email, telefono, ciudad },
    });
  } catch (err) {
    console.log("logLead: error guardando lead (no bloquea la respuesta)", err);
  }
}
