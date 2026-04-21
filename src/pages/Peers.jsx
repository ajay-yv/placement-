import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, TrendingUp, Users, ArrowUp, Map as MapIcon, Compass, Star, Calendar, MessageSquare, ChevronRight, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

const CareerHub = () => {
    const { interviewMetrics, mySkills } = useApp();
    const [selectedPath, setSelectedPath] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showRegistry, setShowRegistry] = useState(false);
    const [activeStep, setActiveStep] = useState(null);

    // Mock Trajectory Data
    const trajectories = [
        {
            title: "Technical Leadership Track",
            steps: [
                { role: "Frontend Engineer", skills: "React, CSS X, TypeScript", duration: "1-2 Years" },
                { role: "Senior Engineer", skills: "System Design, Team Leadership", duration: "3-5 Years" },
                { role: "Technical Architect", skills: "High-level Design, Infrastructure", duration: "6-8 Years" },
                { role: "VP of Engineering", skills: "Strategy, People Ops", duration: "10+ Years" }
            ]
        },
        {
            title: "Product Specialization Track",
            steps: [
                { role: "Software Engineer", skills: "Core Dev, Testing", duration: "1-2 Years" },
                { role: "Product Engineer", skills: "UX, Prototyping, Strategy", duration: "3-5 Years" },
                { role: "Staff Product Engineer", skills: "Product Architecture", duration: "6-8 Years" },
                { role: "Head of Product", skills: "Market Analysis, Growth", duration: "10+ Years" }
            ]
        }
    ];

    // Mock Mentor Data
    const mentors = [
        { name: "Sarah Chen", role: "Principal Engineer @ Google", affinity: 98, topic: "Backend Scalability" },
        { name: "Alex Rivera", role: "Design Lead @ Airbnb", affinity: 92, topic: "UX Systems" },
        { name: "Jessica Wu", role: "CTO @ Fintech Startup", affinity: 89, topic: "Career Growth" }
    ];

    // Dynamic Aptitude derived from real-time interview behavior
    const aptitudeData = [
        { subject: 'Confidence', A: interviewMetrics.confidence * 1.5, fullMark: 150 },
        { subject: 'Emotional Stability', A: interviewMetrics.sentiment === 'Positive' ? 140 : 100, fullMark: 150 },
        { subject: 'Domain Mastery', A: Math.min(150, 40 + (mySkills.length * 15)), fullMark: 150 },
        { subject: 'Extraversion', A: interviewMetrics.sentiment === 'Positive' ? 130 : 90, fullMark: 150 },
        { subject: 'Focus Stability', A: interviewMetrics.focus * 1.5, fullMark: 150 },
    ];

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    // Dynamic XAI based on real metrics
    const getDynamicXAI = () => {
        if (interviewMetrics.confidence < 70) {
            return "Current trajectory is impacted by vocal stability markers. Mentor Jessica Wu is recommended to improve 'Presence' before your next benchmark.";
        }
        if (mySkills.length < 5) {
            return "Technical depth node is currently undersold. Connect with Sarah Chen to align your React/System Design skills with Google's L4 entry requirements.";
        }
        return `Mentor Sarah Chen is recommended based on your high Confidence score (${interviewMetrics.confidence}%) and current skill overlap. Your trajectory matches the top 5% of Architect aspirants.`;
    };

    // Mock Peer Data (Retained for competitive context)
    const peerData = [
        { name: 'You', score: 82 },
        { name: 'Peer A', score: 90 },
        { name: 'Peer B', score: 75 },
        { name: 'Peer C', score: 85 },
        { name: 'Peer D', score: 80 },
        { name: 'Peer E', score: 95 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Compass size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Institutional Strategy Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hyper-Personalized Pathing</h1>
                    <p className="text-gray-500 font-medium">AI-driven trajectories and industry micro-mentorship.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleSync}
                        className={clsx(
                            "px-6 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center shadow-sm",
                            isSyncing ? "opacity-50" : "hover:border-indigo-600 hover:text-indigo-600"
                        )}
                    >
                        <Users size={14} className={clsx("mr-2", isSyncing && "animate-spin")} />
                        {isSyncing ? "Scanning Market..." : "Sync Market Pulse"}
                    </button>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                        {trajectories.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedPath(i)}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                    selectedPath === i ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {t.title}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isSyncing && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-indigo-600 p-2 rounded-xl text-center"
                    >
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] animate-pulse">
                            Institutional Neural Network Synchronizing with Industry Trends...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Trajectory Roadmap */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <MapIcon size={120} className="text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                            <TrendingUp className="mr-3 text-indigo-600" />
                            Predicted Professional Growth
                        </h2>

                        <div className="relative">
                            <div className="absolute left-6 top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>
                            <div className="space-y-12">
                                {trajectories[selectedPath].steps.map((step, i) => (
                                    <motion.div 
                                        key={i}
                                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative pl-12 group cursor-pointer"
                                    >
                                        <div className={clsx(
                                            "absolute left-[1.125rem] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 transition-all group-hover:scale-125",
                                            i === 0 ? "bg-indigo-600 scale-125 ring-4 ring-indigo-100" : "bg-gray-300 group-hover:bg-indigo-400"
                                        )}></div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight uppercase">{step.role}</h3>
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{step.duration}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mb-3">Target Skills: <span className="text-indigo-600">{step.skills}</span></p>
                                            <AnimatePresence>
                                                {activeStep === i && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="mb-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-relaxed"
                                                    >
                                                        Goal: Master {step.skills.split(',')[0]} and establish architectural foundations.
                                                        <br/>Industry Saturation: Low (High Demand)
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div className="flex space-x-2">
                                                <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">Milestone Marker</div>
                                                {i === 0 && <div className="px-3 py-1 bg-green-50 rounded-lg text-[10px] font-bold text-green-600 uppercase tracking-widest border border-green-100 italic">Current Node</div>}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Mentors Carousel */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 flex items-center tracking-tight">
                                <Users className="mr-3 text-indigo-600" />
                                Industry Micro-Mentors
                            </h2>
                            <button 
                                onClick={() => setShowRegistry(true)}
                                className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center"
                            >
                                View Registry <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mentors.map((mentor, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold uppercase text-xl border border-indigo-200 shadow-sm">
                                            {mentor.name.charAt(0)}
                                        </div>
                                        <div className="px-2 py-1 bg-indigo-50 rounded-lg flex items-center space-x-1">
                                            <Star size={10} className="text-indigo-600 fill-current" />
                                            <span className="text-[10px] font-black text-indigo-600 uppercase">{mentor.affinity}% Match</span>
                                        </div>
                                    </div>
                                    <h3 className="text-md font-black text-gray-900 truncate mb-1">{mentor.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 truncate">{mentor.role}</p>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start space-x-2">
                                            <MessageSquare size={12} className="text-indigo-500 mt-1" />
                                            <span className="text-xs text-gray-600 font-medium leading-tight">Focus: {mentor.topic}</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <Calendar size={12} className="text-indigo-500 mt-0.5" />
                                            <span className="text-xs text-gray-600 font-medium italic">Next Slot: 15m Session</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedMentor(mentor)}
                                        className="w-full py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-gray-200"
                                    >
                                        Book Protocol
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Aptitude & Rank */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Aptitude Radar */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                            <Star className="mr-2 text-indigo-600" size={16} />
                            Personality Index
                        </h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aptitudeData}>
                                    <PolarGrid stroke="#f1f5f9" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="You"
                                        dataKey="A"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] font-medium text-indigo-700 leading-relaxed italic">
                                "{getDynamicXAI()}"
                            </p>
                        </div>
                    </section>

                    {/* Competitive Context (Simplified charts from previous view) */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                            <Trophy className="mr-2 text-indigo-600" size={16} />
                            Competitive Context
                        </h2>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peerData}>
                                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-gray-900 text-white p-2 rounded-lg text-[10px] font-black uppercase">
                                                    {payload[0].payload.name}: {payload[0].value}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Rank: #2 / 1240</span>
                            <span className="text-indigo-600">92nd Percentile</span>
                        </div>
                    </section>

                    {/* Explainable AI Insight */}
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl text-white relative h-full">
                        <div className="absolute top-4 right-4 opacity-20">
                            <UserCheck size={32} />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-indigo-300">XAI Career Insight</h2>
                        <p className="text-[11px] font-medium leading-relaxed opacity-90 italic">
                            "{getDynamicXAI()}"
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest">Confidence: 0.942</span>
                            <span className="bg-indigo-500/20 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-indigo-300">Target: Google</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals for Simulation */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white max-w-md w-full rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                                <Calendar size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Protocol Initiated</h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                You have successfully reserved a 15-minute mentorship slot with <span className="text-indigo-600 font-black">{selectedMentor.name}</span>.
                                <br/><span className="text-[10px] uppercase font-black tracking-widest mt-2 block text-gray-400">Institutional ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </p>
                            <button 
                                onClick={() => setSelectedMentor(null)}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                            >
                                Confirm & Return
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {showRegistry && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            className="bg-white max-w-lg w-full h-[80vh] rounded-[2.50rem] p-10 flex flex-col shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setShowRegistry(false)}
                                className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Mentor Registry</h2>
                            <p className="text-gray-500 font-medium mb-8">Access the complete institutional mentorship database.</p>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-300 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 font-bold text-gray-400 uppercase">
                                                M{i+1}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">Researcher {Math.random().toString(36).substr(2, 5)}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Principal @ FinSight Systems</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Ranking: #12 / 450</span>
                                <ArrowUp size={16} className="text-indigo-600" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerHub;
