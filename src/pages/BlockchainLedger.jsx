import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, 
    ExternalLink, 
    Zap, 
    Award, 
    Lock, 
    Search, 
    Filter, 
    ChevronRight, 
    Cpu, 
    Globe,
    CheckCircle2,
    Clock,
    TrendingUp,
    Map,
    X,
    Loader2,
    Database,
    Fingerprint,
    FileCheck,
    Download,
    Eye,
    Building2,
    ShieldAlert,
    Copy,
    Check
} from 'lucide-react';
import { blockchainService } from '../services/blockchainService';
import { predictiveService } from '../services/predictiveService';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const BlockchainLedger = () => {
    const [credentials, setCredentials] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ledger');
    const [did, setDid] = useState('');
    
    // Student Modals
    const [verifyingCred, setVerifyingCred] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0); 
    const [verificationResult, setVerificationResult] = useState(null);
    const [isZKPModalOpen, setIsZKPModalOpen] = useState(false);
    const [zkpStep, setZkpStep] = useState(0); 
    const [zkpResult, setZkpResult] = useState(null);
    const [selectedPath, setSelectedPath] = useState(null);
    const [isLabOpen, setIsLabOpen] = useState(false);
    const [labStep, setLabStep] = useState(0); 
    const [labData, setLabData] = useState(null);

    // Institutional/Recruiter State
    const [isRecruiterPortalOpen, setIsRecruiterPortalOpen] = useState(false);
    const [verifyInput, setVerifyInput] = useState('');
    const [isVerifyingExt, setIsVerifyingExt] = useState(false);
    const [extVerifyResult, setExtVerifyResult] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const creds = await blockchainService.getCredentials();
                const recs = await predictiveService.getRecommendations();
                setCredentials(creds);
                setRecommendations(recs);
                setDid(blockchainService.getUserDID());
            } catch (error) {
                console.error("Error fetching ledger data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleVerify = async (cred) => {
        setVerifyingCred(cred);
        setVerificationStep(1);
        const result = await blockchainService.verifyCredentialDetail(cred);
        setVerificationResult(result);
        setVerificationStep(2);
    };

    const handleGenerateProof = async () => {
        setIsZKPModalOpen(true);
        setZkpStep(1);
        const result = await blockchainService.generateProficiencyProof("Senior Expert");
        setZkpResult(result);
        setZkpStep(2);
    };

    const handleLaunchLab = async (path = null) => {
        const title = path ? path.title : "Advanced System Design Lab";
        setLabData({ title, type: path ? 'Skill' : 'Academic' });
        if (selectedPath) setSelectedPath(null); 
        setIsLabOpen(true);
        setLabStep(0);
        
        // Simulation timeline
        setTimeout(() => setLabStep(1), 1500); 
        setTimeout(() => setLabStep(2), 3500); 
        setTimeout(() => setLabStep(3), 6000); 
        
        const newCred = await blockchainService.issueCredential(
            title, 
            "PlacePrep Verified AI", 
            path ? 'Skill' : 'Academic'
        );
        
        setTimeout(() => {
            setCredentials(prev => [newCred, ...prev]);
            setLabStep(4);
        }, 8500);
    };

    const handleExternalVerify = async () => {
        if (!verifyInput) return;
        setIsVerifyingExt(true);
        setExtVerifyResult(null);
        const result = await blockchainService.verifyProof(verifyInput);
        setExtVerifyResult(result);
        setIsVerifyingExt(false);
    };

    const handleExportLedger = () => {
        const exportData = {
            ownerDID: did,
            timestamp: new Date().toISOString(),
            credentials: credentials,
            summary: {
                totalVerified: credentials.length,
                trustIndex: "94%"
            }
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verified_profile_${did.substring(8, 16)}.json`;
        a.click();
    };

    const copyDID = () => {
        navigator.clipboard.writeText(did);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                </div>
                <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest text-xs">Synchronizing with L2 Nodes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 w-fit">
                            <ShieldCheck size={14} className="text-indigo-300" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100 italic">Self-Sovereign Identity</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Verified Experience <br/><span className="text-indigo-400">Ledger</span></h1>
                        <p className="text-indigo-100/70 max-w-xl font-medium">
                            Manage your cryptographically verified institutional achievements. Your identity is private, but your excellence is provable.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:w-96 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Public DID Profile</span>
                            </div>
                            <button 
                                onClick={handleExportLedger}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-indigo-300"
                                title="Export Signed Profile"
                            >
                                <Download size={16} />
                            </button>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-4 space-y-3">
                            <code className="text-[9px] font-mono text-indigo-300 break-all leading-relaxed block">{did}</code>
                            <button 
                                onClick={copyDID}
                                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                {isCopied ? 'Copied' : 'Copy DID'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit border border-gray-200/50">
                    <button 
                        onClick={() => setActiveTab('ledger')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-tight ${activeTab === 'ledger' ? 'bg-white text-indigo-600 shadow-xl' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Award size={18} />
                        Ledger
                    </button>
                    <button 
                        onClick={() => setActiveTab('predictive')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-tight ${activeTab === 'predictive' ? 'bg-white text-indigo-600 shadow-xl' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <TrendingUp size={18} />
                        Pathways
                    </button>
                </div>

                <button 
                    onClick={() => setIsRecruiterPortalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    <Building2 size={16} />
                    Recruiter View
                </button>
            </div>

            {activeTab === 'ledger' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Ledger List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                <Database className="text-indigo-600" />
                                On-Chain Credentials
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{credentials.length} Entries</span>
                                <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 border border-gray-200">
                                    <Filter size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {credentials.map((cred) => (
                                <div key={cred.id} className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-110 transition-all duration-500">
                                        <Award size={100} />
                                    </div>
                                    
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-2xl ${
                                            cred.type === 'Academic' ? 'bg-blue-50 text-blue-600' :
                                            cred.type === 'Experience' ? 'bg-emerald-50 text-emerald-600' :
                                            'bg-purple-50 text-purple-600'
                                        }`}>
                                            {cred.type === 'Academic' ? <Cpu size={28} /> : 
                                             cred.type === 'Experience' ? <Clock size={28} /> : 
                                             <Award size={28} />}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm animate-in fade-in zoom-in duration-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-black text-gray-900 uppercase group-hover:text-indigo-600 transition-colors tracking-tight mb-2 leading-tight">{cred.title}</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-6">{cred.issuer}</p>
                                    
                                    <div className="space-y-4 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">On-Chain Hash</span>
                                            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{cred.hash.substring(0, 14)}...</span>
                                        </div>
                                        <div className="h-px bg-gray-100 w-full"></div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-300 uppercase leading-none mb-1">Issue Date</span>
                                                <span className="text-xs font-bold text-gray-900">{cred.issueDate}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleVerify(cred)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm uppercase active:scale-95"
                                            >
                                                <FileCheck size={16} />
                                                Verify Auth
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Trust Index Card */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Verification Insights</h3>
                            <div className="relative h-6 w-full bg-gray-100 rounded-2xl overflow-hidden mb-6 shadow-inner p-1">
                                <div className="absolute inset-y-1 left-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl w-[94%] shadow-lg shadow-indigo-100" />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">94%</span>
                                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Global Trust Index</span>
                                </div>
                                <div className="px-4 py-2 bg-indigo-50 rounded-2xl text-[10px] font-black text-indigo-600 uppercase">Advanced Standing</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">L2 Sync</p>
                                    <p className="text-xs font-black text-indigo-600">OPTIMAL</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Consensus</p>
                                    <p className="text-xs font-black text-emerald-600">ACTIVE</p>
                                </div>
                            </div>
                        </div>

                        {/* ZKP Engine Card */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl border border-white/5 group">
                            <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-20 transform rotate-12 transition-all duration-700">
                                <Lock size={200} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="inline-flex p-4 bg-indigo-500/10 rounded-3xl mb-6 border border-white/10 group-hover:bg-indigo-500/20 transition-all duration-500">
                                    <Fingerprint size={48} className="text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 tracking-tight uppercase leading-none">Privacy Engine <br/><span className="text-indigo-400">Zero-Knowledge</span></h3>
                                <p className="text-sm text-indigo-100/40 mb-10 font-bold leading-relaxed uppercase tracking-tighter">
                                    Prove your skill proficiency without revealing raw performance data.
                                </p>
                                <button 
                                    onClick={handleGenerateProof}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/40 rounded-2xl text-xs font-black transition-all border border-indigo-400/30 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
                                >
                                    <Fingerprint size={20} />
                                    Generate Proof
                                </button>
                            </div>
                        </div>

                        {/* Export Utility */}
                        <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 border-dashed group hover:bg-indigo-100/50 transition-all duration-500 cursor-pointer" onClick={handleExportLedger}>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm border border-indigo-100 transition-transform group-hover:rotate-12">
                                    <Download size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Export Signed Profile</h4>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Institutional JSON Format</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-indigo-900 rounded-[2rem] border border-indigo-700 shadow-2xl shadow-indigo-200">
                                <Map size={40} className="text-indigo-300" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-1">Predictive Pathways</h2>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">AI Blueprints for Future-Proofing your Career</p>
                            </div>
                        </div>
                        <div className="hidden md:flex p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <button className="px-4 py-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 rounded-xl">Smart Filter</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="group flex flex-col bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border-l-[12px] border-l-indigo-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transform translate-x-12 -translate-y-12 scale-150 transition-all duration-1000">
                                    <Zap size={200} />
                                </div>
                                
                                <div className="flex items-center justify-between mb-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                        rec.demand === 'Very High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {rec.demand} Demand
                                    </span>
                                    <span className="text-xs font-black text-gray-300 uppercase italic tracking-widest">{rec.difficulty}</span>
                                </div>

                                <h3 className="font-black text-gray-900 text-2xl mb-4 uppercase tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">{rec.title}</h3>
                                <p className="text-sm text-gray-400 mb-10 leading-relaxed font-bold italic border-l-[6px] border-l-gray-100 pl-6 py-2">
                                    "{rec.reason}"
                                </p>
                                
                                <div className="space-y-8 mt-auto">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Skills to Forge</p>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.skillsToLearn.map(skill => (
                                                <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 text-[10px] font-black rounded-2xl border border-gray-100 capitalize hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-dashed border-gray-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">ROI Prediction</span>
                                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">+{rec.projectedSalaryIncrease}</span>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedPath(rec)}
                                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest active:scale-95"
                                        >
                                            Explore Route
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 rounded-[3rem] p-12 lg:p-16 border border-indigo-100 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 duration-1000">
                            <Cpu size={280} />
                        </div>
                        <div className="space-y-6 text-center lg:text-left relative z-10">
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg ring-8 ring-indigo-600/10">
                                    <Zap size={24} className="text-white" />
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-indigo-950 uppercase tracking-tighter leading-none">Simulate New <br/><span className="text-indigo-600">Certification</span></h3>
                            </div>
                            <p className="text-lg text-indigo-700/60 font-medium max-w-xl leading-relaxed">
                                Launch a virtual assessment to earn your next verifiable badge. Progress is cryptographically signed and persistent.
                            </p>
                        </div>
                        <button 
                            onClick={() => handleLaunchLab()}
                            className="px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-400/50 transition-all flex items-center gap-4 relative z-10 active:scale-95 shadow-xl shadow-indigo-200 uppercase tracking-widest"
                        >
                            <Cpu size={28} />
                            Launch Virtual Lab
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            
            {/* Verification Detail Modal */}
            <Modal isOpen={!!verifyingCred} onClose={() => setVerifyingCred(null)} title="On-Chain Protocol Check">
                {verificationStep === 1 ? (
                    <div className="flex flex-col items-center py-16 space-y-8 text-center animate-in fade-in">
                        <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
                        <div className="space-y-2">
                            <p className="text-lg font-black text-gray-900 uppercase tracking-tight">Syncing Nodes</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-mono animate-pulse">Comparing Merkle Proofs...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex gap-6 items-center shadow-sm">
                            <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                                <ShieldCheck size={40} />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-xl text-emerald-900 tracking-tighter uppercase leading-none mb-1">Authentic Profile</p>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Digital signature validated by consensus.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5 block">Issuer Digital Signature</label>
                                    <div className="font-mono text-[9px] text-gray-600 bg-white p-3 rounded-xl border border-gray-100 break-all leading-relaxed">{verificationResult?.issuerSignature}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 block">Proof Depth</label>
                                        <p className="text-sm font-black text-gray-900">Layer 12</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 block">Network Status</label>
                                        <p className="text-sm font-black text-emerald-600">CONFIRMED</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setVerifyingCred(null)} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Accept Protocol</button>
                    </div>
                )}
            </Modal>

            {/* ZKP Modal */}
            <Modal isOpen={isZKPModalOpen} onClose={() => setIsZKPModalOpen(false)} title="Zero-Knowledge engine">
                {zkpStep === 1 ? (
                    <div className="flex flex-col items-center py-16 space-y-8 text-center animate-in fade-in">
                        <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
                        <div className="space-y-2">
                            <p className="text-lg font-black text-gray-900 uppercase tracking-tight">Computing SNARKs</p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] font-mono animate-pulse">Generating Proof without Reveal...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="p-10 bg-indigo-950 rounded-[2.5rem] text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Fingerprint size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="p-5 bg-white/5 rounded-3xl mb-6 ring-1 ring-white/10">
                                    <Fingerprint size={56} className="text-white" />
                                </div>
                                <h4 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none">Proof Generated</h4>
                                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 mb-8">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verifiable Signature</span>
                                </div>
                                <code className="text-[10px] font-mono text-indigo-200/50 bg-black/40 p-4 rounded-xl border border-white/5 break-all leading-relaxed transition-all hover:text-indigo-200 cursor-help" title="Click to copy full hash">{zkpResult?.proof}</code>
                            </div>
                        </div>

                        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
                            <div className="flex items-center gap-3">
                                <Eye size={16} className="text-indigo-600" />
                                <p className="text-[11px] font-bold text-indigo-900 tracking-tight italic">Public Signal Result: <span className="text-indigo-600 uppercase not-italic font-black">"{zkpResult?.publicSignal}"</span></p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all border border-gray-200 active:scale-95">Download PDF</button>
                            <button className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">Add to Resume</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Learning Blueprint Modal */}
            <Modal isOpen={!!selectedPath} onClose={() => setSelectedPath(null)} title="Career Forge Blueprint">
                {selectedPath && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100">
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{selectedPath.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended Strategic Route</p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <Award size={24} className="text-indigo-600" />
                            </div>
                        </div>

                        <div className="relative space-y-10 pl-10 before:absolute before:inset-y-0 before:left-3 before:w-1 before:bg-indigo-50 before:rounded-full">
                            <div className="relative">
                                <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shadow-md flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                </div>
                                <h5 className="font-black text-lg text-gray-900 uppercase tracking-tighter leading-none mb-2">Phase 1: Foundation Forge</h5>
                                <p className="text-xs font-bold text-gray-400 italic leading-relaxed">Master the core principles of {selectedPath.skillsToLearn[0]} and {selectedPath.skillsToLearn[1]}.</p>
                            </div>
                            
                            <div className="relative opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                                <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                                    <Lock size={10} className="text-gray-400" />
                                </div>
                                <h5 className="font-black text-lg text-gray-400 uppercase tracking-tighter leading-none mb-2 italic">Phase 2: Project Synthesis</h5>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Locked: Complete previous phase to unlock.</p>
                            </div>

                            <div className="relative opacity-40 grayscale">
                                <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                                    <Lock size={10} className="text-gray-400" />
                                </div>
                                <h5 className="font-black text-lg text-gray-400 uppercase tracking-tighter leading-none mb-2 italic">Final Phase: Protocol Validation</h5>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Locked: Institutional assessment required.</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                onClick={() => handleLaunchLab(selectedPath)} 
                                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-indigo-300 flex items-center justify-center gap-4 transition-all hover:bg-indigo-700 active:scale-95 uppercase tracking-widest"
                            >
                                <Zap size={20} />
                                Initiate Simulation
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Virtual Lab Modal */}
            <Modal isOpen={isLabOpen} onClose={() => labStep === 4 && setIsLabOpen(false)} title={`Virtual Assessment: ${labData?.title}`}>
                <div className="space-y-8 min-h-[400px] flex flex-col justify-center">
                    {labStep < 4 ? (
                        <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in duration-500">
                            {/* Sequence Visualizer */}
                            <div className="w-full bg-gray-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600/30">
                                    <div 
                                        className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                                        style={{ width: `${(labStep / 3) * 100}%` }}
                                    ></div>
                                </div>
                                
                                {labStep === 0 && (
                                    <div className="flex flex-col items-center py-6 space-y-6">
                                        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
                                        <div className="text-center">
                                            <p className="text-indigo-200 font-black uppercase tracking-[0.2em] mb-1">Connecting to Labs</p>
                                            <p className="text-[10px] font-mono text-indigo-500 uppercase">Handshaking with L2 Consensus Nodes...</p>
                                        </div>
                                    </div>
                                )}

                                {labStep === 1 && (
                                    <div className="space-y-4 py-4 animate-in slide-in-from-bottom-2">
                                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Identity Verified</span>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        </div>
                                        <div className="font-mono text-[10px] space-y-2 text-indigo-300">
                                            <p className="flex gap-2"><span>[INFO]</span> <span>Syncing telemetry stream...</span></p>
                                            <p className="flex gap-2"><span>[INFO]</span> <span className="text-emerald-400">Environment provisioned: sys-node-v3.0.2</span></p>
                                            <p className="flex gap-2"><span>[INFO]</span> <span>Injecting logic assessment modules...</span></p>
                                            <p className="flex gap-2 animate-pulse"><span>$</span> <span>input_stream: ready</span></p>
                                        </div>
                                    </div>
                                )}

                                {labStep === 2 && (
                                    <div className="space-y-6 py-6 animate-in fade-in">
                                        <div className="text-center">
                                            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Skill Validation in Progress</h5>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className={`h-1 rounded-full ${i < labStep * 3 ? 'bg-indigo-500' : 'bg-white/5'} transition-all duration-300`}></div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-mono text-center text-indigo-400 italic">Monitoring complex pattern recognition & algorithm logic...</p>
                                    </div>
                                )}

                                {labStep === 3 && (
                                    <div className="flex flex-col items-center py-10 space-y-6 animate-in zoom-in">
                                        <Fingerprint size={64} className="text-emerald-400 animate-bounce" />
                                        <div className="text-center">
                                            <p className="text-white font-black uppercase tracking-[0.3em] mb-2 leading-none">Signing Proof</p>
                                            <p className="text-[9px] font-mono text-indigo-500 break-all px-6">0x{Math.random().toString(16).substr(2, 64)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] leading-none animate-pulse">Simulation In Progress</p>
                        </div>
                    ) : (
                        <div className="text-center space-y-10 py-10 animate-in zoom-in-95 duration-500 relative">
                            {/* Success Visual */}
                            <div className="inline-flex p-10 bg-emerald-50 rounded-[3rem] border-4 border-white shadow-2xl relative">
                                <Award size={80} className="text-emerald-600" />
                                <div className="absolute -bottom-4 -right-4 p-4 bg-white rounded-2xl shadow-lg">
                                    <CheckCircle2 size={32} className="text-emerald-500" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">Assessment Proven</h4>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Your Achievement is now part of the Immutable Chain.</p>
                            </div>

                            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between shadow-inner">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: PERSISTED</span>
                                    <span className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">{labData?.title}</span>
                                </div>
                                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <ShieldCheck className="text-emerald-500" size={24} />
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => { setIsLabOpen(false); setActiveTab('ledger'); }} 
                                className="w-full py-6 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95"
                            >
                                Sync Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Recruiter Verification Portal Modal */}
            <Modal isOpen={isRecruiterPortalOpen} onClose={() => setIsRecruiterPortalOpen(false)} title="Institutional Verification Portal">
                <div className="space-y-8 py-4">
                    <div className="p-6 bg-gray-900 rounded-[2rem] text-white space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Building2 size={120} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-black uppercase tracking-tight mb-2">Recruiter / Employer Check</h4>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Enter a Candidate's Public ZKP Hash to verify proficiency without seeing private scores.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Paste Public Proof Hash (zk_snark_...)"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-12 text-[10px] font-mono text-indigo-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={verifyInput}
                                    onChange={(e) => setVerifyInput(e.target.value)}
                                />
                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                            <button 
                                onClick={handleExternalVerify}
                                disabled={isVerifyingExt}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isVerifyingExt ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck size={18} />}
                                {isVerifyingExt ? 'Verifying on Node...' : 'Verify Candidate'}
                            </button>
                        </div>
                    </div>

                    {extVerifyResult && (
                        <div className={`p-8 rounded-[2rem] animate-in slide-in-from-top-4 duration-500 ${extVerifyResult.valid ? 'bg-emerald-50 border-2 border-emerald-100' : 'bg-rose-50 border-2 border-rose-100'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`p-5 rounded-2xl shadow-sm ${extVerifyResult.valid ? 'bg-white text-emerald-600' : 'bg-white text-rose-600'}`}>
                                    {extVerifyResult.valid ? <CheckCircle2 size={32} /> : <ShieldAlert size={32} />}
                                </div>
                                <div className="flex-1">
                                    <h5 className={`font-black text-xl uppercase tracking-tighter leading-none mb-1 ${extVerifyResult.valid ? 'text-emerald-900' : 'text-rose-900'}`}>
                                        {extVerifyResult.valid ? 'Verification Success' : 'Invalid Proof'}
                                    </h5>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${extVerifyResult.valid ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {extVerifyResult.message}
                                    </p>
                                </div>
                            </div>
                            
                            {extVerifyResult.valid && (
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/60 rounded-xl border border-emerald-100/50">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Consensus</p>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{extVerifyResult.consensus} Network</p>
                                    </div>
                                    <div className="p-4 bg-white/60 rounded-xl border border-emerald-100/50">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Proof Depth</p>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Layer {extVerifyResult.depth}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default BlockchainLedger;
