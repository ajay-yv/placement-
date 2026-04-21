import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Upload, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeKeywords } from '../data/resumeData';

const ResumeBuilder = () => {
    const [resumeText, setResumeText] = useState('');
    const [selectedRole, setSelectedRole] = useState('frontend');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeResume = () => {
        setIsAnalyzing(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const keywords = resumeKeywords[selectedRole] || [];
            const foundKeywords = keywords.filter(word =>
                resumeText.toLowerCase().includes(word.toLowerCase())
            );
            const missingKeywords = keywords.filter(word =>
                !resumeText.toLowerCase().includes(word.toLowerCase())
            );

            const score = Math.round((foundKeywords.length / keywords.length) * 100);

            setAnalysis({
                score,
                found: foundKeywords,
                missing: missingKeywords
            });
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">AI Resume Vetting</h1>
                <p className="mt-2 text-gray-600">Scan your resume against ATS filters and get instant feedback.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                        >
                            <option value="frontend">Frontend Developer</option>
                            <option value="backend">Backend Developer</option>
                            <option value="fullstack">Full Stack Developer</option>
                            <option value="datascience">Data Scientist</option>
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Paste Resume Content</label>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            rows={12}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                            placeholder="Paste your resume text here..."
                        />

                        <button
                            onClick={analyzeResume}
                            disabled={!resumeText.trim() || isAnalyzing}
                            className={`w-full flex items-center justify-center py-2 px-4 rounded-lg text-white transition-colors ${!resumeText.trim() || isAnalyzing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <RefreshCw className="animate-spin w-5 h-5 mr-2" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5 mr-2" />
                                    Scan Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {analysis ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full"
                        >
                            <div className="text-center mb-6">
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * analysis.score) / 100}
                                            className={`${analysis.score >= 70 ? 'text-green-500' : 'text-yellow-500'} transition-all duration-1000`}
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-bold text-gray-800">{analysis.score}%</span>
                                </div>
                                <h2 className="text-lg font-semibold mt-2">ATS Score</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-green-700 flex items-center mb-2">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Keywords Found ({analysis.found.length})
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.found.map(word => (
                                            <span key={word} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-red-700 flex items-center mb-2">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Missing Keywords ({analysis.missing.length})
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.missing.map(word => (
                                            <span key={word} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-100">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <h4 className="text-sm font-semibold text-indigo-900 mb-1">AI Suggestion</h4>
                                    <p className="text-sm text-indigo-800">
                                        {analysis.score < 50
                                            ? "Your resume is missing key technical skills. Add the missing keywords in your 'Skills' or 'Projects' section to pass ATS filters."
                                            : "Great job! Your resume is well-optimized. Focus on quantifying your achievements with numbers to improve further."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-center text-gray-500">
                            <Upload className="w-12 h-12 mb-4 opacity-50" />
                            <p>Paste your resume and click Scan used logic to see the analysis results here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
