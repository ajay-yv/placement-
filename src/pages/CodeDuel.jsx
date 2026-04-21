
import React, { useState, useEffect } from 'react';
import { Swords, Play, Trophy, AlertTriangle, Code, Timer, ChevronLeft, ChevronRight, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { duelProblems } from '../data/duelData';
import { duelService } from '../services/duelService';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const CodeDuel = () => {
    const { duelStats, updateDuelStats } = useApp();
    const [problemIndex, setProblemIndex] = useState(0);
    const activeProblem = duelProblems?.[problemIndex] || { title: 'Loading...', starterCode: '', difficulty: 'Easy', testCases: [{input:[], output:''}] };
    const [userCode, setUserCode] = useState(activeProblem?.starterCode || '');
    const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, won, lost
    const [botProgress, setBotProgress] = useState(0);
    const [userProgress, setUserProgress] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [matchPoints, setMatchPoints] = useState(0);

    // Reset editor when problem changes
    useEffect(() => {
        if (activeProblem) {
            setUserCode(activeProblem.starterCode || '');
            setUserProgress(0);
            setBotProgress(0);
            setTimeElapsed(0);
            setGameStatus('idle');
        }
    }, [problemIndex, activeProblem?.starterCode]);

    useEffect(() => {
        let interval;
        if (gameStatus === 'playing') {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);

                // Bot Logic: Realistic progression from service
                setBotProgress(prev => {
                    if (prev >= 100) {
                        setGameStatus('lost');
                        return 100;
                    }
                    const diff = activeProblem?.difficulty || 'Easy';
                    const increment = duelService.getBotProgression(diff, prev, timeElapsed);
                    return Math.min(prev + increment, 100);
                });
            }, 100);
        }
        if (gameStatus === 'lost') {
            updateDuelStats('lost');
        }
        return () => clearInterval(interval);
    }, [gameStatus, activeProblem?.difficulty, timeElapsed]);

    const startGame = () => {
        setGameStatus('playing');
        setBotProgress(0);
        setUserProgress(0);
        setTimeElapsed(0);
        if (activeProblem) setUserCode(activeProblem.starterCode || '');
    };

    const handleCodeChange = (e) => {
        const code = e.target.value;
        setUserCode(code);
        // Mock user progress based on length (just for visual)
        const lengthProgress = Math.min((code.length / 50) * 100, 95);
        setUserProgress(lengthProgress);
    };

    const submitCode = () => {
        if (gameStatus !== 'playing') return;

        try {
            const funcNameMatch = activeProblem?.starterCode?.match(/function\s+(\w+)/);
            const functionName = funcNameMatch?.[1] || "solution";

            const wrapper = `
                ${userCode}
                if (typeof ${functionName} === 'undefined') {
                    throw new Error("Function '${functionName}' not found in your code!");
                }
                return ${functionName};
            `;

            const solveFn = new Function(wrapper)();
            if (typeof solveFn !== 'function') throw new Error("Result is not a function!");

            let allPassed = true;
            for (let test of (activeProblem?.testCases || [])) {
                const result = solveFn(...test.input);
                if (JSON.stringify(result) !== JSON.stringify(test.output)) {
                    allPassed = false;
                    alert(`Test Failed!\nInput: ${JSON.stringify(test.input)}\nExpected: ${JSON.stringify(test.output)}\nGot: ${JSON.stringify(result)}`);
                    break;
                }
            }

            if (allPassed) {
                const diff = activeProblem?.difficulty || 'Easy';
                const points = duelService.calculatePoints('won', diff, timeElapsed / 10);
                setMatchPoints(points);
                setUserProgress(100);
                setGameStatus('won');
                updateDuelStats('won', points);
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const nextProblem = () => {
        if (duelProblems?.length) {
            setProblemIndex((prev) => (prev + 1) % duelProblems.length);
        }
    };

    const prevProblem = () => {
        if (duelProblems?.length) {
            setProblemIndex((prev) => (prev - 1 + duelProblems.length) % duelProblems.length);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 600);
        const secs = Math.floor((seconds % 600) / 10);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const HelpOverlay = () => (
        <AnimatePresence>
            {showHelp && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowHelp(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Swords className="text-indigo-200" />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Code Duel Guide</h2>
                            </div>
                            <button onClick={() => setShowHelp(false)} className="hover:bg-indigo-500 p-1 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 text-left">
                            {duelService.getHelpGuide().map((item, idx) => (
                                <div key={idx} className="flex space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 h-[calc(100vh-140px)] flex flex-col p-4 sm:p-0">
            <HelpOverlay />
            
            {/* Header Section */}
            <div className="text-center flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left flex items-center space-x-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 leading-tight">Code Duel</h1>
                        <p className="text-gray-500 font-medium whitespace-nowrap">Outprogram the bot. Rule the leaderboard.</p>
                    </div>
                    <button
                        onClick={() => setShowHelp(true)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition shadow-sm"
                        title="How to play"
                    >
                        <HelpCircle size={20} />
                    </button>
                </div>
                
                <div className="flex space-x-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-center px-4">
                        <p className="text-[10px] uppercase font-black text-gray-400">Wins</p>
                        <p className="text-xl font-black text-indigo-600">{duelStats?.wins || 0}</p>
                    </div>
                    <div className="w-px bg-gray-200 h-8 self-center"></div>
                    <div className="text-center px-4">
                        <p className="text-[10px] uppercase font-black text-gray-400">Points</p>
                        <p className="text-xl font-black text-green-600">{duelStats?.points || 0}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Left Panel: Problem & Status */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevProblem}
                                    disabled={gameStatus === 'playing'}
                                    className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-30"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-xs font-bold text-gray-400 self-center">
                                    {problemIndex + 1}/{duelProblems?.length || 0}
                                </span>
                                <button
                                    onClick={nextProblem}
                                    disabled={gameStatus === 'playing'}
                                    className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-30"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {activeProblem?.category || 'General'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    activeProblem?.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' :
                                    activeProblem?.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {activeProblem?.difficulty || 'Easy'}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-500 font-mono text-xs">
                                <Timer size={14} className="mr-1" />
                                {formatTime(timeElapsed)}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={activeProblem?.title}>
                            {activeProblem?.title || 'No Title'}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4 overflow-y-auto max-h-32 pr-1">
                            {activeProblem?.description || 'No description provided.'}
                        </p>

                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">Example I/O:</h3>
                            <div className="bg-gray-50 p-3 rounded-lg text-[11px] font-mono text-gray-600 border border-gray-100 whitespace-pre-wrap overflow-hidden">
                                <span className="text-indigo-500 font-bold">Input:</span> {JSON.stringify(activeProblem?.testCases?.[0]?.input || '')} <br />
                                <span className="text-green-500 font-bold">Output:</span> {JSON.stringify(activeProblem?.testCases?.[0]?.output || '')}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col justify-center relative overflow-hidden min-h-[200px]">
                        {gameStatus === 'idle' && (
                            <div className="text-center z-10">
                                <Swords size={48} className="mx-auto text-indigo-500 mb-4 opacity-50" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to battle?</h3>
                                <p className="text-sm text-gray-500 mb-6 px-4">DuelBot is waiting for your challenge. Start whenever you're ready.</p>
                                <button
                                    onClick={startGame}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-bold flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-95"
                                >
                                    <Play size={20} className="mr-2 fill-current" /> Challenge AI
                                </button>
                            </div>
                        )}

                        {gameStatus === 'playing' && (
                            <div className="space-y-6 z-10">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 font-bold">
                                        <span className="text-indigo-600 uppercase tracking-tight">You</span>
                                        <span>{Math.round(userProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${userProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 font-bold">
                                        <span className="text-rose-500 uppercase tracking-tight">DuelBot 🤖</span>
                                        <span>{Math.round(botProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="bg-rose-500 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${botProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                        Battle in Progress...
                                    </p>
                                </div>
                            </div>
                        )}

                        {(gameStatus === 'won' || gameStatus === 'lost') && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center z-10"
                            >
                                {gameStatus === 'won' ? (
                                    <>
                                        <Trophy size={64} className="mx-auto text-yellow-500 mb-4 drop-shadow-lg" />
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Victory!</h3>
                                        <div className="mt-2 text-indigo-600 font-black flex items-center justify-center space-x-2">
                                            <CheckCircle2 size={18} />
                                            <span>+{matchPoints} Points Earned</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle size={64} className="mx-auto text-rose-500 mb-4" />
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Defeat</h3>
                                        <p className="text-gray-500 font-medium">The bot finished faster this time.</p>
                                    </>
                                )}
                                <p className="text-gray-400 text-[10px] mt-4 uppercase font-bold">
                                    {activeProblem?.title} | {activeProblem?.difficulty}
                                </p>
                                <button
                                    onClick={() => setGameStatus('idle')}
                                    className="mt-8 bg-gray-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg active:scale-95"
                                >
                                    New Match
                                </button>
                            </motion.div>
                        )}
                        
                        {/* Background Decoration */}
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12">
                            <Swords size={200} />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="lg:col-span-2 flex flex-col bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-800 overflow-hidden min-h-[400px]">
                    <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d] flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <span className="ml-4 text-xs font-mono text-gray-400">solution.js</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={submitCode}
                                disabled={gameStatus !== 'playing'}
                                className="bg-indigo-600 text-white px-6 py-1.5 rounded text-xs font-black hover:bg-indigo-700 transition flex items-center shadow-lg shadow-indigo-900/50 disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                <CheckCircle2 size={14} className="mr-2 group-hover:scale-110 transition" />
                                SUBMIT SYSTEM
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={userCode}
                        onChange={handleCodeChange}
                        disabled={gameStatus !== 'playing'}
                        placeholder={gameStatus === 'playing' ? "Type your solution here..." : "Start the duel to enable code input"}
                        className="flex-1 w-full bg-transparent text-[#d4d4d4] p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none disabled:opacity-50"
                        spellCheck="false"
                    />
                    <div className="bg-[#252526] px-4 py-1.5 border-t border-[#3d3d3d] flex justify-between text-[10px] text-gray-500 font-mono">
                        <div>UTF-8 | JavaScript</div>
                        <div>Line {userCode.split('\n').length}, Col {userCode.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeDuel;