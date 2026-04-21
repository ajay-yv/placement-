import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = crypto.createHash('sha256').update(otp + email).digest('hex');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'no-reply@placementtracker.com',
            to: email,
            subject: 'Your Placement Application Security Code',
            text: `Your security access code is: ${otp}\n\nThis code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h2>Account Security Protocol</h2>
                    <p>You requested a secure verification. Your access code is:</p>
                    <div style="font-size: 32px; font-weight: bold; background: #eef2ff; color: #4f46e5; padding: 20px; border-radius: 8px; letter-spacing: 6px; display: inline-block; margin: 15px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 13px; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this, please safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, hash });
    } catch (error) {
        console.error('SMTP sending failed:', error);
        return res.status(500).json({ success: false, message: 'Failed to dispatch email. Check SMTP configuration.' });
    }
}
