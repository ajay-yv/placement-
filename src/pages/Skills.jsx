import React, { useState } from 'react';
import { Lightbulb, BookOpen, Check, X } from 'lucide-react';
import { roles } from '../data/skillsData';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Skills = () => {
    const { mySkills, addSkill, removeSkill } = useApp();
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [skillInput, setSkillInput] = useState('');

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput.trim()) {
            addSkill(skillInput.trim());
            setSkillInput('');
        }
    };

    const missingSkills = selectedRole.requiredSkills.filter(
        req => !mySkills.some(my => my.toLowerCase() === req.name.toLowerCase())
    );

    const masteredSkills = selectedRole.requiredSkills.filter(
        req => mySkills.some(my => my.toLowerCase() === req.name.toLowerCase())
    );

    // Logic for Learning Highway (Personalized Path)
    const generatePathway = () => {
        return missingSkills.sort((a, b) => {
            // Prioritize by prerequisites count and difficulty
            const diffOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
            if (a.prerequisites.length !== b.prerequisites.length) {
                return a.prerequisites.length - b.prerequisites.length;
            }
            return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        });
    };

    const pathway = generatePathway();

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            <div className="text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full"></div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Adaptive Learning Highway</h1>
                <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                    Institutional intelligence mapping your personalized route to <span className="text-indigo-600 font-semibold">{selectedRole.title}</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Lightbulb size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">1. Select Ambition</h2>
                        </div>
                        <select
                            value={selectedRole.id}
                            onChange={(e) => setSelectedRole(roles.find(r => r.id === e.target.value))}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all text-sm font-medium"
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.title}</option>
                            ))}
                        </select>
                        <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Institutional Partners</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedRole.companies.map(company => (
                                    <span key={company} className="px-3 py-1 bg-white text-indigo-600 text-[10px] font-bold rounded-lg shadow-sm border border-indigo-100">
                                        {company}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                         <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Check size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">2. Current Protocol</h2>
                        </div>
                        <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add skill..."
                                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all text-sm"
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-bold text-xs transition-transform active:scale-95"
                            >
                                ADD
                            </button>
                        </form>
                        <div className="flex flex-wrap gap-2">
                            {mySkills.map(skill => (
                                <motion.span 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={skill} 
                                    className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 text-[11px] font-bold rounded-xl border border-gray-100"
                                >
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-400 hover:text-red-500">
                                        <X size={12} />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: The Highway */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <Lightbulb size={120} className="text-indigo-600" />
                        </div>
                        
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight">Remediation Protocol</h2>
                                <p className="text-sm text-gray-500 mt-1">Sequential skill acquisition map</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-indigo-600">{Math.round((masteredSkills.length / selectedRole.requiredSkills.length) * 100)}%</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Readiness Level</div>
                            </div>
                        </div>

                        {pathway.length > 0 ? (
                            <div className="relative space-y-6 ml-4 border-l-2 border-indigo-100 pl-8 pb-4">
                                {pathway.map((skill, index) => (
                                    <motion.div 
                                        key={skill.name}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 z-10"></div>
                                        <div className="bg-gray-50/50 hover:bg-white p-5 rounded-3xl border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-bold text-gray-900">{skill.name}</h3>
                                                        {skill.isTrending && (
                                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black uppercase tracking-tighter rounded-md">Market Pulse: High</span>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                                        <span className="flex items-center"><BookOpen size={10} className="mr-1" /> {skill.difficulty}</span>
                                                        {skill.prerequisites.length > 0 && (
                                                            <span className="text-indigo-400">Prereq: {skill.prerequisites.join(', ')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-white border border-gray-100 rounded-xl text-[10px] font-bold shadow-sm text-gray-500">
                                                    Step {index + 1}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="inline-flex p-4 bg-green-50 rounded-full text-green-600">
                                    <Check size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Protocol Complete</h3>
                                <p className="text-sm text-gray-500">You have mastered all essential nodes for this institutional role.</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <BookOpen size={20} className="mr-2 text-indigo-600" />
                                Growth Assets
                            </h2>
                            <div className="space-y-3">
                                {selectedRole.resources.map(resource => (
                                    <a
                                        key={resource.name}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {resource.type === 'Course' ? <Check size={14} /> : <BookOpen size={14} />}
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-900 transition-colors">
                                                    {resource.name}
                                                </h3>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{resource.type}</p>
                                            </div>
                                        </div>
                                        <X size={14} className="text-gray-300 group-hover:text-indigo-600 transition-transform hover:rotate-45" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                                <Check size={200} />
                            </div>
                            <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Institutional Goal</h2>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">Your current profile matches 3 out of 10 market leaders in the {selectedRole.title} domain.</p>
                            <button className="w-full py-4 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95">
                                Export Learning Log
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;
