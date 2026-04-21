export const roles = [
    {
        id: 'frontend',
        title: 'Frontend Developer',
        companies: ['Google', 'Meta', 'Amazon', 'Netflix'],
        requiredSkills: [
            { name: 'HTML', difficulty: 'Beginner', prerequisites: [], isTrending: false },
            { name: 'CSS', difficulty: 'Beginner', prerequisites: ['HTML'], isTrending: false },
            { name: 'JavaScript', difficulty: 'Intermediate', prerequisites: ['HTML', 'CSS'], isTrending: true },
            { name: 'React', difficulty: 'Intermediate', prerequisites: ['JavaScript'], isTrending: true },
            { name: 'TypeScript', difficulty: 'Advanced', prerequisites: ['JavaScript'], isTrending: true },
            { name: 'Redux', difficulty: 'Advanced', prerequisites: ['React'], isTrending: false }
        ],
        resources: [
            { name: 'React Documentation', url: 'https://react.dev', type: 'Documentation' },
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'Documentation' },
            { name: 'Advanced React Patterns', url: 'https://epicreact.dev', type: 'Course' }
        ]
    },
    {
        id: 'backend',
        title: 'Backend Developer',
        companies: ['Amazon', 'Microsoft', 'Uber', 'Airbnb'],
        requiredSkills: [
            { name: 'Python', difficulty: 'Beginner', prerequisites: [], isTrending: true },
            { name: 'SQL', difficulty: 'Intermediate', prerequisites: [], isTrending: false },
            { name: 'Node.js', difficulty: 'Intermediate', prerequisites: ['JavaScript'], isTrending: true },
            { name: 'Java', difficulty: 'Intermediate', prerequisites: [], isTrending: false },
            { name: 'MongoDB', difficulty: 'Intermediate', prerequisites: ['SQL'], isTrending: false },
            { name: 'System Design', difficulty: 'Advanced', prerequisites: ['Node.js', 'SQL'], isTrending: true }
        ],
        resources: [
            { name: 'Node.js Docs', url: 'https://nodejs.org', type: 'Documentation' },
            { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Project' },
            { name: 'Backend Masters', url: 'https://frontendmasters.com', type: 'Course' }
        ]
    },
    {
        id: 'datascience',
        title: 'Data Scientist',
        companies: ['Google', 'Microsoft', 'IBM', 'NVIDIA'],
        requiredSkills: [
            { name: 'Python', difficulty: 'Beginner', prerequisites: [], isTrending: true },
            { name: 'Statistics', difficulty: 'Intermediate', prerequisites: [], isTrending: false },
            { name: 'Pandas', difficulty: 'Intermediate', prerequisites: ['Python'], isTrending: false },
            { name: 'Machine Learning', difficulty: 'Advanced', prerequisites: ['Python', 'Statistics'], isTrending: true },
            { name: 'Deep Learning', difficulty: 'Advanced', prerequisites: ['Machine Learning'], isTrending: true },
            { name: 'LLMs & RAG', difficulty: 'Advanced', prerequisites: ['Deep Learning'], isTrending: true }
        ],
        resources: [
            { name: 'Kaggle', url: 'https://www.kaggle.com', type: 'Platform' },
            { name: 'Fast.ai', url: 'https://www.fast.ai', type: 'Course' },
            { name: 'Andrew Ng ML Specialization', url: 'https://coursera.org', type: 'Micro-Credential' }
        ]
    }
];
