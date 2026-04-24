import { EmailClient, type EmailMessage } from "@azure/communication-email";
import { env } from "@/env";

const client = new EmailClient(env.AZURE_COMMUNICATION_CONNECTION_STRING);

export async function sendContactEmail({
  senderEmail,
  subject,
  html,
}: {
  senderEmail: string;
  subject: string;
  html: string;
}) {
  const message: EmailMessage = {
    senderAddress: env.AZURE_COMMUNICATION_SENDER_EMAIL,
    content: { subject, html },
    recipients: {
      to: [{ address: env.CONTACT_RECIPIENT_EMAIL }],
    },
    replyTo: [{ address: senderEmail }],
  };

  const poller = await client.beginSend(message);
  await poller.pollUntilDone();
}
