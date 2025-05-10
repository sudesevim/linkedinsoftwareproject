// emails/emailHandlers.js
import { MailtrapClient } from "mailtrap";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER;

const client = new MailtrapClient({ token: TOKEN });

export async function sendWelcomeEmail(to, name, profileUrl) {
  const html = createWelcomeEmailTemplate(name, profileUrl);

  await client.send({
    from: {
      email: SENDER_EMAIL,
      name: "LinkedIn Team",
    },
    to: [
      {
        email: to,
      },
    ],
    subject: "Welcome to LinkedIn! 🎉",
    html,
    category: "Welcome",
  });
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
		const response = await mailtrapClient.send({
			from: sender,
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
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {}
};