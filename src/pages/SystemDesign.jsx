import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cloud, Shield, Globe, Cpu, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const componentTypes = [
    { id: 'lb', type: 'Load Balancer', icon: Shield, color: 'bg-blue-100 text-blue-600' },
    { id: 'server', type: 'App Server', icon: Server, color: 'bg-green-100 text-green-600' },
    { id: 'db', type: 'Database', icon: Database, color: 'bg-purple-100 text-purple-600' },
    { id: 'cache', type: 'Cache (Redis)', icon: Cpu, color: 'bg-red-100 text-red-600' },
    { id: 'cdn', type: 'CDN', icon: Cloud, color: 'bg-sky-100 text-sky-600' },
    { id: 'client', type: 'Client', icon: Globe, color: 'bg-gray-100 text-gray-600' },
];

const SystemDesign = () => {
    const [nodes, setNodes] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const canvasRef = useRef(null);

    const addNode = (component) => {
        const newNode = {
            id: Date.now(),
            ...component,
            x: 50 + Math.random() * 50,
            y: 50 + Math.random() * 50,
        };
        setNodes([...nodes, newNode]);
        setFeedback(null);
    };

    const removeNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
    };

    const validateDesign = () => {
        setIsAnalyzing(true);
        setFeedback(null);

        // Simulated AI Analysis
        setTimeout(() => {
            const counts = nodes.reduce((acc, node) => {
                acc[node.id] = (acc[node.id] || 0) + 1;
                return acc;
            }, {});

            let analysis = {
                score: 0,
                messages: []
            };

            if (nodes.length === 0) {
                analysis.messages.push({ type: 'error', text: "The canvas is empty! Start by adding a Client or Server." });
            } else {
                // Basic Rules
                const hasClient = nodes.some(n => n.id === 'client');
                const hasServer = nodes.some(n => n.id === 'server');
                const hasDB = nodes.some(n => n.id === 'db');
                const hasLB = nodes.some(n => n.id === 'lb');

                if (hasClient && hasServer && hasDB) {
                    analysis.score += 70;
                    analysis.messages.push({ type: 'success', text: "Good basic structure: Client -> Server -> DB." });
                }

                if (hasServer && !hasLB && nodes.filter(n => n.id === 'server').length > 1) {
                    analysis.messages.push({ type: 'warning', text: "Multiple servers detected but no Load Balancer. Traffic distribution might be uneven." });
                } else if (hasServer && hasLB) {
                    analysis.score += 15;
                    analysis.messages.push({ type: 'success', text: "Load Balancer included for scalability." });
                }

                if (hasDB && !nodes.some(n => n.id === 'cache')) {
                    analysis.messages.push({ type: 'info', text: "Consider adding a Cache (Redis) to reduce database load for read-heavy systems." });
                } else if (hasDB && nodes.some(n => n.id === 'cache')) {
                    analysis.score += 15;
                    analysis.messages.push({ type: 'success', text: "Caching layer added for performance." });
                }

                if (analysis.score === 0 && nodes.length > 0) {
                    analysis.messages.push({ type: 'warning', text: "Design is incomplete. Ensure you have a full flow from Client to Database." });
                }
            }

            setFeedback(analysis);
            setIsAnalyzing(false);
        }, 1500);
    };

    const clearCanvas = () => {
        setNodes([]);
        setFeedback(null);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Component Library */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="font-bold text-gray-900 mb-4">Components</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        {componentTypes.map((comp) => (
                            <button
                                key={comp.id}
                                onClick={() => addNode(comp)}
                                className={`flex items-center p-3 rounded-lg border border-transparent hover:border-indigo-200 hover:shadow-sm transition-all text-sm font-medium ${comp.color.replace('text-', 'bg-').replace('100', '50')} text-gray-700`}
                            >
                                <comp.icon size={18} className="mr-2" />
                                {comp.type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="font-bold text-gray-900 mb-2">Instructions</h2>
                    <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                        <li>Drag components to arrange them.</li>
                        <li>Double click to remove.</li>
                        <li>Click <b>Validate</b> to get AI feedback.</li>
                    </ul>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col bg-gray-50 rounded-xl border border-gray-200 relative overflow-hidden">
                {/* Toolbar */}
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                    <button
                        onClick={clearCanvas}
                        className="bg-white p-2 rounded-lg shadow text-gray-600 hover:text-red-600 transition"
                        title="Clear Canvas"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={validateDesign}
                        disabled={isAnalyzing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition font-medium flex items-center"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Validate Design'}
                        {!isAnalyzing && <CheckCircle size={18} className="ml-2" />}
                    </button>
                </div>

                {/* Canvas Grid Background */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative overflow-hidden"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                >
                    {nodes.map((node) => (
                        <motion.div
                            key={node.id}
                            drag
                            dragConstraints={canvasRef}
                            dragMomentum={false}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                            className={`absolute flex flex-col items-center justify-center p-4 w-32 h-32 bg-white rounded-xl shadow-md border-2 cursor-move ${node.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')
                                }`}
                            onDoubleClick={() => removeNode(node.id)}
                        >
                            <node.icon size={32} className={`mb-2 ${node.color.split(' ')[1]}`} />
                            <span className="text-xs font-bold text-gray-700 text-center">{node.type}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Feedback Panel */}
                {feedback && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20"
                    >
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">AI Design Review</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${feedback.score >= 80 ? 'bg-green-100 text-green-700' :
                                        feedback.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    Architecture Score: {feedback.score}/100
                                </span>
                            </div>
                            <div className="space-y-2">
                                {feedback.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex items-start p-3 rounded-lg ${msg.type === 'success' ? 'bg-green-50 text-green-800' :
                                            msg.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                                msg.type === 'error' ? 'bg-red-50 text-red-800' :
                                                    'bg-blue-50 text-blue-800'
                                        }`}>
                                        {msg.type === 'success' && <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />}
                                        {msg.type === 'warning' && <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />}
                                        {(msg.type === 'info' || msg.type === 'error') && <RefreshCw size={18} className="mr-2 mt-0.5 flex-shrink-0" />}
                                        <span className="text-sm">{msg.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SystemDesign;
