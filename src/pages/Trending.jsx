import React from 'react';
import { TrendingUp, Book, Clock } from 'lucide-react';
import { trendingTopics, cheatSheets } from '../data/trendingData';
import { motion } from 'framer-motion';

const Trending = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Trending & Cheat Sheets</h1>
                <p className="mt-2 text-gray-600">Stay updated with last-minute interview topics and company values.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Feed Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4 text-indigo-600">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            <h2 className="font-bold text-lg">Live Interview Feed</h2>
                        </div>
                        <div className="space-y-4">
                            {trendingTopics.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-800">{item.company}</span>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Clock size={10} className="mr-1" />
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Asked: <span className="font-medium text-indigo-600">{item.topic}</span></p>
                                </motion.div>
                            ))}
                            <div className="text-center pt-2">
                                <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">View All Updates</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cheat Sheets Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="font-bold text-xl text-gray-800 flex items-center">
                        <Book className="w-6 h-6 mr-2 text-indigo-600" />
                        Company Cheat Sheets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cheatSheets.map((sheet, idx) => (
                            <motion.div
                                key={sheet.company}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-gray-900">{sheet.company}</h3>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{sheet.title}</span>
                                </div>
                                <ul className="space-y-2">
                                    {sheet.content.slice(0, 5).map((point, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-600">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                                {sheet.content.length > 5 && (
                                    <p className="mt-4 text-xs text-gray-400 italic">
                                        + {sheet.content.length - 5} more principles
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trending;
