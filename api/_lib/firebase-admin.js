import admin from 'firebase-admin';

export function initAdmin() {
    if (admin.apps.length === 0) {
        try {
            const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
            
            if (serviceAccount) {
                const config = JSON.parse(serviceAccount);
                admin.initializeApp({
                    credential: admin.credential.cert(config)
                });
                console.log('Firebase Admin initialized with service account.');
            } else {
                // If no service account, try default or just log it
                // We'll catch the error if it fails to initialize
                admin.initializeApp();
                console.log('Firebase Admin initialized with default credentials.');
            }
        } catch (error) {
            console.warn('Firebase Admin could not initialize (Normal for local dev without credentials). Verification will use stateless mode.');
            return null; // Return null to indicate mock/stateless mode
        }
    }
    try {
        const db = admin.firestore();
        // Test if db is actually functional by checking settings
        if (!process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error('No credentials');
        }
        return db;
    } catch (e) {
        console.warn('⚠️  Database not connected (No credentials). Using Mock DB for testing.');
        // Return a mock object that mimics Firestore basic behavior to prevent crashes
        return {
            collection: () => ({
                doc: () => ({
                    set: async () => {},
                    get: async () => ({ exists: false }),
                    delete: async () => {}
                }),
                where: () => ({
                    get: async () => ({ size: 0, docs: [] })
                }),
                add: async () => {}
            })
        };
    }
}
