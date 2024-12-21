import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS_KEY,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_SITE_URL!}/auth/new-verification?token=${token}`;

  const mailOptions: Mail.Options = {
    from: "RealTimeChat <<EMAIL>>",
    to: email,
    subject: "Email Confirmation",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return { success: "verification email sent successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Error sending email" };
  }
};
