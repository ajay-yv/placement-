import React from 'react';
import { Briefcase, MapPin, Lock, Unlock, CheckCircle } from 'lucide-react';
import { referrals } from '../data/referralData';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const Referrals = () => {
    const { prediction, setPrediction, referralRequests, addReferralRequest } = useApp();
    const userScore = prediction || 0;
    const [showSimulator, setShowSimulator] = React.useState(false);

    const handleRequest = (id) => {
        addReferralRequest(id);
    };

    const requestedReferrals = referrals.filter(ref => referralRequests.includes(ref.id));

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Referral Marketplace</h1>
                <p className="mt-2 text-gray-600">Connect with alumni for referrals. Unlock top companies by improving your prep score.</p>

                <div className="mt-6 flex flex-col items-center space-y-4">
                    <div className="inline-flex items-center bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 shadow-sm">
                        <div className="mr-4">
                            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Your Prep Score</p>
                            <p className="text-3xl font-black text-indigo-600 leading-none">{userScore}%</p>
                        </div>
                        <div className="h-10 w-px bg-indigo-200 mx-2"></div>
                        <button
                            onClick={() => setShowSimulator(!showSimulator)}
                            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 underline underline-offset-4"
                        >
                            {showSimulator ? "Close Sim" : "Boost Score"}
                        </button>
                    </div>

                    {/* Score Simulator for Testing */}
                    {showSimulator && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="w-full max-w-xs bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                        >
                            <label htmlFor="score-slider" className="block text-xs font-bold text-gray-400 uppercase mb-2">
                                Reality Distortion (Demo)
                            </label>
                            <input
                                type="range"
                                id="score-slider"
                                min="0"
                                max="100"
                                value={userScore}
                                onChange={(e) => setPrediction(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                                <span>NOOB</span>
                                <span>ELITE</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Active Requests Section */}
            {requestedReferrals.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">My Active Applications</h2>
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
                            {requestedReferrals.length} Pending
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {requestedReferrals.map(ref => (
                            <div key={`active-${ref.id}`} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                                        {ref.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 leading-tight">{ref.name}</p>
                                        <p className="text-xs text-gray-500">{ref.company} • {ref.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-yellow-700">Under Review</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Briefcase className="mr-2 text-indigo-600" />
                    Available Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {referrals.map((ref, idx) => {
                        const isUnlocked = userScore >= ref.minScore;

                        return (
                            <motion.div
                                key={ref.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-75'
                                    }`}
                            >
                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                            <Lock className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600">Locked</p>
                                        <p className="text-xs text-gray-500 mt-1">Requires {ref.minScore}% Score</p>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                            {ref.name.charAt(0)}
                                        </div>
                                        {isUnlocked ? (
                                            <span className={`px-2 py-1 text-xs rounded-full border ${ref.available ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {ref.available ? 'Available' : 'Busy'}
                                            </span>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                                    Locked
                                                </span>
                                                <p className="text-[10px] font-bold text-red-500 mt-1">
                                                    Need {ref.minScore - userScore}% more
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{ref.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{ref.role}</p>

                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center">
                                            <Briefcase size={14} className="mr-2" />
                                            {ref.company}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={14} className="mr-2" />
                                            {ref.location}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRequest(ref.id)}
                                        disabled={!isUnlocked || !ref.available || referralRequests.includes(ref.id)}
                                        className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${!isUnlocked || !ref.available
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : referralRequests.includes(ref.id)
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isUnlocked ? (
                                            referralRequests.includes(ref.id) ? (
                                                <React.Fragment>
                                                    <CheckCircle size={16} className="mr-2" />
                                                    Requested
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    Request Referral
                                                </React.Fragment>
                                            )
                                        ) : (
                                            <React.Fragment>
                                                <Lock size={14} className="mr-2" />
                                                Locked
                                            </React.Fragment>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Referrals;
