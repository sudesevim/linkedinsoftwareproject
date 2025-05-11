// emails/emailHandlers.js
import sgMail from '@sendgrid/mail';
import { createWelcomeEmailTemplate } from "./emailTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendWelcomeEmail(to, name, profileUrl) {
  console.log("Sending welcome email to:", to);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to UnLinked</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to UnLinked!</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
        <p>We're thrilled to have you join our professional community! UnLinked is your platform to connect, learn, and grow in your career.</p>
        
        <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
          <ul style="padding-left: 20px;">
            <li>Complete your profile</li>
            <li>Connect with colleagues and friends</li>
            <li>Join groups relevant to your interests</li>
            <li>Explore job opportunities</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Complete Your Profile</a>
        </div>

        <p>If you have any questions or need assistance, our support team is always here to help.</p>
        <p>Best regards,<br>The UnLinked Team</p>
      </div>
    </body>
    </html>
  `;

  try {
    const msg = {
      to,
      from: SENDER_EMAIL,
      subject: "Welcome to UnLinked! 🎉",
      html,
    };
    const result = await sgMail.send(msg);
    console.log("Welcome email sent successfully:", result);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

export const sendCommentNotificationEmail = async (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await sgMail.send({
			from: SENDER_EMAIL,
			to: recipient,
			subject: "New Comment on Your Post",
			html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
			category: "comment_notification",
		});
		console.log("Comment Notification Email sent successfully", response);
	} catch (error) {
		throw error;
	}
};

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await sgMail.send({
			from: SENDER_EMAIL,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {}
};

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    console.log("Sending password reset email to:", email);
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
                <p>We received a request to reset your password for your UnLinked account. To proceed with the password reset, please click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Reset Password</a>
                </div>

                <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 16px; margin: 0;"><strong>Important Information:</strong></p>
                    <ul style="padding-left: 20px;">
                        <li>This link will expire in 1 hour</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>For security reasons, please don't share this link with anyone</li>
                    </ul>
                </div>

                <p>If you have any questions or need assistance, our support team is always here to help.</p>
                <p>Best regards,<br>The UnLinked Team</p>
            </div>
        </body>
        </html>
    `;

    try {
        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: "Reset Your UnLinked Password",
            html,
        };
        const result = await sgMail.send(msg);
        console.log("Password reset email sent successfully:", result);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};