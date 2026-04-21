import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
    const { prediction, mySkills, problems, interviews } = useApp();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Placement Chance</h3>
                    <p className={`mt-2 text-3xl font-semibold ${prediction && prediction >= 80 ? 'text-green-600' : 'text-indigo-600'}`}>
                        {prediction !== null ? `${prediction}%` : '--%'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Skills Mastered</h3>
                    <p className="mt-2 text-3xl font-semibold text-green-600">{mySkills.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Problems Solved</h3>
                    <p className="mt-2 text-3xl font-semibold text-blue-600">{problems.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Mock Interviews</h3>
                    <p className="mt-2 text-3xl font-semibold text-orange-600">{interviews.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer" onClick={() => navigate('/interview')}>
                    <h3 className="font-bold text-indigo-900">🎤 AI Mock Interview</h3>
                    <p className="text-sm text-indigo-700 mt-1">Practice with a voice-based AI interviewer.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => navigate('/study-plan')}>
                    <h3 className="font-bold text-green-900">📅 Smart Study Plan</h3>
                    <p className="text-sm text-green-700 mt-1">Generate a personalized daily schedule.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer" onClick={() => navigate('/resume')}>
                    <h3 className="font-bold text-purple-900">📄 Resume Vetting</h3>
                    <p className="text-sm text-purple-700 mt-1">Check your ATS score instantly.</p>
                </div>


                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => navigate('/trending')}>
                    <h3 className="font-bold text-blue-900">📈 Trending Topics</h3>
                    <p className="text-sm text-blue-700 mt-1">See live interview questions.</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer" onClick={() => navigate('/career-quest')}>
                    <h3 className="font-bold text-amber-900">🚀 Career Quest</h3>
                    <p className="text-sm text-amber-700 mt-1">Join team missions & solve industry challenges.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
