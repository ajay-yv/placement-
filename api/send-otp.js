import nodemailer from 'nodemailer';
import { initAdmin } from './_lib/firebase-admin.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 600000; // 10 minutes from now

    try {
        const db = initAdmin();
        const emailKey = email.toLowerCase();
        const now = Date.now();
        let isStatelessFallback = false;

        if (db) {
            // --- ADAPTIVE AUTHENTICATION: Rate Limiting & Anomaly Detection ---
            const recentRequests = await db.collection('password_resets')
                .where('email', '==', emailKey)
                .where('createdAt', '>', now - 900000) // Last 15 minutes
                .get();

            if (recentRequests.size >= 3) {
                await db.collection('security_logs').add({
                    event: 'RATE_LIMIT_EXCEEDED',
                    email: emailKey,
                    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: now,
                    severity: 'MEDIUM'
                });
                return res.status(429).json({ 
                    success: false, 
                    message: 'Too many security requests. Please wait 15 minutes before trying again.' 
                });
            }

            await db.collection('security_logs').add({
                event: 'OTP_REQUESTED',
                email: emailKey,
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: now,
                severity: 'LOW'
            });

            await db.collection('password_resets').doc(emailKey).set({
                email: emailKey,
                otp: otp,
                expiresAt: expiresAt,
                createdAt: now
            });
        } else {
            console.warn("Firestore not available. Using stateless fallback for local testing.");
            isStatelessFallback = true;
        }

        let transporter;
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            console.log(`Initializing real SMTP service: ${process.env.SMTP_SERVICE || 'gmail'}`);
            transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE || 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            console.log("No SMTP credentials found. Creating Ethereal secure test account...");
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        }

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

        const info = await transporter.sendMail(mailOptions);
        
        let previewUrl = null;
        let demoOtp = null;
        if (!process.env.SMTP_USER) {
            previewUrl = nodemailer.getTestMessageUrl(info);
            demoOtp = otp; 
        }

        return res.status(200).json({ success: true, previewUrl, demoOtp });
    } catch (error) {
        console.error('OTP processing failed:', error);
        return res.status(500).json({ success: false, message: 'Failed to process security code. Please try again later.' });
    }
}
