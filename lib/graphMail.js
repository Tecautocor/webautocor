import axios from "axios";

// Envío de correo vía Microsoft Graph (app-only, client_credentials) usando
// el permiso de aplicación Mail.Send ("Send mail as any user") ya concedido
// a la app autocor-mailer - reemplaza SMTP básico, que Microsoft 365 rechaza
// hoy (535 Authentication unsuccessful) para este tipo de auth.
async function obtenerTokenGraph() {
  const { data } = await axios({
    method: "POST",
    url: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  return data.access_token;
}

// attachments: [{ filename, contentType, buffer }]
export async function sendMailGraph({ to, subject, html, attachments = [] }) {
  const token = await obtenerTokenGraph();
  const fromMailbox = process.env.EMAIL_USER;

  const message = {
    message: {
      subject,
      body: { contentType: "HTML", content: html },
      toRecipients: [{ emailAddress: { address: to } }],
      attachments: attachments.map((a) => ({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: a.filename,
        contentType: a.contentType,
        contentBytes: a.buffer.toString("base64"),
      })),
    },
    saveToSentItems: "true",
  };

  await axios({
    method: "POST",
    url: `https://graph.microsoft.com/v1.0/users/${fromMailbox}/sendMail`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: message,
  });
}
