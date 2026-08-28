import formidable from 'formidable';
import fs from 'fs';
import { sendMailGraph } from '../../../lib/graphMail';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: true });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nueva aplicación de empleo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #1a365d;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                border: 1px solid #e1e1e1;
                border-top: none;
                border-radius: 0 0 5px 5px;
                background-color: #f9f9f9;
            }
            .field {
                margin-bottom: 15px;
            }
            .field-label {
                font-weight: bold;
                color: #1a365d;
                display: inline-block;
                width: 180px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Nueva aplicación de empleo</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="field-label">Nombre completo:</span>
                <span>${fields.firstName} ${fields.lastName}</span>
            </div>
            <div class="field">
                <span class="field-label">Cédula/Identificación:</span>
                <span>${fields.idNumber}</span>
            </div>
            <div class="field">
                <span class="field-label">Fecha de nacimiento:</span>
                <span>${fields.birthDate}</span>
            </div>
            <div class="field">
                <span class="field-label">Ubicación:</span>
                <span>${fields.city}, ${fields.country}</span>
            </div>
            <div class="field">
                <span class="field-label">Teléfono:</span>
                <span>${fields.phone}</span>
            </div>
            <div class="field">
                <span class="field-label">Correo electrónico:</span>
                <span>${fields.email}</span>
            </div>
            <div class="field">
                <span class="field-label">Cargo de interés:</span>
                <span style="font-weight: bold; color: #1a365d;">${fields.position}</span>
            </div>
            <div class="field">
                <span class="field-label">Aspiración salarial:</span>
                <span>$${Number(fields.salaryExpectation).toLocaleString()}</span>
            </div>
        </div>
        <div class="footer">
            <p>Este correo fue generado automáticamente desde el formulario de empleo de AUTOCOR.</p>
            <p>© ${new Date().getFullYear()} AUTOCOR. Todos los derechos reservados.</p>
        </div>
        <br/><br/><br/>
    </body>
    </html>
    `;

    // Prepare attachments
    const attachments = [];
    if (files.resume) {
      const resumeFile = files.resume[0];
      attachments.push({
        filename: resumeFile.originalFilename,
        contentType: resumeFile.mimetype,
        buffer: fs.readFileSync(resumeFile.filepath),
      });
    }

    await sendMailGraph({
      to: process.env.TO_EMAIL,
      subject: `Nueva aplicación para ${fields.position}`,
      html: emailContent,
      attachments,
    });

    // Clean up: Delete the temporary file
    if (files.resume) {
      fs.unlink(files.resume[0].filepath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    console.log('Message sent to', process.env.TO_EMAIL);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}

export default handler;
