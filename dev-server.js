import express from 'express';
import cors from 'cors';
import sendOtp from './api/send-otp.js';
import verifyOtp from './api/verify-otp.js';
import updatePassword from './api/update-password.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// Mock Vercel Request/Response objects
const wrapHandler = (handler) => async (req, res) => {
    const vercelRes = {
        status: (code) => {
            res.status(code);
            return vercelRes;
        },
        json: (data) => {
            res.json(data);
            return vercelRes;
        }
    };
    await handler(req, vercelRes);
};

app.post('/api/send-otp', wrapHandler(sendOtp));
app.post('/api/verify-otp', wrapHandler(verifyOtp));
app.post('/api/update-password', wrapHandler(updatePassword));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `🚀 Local API Server running at http://localhost:${PORT}`);
    console.log(`\x1b[36m%s\x1b[0m`, `Checking credentials...`);
    if (process.env.SMTP_USER) {
        console.log(`✅ SMTP_USER detected: ${process.env.SMTP_USER}`);
    } else {
        console.log(`⚠️  No SMTP_USER found. Emails will be simulated (Ethereal).`);
    }
});
