import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Calendar, Clock, MapPin, AlertCircle, User, 
  FileText, Sparkles, LayoutDashboard, Database, ShieldCheck, 
  TrendingUp, PieChart as PieChartIcon, BarChart3, Menu, X, ChevronRight,
  Activity, Info, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NyayaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-10 h-10", className)}>
    {/* Laurel Wreath - Left */}
    <g fill="#8B735B">
      <path d="M 30 85 C 15 75 10 45 15 30 Q 12 35 10 45 Q 12 55 15 65 Q 20 75 30 85" opacity="0.3" />
      <path d="M 15 30 Q 10 32 8 38 Q 12 36 15 30" />
      <path d="M 13 40 Q 8 42 6 48 Q 10 46 13 40" />
      <path d="M 12 50 Q 7 52 5 58 Q 9 56 12 50" />
      <path d="M 13 60 Q 8 62 6 68 Q 10 66 13 60" />
      <path d="M 16 70 Q 11 72 9 78 Q 13 76 16 70" />
      <path d="M 22 78 Q 17 80 15 86 Q 19 84 22 78" />
    </g>
    {/* Laurel Wreath - Right */}
    <g fill="#8B735B">
      <path d="M 70 85 C 85 75 90 45 85 30 Q 88 35 90 45 Q 88 55 85 65 Q 80 75 70 85" opacity="0.3" />
      <path d="M 85 30 Q 90 32 92 38 Q 88 36 85 30" />
      <path d="M 87 40 Q 92 42 94 48 Q 90 46 87 40" />
      <path d="M 88 50 Q 93 52 95 58 Q 91 56 88 50" />
      <path d="M 87 60 Q 92 62 94 68 Q 90 66 87 60" />
      <path d="M 84 70 Q 89 72 91 78 Q 87 76 84 70" />
      <path d="M 78 78 Q 83 80 85 86 Q 81 84 78 78" />
    </g>
    {/* Scale of Justice - Center Pillar */}
    <path d="M 50 25 L 50 75" stroke="#004A7C" strokeWidth="4" strokeLinecap="round" />
    <path d="M 40 75 L 60 75" stroke="#004A7C" strokeWidth="4" strokeLinecap="round" />
    <path d="M 42 78 L 58 78" stroke="#004A7C" strokeWidth="2" strokeLinecap="round" />
    {/* Scale of Justice - Horizontal Beam */}
    <path d="M 25 38 C 35 30 65 30 75 38" fill="none" stroke="#004A7C" strokeWidth="3" strokeLinecap="round" />
    {/* Left Scale */}
    <path d="M 25 38 L 15 65 L 35 65 Z" fill="#004A7C" />
    <path d="M 25 38 L 25 45" stroke="#004A7C" strokeWidth="1.5" />
    {/* Right Scale */}
    <path d="M 75 38 L 65 65 L 85 65 Z" fill="#004A7C" />
    <path d="M 75 38 L 75 45" stroke="#004A7C" strokeWidth="1.5" />
    {/* Top Tip */}
    <path d="M 50 15 L 53 25 L 47 25 Z" fill="#004A7C" />
  </svg>
);

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Small Stars */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-black rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.2 + 0.05
          }}
          animate={{ 
            x: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ 
            duration: Math.random() * 30 + 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      ))}

      {/* Large Floating Blobs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute bg-black/5 rounded-full blur-[100px]"
          style={{
            width: Math.random() * 400 + 200,
            height: Math.random() * 400 + 200,
          }}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
          }}
          animate={{ 
            x: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: Math.random() * 40 + 40, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="black" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Case {
  case_id: number;
  person_name: string;
  case_type: 'Criminal' | 'Civil' | 'Property' | 'Corporate' | 'Family';
  severity: 'low' | 'medium' | 'high';
  pending_days: number;
  court: string;
  judge: string;
  status: 'pending' | 'closed' | 'ongoing';
  filing_date: string;
}

interface Hearing {
  priority: string;
  schedule_days: number;
  hearing_date: string;
  hearing_time: string;
  courtroom: string;
  ai_reasoning?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'database' | 'courtrooms'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [hearing, setHearing] = useState<Hearing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAIReasoning, setShowAIReasoning] = useState(false);

  // Fetch all cases for dashboard stats
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        setAllCases(data);
      } catch (err) {
        console.error("Failed to fetch cases", err);
      }
    };
    fetchAll();
  }, []);

  // Dashboard Stats
  const stats = useMemo(() => {
    if (allCases.length === 0) return null;
    
    const typeData = allCases.reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.case_type);
      if (existing) existing.value++;
      else acc.push({ name: curr.case_type, value: 1 });
      return acc;
    }, []);

    const severityData = [
      { name: 'High', value: allCases.filter(c => c.severity === 'high').length },
      { name: 'Medium', value: allCases.filter(c => c.severity === 'medium').length },
      { name: 'Low', value: allCases.filter(c => c.severity === 'low').length },
    ];

    const pendingTrend = allCases
      .sort((a, b) => new Date(a.filing_date).getTime() - new Date(b.filing_date).getTime())
      .map(c => ({
        date: new Date(c.filing_date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        days: c.pending_days
      }));

    return { typeData, severityData, pendingTrend };
  }, [allCases]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSelectedCase(null);
    setHearing(null);

    try {
      const isId = !isNaN(Number(searchQuery));
      const endpoint = isId ? `/api/case/${searchQuery}` : `/api/user/${searchQuery}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('No cases found');
      
      const data = await response.json();
      const casesArray = Array.isArray(data) ? data : [data];
      setResults(casesArray);
      
      if (casesArray.length === 0) setError('No matching records found.');
    } catch (err) {
      setError('Error fetching case details. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCase = (c: Case) => {
    setSelectedCase(c);
    setHearing(null);
    setShowAIReasoning(false);
  };

  const generateHearingAI = async (caseData: Case) => {
    if (!process.env.GEMINI_API_KEY) {
      setError('Gemini API Key is missing. Please add it to the Secrets panel.');
      return;
    }

    setLoading(true);
    try {
      const model = "gemini-3-flash-preview";
      const prompt = `As a Judicial AI Assistant, analyze this court case and generate a hearing schedule:
      Person: ${caseData.person_name}
      Case Type: ${caseData.case_type}
      Severity: ${caseData.severity}
      Pending Days: ${caseData.pending_days}
      Court: ${caseData.court}
      Judge: ${caseData.judge}
      
      Determine the priority (High/Normal), a hearing date (within 5-20 days from today), a time (10:00 AM, 11:30 AM, or 2:00 PM), and a courtroom number. 
      Also provide a brief 1-sentence AI reasoning for the priority.`;

      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING },
              schedule_days: { type: Type.NUMBER },
              hearing_date: { type: Type.STRING },
              hearing_time: { type: Type.STRING },
              courtroom: { type: Type.STRING },
              ai_reasoning: { type: Type.STRING }
            },
            required: ["priority", "hearing_date", "hearing_time", "courtroom", "ai_reasoning"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setHearing(result);
    } catch (err) {
      console.error(err);
      setError('AI Generation failed. Please check your API key in the Secrets panel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans relative overflow-hidden">
      <AnimatedBackground />
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse-slow" />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-black/5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white p-1 rounded-xl shadow-lg border border-black/5">
              <NyayaLogo className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Nyaya Portal
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarLink 
              icon={<Search size={20} />} 
              label="Case Lookup" 
              active={activeTab === 'search'} 
              onClick={() => setActiveTab('search')} 
            />
            <SidebarLink 
              icon={<Monitor size={20} />} 
              label="Courtroom Monitor" 
              active={activeTab === 'courtrooms'} 
              onClick={() => setActiveTab('courtrooms')} 
            />
            <SidebarLink 
              icon={<Database size={20} />} 
              label="Central Database" 
              active={activeTab === 'database'} 
              onClick={() => setActiveTab('database')} 
            />
          </nav>

          <div className="mt-auto pt-6 border-t border-black/5">
            <div className="bg-black/5 rounded-2xl p-4 border border-black/5">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-blue-600 w-4 h-4" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-slate-900">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full border border-black/5">
              <Activity size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-500">AI Engine: Gemini 3 Flash</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-black/10 flex items-center justify-center">
              <User size={16} className="text-slate-600" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Judicial Intelligence Dashboard</h2>
                    <p className="text-slate-500 mt-1">Real-time analytics and case distribution overview.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-4 py-2 bg-black/5 border border-black/5 rounded-xl text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Cases</p>
                      <p className="text-xl font-bold text-slate-900">{allCases.length}</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-center">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Pending</p>
                      <p className="text-xl font-bold text-blue-600">{allCases.filter(c => c.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <DashboardCard title="Case Distribution" icon={<PieChartIcon size={18} />}>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats?.typeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats?.typeData.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: '#0f172a' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </DashboardCard>

                  <DashboardCard title="Severity Analysis" icon={<BarChart3 size={18} />}>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.severityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: '#0f172a' }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </DashboardCard>

                  <DashboardCard title="Pending Days Trend" icon={<TrendingUp size={18} />}>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.pendingTrend}>
                          <defs>
                            <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: '#0f172a' }}
                          />
                          <Area type="monotone" dataKey="days" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorDays)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </DashboardCard>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-md border border-black/5 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900">Recent Case Filings</h3>
                    <button onClick={() => setActiveTab('database')} className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-bold">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-black/5">
                          <th className="pb-4">Case ID</th>
                          <th className="pb-4">Petitioner</th>
                          <th className="pb-4">Type</th>
                          <th className="pb-4">Severity</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {allCases.slice(0, 5).map(c => (
                          <tr key={c.case_id} className="group hover:bg-black/[0.01] transition-colors">
                            <td className="py-4 text-sm font-mono text-blue-600">#{c.case_id}</td>
                            <td className="py-4 text-sm font-black text-slate-900">{c.person_name}</td>
                            <td className="py-4 text-sm text-slate-500">{c.case_type}</td>
                            <td className="py-4">
                              <span className={cn(
                                "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                                c.severity === 'high' ? "bg-red-100 text-red-600" :
                                c.severity === 'medium' ? "bg-amber-100 text-amber-600" :
                                "bg-green-100 text-green-600"
                              )}>
                                {c.severity}
                              </span>
                            </td>
                            <td className="py-4 text-sm font-bold text-slate-600 capitalize">{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Case Intelligence Lookup</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                    Search the national judicial database with AI-enhanced scheduling and analysis.
                  </p>
                </div>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter Petitioner Name or Case ID..."
                      className="w-full pl-14 pr-36 py-5 bg-white border border-black/10 rounded-3xl shadow-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-lg placeholder:text-slate-400 text-slate-900 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="max-w-xl mx-auto bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-4 animate-shake shadow-sm">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-bold">{error}</p>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {!selectedCase && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {results.map((c) => (
                        <div
                          key={c.case_id}
                          onClick={() => selectCase(c)}
                          className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-black/5 hover:border-blue-600/50 cursor-pointer transition-all flex items-center justify-between group shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-600 transition-all">
                              <User className="w-7 h-7" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{c.person_name}</h4>
                              <p className="text-sm text-slate-500 font-mono">ID: #{c.case_id} • {c.case_type}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-all" />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {selectedCase && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                      {/* Case Info Card */}
                      <div className="lg:col-span-7 space-y-6">
                        <button
                          onClick={() => setSelectedCase(null)}
                          className="text-sm font-black text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors"
                        >
                          <X size={16} /> Close Case View
                        </button>
                        
                        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] border border-black/5 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                          
                          <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                              <FileText className="w-10 h-10" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-slate-900">{selectedCase.person_name}</h3>
                              <p className="text-slate-500 font-mono tracking-tighter font-bold">CASE_REFERENCE_ID: {selectedCase.case_id}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <CaseDetail label="Type" value={selectedCase.case_type} />
                            <CaseDetail label="Severity" value={selectedCase.severity} highlight={selectedCase.severity === 'high'} />
                            <CaseDetail label="Status" value={selectedCase.status} />
                            <CaseDetail label="Court" value={selectedCase.court} />
                            <CaseDetail label="Judge" value={selectedCase.judge} />
                            <CaseDetail label="Pending" value={`${selectedCase.pending_days} Days`} />
                          </div>

                          {!hearing && (
                            <button
                              onClick={() => generateHearingAI(selectedCase)}
                              disabled={loading}
                              className="w-full mt-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-3xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                            >
                              {loading ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  AI Processing...
                                </div>
                              ) : (
                                <>
                                  <Sparkles className="w-6 h-6" />
                                  Generate AI Hearing Schedule
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* AI Result Card */}
                      <div className="lg:col-span-5">
                        <AnimatePresence>
                          {hearing ? (
                            <motion.div
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-gradient-to-b from-slate-50 to-white p-10 rounded-[40px] border border-black/5 shadow-2xl h-full flex flex-col relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-grid opacity-5" />
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="text-blue-600 w-5 h-5" />
                                    <h3 className="text-xl font-black text-slate-900">AI Analysis Result</h3>
                                  </div>
                                  <span className={cn(
                                    "text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest",
                                    hearing.priority.toLowerCase() === 'high' ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                                  )}>
                                    {hearing.priority} Priority
                                  </span>
                                </div>

                                <div className="space-y-10">
                                  <HearingInfo icon={<Calendar className="text-blue-600" />} label="Scheduled Date" value={hearing.hearing_date} />
                                  <HearingInfo icon={<Clock className="text-blue-600" />} label="Session Time" value={hearing.hearing_time} />
                                  <HearingInfo icon={<MapPin className="text-blue-600" />} label="Courtroom" value={hearing.courtroom} />
                                </div>
                              </div>

                              <div className="mt-auto pt-10 border-t border-white/5 relative z-10">
                                <button 
                                  onClick={() => setShowAIReasoning(!showAIReasoning)}
                                  className="flex items-center justify-between w-full group/btn"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover/btn:bg-blue-500/20 transition-colors">
                                      <Info size={14} className="text-blue-400" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover/btn:text-slate-300 transition-colors">
                                      AI Justification Engine
                                    </p>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: showAIReasoning ? 180 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <ChevronRight size={14} className="text-slate-600 group-hover/btn:text-blue-400 transition-colors" />
                                  </motion.div>
                                </button>

                                <AnimatePresence>
                                  {showAIReasoning && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="relative">
                                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full" />
                                        <p className="text-sm text-slate-300 italic leading-relaxed bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10 shadow-inner">
                                          <span className="text-blue-400 font-serif text-2xl absolute -top-1 -left-1 opacity-20">"</span>
                                          {hearing.ai_reasoning}
                                          <span className="text-blue-400 font-serif text-2xl absolute -bottom-4 right-2 opacity-20">"</span>
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center p-12 text-center bg-white/[0.01]">
                              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Sparkles className="w-10 h-10 text-slate-700" />
                              </div>
                              <h4 className="text-xl font-bold text-slate-500 mb-2">Awaiting AI Input</h4>
                              <p className="text-slate-600 text-sm max-w-[240px]">
                                Use the generator to process case data through our judicial intelligence engine.
                              </p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'database' && (
              <motion.div
                key="database"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Central Repository</h2>
                    <p className="text-slate-500 mt-1">Access all judicial records indexed in the system.</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-black/5 rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-black/[0.02] border-b border-black/5">
                          <th className="px-8 py-6">Case ID</th>
                          <th className="px-8 py-6">Petitioner</th>
                          <th className="px-8 py-6">Type</th>
                          <th className="px-8 py-6">Court</th>
                          <th className="px-8 py-6">Judge</th>
                          <th className="px-8 py-6">Severity</th>
                          <th className="px-8 py-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {allCases.map(c => (
                          <tr key={c.case_id} className="group hover:bg-black/[0.01] transition-colors cursor-pointer" onClick={() => {
                            setSelectedCase(c);
                            setActiveTab('search');
                          }}>
                            <td className="px-8 py-5 text-sm font-mono text-blue-600">#{c.case_id}</td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900">{c.person_name}</td>
                            <td className="px-8 py-5 text-sm text-slate-500">{c.case_type}</td>
                            <td className="px-8 py-5 text-sm text-slate-500">{c.court}</td>
                            <td className="px-8 py-5 text-sm text-slate-500">{c.judge}</td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                                c.severity === 'high' ? "bg-red-100 text-red-600" :
                                c.severity === 'medium' ? "bg-amber-100 text-amber-600" :
                                "bg-green-100 text-green-600"
                              )}>
                                {c.severity}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "text-[10px] font-black uppercase px-2 py-1 rounded-full",
                                c.status === 'pending' ? "text-amber-600 bg-amber-100" : "text-green-600 bg-green-100"
                              )}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courtrooms' && (
              <motion.div
                key="courtrooms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">Courtroom Monitor</h2>
                  <p className="text-slate-500 mt-1">Real-time occupancy and availability status across all courtrooms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[101, 102, 103, 104, 105, 106, 107, 108, 109, 110].map((num) => {
                    const isOccupied = allCases.some(c => c.status === 'ongoing' && (c.case_id % 10 + 101) === num);
                    const currentCase = allCases.find(c => c.status === 'ongoing' && (c.case_id % 10 + 101) === num);
                    
                    return (
                      <motion.div 
                        key={num}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "p-8 rounded-[32px] border transition-all relative overflow-hidden",
                          isOccupied 
                            ? "bg-red-50 border-red-100 shadow-lg shadow-red-500/5" 
                            : "bg-green-50 border-green-100 shadow-lg shadow-green-500/5"
                        )}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            isOccupied ? "bg-red-600 text-white" : "bg-green-600 text-white"
                          )}>
                            <NyayaLogo className={cn("w-6 h-6", isOccupied ? "brightness-0 invert" : "brightness-0 invert")} />
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest",
                            isOccupied ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
                          )}>
                            {isOccupied ? 'Occupied' : 'Available'}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-900 mb-1">Courtroom {num}</h3>
                        <p className="text-slate-500 text-sm mb-6 font-bold">Main Judicial Wing</p>

                        {isOccupied && currentCase ? (
                          <div className="space-y-3 pt-6 border-t border-red-100">
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-red-500" />
                              <span className="text-xs font-black text-red-900">{currentCase.person_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-red-500" />
                              <span className="text-xs font-bold text-red-700">{currentCase.case_type} - #{currentCase.case_id}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-6 border-t border-green-100">
                            <p className="text-xs text-green-700 font-black">Ready for next session</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-slate-500 hover:bg-black/5 hover:text-slate-900"
      )}
    >
      <span className={cn(active ? "text-white" : "text-slate-400 group-hover:text-blue-600")}>
        {icon}
      </span>
      <span className="text-sm font-bold">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function DashboardCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/5 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-blue-600">{icon}</span>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CaseDetail({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={cn(
        "text-sm font-black",
        highlight ? "text-red-600" : "text-slate-900"
      )}>
        {value}
      </p>
    </div>
  );
}

function HearingInfo({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-5 group/item">
      <div className="bg-black/5 p-4 rounded-2xl border border-black/5 group-hover/item:border-blue-600/30 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">{value}</p>
      </div>
    </div>
  );
}
