import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, 
    Target, 
    Users, 
    Zap, 
    ChevronRight, 
    Star, 
    Award, 
    MessageSquare, 
    Code, 
    Search,
    Filter,
    Clock,
    Shield,
    TrendingUp,
    CheckCircle2,
    Lightbulb,
    ArrowRight,
    Activity
} from 'lucide-react';
import clsx from 'clsx';
import careerQuestService from '../services/careerQuestService';

const CareerQuest = () => {
    const [challenges, setChallenges] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('quests'); // quests, teams, leaderboard
    const [loading, setLoading] = useState(true);

    // Mission Workspace State
    const [activeMission, setActiveMission] = useState(null);
    const [solutionText, setSolutionText] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [peerFeedback, setPeerFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hints, setHints] = useState([]);
    const [activeHintLevel, setActiveHintLevel] = useState(0);
    const [isFetchingHint, setIsFetchingHint] = useState(false);
    const [teamChat, setTeamChat] = useState([]);
    const [skillOntology, setSkillOntology] = useState({});
    const [messageDraft, setMessageDraft] = useState('');
    const [showHelp, setShowHelp] = useState(false);
    
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [teamChat]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [q, profile, lb, ontology, chat] = await Promise.all([
                    careerQuestService.getChallenges(),
                    careerQuestService.getUserProfile(),
                    careerQuestService.getGlobalLeaderboard(),
                    careerQuestService.getSkillOntology(),
                    careerQuestService.getTeamCommunications('t1')
                ]);
                setChallenges(q);
                setUserProfile(profile);
                setLeaderboard(lb);
                setSkillOntology(ontology);
                setTeamChat(chat);
            } catch (error) {
                console.error("Failed to fetch quest data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInitializeQuest = () => {
        setActiveMission(selectedQuest);
        setSelectedQuest(null);
        setSolutionText('');
        setFeedback(null);
        setPeerFeedback(null);
        setHints([]);
        setActiveHintLevel(0);
    };

    const handleGetHint = async () => {
        if (activeHintLevel >= activeMission.hints.length) return;
        setIsFetchingHint(true);
        try {
            const hint = await careerQuestService.getHint(activeMission.id, activeHintLevel);
            setHints([...hints, hint]);
            setActiveHintLevel(activeHintLevel + 1);
            // Refresh profile to reflect point deduction
            const profile = await careerQuestService.getUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingHint(false);
        }
    };

    const handleSubmitSolution = async () => {
        if (!solutionText.trim()) return;
        setIsSubmitting(true);
        try {
            const [result, peerFB, profile] = await Promise.all([
                careerQuestService.submitSolution(activeMission.id, solutionText),
                careerQuestService.getPeerFeedback(activeMission.id),
                careerQuestService.getUserProfile()
            ]);
            setFeedback(result);
            setPeerFeedback(peerFB);
            setUserProfile(profile);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageDraft.trim()) return;
        try {
            await careerQuestService.sendMessageToTeam('t1', messageDraft);
            setMessageDraft('');
            // Refresh chat
            const chat = await careerQuestService.getTeamCommunications('t1');
            setTeamChat(chat);
            
            // Auto-refresh after a second for the bot response
            setTimeout(async () => {
                const refreshedChat = await careerQuestService.getTeamCommunications('t1');
                setTeamChat(refreshedChat);
            }, 1100);
        } catch (error) {
            console.error(error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-gray-500 font-medium animate-pulse text-center">Loading Quest Deck...</div>
                </div>
            </div>
        );
    }

    if (activeMission) {
        return (
            <div className="h-[calc(100vh-100px)] flex flex-col bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                {/* Workspace Header */}
                <div className="bg-black/40 backdrop-blur-md p-4 px-6 flex items-center justify-between border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setActiveMission(null)}
                            className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-white font-bold tracking-tight">{activeMission.title}</h2>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-widest">{activeMission.company} // TARGET: {activeMission.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-green-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            TELEMETRY_LINK_ACTIVE
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Telemetry Sidebar */}
                    <div className="w-64 bg-black/20 border-r border-gray-800 p-4 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Signal Feed</h4>
                            <div className="space-y-3">
                                {Object.entries(activeMission.realTimeData || {}).map(([key, val]) => (
                                    <div key={key} className="bg-gray-900/50 border border-gray-800 p-3 rounded-lg">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="text-lg font-bold font-mono text-indigo-400">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Objective</h4>
                            <p className="text-xs text-gray-400 leading-relaxed bg-gray-800/30 p-3 rounded-xl border border-gray-800">
                                {activeMission.objective}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Intelligence Hints</h4>
                            <div className="space-y-3">
                                {hints.map((hint, idx) => (
                                    <div key={idx} className="bg-indigo-900/20 border border-indigo-800/50 p-3 rounded-xl">
                                        <p className="text-[10px] text-indigo-300 font-medium leading-relaxed italic">
                                            "{hint}"
                                        </p>
                                    </div>
                                ))}
                                {activeHintLevel < activeMission.hints.length && (
                                    <button 
                                        onClick={handleGetHint}
                                        disabled={isFetchingHint}
                                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-[10px] font-bold text-gray-400 rounded-lg transition-colors border border-gray-700"
                                    >
                                        {isFetchingHint ? 'Requesting...' : `Request Hint Level ${activeHintLevel + 1} (-10 XP)`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Workspace Area */}
                    <div className="flex-1 flex flex-col p-6 bg-gray-900/40 relative">
                        <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                            <Code className="w-4 h-4 text-indigo-400" />
                            Mission Execution Terminal
                        </h3>
                        
                        {!feedback ? (
                            <div className="flex-1 flex flex-col">
                                <textarea
                                    value={solutionText}
                                    onChange={(e) => setSolutionText(e.target.value)}
                                    placeholder="Enter your implementation strategy, code, or analysis here..."
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={handleSubmitSolution}
                                        disabled={isSubmitting || !solutionText.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>Processing <span className="animate-spin text-white">⭮</span></>
                                        ) : (
                                            <>Submit to HQ <Zap className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 max-w-2xl mx-auto w-full text-gray-900 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                            Mission Analysis
                                            {feedback.score >= 80 ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Activity className="w-8 h-8 text-amber-500" />}
                                        </h2>
                                        <p className="text-gray-500 font-medium mt-1">AI Evaluation Complete</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-indigo-600">{feedback.score}</div>
                                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Score</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                                        <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {feedback.strengths.map((item, idx) => (
                                                <li key={idx} className="text-xs text-emerald-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                        <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4" /> Areas for Improvement
                                        </h4>
                                        <ul className="space-y-2">
                                            {feedback.improvements.map((item, idx) => (
                                                <li key={idx} className="text-xs text-amber-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp className="w-4 h-4 text-indigo-600" />
                                            <h4 className="text-sm font-bold text-indigo-900">Collaboration</h4>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-black text-indigo-600">{feedback.collaborationScore}%</span>
                                            <span className="text-[10px] text-indigo-400 font-bold mb-1 uppercase">Efficiency</span>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MessageSquare className="w-4 h-4 text-purple-600" />
                                            <h4 className="text-sm font-bold text-purple-900">Originality</h4>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-black text-purple-600">High</span>
                                            <span className="text-[10px] text-purple-400 font-bold mb-1 uppercase">AI Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8">
                                    <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Team Dynamics Output
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed italic">
                                        "{feedback.sentimentAnalysis}"
                                    </p>
                                </div>

                                {peerFeedback && peerFeedback.length > 0 && (
                                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-8">
                                        <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Peer Insights
                                        </h4>
                                        <div className="space-y-4">
                                            {peerFeedback.map(pf => (
                                                <div key={pf.id} className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-900">{pf.user}</span>
                                                            <span className={clsx(
                                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                                                                pf.sentiment === 'Positive' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                                            )}>
                                                                {pf.sentiment}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-medium">{pf.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 leading-relaxed italic">"{pf.feedback}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {feedback.badgeEarned && (
                                    <div className="flex items-center justify-center p-6 bg-indigo-50 border border-indigo-100 rounded-2xl mb-8">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white">
                                                <Award className="w-8 h-8 text-amber-500" />
                                            </div>
                                            <p className="text-sm font-bold text-indigo-900">Achievement Unlocked!</p>
                                            <p className="text-xl font-black text-amber-600">{feedback.badgeEarned}</p>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setActiveMission(null)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all"
                                >
                                    Return to HQ
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Career Quest</h1>
                    <p className="text-gray-500 mt-1">Embark on industry missions, solve real challenges, and level up your career.</p>
                </div>
                <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setActiveTab('quests')}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'quests' ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Quests
                    </button>
                    <button 
                        onClick={() => setActiveTab('teams')}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'teams' ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Your Team
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaderboard')}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                            activeTab === 'leaderboard' ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Leaderboard
                    </button>
                    <button 
                        onClick={() => setShowHelp(true)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors ml-2"
                        title="How to play"
                    >
                        <Lightbulb className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Main View */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'quests' && (
                            <motion.div 
                                key="quests"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by company, skill, or role..."
                                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                                        />
                                    </div>
                                    <button className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100">
                                        <Filter className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {challenges.map((quest) => (
                                        <motion.div 
                                            key={quest.id}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                                            onClick={() => setSelectedQuest(quest)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <Code className="w-6 h-6" />
                                                </div>
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                    quest.difficulty === 'Hard' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                                )}>
                                                    {quest.difficulty}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{quest.title}</h3>
                                            <p className="text-sm font-medium text-indigo-600 mb-4">{quest.company}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {quest.skills.slice(0, 3).map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {quest.skills.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold">
                                                        +{quest.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <Clock className="w-4 h-4 mr-1.5" />
                                                    Ends {new Date(quest.deadline).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-amber-600 font-bold text-sm">
                                                    <Zap className="w-4 h-4 mr-1 fill-amber-500 stroke-amber-500" />
                                                    {quest.rewardPoints} XP
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'teams' && (
                            <motion.div 
                                key="teams"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">The Binary Bandits</h2>
                                                <p className="text-indigo-100">Team Efficiency: 94%</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                                <p className="text-xs text-indigo-100 opacity-80 mb-1">Quests Active</p>
                                                <p className="text-2xl font-bold">1</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                                <p className="text-xs text-indigo-100 opacity-80 mb-1">Team Rank</p>
                                                <p className="text-2xl font-bold">#4</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                                <p className="text-xs text-indigo-100 opacity-80 mb-1">Collaboration</p>
                                                <p className="text-2xl font-bold">High</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
                                            Collaboration Hub
                                        </h3>
                                        <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {teamChat.map(msg => (
                                                <div key={msg.id} className="flex gap-3">
                                                    <div className={clsx(
                                                        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white",
                                                        msg.user === 'You' ? "bg-indigo-600" : "bg-gray-400"
                                                    )}>
                                                        {msg.user[0]}
                                                    </div>
                                                    <div className={clsx(
                                                        "rounded-2xl p-3 flex-1",
                                                        msg.user === 'You' ? "bg-indigo-50 border border-indigo-100" : "bg-gray-50 border border-gray-100"
                                                    )}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-[10px] font-bold text-gray-900">{msg.user}</p>
                                                            <p className="text-[8px] text-gray-400 font-bold uppercase">{msg.time}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-600">{msg.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={chatEndRef} />
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <input 
                                                type="text" 
                                                value={messageDraft}
                                                onChange={(e) => setMessageDraft(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Message the team..."
                                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <button 
                                                onClick={handleSendMessage}
                                                className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                                            Active Contribution
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Solution Synthesis</p>
                                                    <span className="text-[10px] font-black text-emerald-600">92%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500 h-full w-[92%]" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Peer Validation</p>
                                                    <span className="text-[10px] font-black text-indigo-600">65%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-500 h-full w-[65%]" />
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-gray-50">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center transition-all">Automated Stand-up Summary</p>
                                                <p className="text-xs text-gray-500 italic text-center leading-relaxed">
                                                    "Team is successfully iterating on the core logic. Ananya and Rahul are synced on the data layer."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <motion.div 
                                key="leaderboard"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Elite Challengers</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {leaderboard.map((user) => (
                                        <div key={user.name} className={clsx(
                                            "flex items-center justify-between p-4 px-6 transition-colors",
                                            user.name === 'You' ? "bg-indigo-50/50" : "hover:bg-gray-50"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <span className={clsx(
                                                    "w-8 text-center font-bold text-sm",
                                                    user.rank <= 3 ? "text-amber-500" : "text-gray-400"
                                                )}>
                                                    #{user.rank}
                                                </span>
                                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-600 uppercase">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.badges} Badges Collected</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-indigo-600">{user.points.toLocaleString()}</p>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Total XP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: User Stats & Info */}
                <div className="lg:col-span-4 space-y-6">
                    {/* User Profile Summary */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center text-3xl text-white font-black shadow-lg shadow-indigo-200">
                                {userProfile?.name[0]}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                                <Trophy className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mt-2">{userProfile?.name}</h2>
                        <p className="text-sm font-medium text-gray-500 tracking-tight">Level 14 Quest Master</p>
                        
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <div>
                                <p className="text-2xl font-black text-indigo-600">{userProfile?.totalPoints}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">XP</p>
                            </div>
                            <div className="h-8 w-px bg-gray-100" />
                            <div>
                                <p className="text-2xl font-black text-indigo-600">{userProfile?.rank}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Rank</p>
                            </div>
                            <div className="h-8 w-px bg-gray-100" />
                            <div>
                                <p className="text-2xl font-black text-indigo-600">{userProfile?.badges.length}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Badges</p>
                            </div>
                        </div>
                    </div>

                    {/* Skill Ontology Tree */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <Target className="w-4 h-4 text-indigo-600" />
                            Skill Ontology
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(skillOntology).map(([group, skills]) => (
                                <div key={group}>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{group}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => {
                                            const val = userProfile?.skillTree[skill] || 0;
                                            return (
                                                <div key={skill} className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-bold text-gray-600">{skill}</span>
                                                        <span className="text-[10px] font-black text-indigo-600">{val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white h-1 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${val}%` }}
                                                            className="bg-indigo-600 h-full"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badges Locker */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <Award className="w-4 h-4 text-indigo-600" />
                            Achievements
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {userProfile?.badges.map((badge) => (
                                <motion.div 
                                    key={badge}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 cursor-help"
                                    title={badge}
                                >
                                    <Star className="w-6 h-6 fill-amber-500" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quest Modal / Detail View */}
            <AnimatePresence>
                {selectedQuest && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setSelectedQuest(null)}
                                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-gray-900">{selectedQuest.title}</h2>
                                        <div className="flex items-center text-gray-500 mt-1 font-medium">
                                            <span className="text-indigo-600">{selectedQuest.company}</span>
                                            <span className="mx-2">•</span>
                                            <span>Industry Partner Challenge</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-8">
                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                                <Target className="w-5 h-5 mr-2 text-indigo-600" />
                                                Mission Objective
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                {selectedQuest.description}
                                                <br /><br />
                                                <span className="font-bold text-gray-900 italic">Target: {selectedQuest.objective}</span>
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                                                Requirements
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedQuest.skills.map(skill => (
                                                    <div key={skill} className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3" />
                                                        <span className="text-sm font-semibold text-gray-700">{skill}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="pt-4 flex gap-4">
                                            <button 
                                                onClick={handleInitializeQuest}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-1 flex items-center justify-center"
                                            >
                                                Initialize Quest
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </button>
                                            <button className="px-6 py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center">
                                                <Users className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
                                            <h4 className="flex items-center font-black text-amber-700 uppercase tracking-widest text-[10px] mb-4">
                                                <Star className="w-4 h-4 mr-2" />
                                                Quest Rewards
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-amber-900/60">XP Multiplier</span>
                                                    <span className="text-sm font-black text-amber-600">x1.5</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-amber-900/60">Total XP</span>
                                                    <span className="text-sm font-black text-amber-600">+{selectedQuest.rewardPoints} XP</span>
                                                </div>
                                                <div className="pt-4 border-t border-amber-100">
                                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Badges at stake</p>
                                                    <div className="flex gap-2">
                                                        {selectedQuest.badges.map(b => (
                                                            <div key={b} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-500" title={b}>
                                                                <Award className="w-6 h-6" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                                            <h4 className="flex items-center font-black text-indigo-700 uppercase tracking-widest text-[10px] mb-4">
                                                <Lightbulb className="w-4 h-4 mr-2" />
                                                AI Hint System
                                            </h4>
                                            <p className="text-xs text-indigo-900/60 leading-relaxed">
                                                Stuck? Get real-time hints based on industry best practices.
                                            </p>
                                            <button 
                                                onClick={handleInitializeQuest}
                                                className="w-full mt-4 bg-white text-indigo-600 font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Start Mission to Unlock Hints
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedQuest.companyProfile && (
                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Industry Intelligence: {selectedQuest.company}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Industry</p>
                                                <p className="text-xs font-bold text-gray-700">{selectedQuest.companyProfile.industry}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Founded</p>
                                                <p className="text-xs font-bold text-gray-700">{selectedQuest.companyProfile.founded}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Headquarters</p>
                                                <p className="text-xs font-bold text-gray-700">{selectedQuest.companyProfile.headquarters}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl col-span-2 md:col-span-1">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Mission</p>
                                                <p className="text-[10px] font-medium text-gray-600 leading-tight">{selectedQuest.companyProfile.mission}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerQuest;
