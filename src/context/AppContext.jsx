import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [prediction, setPrediction] = useState(() => {
        const saved = localStorage.getItem('prediction');
        return saved ? parseInt(saved) : 0;
    });
    const [mySkills, setMySkills] = useState(() => {
        const saved = localStorage.getItem('mySkills');
        return saved ? JSON.parse(saved) : [];
    });
    const [problems, setProblems] = useState(() => {
        const saved = localStorage.getItem('problems');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Two Sum', platform: 'LeetCode', difficulty: 'Easy', status: 'Solved' },
            { id: 2, title: 'LRU Cache', platform: 'LeetCode', difficulty: 'Medium', status: 'Solved' },
        ];
    });
    const [interviews, setInterviews] = useState(() => {
        const saved = localStorage.getItem('interviews');
        return saved ? JSON.parse(saved) : [
            { id: 1, company: 'Google', date: '2023-10-15', type: 'Mock', verdict: 'Feedback Received' },
        ];
    });

    const [referralRequests, setReferralRequests] = useState(() => {
        const saved = localStorage.getItem('referralRequests');
        return saved ? JSON.parse(saved) : [];
    });



    const [interviewMetrics, setInterviewMetrics] = useState(() => {
        const saved = localStorage.getItem('interviewMetrics');
        return saved ? JSON.parse(saved) : { confidence: 85, focus: 95, sentiment: 'Neutral', lastUpdate: Date.now() };
    });

    // Persistence effects
    useEffect(() => localStorage.setItem('prediction', prediction), [prediction]);
    useEffect(() => localStorage.setItem('mySkills', JSON.stringify(mySkills)), [mySkills]);
    useEffect(() => localStorage.setItem('problems', JSON.stringify(problems)), [problems]);
    useEffect(() => localStorage.setItem('interviews', JSON.stringify(interviews)), [interviews]);
    useEffect(() => localStorage.setItem('referralRequests', JSON.stringify(referralRequests)), [referralRequests]);

    useEffect(() => localStorage.setItem('interviewMetrics', JSON.stringify(interviewMetrics)), [interviewMetrics]);

    const addSkill = (skill) => {
        if (!mySkills.includes(skill)) {
            setMySkills([...mySkills, skill]);
        }
    };

    const removeSkill = (skill) => {
        setMySkills(mySkills.filter(s => s !== skill));
    };

    const addProblem = (problem) => {
        setProblems([...problems, { id: Date.now(), ...problem }]);
    };

    const deleteProblem = (id) => {
        setProblems(problems.filter(p => p.id !== id));
    };

    const addInterview = (interview) => {
        setInterviews([...interviews, { id: Date.now(), ...interview }]);
    };

    const deleteInterview = (id) => {
        setInterviews(interviews.filter(i => i.id !== id));
    };

    const addReferralRequest = (id) => {
        if (!referralRequests.includes(id)) {
            setReferralRequests([...referralRequests, id]);
        }
    };



    const value = useMemo(() => ({
        prediction, setPrediction,
        mySkills, addSkill, removeSkill,
        problems, addProblem, deleteProblem,
        interviews, addInterview, deleteInterview,
        referralRequests, addReferralRequest,
        interviewMetrics, setInterviewMetrics
    }), [prediction, mySkills, problems, interviews, referralRequests, interviewMetrics]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
