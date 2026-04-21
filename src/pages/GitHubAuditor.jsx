import React, { useState } from 'react';
import { Github, Search, Star, GitBranch, BookOpen, AlertCircle, CheckCircle, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const GitHubAuditor = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const analyzeProfile = async () => {
        if (!username) return;
        setLoading(true);
        setError(null);
        setData(null);

        try {
            // Fetch User Data
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            if (!userRes.ok) throw new Error('User not found');
            const user = await userRes.json();

            // Fetch Repos
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
            const repos = await reposRes.json();

            // Analyze
            let score = 0;
            const feedback = [];

            // Scoring Logic
            if (user.bio) score += 10;
            else feedback.push({ type: 'warning', text: "Add a bio to tell recruiters who you are." });

            if (user.public_repos >= 5) score += 20;
            else feedback.push({ type: 'info', text: "Try to have at least 5 public repositories." });

            if (user.followers >= 10) score += 10;

            // Repo Analysis
            const hasReadmes = repos.filter(r => r.id).length; // Mock check, real API doesn't allow easy readme check without extra calls
            // We'll simulate checking descriptions instead as a proxy for quality
            const meaningfulRepos = repos.filter(r => r.description && r.description.length > 20).length;

            if (meaningfulRepos >= 3) {
                score += 30;
                feedback.push({ type: 'success', text: "Great job adding descriptions to your repositories!" });
            } else {
                feedback.push({ type: 'error', text: "Many recent repos lack descriptions. Treat your GitHub like a portfolio." });
            }

            const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
            if (languages.length >= 3) {
                score += 20;
                feedback.push({ type: 'success', text: `Versatile stack detected: ${languages.slice(0, 3).join(', ')}` });
            }

            // Recent Activity (Mock based on updated_at)
            const lastUpdate = new Date(repos[0]?.updated_at);
            const daysSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);

            if (daysSinceUpdate < 7) {
                score += 10;
                feedback.push({ type: 'success', text: "Active usage! You pushed code recently." });
            } else {
                feedback.push({ type: 'warning', text: "No recent activity. Consistency matters." });
            }

            setData({ user, repos, score: Math.min(score, 100), feedback });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <Github className="mr-3" size={32} /> GitHub Portfolio Auditor
                </h1>
                <p className="mt-2 text-gray-600">Enter your username. The AI will audit your profile from a recruiter's perspective.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Enter GitHub Username (e.g., torvalds)"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && analyzeProfile()}
                        />
                    </div>
                    <button
                        onClick={analyzeProfile}
                        disabled={loading || !username}
                        className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : null}
                        Audit
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        {error}
                    </div>
                )}
            </div>

            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Main User Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                        <img
                            src={data.user.avatar_url}
                            alt={data.user.login}
                            className="w-24 h-24 rounded-full border-4 border-gray-100 mb-4"
                        />
                        <h2 className="text-xl font-bold text-gray-900">{data.user.name || data.user.login}</h2>
                        <p className="text-gray-500 mb-4">@{data.user.login}</p>

                        <div className="w-full grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="block font-bold text-gray-900">{data.user.public_repos}</span>
                                <span className="text-gray-500">Repos</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="block font-bold text-gray-900">{data.user.followers}</span>
                                <span className="text-gray-500">Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Analysis & Score */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Recruiter Impression Score</h3>
                                <div className="text-4xl font-black text-gray-900">{data.score}<span className="text-xl text-gray-400 font-normal">/100</span></div>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
                                <div
                                    className={`h-4 rounded-full transition-all duration-1000 ${data.score >= 80 ? 'bg-green-500' :
                                            data.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${data.score}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                                {data.score >= 80 ? "Your profile looks professional! Ready for top-tier applications." :
                                    "You have some work to do. Follow the tips below to improve."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4">Audit Report</h3>
                            <div className="space-y-3">
                                {data.feedback.map((item, idx) => (
                                    <div key={idx} className={`flex items-start p-3 rounded-lg text-sm ${item.type === 'success' ? 'bg-green-50 text-green-800' :
                                            item.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                                item.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
                                        }`}>
                                        {item.type === 'success' ? <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> :
                                            item.type === 'warning' ? <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> :
                                                <Terminal size={16} className="mr-2 mt-0.5 flex-shrink-0" />}
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GitHubAuditor;
