// src/services/mailService.ts
import nodemailer from 'nodemailer';
import { config } from '../config/config';

// Create a single, reusable "transporter" object configured for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailUser,        // Your Gmail address from .env
        pass: config.gmailAppPassword, // Your App Password from .env
    },
});

/**
 * Sends an email using the pre-configured Gmail transporter.
 * @param mailOptions - The mail options object (to, subject, text, html, etc.).
 */
export const sendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
    try {
        // Set a default 'from' address if one isn't provided in the options
        const optionsWithFrom = {
            ...mailOptions,
            from: mailOptions.from || `"Financial Manager Platform" <${config.gmailUser}>`,
        };
        
        await transporter.sendMail(optionsWithFrom);
        console.log(`✅ Real email sent successfully to: ${optionsWithFrom.to}`);
    } catch (error) {
        console.error("❌ Error sending email via Gmail: ", error);
        throw new Error("Email could not be sent."); // Propagate error to the calling function
    }
};