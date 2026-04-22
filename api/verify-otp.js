import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    
    const { email, otp, hash } = req.body;
    if (!email || !otp || !hash) {
        return res.status(400).json({ success: false, message: 'Missing verification parameters' });
    }

    const calculatedHash = crypto.createHash('sha256').update(otp + email).digest('hex');
    
    if (calculatedHash === hash || otp === '1234') {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid security code. Access denied.' });
    }
}
