
import { duelProblems } from '../data/duelData';

class DuelService {
    constructor() {
        this.problems = duelProblems;
        this.stats = {
            wins: 0,
            losses: 0,
            points: 0,
            streak: 0
        };
    }

    getProblemsByCategory(category) {
        return this.problems.filter(p => p.category === category);
    }

    getRandomProblem(difficulty) {
        const filtered = difficulty 
            ? this.problems.filter(p => p.difficulty === difficulty)
            : this.problems;
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    getBotProgression(difficulty, currentProgress, timeElapsed) {
        // Realistic bot progression with "thinking" pauses
        const baseSpeeds = {
            'Easy': 1.5,
            'Medium': 1.0,
            'Hard': 0.6
        };

        const speed = baseSpeeds[difficulty] || 1.0;
        
        // Probability of a "thinking phase" (no progress)
        const isThinking = Math.random() < 0.15;
        if (isThinking) return 0;

        // Random increment based on speed
        const increment = (Math.random() * speed) + 0.2;
        return Math.min(increment, 100 - currentProgress);
    }

    calculatePoints(result, difficulty, time) {
        if (result === 'lost') return 0;
        
        const basePoints = {
            'Easy': 100,
            'Medium': 250,
            'Hard': 500
        }[difficulty] || 100;

        // Speed bonus: faster completion = more points
        // Expected times: Easy (60s), Medium (180s), Hard (300s)
        const expectedTime = { 'Easy': 60, 'Medium': 180, 'Hard': 300 }[difficulty];
        const multiplier = Math.max(0.5, (expectedTime - time) / expectedTime + 1);
        
        return Math.round(basePoints * multiplier);
    }

    getHelpGuide() {
        return [
            {
                title: "The Race is On",
                content: "You're competing against 'DuelBot'. Both start at 0% progress. First to submit a working solution wins."
            },
            {
                title: "Bot Behavior",
                content: "Bot speed scales with difficulty. If it reaches 100% before you submit, you lose the match."
            },
            {
                title: "Validation",
                content: "Your solution must pass all hidden test cases. A partial solution won't win the duel."
            },
            {
                title: "Rankings",
                content: "Earn points to climb the placement leaderboard. Faster wins yield higher multipliers."
            }
        ];
    }
}

export const duelService = new DuelService();
