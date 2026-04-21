import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, Square, SkipForward, Camera, CameraOff, Check } from 'lucide-react';
import { interviewQuestions } from '../data/interviewData';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const VoiceInterview = () => {
    const { setInterviewMetrics } = useApp();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true); // Default to true to match initial behavior
    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null); // Ref to hold the stream for stopping tracks

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraOn(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setIsCameraOn(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        }
    };

    const toggleCamera = () => {
        if (isCameraOn) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API is not supported in this browser. Please use Chrome.");
        }
    }, []);

    const [performance, setPerformance] = useState({
        confidence: 85,
        clarity: 90,
        pace: 'Steady',
        fillers: 0,
        sentiment: 'Neutral',
        focus: 98,
        xaiInsight: "Initializing neural analysis engine... Monitoring for institutional competency markers."
    });

    const currentQuestion = interviewQuestions[currentQuestionIndex];

    // Dynamic XAI Insight Generation
    const getXAIInsight = (metrics) => {
        if (metrics.fillers > 4) {
            return "Cognitive load peak detected. High frequency of transition markers (fillers) suggests structured retrieval difficulty. Recommend pausing to stabilize neural coherence.";
        }
        if (metrics.confidence < 60) {
            return "Vocal projection variance noted. Tone stability has dropped below optimal institutional thresholds. Suggest increasing volume and articular clarity.";
        }
        if (metrics.sentiment === 'Positive') {
            return "Positive affective mirroring detected. Terminology ('passionate', 'excited') aligns with high-engagement profiles. Competency index increasing.";
        }
        if (metrics.pace === 'Fast') {
            return "Cadence exceeds typical professional benchmarks. Rapid speech may hinder protocol parsing. Suggest strategic deceleration.";
        }
        return "Candidate utilized professional terminology. Strategic pause before delivery indicated high cognitive processing. Structural integrity of response is optimal.";
    };

    // Simulate real-time behavioral analysis
    useEffect(() => {
        if (isListening) {
            if (transcript) {
                const words = transcript.trim().split(/\s+/);
                const fillers = words.filter(w => ['um', 'uh', 'like', 'actually', 'basically', 'err', 'ah'].includes(w.toLowerCase())).length;
                
                // Sensitive feedback updates
                const newConfidence = Math.max(30, 95 - (fillers * 8) - (words.length < 5 ? 20 : 0));
                const newPace = words.length > 5 && (words.length / (transcript.length / 50)) > 15 ? 'Fast' : 'Steady';
                const newSentiment = transcript.toLowerCase().includes('excited') || transcript.toLowerCase().includes('passionate') || transcript.toLowerCase().includes('great') ? 'Positive' : 'Neutral';
                const newFocus = Math.max(70, 98 - (Math.random() * 5)); // Simulate slight focus drift

                const metrics = {
                    ...performance,
                    fillers,
                    confidence: newConfidence,
                    pace: newPace,
                    sentiment: newSentiment,
                    focus: newFocus,
                };

                metrics.xaiInsight = getXAIInsight(metrics);
                setPerformance(metrics);
            } else {
                // Reset/Init state while listening but no speech yet
                setPerformance(prev => ({
                    ...prev,
                    confidence: 85,
                    focus: 95 + (Math.random() * 5),
                    xaiInsight: "Listening for initial protocol signature... Behavioral baseline established."
                }));
            }
        }
    }, [transcript, isListening]);

    const speakQuestion = () => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const speak = () => {
                if (synth.speaking) {
                    synth.cancel();
                }
                const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = (e) => {
                    console.error("Speech error:", e);
                    setIsSpeaking(false);
                };

                const voices = synth.getVoices();
                if (voices.length > 0) {
                    const preferredVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
                    utterance.voice = preferredVoice;
                }

                synth.speak(utterance);
            };

            if (synth.getVoices().length === 0) {
                synth.onvoiceschanged = () => {
                    speak();
                    synth.onvoiceschanged = null;
                };
            } else {
                speak();
            }
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript(''); // Clear for new answer
            recognitionRef.current.start();
        }
    };

    const handleNext = () => {
        // Sync to Career Hub (Institutional Global State)
        setInterviewMetrics({
            confidence: performance.confidence,
            focus: performance.focus,
            sentiment: performance.sentiment,
            lastUpdate: Date.now()
        });

        setTranscript('');
        setPerformance({ 
            confidence: 85, 
            clarity: 90, 
            pace: 'Steady', 
            fillers: 0, 
            sentiment: 'Neutral',
            focus: 98,
            xaiInsight: "Node transition complete. Ready for next inquiry."
        });
        if (currentQuestionIndex < interviewQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            alert("Institutional Protocol: Interview Simulation Completed.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                         <Camera size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 leading-tight tracking-tight uppercase">Simulation Unit 02</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cognitive & Behavioral Analysis</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Ethical Bias-Guard Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visualizer & Camera Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-video group">
                        <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700 ${!isCameraOn ? 'opacity-0' : 'opacity-80'}`} />
                        
                        {/* Overlay: AI Scanning Effect */}
                        {isCameraOn && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20"
                                />
                                {/* Face Tracking Brackets (MOCKED) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-2xl">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>
                                </div>
                            </div>
                        )}

                        {!isCameraOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                                <CameraOff size={48} className="opacity-20" />
                            </div>
                        )}

                        {/* Visualizer Overlay */}
                        {(isListening || isSpeaking) && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end space-x-1 h-12">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                                        className="w-1.5 bg-indigo-400 rounded-full opacity-80"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="absolute top-6 left-6 text-white space-y-1">
                            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-red-pulse"></div>
                                <span>Live Feed Processing</span>
                            </div>
                        </div>

                        <div className="absolute bottom-6 right-6">
                            <button onClick={toggleCamera} className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                                {isCameraOn ? <CameraOff size={20} /> : <Camera size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Interaction Content */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Mic size={120} className="text-indigo-600" />
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 text-indigo-600 mb-2">
                                <Volume2 size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Institutional Inquiry {currentQuestionIndex + 1}</span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-6">{currentQuestion.question}</h2>
                            <button
                                onClick={speakQuestion}
                                disabled={isSpeaking}
                                className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all font-bold text-xs uppercase tracking-widest flex items-center"
                            >
                                {isSpeaking ? "Interviewer Speaking..." : "Play Audio Prompt"}
                            </button>
                        </div>

                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 min-h-[180px] relative">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Transcription Engine</p>
                            <p className="text-lg text-gray-800 leading-relaxed font-medium transition-all">
                                {transcript || <span className="text-gray-300 italic font-normal text-sm block py-4">"Listening for voice protocol..."</span>}
                            </p>
                            {isListening && (
                                <div className="absolute bottom-6 right-6 flex items-center space-x-2 text-indigo-600 text-[10px] font-black uppercase">
                                    <div className="flex space-x-1">
                                        {[1,2,3].map(i => <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1 h-1 bg-indigo-600 rounded-full" />)}
                                    </div>
                                    <span>Syncing...</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 flex items-center justify-between">
                            <div className="flex space-x-4">
                                <button
                                    onClick={toggleListening}
                                    className={`relative p-8 rounded-full shadow-2xl transition-all active:scale-90 ${
                                        isListening 
                                        ? 'bg-red-500 text-white shadow-red-200 ring-8 ring-red-500/10' 
                                        : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                                    }`}
                                >
                                    {isListening ? <Square size={32} fill="white" /> : <Mic size={32} />}
                                </button>
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs font-black text-gray-900 uppercase">{isListening ? "DEACTIVATE" : "ACTIVATE"}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Voice Receiver</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleNext}
                                className="px-8 py-4 bg-gray-900 text-white rounded-3xl hover:bg-black transition-all font-bold text-xs uppercase tracking-widest shadow-xl flex items-center group"
                            >
                                Next Node <SkipForward size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cognitive Dashboard */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Real-time Diagnostics</h2>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-500">Confidence Stability</span>
                                    <span className={performance.confidence > 70 ? 'text-green-600' : 'text-orange-600'}>{performance.confidence}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div animate={{ width: `${performance.confidence}%` }} className={`h-full rounded-full ${performance.confidence > 70 ? 'bg-green-500' : 'bg-orange-500'}`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Cadence</p>
                                    <p className="text-sm font-black text-gray-900">{performance.pace}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Face Focus</p>
                                    <p className="text-sm font-black text-indigo-600 uppercase italic">{performance.focus.toFixed(0)}%</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-500">Cognitive Load Check</span>
                                    <span className={performance.fillers > 3 ? 'text-red-500' : 'text-indigo-600'}>
                                        {performance.fillers === 0 ? 'Optimal' : `${performance.fillers} Fillers Detected`}
                                    </span>
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                                    <p className="text-[9px] font-medium text-indigo-700 leading-relaxed italic">
                                        {performance.fillers > 3 
                                        ? "AI ALERT: Frequent filler words detected. Reduce transition markers to improve institutional authority index."
                                        : "Protocol stable. Your response latency matches institutional performance benchmarks."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 rounded-[2rem] shadow-2xl text-white relative">
                        <div className="absolute top-4 right-4 opacity-20">
                            <Check size={40} />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-indigo-300">Explainable AI (XAI) Insight</h2>
                        <div className="space-y-4">
                            <div className="flex space-x-3">
                                <div className="w-1 h-full bg-white/20 rounded-full"></div>
                                <p className="text-[11px] font-medium leading-relaxed opacity-90 italic">
                                    "{performance.xaiInsight}"
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest">XAI Confidence Score: {(0.98 + (Math.random() * 0.01)).toFixed(3)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceInterview;
