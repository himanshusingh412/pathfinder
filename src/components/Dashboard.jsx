import React, { useState, useEffect } from 'react';
import { fetchUserHistory } from '../utils/history';

export default function Dashboard({ user, onNavigate }) {
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ roadmaps: 0, chats: 0 });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const historyData = await fetchUserHistory();
        setRecentHistory(historyData.slice(0, 3)); // Get last 3 items
        
        // Calculate basic statistics
        const roadmapCount = historyData.filter(item => item.action.includes('roadmap') && item.status === 'success').length;
        const chatCount = historyData.filter(item => item.action.includes('chat') || item.action.includes('counselor')).length;
        setStats({ roadmaps: roadmapCount, chats: chatCount });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Format joined date
  const formatJoinedDate = (isoString) => {
    if (!isoString) return 'Recently';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  // Intelligence Layer: Generate smart suggestions based on history
  const getIntelligenceSuggestions = () => {
    if (loading) return [];

    // Find latest roadmap generation detail
    const latestRoadmap = recentHistory.find(item => item.action.includes('roadmap') && item.status === 'success');
    // Find latest chat interaction
    const latestChat = recentHistory.find(item => item.action.includes('chat') || item.action.includes('counselor'));

    const suggestions = [];

    if (latestRoadmap) {
      // Try to parse details (e.g. Generated roadmap for Aarav, Class 12, Physics...)
      const details = latestRoadmap.details.toLowerCase();
      
      if (details.includes('technology') || details.includes('coding') || details.includes('pcm')) {
        suggestions.push({
          type: 'counsel',
          text: `You recently generated a Science/Tech roadmap. Try asking the Counselor: "What BITSAT preparation strategies do you recommend?"`,
          query: "What BITSAT preparation strategies do you recommend?"
        });
        suggestions.push({
          type: 'explore',
          text: "Suggested Next Step: Explore the JEE Mains syllabus & practice free coding exercises on freeCodeCamp.",
          link: "https://jeemain.nta.ac.in/"
        });
      } else if (details.includes('medicine') || details.includes('biology') || details.includes('pcb')) {
        suggestions.push({
          type: 'counsel',
          text: `You explored Medicine interests. Try asking the Counselor: "How should I structure my NEET preparation during Class 11 and 12?"`,
          query: "How should I structure my NEET preparation during Class 11 and 12?"
        });
      } else if (details.includes('commerce') || details.includes('business') || details.includes('finance')) {
        suggestions.push({
          type: 'counsel',
          text: `You searched Business / Finance pathways. Try asking the Counselor: "Which B.Com/BBA colleges in India have the highest placements?"`,
          query: "Which B.Com/BBA colleges in India have the highest placements?"
        });
      } else {
        suggestions.push({
          type: 'counsel',
          text: `We noticed your career roadmap. Try asking the Counselor: "What are the key exams and college options for my chosen fields?"`,
          query: "What are the key exams and college options for my chosen fields?"
        });
      }
    }

    if (latestChat) {
      // If user had a chat query recently
      const chatDetails = latestChat.details;
      suggestions.push({
        type: 'history',
        text: `You recently asked about gaming or other options. Follow up with: "What is the typical starting salary for a game developer or design professional in India?"`,
        query: "What is the typical starting salary for a game developer or design professional in India?"
      });
    }

    // Default suggestions if no history exists
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'action',
        text: "Create your first personalized career roadmap to unlock smart suggestions & timeline tracking.",
        action: 'form'
      });
      suggestions.push({
        type: 'counsel',
        text: 'Ask the Counselor: "What are the top emerging careers in India for 2026?"',
        query: "What are the top emerging careers in India for 2026?"
      });
    }

    return suggestions.slice(0, 2); // Return top 2 recommendations
  };

  const suggestions = getIntelligenceSuggestions();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-indigo-400">{user.name}</span>!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Student Account • Joined {formatJoinedDate(user.createdAt)}
          </p>
        </div>
        
        <button 
          onClick={() => onNavigate('form')}
          className="self-start md:self-center bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] text-white px-5 py-3 rounded-xl text-xs font-semibold transition-all border border-indigo-500/20"
        >
          Create New Roadmap
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Roadmaps count */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="block text-xl font-bold text-white leading-tight">
              {loading ? '...' : stats.roadmaps}
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              Roadmaps Generated
            </span>
          </div>
        </div>

        {/* Chat questions count */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <span className="block text-xl font-bold text-white leading-tight">
              {loading ? '...' : stats.chats}
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              Counselor Consultations
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Intelligence Layer Card: 3 cols */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-sm md:col-span-3 flex flex-col">
          <div className="flex items-center space-x-2 border-b border-slate-850 pb-4 mb-4">
            <div className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Coach Recommendations</h3>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs text-slate-350 leading-relaxed font-medium">
                    {sug.text}
                  </div>
                ))}
              </div>

              {/* Action hints */}
              <div className="text-[10px] text-slate-450 border-t border-slate-850 pt-4 flex items-center space-x-1 font-semibold uppercase tracking-wider">
                <span>⚡ Tip: Open the AI Counselor chat inside results to try these queries.</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Mini List: 2 cols */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-350 hover:underline uppercase tracking-wider"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : recentHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <p className="text-xs text-slate-500">No activities registered yet.</p>
            </div>
          ) : (
            <div className="flex-1 space-y-3.5">
              {recentHistory.map((item) => {
                let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                if (item.action.includes('roadmap')) {
                  badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                } else if (item.status === 'failed') {
                  badgeColor = "bg-rose-500/10 text-rose-450 border-rose-500/20";
                }

                return (
                  <div key={item.id} className="text-xs border-b border-slate-850 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                        {item.action.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium line-clamp-1 break-all">
                      {item.details}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
