import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS_KEY,
  },
});

export const sendIvitationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SITE_URL}/invitation?token=${token}`;
  const mailOptions: Mail.Options = {
    from: "RealTimeChat <<EMAIL>>",
    to: email,
    subject: "Invitation to RealTimeChat",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your Invitation to RealTimeChat</p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env
    .NEXT_PUBLIC_SITE_URL!}/auth/new-password?token=${token}`;

  const mailOptions = {
    from: "RealTimeChat <<EMAIL>>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> reset password.</p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
