export const negotiationScenarios = {
    start: {
        message: "Congratulations! We are excited to offer you the Software Engineer role. The base salary is $80,000/year.",
        options: [
            { text: "Accept immediately", next: "accept_low" },
            { text: "Ask for time to review", next: "review" },
            { text: "Counter with $95,000", next: "counter_high" }
        ]
    },
    accept_low: {
        message: "Great! We look forward to having you. (Tip: You accepted the first offer. You likely left money on the table!)",
        score: 50,
        isEnd: true
    },
    review: {
        message: "Of course. Take your time. Let us know by monday.",
        options: [
            { text: "Accept the original $80k", next: "accept_low" },
            { text: "Research market rates and counter $90k", next: "counter_researched" }
        ]
    },
    counter_high: {
        message: "$95k is a bit outside our band. But we can meet you halfway at $88,000.",
        options: [
            { text: "Accept $88k", next: "accept_mid" },
            { text: "Push for $90k final", next: "final_push" }
        ]
    },
    counter_researched: {
        message: "That's a fair point. We can match that. The new offer is $90,000.",
        options: [
            { text: "Accept $90k", next: "accept_high" },
            { text: "Ask for signing bonus", next: "signing_bonus" }
        ]
    },
    accept_mid: {
        message: "Welcome aboard! $88k is a solid start.",
        score: 75,
        isEnd: true
    },
    final_push: {
        message: "Alright, we really want you. $90,000 it is.",
        score: 90,
        isEnd: true
    },
    accept_high: {
        message: "Fantastic! You negotiated a 12.5% increase. Well done.",
        score: 95,
        isEnd: true
    },
    signing_bonus: {
        message: "We can't do more salary, but we can add a $5k signing bonus.",
        score: 100,
        isEnd: true,
        finalMessage: "Perfect execution! You got a raise AND a bonus."
    }
};
