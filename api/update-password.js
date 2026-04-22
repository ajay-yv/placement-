import { initAdmin } from './_lib/firebase-admin.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    try {
        const db = initAdmin();
        
        if (db) {
            // In a real-world app, you would also use firebase-admin auth to update the user
            // But for this institutional simulation, we store it in a users collection
            await db.collection('users').doc(email.toLowerCase()).set({
                password: newPassword, // Note: In production, always salt and hash passwords!
                updatedAt: Date.now()
            }, { merge: true });

            return res.status(200).json({ success: true, message: 'Password updated successfully in database.' });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: 'Database not connected. Password updated in local simulation mode.' 
            });
        }
    } catch (error) {
        console.error('Password update failed:', error);
        return res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
}
