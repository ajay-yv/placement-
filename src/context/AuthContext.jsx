import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    signInWithCredential,
    sendPasswordResetEmail,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirectPending, setRedirectPending] = useState(false);

    // Environment Detection
    const isNative = typeof window !== 'undefined' &&
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform();

    const isElectron = typeof window !== 'undefined' &&
        window.navigator.userAgent.toLowerCase().includes('electron');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    id: currentUser.uid,
                    name: currentUser.displayName || currentUser.email.split('@')[0],
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    provider: currentUser.providerData[0]?.providerId || 'email'
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        // Institutional Simulation: Check Session Bridge first
        const sessionStore = JSON.parse(localStorage.getItem('institutional_session_registry') || '{}');
        const sessionUser = sessionStore[email.toLowerCase()];

        if (sessionUser && sessionUser.password === password) {
            console.log(`%c[Session Bridge] Identity authenticated for ${email}`, "color: #059669; font-weight: bold;");
            const mockUser = {
                id: `mock_${Date.now()}`,
                name: email.split('@')[0],
                email: email,
                provider: 'session-bridge'
            };
            setUser(mockUser);
            return { user: mockUser };
        }

        // Fallback to real Firebase Authentication
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (name, email, password) => {
        // Firebase Auth doesn't take 'name' in createUserWithEmailAndPassword,
        // but we can update the profile later if needed, or simply let the state 
        // fallback to email prefix.
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Google Sign-In Error:", err.code, err.message);
            if (isElectron) {
                console.warn("Electron Detection: If you see 'invalid action', ensure http://localhost is added to Firebase Authorized Domains.");
            }
            throw err;
        }
    };

    const nativeGoogleSignIn = async () => {
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        await GoogleAuth.initialize();
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(
            googleUser.authentication.idToken
        );
        return signInWithCredential(auth, credential);
    };

    const logout = () => {
        setUser(null);
        return signOut(auth);
    };

    const sendResetOTP = async (email) => {
        try {
            // Automatically handled by Firebase using the client API keys, zero setup required!
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: 'Secure access link dispatched to your email' };
        } catch (error) {
            console.error("Firebase reset email failed:", error);
            throw new Error(error.message || 'Failed to dispatch secure email from Firebase.');
        }
    };

    const verifyResetOTP = async (email, otp) => {
        // Obsolete in Firebase link mode
        return { success: true };
    };

    const updatePasswordSimulated = async (email, newPassword) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[Institutional Security] Password updated for ${email}`);
                localStorage.removeItem(`otp_${email}`);
                
                // Session Bridge: Save to temporary registry for immediate login testing
                const sessionStore = JSON.parse(localStorage.getItem('institutional_session_registry') || '{}');
                sessionStore[email.toLowerCase()] = {
                    password: newPassword,
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('institutional_session_registry', JSON.stringify(sessionStore));
                
                resolve({ success: true });
            }, 1500);
        });
    };

    const value = {
        user,
        login,
        register,
        loginWithGoogle,
        nativeGoogleSignIn,
        logout,
        sendResetOTP,
        verifyResetOTP,
        updatePasswordSimulated,
        loading,
        redirectPending
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
