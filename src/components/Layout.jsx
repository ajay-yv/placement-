import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Target,
    Lightbulb,
    ListTodo,
    Users,
    Menu,
    X,
    FileText,
    Mic,
    Calendar,

    TrendingUp,

    Briefcase,
    Server,
    Github,
    Terminal,
    BarChart2,
    Compass,

    LogOut,
    LogIn,
    ShieldCheck,
    Trophy
} from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Predict Placement', path: '/predict', icon: Target },
        { name: 'Skill Suggestions', path: '/skills', icon: Lightbulb },
        { name: 'Preparation Tracker', path: '/tracker', icon: ListTodo },
        { name: 'AI Resume Builder', path: '/resume', icon: FileText },
        { name: 'Voice Interview', path: '/interview', icon: Mic },
        { name: 'Smart Study Plan', path: '/study-plan', icon: Calendar },

        { name: 'Trending Topics', path: '/trending', icon: TrendingUp },

        { name: 'Get Referrals', path: '/referrals', icon: Briefcase },
        { name: 'System Design', path: '/system-design', icon: Server },
        { name: 'GitHub Auditor', path: '/github', icon: Github },
        { name: 'Algo Visualizer', path: '/algo', icon: BarChart2 },

        { name: 'Blockchain Ledger', path: '/ledger', icon: ShieldCheck },
        { name: 'Career Hub', path: '/peers', icon: Compass },
        { name: 'Career Quest', path: '/career-quest', icon: Trophy },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center px-6 py-4 border-b border-gray-200 shrink-0 h-16">
                    <span className="text-xl font-bold text-indigo-600">PlacePrep</span>
                    <button
                        className="lg:hidden ml-auto"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Main Header */}
                <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8 shrink-0">
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="ml-4 text-xl font-bold text-gray-900">PlacePrep</span>
                    </div>

                    <div className="hidden lg:block"></div> {/* Spacer for desktop */}

                    <div className="flex items-center ml-auto space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-medium text-gray-900 leading-none mb-1">{user.name}</p>
                                        <p className="text-xs text-gray-500 leading-none">{user.email}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 sm:mr-2" />
                                    <span className="hidden sm:block">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Login
                                </Link>
                                <Link to="/register" className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
