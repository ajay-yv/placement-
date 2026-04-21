import React, { useState } from 'react';
import { Plus, Trash2, Code, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Tracker = () => {
    const { problems, addProblem, deleteProblem, interviews, addInterview, deleteInterview } = useApp();
    const [activeTab, setActiveTab] = useState('coding');

    const [problemForm, setProblemForm] = useState({ title: '', platform: 'LeetCode', difficulty: 'Medium', status: 'Solved' });
    const [interviewForm, setInterviewForm] = useState({ company: '', date: '', type: 'Mock', verdict: 'Pending' });

    // Handlers
    const handleAddProblem = (e) => {
        e.preventDefault();
        addProblem(problemForm);
        setProblemForm({ title: '', platform: 'LeetCode', difficulty: 'Medium', status: 'Solved' });
    };

    const handleAddInterview = (e) => {
        e.preventDefault();
        addInterview(interviewForm);
        setInterviewForm({ company: '', date: '', type: 'Mock', verdict: 'Pending' });
    };

    // Chart Data
    // Chart Data - Memoized to prevent Recharts from re-rendering on every keystroke
    const difficultyData = React.useMemo(() => [
        { name: 'Easy', value: problems.filter(p => p.difficulty === 'Easy').length, color: '#4ade80' },
        { name: 'Medium', value: problems.filter(p => p.difficulty === 'Medium').length, color: '#facc15' },
        { name: 'Hard', value: problems.filter(p => p.difficulty === 'Hard').length, color: '#f87171' },
    ].filter(d => d.value > 0), [problems]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Preparation Tracker</h1>
                <p className="mt-2 text-gray-600">Keep track of your coding practice and mock interviews.</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('coding')}
                    className={clsx(
                        "pb-4 px-4 text-sm font-medium flex items-center transition-colors",
                        activeTab === 'coding' ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Code className="w-4 h-4 mr-2" />
                    Coding Practice
                </button>
                <button
                    onClick={() => setActiveTab('interviews')}
                    className={clsx(
                        "pb-4 px-4 text-sm font-medium flex items-center transition-colors",
                        activeTab === 'interviews' ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Mock Interviews
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {activeTab === 'coding' ? 'Log New Problem' : 'Log Interview'}
                    </h2>

                    {activeTab === 'coding' ? (
                        <form onSubmit={handleAddProblem} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Problem Title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={problemForm.title}
                                onChange={e => setProblemForm({ ...problemForm, title: e.target.value })}
                                required
                            />
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={problemForm.platform}
                                onChange={e => setProblemForm({ ...problemForm, platform: e.target.value })}
                            >
                                <option>LeetCode</option>
                                <option>HackerRank</option>
                                <option>CodeChef</option>
                                <option>GeeksForGeeks</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={problemForm.difficulty}
                                    onChange={e => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={problemForm.status}
                                    onChange={e => setProblemForm({ ...problemForm, status: e.target.value })}
                                >
                                    <option>Solved</option>
                                    <option>Attempted</option>
                                    <option>To Do</option>
                                </select>
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Add Problem</button>
                        </form>
                    ) : (
                        <form onSubmit={handleAddInterview} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Company Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={interviewForm.company}
                                onChange={e => setInterviewForm({ ...interviewForm, company: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={interviewForm.date}
                                onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                required
                            />
                            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Add Interview</button>
                        </form>
                    )}
                </div>

                {/* List & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'coding' && (
                        <>
                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Solved</p>
                                        <p className="text-2xl font-bold text-gray-900">{problems.length}</p>
                                    </div>
                                    <div className="h-16 w-16">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={difficultyData} innerRadius={15} outerRadius={30} paddingAngle={2} dataKey="value">
                                                    {difficultyData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                    <p className="text-sm text-gray-500">Recent Focus</p>
                                    <p className="text-lg font-medium text-indigo-600">Dynamic Programming</p> {/* Mock */}
                                </div>
                            </div>

                            {/* List */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {problems.map(problem => (
                                            <motion.tr
                                                key={problem.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{problem.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.platform}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={clsx(
                                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    )}>
                                                        {problem.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => deleteProblem(problem.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'interviews' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {interviews.map(interview => (
                                        <motion.tr
                                            key={interview.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{interview.company}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.verdict}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => deleteInterview(interview.id)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tracker;
