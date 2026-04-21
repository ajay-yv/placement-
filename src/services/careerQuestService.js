/**
 * Career Quest Service
 * Handles data fetching and logic for the gamified career quests.
 */

// Mock Industry Challenge Database
const industryChallenges = [
    {
        id: 'q1',
        title: 'Network Traffic Anomaly Detection',
        company: 'CyberGlobal Inc.',
        difficulty: 'Hard',
        category: 'Cybersecurity',
        description: 'Analyze anonymized server logs to identify potential DDoS attack patterns. Use statistical methods to flag traffic spikes.',
        objective: 'Implement a detection algorithm that minimizes false positives while ensuring 99% accuracy for known attack patterns.',
        skills: ['Python', 'Data Analysis', 'Network Security', 'Statistics'],
        rewardPoints: 500,
        deadline: '2026-05-15',
        badges: ['Security Sentinel', 'Packet Wizard'],
        realTimeData: {
            latency: '15ms',
            packetsPerSecond: '12.5k',
            threatLevel: 'Medium'
        },
        datasetRefs: ['security-logs-v1.json'],
        hints: [
            "Look for unusual spikes in UDP traffic from common source ports.",
            "Consider using a Z-score threshold for identifying outliers in packet frequency.",
            "Analyze the ratio of SYN to ACK packets to detect SYN flood attempts."
        ],
        companyProfile: {
            industry: "Cybersecurity",
            founded: "2012",
            headquarters: "San Francisco, CA",
            mission: "Protecting global infrastructure from evolving digital threats."
        }
    },
    {
        id: 'q2',
        title: 'Sustainable Supply Chain Optimization',
        company: 'EcoLogistics',
        difficulty: 'Medium',
        category: 'Data Science',
        description: 'Optimize delivery routes for a fleet of 100 electric vehicles to minimize carbon footprint and energy consumption.',
        objective: 'Develop a routing model that reduces total energy consumption by at least 15% compared to baseline GPS routing.',
        skills: ['Optimization', 'Graph Theory', 'Sustainability', 'R'],
        rewardPoints: 350,
        deadline: '2026-05-20',
        badges: ['Green Optimizer', 'Green Belt'],
        realTimeData: {
            avgEnergySavings: '12%',
            fleetUtilization: '88%',
            carbonOffset: '1.2 Tons'
        },
        datasetRefs: ['route-telemetry-2026.csv'],
        hints: [
            "Weights in your graph should consider elevation changes, not just distance.",
            "EV efficiency drops significantly at higher speeds; optimize for consistent moderate speeds.",
            "Incorporate real-time traffic data to avoid stop-and-go energy loss."
        ],
        companyProfile: {
            industry: "Sustainability & Logistics",
            founded: "2018",
            headquarters: "Berlin, Germany",
            mission: "Pioneering zero-emission supply chain solutions for a greener planet."
        }
    },
    {
        id: 'q3',
        title: 'Legacy System Microservices Migration',
        company: 'FinTech Solutions',
        difficulty: 'Medium',
        category: 'Software Architecture',
        description: 'Propose a decommissioning plan for a monolithic banking application and its migration to a service-oriented architecture.',
        objective: 'Create a service topology map and migration timeline that ensures zero downtime for retail banking services.',
        skills: ['Microservices', 'Docker', 'System Design', 'Risk Management'],
        rewardPoints: 400,
        deadline: '2026-05-25',
        badges: ['Architect Alpha', 'Cloud Pioneer'],
        realTimeData: {
            serviceHealth: '100%',
            migrationProgress: '45%',
            errorRate: '0.01%'
        },
        datasetRefs: ['monolith-dependency-graph.xml'],
        hints: [
            "Identify the 'Accounts' module as the first candidate for extraction using the Strangler Fig pattern.",
            "Ensure shared databases are handled via 'Database per Service' or a shared schema with strict access controls during transition.",
            "Use a Message Broker (RabbitMQ/Kafka) for eventual consistency between the monolith and new services."
        ],
        companyProfile: {
            industry: "Financial Technology",
            founded: "2005",
            headquarters: "London, UK",
            mission: "Modernizing banking infrastructure for the digital age."
        }
    }
];

// Mock Teams
const teams = [
    {
        id: 't1',
        name: 'The Binary Bandits',
        members: [
            { id: 'u1', name: 'You', role: 'Lead Developer' },
            { id: 'u2', name: 'Ananya S.', role: 'Data Analyst' },
            { id: 'u3', name: 'Rahul K.', role: 'System Architect' }
        ],
        activeQuest: 'q1',
        progress: 65,
        contributions: [
            { userId: 'u1', task: 'Log Parser Implementation', status: 'Done' },
            { userId: 'u2', task: 'Statistical Analysis', status: 'In-progress' },
            { userId: 'u3', task: 'Real-time Telemetry Dashboard', status: 'Done' }
        ],
        chatHistory: [
            { id: 1, user: 'Ananya S.', message: "Starting the data cleaning for the logs.", time: '10:00 AM' },
            { id: 2, user: 'Rahul K.', message: "I've drafted the preliminary architecture diagram.", time: '10:25 AM' },
            { id: 3, user: 'You', message: "Sounds good. I'll focus on the anomaly detection algorithm.", time: '10:30 AM' },
            { id: 4, user: 'Elena V.', message: "I can help with the performance testing once the first draft is ready.", time: '10:45 AM' }
        ]
    }
];

// Mock Student Performance Profile
let userProfile = {
    id: 'u1',
    name: 'You',
    totalPoints: 1250,
    rank: 12,
    badges: ['Fast Learner', 'Junior Fixer'],
    skillTree: {
        'Python': 85,
        'React': 90,
        'AWS': 45,
        'System Design': 60
    },
    questHistory: [
        { id: 'q0', title: 'Basic API Security', status: 'Completed', score: 95 }
    ]
};

// Skill Ontology
const skillOntology = {
    'Software Engineering': ['Python', 'JavaScript', 'System Design', 'Microservices', 'Docker'],
    'Data Science': ['Python', 'R', 'Data Analysis', 'Statistics', 'Optimization', 'Graph Theory'],
    'Cybersecurity': ['Network Security', 'Anomaly Detection', 'Risk Management', 'Cryptography']
};

export const careerQuestService = {
    getChallenges: () => Promise.resolve(industryChallenges),
    
    getChallengeById: (id) => Promise.resolve(industryChallenges.find(q => q.id === id)),
    
    getUserTeams: () => Promise.resolve(teams),
    
    getUserProfile: () => Promise.resolve(userProfile),

    getSkillOntology: () => Promise.resolve(skillOntology),
    
    submitSolution: (questId, solution) => {
        // AI Feedback Simulation (LLM powered)
        const quest = industryChallenges.find(q => q.id === questId);
        const score = Math.floor(Math.random() * 20) + 75; // Simulate score range 75-95
        
        const feedback = {
            score: score,
            strengths: [
                'Excellent architectural considerations',
                'Demonstrated strong understanding of the core problem',
                'Methodology aligns with industry standards'
            ],
            improvements: [
                'Consider more edge cases in the data validation layer',
                'Documentation could be more comprehensive for the API contracts',
                'Expand the unit testing suite to cover concurrent execution'
            ],
            badgeEarned: score > 85 ? (quest?.badges[0] || null) : null,
            collaborationScore: 92,
            sentimentAnalysis: 'Positive team dynamics detected. High level of peer interaction and constructive feedback.',
            aiPlagiarismCheck: 'Originality: 98% (Low similarity found with existing public repositories)'
        };
        
        if (feedback.badgeEarned && !userProfile.badges.includes(feedback.badgeEarned)) {
            userProfile.badges.push(feedback.badgeEarned);
        }
        userProfile.totalPoints += quest?.rewardPoints || 100;
        
        return Promise.resolve(feedback);
    },
    
    getPeerFeedback: (questId) => {
        return Promise.resolve([
            { id: 1, user: 'Ananya S.', feedback: 'Great approach on the log parsing! Maybe consider edge cases for empty logs.', time: '2h ago', sentiment: 'Constructive' },
            { id: 2, user: 'Rahul K.', feedback: 'The telemetry component looks solid. Matches the requirement perfectly.', time: '5h ago', sentiment: 'Positive' },
            { id: 3, user: 'Elena V.', feedback: 'I liked the way you handled the microservices boundary. Very clean.', time: '1h ago', sentiment: 'Positive' }
        ]);
    },
    
    getGlobalLeaderboard: () => {
        return Promise.resolve([
            { rank: 1, name: 'Siddharth M.', points: 5400, badges: 15 },
            { rank: 2, name: 'Priya R.', points: 5150, badges: 12 },
            { rank: 3, name: 'Vikram A.', points: 4900, badges: 14 },
            { rank: 12, name: 'You', points: 1250, badges: 2 }
        ]);
    },

    getTeamCommunications: (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return Promise.resolve(team ? team.chatHistory : []);
    },

    sendMessageToTeam: (teamId, message) => {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            const newMsg = {
                id: team.chatHistory.length + 1,
                user: 'You',
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            team.chatHistory.push(newMsg);
            
            // Simulate an automated response
            setTimeout(() => {
                team.chatHistory.push({
                    id: team.chatHistory.length + 1,
                    user: 'CareerBot',
                    message: "Message received. Analyzing contribution metrics...",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }, 1000);
            
            return Promise.resolve(newMsg);
        }
        return Promise.reject("Team not found");
    },

    getHint: (questId, hintLevel) => {
        const quest = industryChallenges.find(q => q.id === questId);
        if (!quest || !quest.hints) return Promise.resolve(null);
        
        // Deduct points for hints (simulated)
        userProfile.totalPoints -= 10;
        
        return Promise.resolve(quest.hints[hintLevel] || quest.hints[quest.hints.length - 1]);
    }
};

export default careerQuestService;
