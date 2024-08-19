import * as nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const senderEmail = process.env.SMTP_EMAIL;
  const senderPassword = process.env.SMTP_PASSWORD;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });
  await transport.verify();
  await transport.sendMail({
    to,
    subject,
    html: body,
  });
}
