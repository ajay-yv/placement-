/**
 * Service to simulate blockchain interactions for skill verification.
 * Includes DIDs, ZKPs, and IPFS-based storage simulations.
 */

const MOCK_CREDENTIALS = [
    {
        id: 'cred_001',
        title: 'Full Stack Development Certification',
        issuer: 'Tech Academy Global',
        issueDate: '2024-05-15',
        hash: '0x7f83b12...a9e4',
        status: 'Verified',
        ipfsHash: 'QmXoyp...78hc',
        type: 'Academic'
    },
    {
        id: 'cred_002',
        title: 'React.js Specialist Assessment',
        issuer: 'HackerRank (Verified)',
        issueDate: '2024-10-20',
        hash: '0x3a2b5c...8e2f',
        status: 'Verified',
        ipfsHash: 'QmYzp...12da',
        type: 'Skill'
    },
    {
        id: 'cred_003',
        title: 'Senior Frontend Intern',
        issuer: 'InnovateSoft',
        issueDate: '2025-01-10',
        hash: '0x9d4e...f1b2',
        status: 'Verified',
        ipfsHash: 'QmRpq...99xy',
        type: 'Experience'
    }
];

export const blockchainService = {
    /**
     * Get credentials with persistence support
     */
    getCredentials: async () => {
        // First check local storage for any custom/issued credentials
        const localCreds = JSON.parse(localStorage.getItem('placeprep_credentials') || '[]');
        
        // Mock default credentials
        const defaults = [
            {
                id: 'cred_1',
                title: 'Full Stack Development Certification',
                issuer: 'Tech Academy Global',
                issueDate: '2024-05-15',
                hash: '0x7f83b12d5e3a4b9c1f0a8d7e6c2b4a3a1f0e8d7c',
                status: 'Verified',
                type: 'Academic'
            },
            {
                id: 'cred_2',
                title: 'React.js Specialist Assessment',
                issuer: 'HackerRank (Verified)',
                issueDate: '2024-10-20',
                hash: '0x3a2b5c8d7e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
                status: 'Verified',
                type: 'Skill'
            },
            {
                id: 'cred_3',
                title: 'Senior Frontend Intern',
                issuer: 'InnovateSoft',
                issueDate: '2025-01-10',
                hash: '0x9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
                status: 'Verified',
                type: 'Experience'
            }
        ];
        
        // Return both combined, avoiding duplicates
        const combined = [...localCreds, ...defaults];
        return combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    },

    /**
     * Verify a specific credential hash using a mock ZKP.
     */
    verifyCredential: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const cred = MOCK_CREDENTIALS.find(c => c.id === id);
        return {
            verified: !!cred,
            timestamp: new Date().toISOString(),
            zkpProof: `zkp_proof_${Math.random().toString(36).substr(2, 9)}`,
            blockNumber: Math.floor(Math.random() * 1000000)
        };
    },

    /**
     * Get user's Decentralized Identifier (DID).
     */
    getUserDID: () => {
        return "did:key:z6MkpTHR8VNsLj7Y89RPT37SpA6yBx8W835A8876p98A2";
    },

    /**
     * Simulate a deep verification check on a credential.
     */
    verifyCredentialDetail: async (cred) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            valid: true,
            issuerSignature: `sig_0x${Math.random().toString(16).substr(2, 40)}`,
            merkleProof: [`hash_${Math.random().toString(36).substr(2, 8)}`, `hash_${Math.random().toString(36).substr(2, 8)}`],
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Simulate ZKP generation for a specific proficiency level.
     */
    generateProficiencyProof: async (skill) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            proof: `zk_snark_${Math.random().toString(36).substr(2, 32)}`,
            nullifier: `null_${Math.random().toString(36).substr(2, 16)}`,
            publicSignal: "High proficiency verified (unrevealed score)"
        };
    },

    /**
     * Simulate issuing a new credential to the blockchain ledger (with persistence).
     */
    issueCredential: async (title, issuer, type) => {
        await new Promise(resolve => setTimeout(resolve, 4000));
        const newCred = {
            id: `cred_${Math.random().toString(36).substr(2, 6)}`,
            title,
            issuer,
            issueDate: new Date().toLocaleDateString(),
            hash: `0x${Math.random().toString(16).substr(2, 40)}`,
            status: 'Verified',
            ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
            type
        };

        // Save to local storage
        const currentLocal = JSON.parse(localStorage.getItem('placeprep_credentials') || '[]');
        localStorage.setItem('placeprep_credentials', JSON.stringify([newCred, ...currentLocal]));

        return newCred;
    },

    /**
     * Verifies a proof hash (Simulated Recruiter Action)
     */
    verifyProof: async (proofHash) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (proofHash && proofHash.startsWith('zk_snark_')) {
            return {
                valid: true,
                message: "Cryptomnemonic validation successful. Identity & Proficiency confirmed.",
                depth: 12,
                consensus: "Full"
            };
        }
        return {
            valid: false,
            message: "Invalid or falsified proof signature detected."
        };
    }
};
