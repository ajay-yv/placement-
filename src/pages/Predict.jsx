import React, { useState } from 'react';
import { Target, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Predict = () => {
    const { prediction, setPrediction, mySkills } = useApp();

    const [formData, setFormData] = useState({
        cgpa: '',
        internships: '',
        projects: '',
        backlogs: '0',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateChance = (e) => {
        e.preventDefault();

        // Simple mock heuristic
        const cgpa = parseFloat(formData.cgpa) || 0;
        const internships = parseInt(formData.internships) || 0;
        const projects = parseInt(formData.projects) || 0;
        const backlogs = parseInt(formData.backlogs) || 0;
        const skillCount = mySkills.length; // Use skills from context

        let score = (cgpa / 10) * 50;
        score += Math.min(skillCount * 5, 20);
        score += Math.min(internships * 10, 20);
        score += Math.min(projects * 5, 10);
        score -= backlogs * 5;

        const finalScore = Math.max(0, Math.min(100, Math.round(score)));

        setPrediction(finalScore);
    };

    const getPredictionColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPredictionMessage = (score) => {
        if (score >= 80) return "Excellent! You're well-prepared for top-tier companies.";
        if (score >= 50) return "Good! With a bit more preparation, you can crack it.";
        return "Needs Improvement. Focus on skills and projects to boost your chances.";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Placement Predictor</h1>
                <p className="mt-2 text-gray-600">Estimate your placement chances based on your current profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                    <form onSubmit={calculateChance} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA (0-10)</label>
                            <input
                                type="number"
                                name="cgpa"
                                step="0.01"
                                max="10"
                                value={formData.cgpa}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. 8.5"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internships</label>
                                <input
                                    type="number"
                                    name="internships"
                                    min="0"
                                    value={formData.internships}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Count"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                                <input
                                    type="number"
                                    name="projects"
                                    min="0"
                                    value={formData.projects}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Count"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Active Backlogs</label>
                            <input
                                type="number"
                                name="backlogs"
                                min="0"
                                value={formData.backlogs}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                            <span className="font-medium">Note:</span> Your prediction also uses the skills you've added in the "Skills" section.
                            Currently added: <span className="font-bold text-indigo-600">{mySkills.length}</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                            <Calculator className="w-5 h-5 mr-2" />
                            Analyze Profile
                        </button>
                    </form>
                </motion.div>

                {/* Results Section */}
                <div className="flex items-center justify-center">
                    {prediction !== null ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 w-full"
                        >
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Placement Chance</h2>
                            <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center rounded-full border-8 border-gray-100">
                                <span className={`text-4xl font-bold ${getPredictionColor(prediction)}`}>
                                    {prediction}%
                                </span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90 stroke-current text-indigo-600" viewBox="0 0 100 100" fill="none">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        strokeWidth="8"
                                        className="opacity-10 text-gray-300"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        strokeWidth="8"
                                        strokeDasharray="289"
                                        strokeDashoffset={289 - (289 * prediction) / 100}
                                        className={`transition-all duration-1000 ease-out ${getPredictionColor(prediction)}`}
                                    />
                                </svg>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800 font-medium mb-1">
                                    {prediction >= 80 ? <CheckCircle className="inline w-5 h-5 text-green-500 mr-1" /> : <AlertCircle className="inline w-5 h-5 text-yellow-500 mr-1" />}
                                    Verdict
                                </p>
                                <p className="text-sm text-gray-600">{getPredictionMessage(prediction)}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Enter your details to generate a prediction.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Predict;
