import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Loader2, ShieldCheck, AlertCircle, KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState('EMAIL'); // EMAIL, OTP, PASSWORD, SUCCESS
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [demoOtp, setDemoOtp] = useState(null);
    
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { sendResetOTP, verifyResetOTP, updatePasswordSimulated } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await sendResetOTP(email);
            setStep('OTP');
            setMessage('We sent a secure 4-digit code to your email.');
            if (res.previewUrl) setPreviewUrl(res.previewUrl);
            if (res.demoOtp) setDemoOtp(res.demoOtp);
        } catch (err) {
            setError(err.message || 'Failed to dispatch security code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await verifyResetOTP(email, otp);
            setStep('PASSWORD');
            setMessage('OTP Verified. Please enter your new password.');
        } catch (err) {
            setError(err.message || 'Invalid security code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        setIsLoading(true);
        try {
            await updatePasswordSimulated(email, password);
            setStep('SUCCESS');
        } catch (err) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 transform transition-all duration-500 hover:scale-110">
                        {step === 'SUCCESS' ? <CheckCircle className="h-8 w-8 text-white" /> : <ShieldCheck className="h-8 w-8 text-white" />}
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    {step === 'EMAIL' && 'Forgot Password?'}
                    {step === 'OTP' && 'Enter OTP'}
                    {step === 'PASSWORD' && 'Reset Password'}
                    {step === 'SUCCESS' && 'Success!'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 max-w-xs mx-auto">
                    {step === 'EMAIL' && 'No worries, we\'ll send you reset instructions.'}
                    {step === 'OTP' && 'We sent a secure 4-digit code to your email.'}
                    {step === 'PASSWORD' && 'Please enter a new password for your account.'}
                    {step === 'SUCCESS' && 'Your password has been successfully reset.'}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
                    
                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                                <p className="text-xs font-bold text-red-800 tracking-wide">{error}</p>
                            </div>
                        </div>
                    )}
                    {message && step !== 'SUCCESS' && (
                        <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
                                <p className="text-xs font-bold text-emerald-800 tracking-wide">{message}</p>
                            </div>
                        </div>
                    )}
                    {previewUrl && step === 'OTP' && (
                        <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-indigo-800 tracking-wide mb-1">Demo Mode Activated</p>
                                <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline">
                                    Click here to view the Ethereal Test Email
                                </a>
                            </div>
                        </div>
                    )}

                    {step === 'EMAIL' && (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSendOTP}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white text-sm transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Code'}
                            </button>
                        </form>
                    )}

                    {step === 'OTP' && (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleVerifyOTP}>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Enter 4-Digit OTP</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <KeyRound className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength="4"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white text-sm tracking-[0.5em] font-mono text-center transition-all"
                                        placeholder="••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Code'}
                            </button>
                            <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-center text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium">
                                Didn't receive the OTP? Click to resend
                            </button>
                        </form>
                    )}

                    {step === 'PASSWORD' && (
                        <form className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleResetPassword}>
                             <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600"
                                        placeholder="Confirm email address"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Password'}
                            </button>
                        </form>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-6 animate-in zoom-in-95 duration-700">
                             <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Password Secured</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                                Your account password has been successfully updated.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-emerald-100 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all hover:scale-[1.02]"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {step !== 'SUCCESS' && (
                        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                            <Link to="/login" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                &copy; 2026 Placement Tracker &bull; All Rights Reserved
            </p>

            {/* In-App Automated Email Delivery Simulator */}
            {demoOtp && step === 'OTP' && (
                <div className="fixed top-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 animate-in slide-in-from-top-12 fade-in duration-700 z-50">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                        <div className="flex items-center space-x-2">
                            <div className="bg-indigo-100 p-1.5 rounded-full">
                                <Mail className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-800">New Email Received</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Just now</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 mb-1 font-semibold">From: security@placementtracker.com</p>
                        <p className="text-[10px] text-gray-500 mb-3 font-semibold">To: {email}</p>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Your Security Access Code</h4>
                        <p className="text-xs text-gray-600 leading-relaxed mb-4">
                            You requested a password reset. Your secure access code is:
                        </p>
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center mb-2 shadow-inner">
                            <span className="text-2xl font-mono font-bold tracking-[0.3em] text-indigo-700">{demoOtp}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setDemoOtp(null)}
                        className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors text-xs font-bold shadow-sm focus:outline-none"
                    >
                        &times;
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl"></div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
