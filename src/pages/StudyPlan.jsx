import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { syllabus } from '../data/syllabusData';
import { motion } from 'framer-motion';

const StudyPlan = () => {
    const [inputs, setInputs] = useState({
        targetDate: '',
        dailyHours: 2
    });
    const [plan, setPlan] = useState(null);

    const generatePlan = (e) => {
        e.preventDefault();
        if (!inputs.targetDate) return;

        const start = new Date();
        const end = new Date(inputs.targetDate);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 0) {
            alert("Target date must be in the future!");
            return;
        }

        const totalAvailableHours = daysDiff * inputs.dailyHours;
        const totalNeededHours = syllabus.reduce((acc, curr) => acc + curr.hours, 0);

        let currentDay = 0;
        let currentHourInDay = 0;
        const generatedPlan = [];

        syllabus.forEach(item => {
            let hoursRemaining = item.hours;

            while (hoursRemaining > 0) {
                const hoursToday = Math.min(hoursRemaining, inputs.dailyHours - currentHourInDay);

                if (!generatedPlan[currentDay]) {
                    generatedPlan[currentDay] = [];
                }

                generatedPlan[currentDay].push({
                    topic: item.topic,
                    hours: hoursToday
                });

                hoursRemaining -= hoursToday;
                currentHourInDay += hoursToday;

                if (currentHourInDay >= inputs.dailyHours) {
                    currentDay++;
                    currentHourInDay = 0;
                }
            }
        });

        // Filter out any potential empty days from jagged math
        const finalPlan = generatedPlan.filter(day => day && day.length > 0);

        setPlan({ days: finalPlan, totalDays: daysDiff, coverage: Math.min(100, Math.round((totalAvailableHours / totalNeededHours) * 100)) });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Smart Study Plan</h1>
                <p className="mt-2 text-gray-600">Generate a personalized daily schedule to cover your syllabus.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <form onSubmit={generatePlan} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={inputs.targetDate}
                                onChange={e => setInputs({ ...inputs, targetDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Hours: {inputs.dailyHours}</label>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                step="0.5"
                                className="w-full"
                                value={inputs.dailyHours}
                                onChange={e => setInputs({ ...inputs, dailyHours: parseFloat(e.target.value) })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Generate Plan
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Syllabus Overview</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {syllabus.slice(0, 5).map(item => (
                                <li key={item.topic} className="flex justify-between">
                                    <span>{item.topic}</span>
                                    <span className="text-gray-400">{item.hours}h</span>
                                </li>
                            ))}
                            <li className="text-center text-xs text-gray-400 italic">+ {syllabus.length - 5} more topics</li>
                        </ul>
                    </div>
                </div>

                {/* Plan Display */}
                <div className="md:col-span-2 space-y-6">
                    {plan ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                                <div>
                                    <p className="text-indigo-900 font-semibold">Plan Coverage</p>
                                    <p className="text-sm text-indigo-700">Based on your time, you can cover {plan.coverage}% of the syllabus.</p>
                                </div>
                                <div className="text-2xl font-bold text-indigo-600">{plan.days.length} Days</div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                {plan.days.map((day, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-start"
                                    >
                                        <div className="flex-shrink-0 w-16 text-center mr-4">
                                            <span className="block text-xs text-gray-500 uppercase">Day</span>
                                            <span className="block text-2xl font-bold text-gray-900">{index + 1}</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {day.map((session, i) => (
                                                <div key={i} className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                                                    <BookOpen size={16} className="mr-2 text-indigo-500" />
                                                    <span className="flex-1 font-medium">{session.topic}</span>
                                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                                                        {session.hours} hrs
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[400px]">
                            <Calendar className="w-16 h-16 mb-4 opacity-30" />
                            <p>Set your goals to see your roadmap.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlan;
