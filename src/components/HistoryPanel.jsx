import React, { useState, useEffect } from 'react';
import { fetchUserHistory } from '../utils/history';

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchUserHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch activity history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Helper to format timestamps nicely in Indian local time
  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return isoString;
    }
  };

  // Map actions to descriptive labels, colors, and SVG icons
  const getActionConfig = (action) => {
    const config = {
      label: action,
      colorClass: 'bg-slate-800 text-slate-400 border-slate-700',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      )
    };

    if (action.includes('roadmap')) {
      config.label = 'Roadmap Generation';
      config.colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      config.icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    } else if (action.includes('chat') || action.includes('counselor')) {
      config.label = 'Counselor Query';
      config.colorClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      config.icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    } else if (action === 'login' || action === 'signup' || action === 'login_google') {
      config.label = 'User Authentication';
      config.colorClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      config.icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    } else if (action.includes('failed')) {
      config.label = 'Failed Interaction';
      config.colorClass = 'bg-rose-500/10 text-rose-450 border-rose-500/20';
      config.icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    return config;
  };

  // Filter & Search Logic
  const filteredHistory = history.filter(item => {
    // 1. Text Search Match
    const matchesSearch = 
      item.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Action Category Filter Match
    let matchesFilter = true;
    if (actionFilter === 'roadmap') {
      matchesFilter = item.action.includes('roadmap');
    } else if (actionFilter === 'chat') {
      matchesFilter = item.action.includes('chat') || item.action.includes('counselor');
    } else if (actionFilter === 'auth') {
      matchesFilter = item.action === 'login' || item.action === 'signup' || item.action === 'login_google';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto my-6 animate-fade-in">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-850 pb-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Activity History</h2>
            <p className="text-xs text-slate-400 mt-1">A secure log of your interactions and roadmap queries.</p>
          </div>
          
          <button 
            onClick={loadHistory}
            className="self-start sm:self-center px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center space-x-1.5 focus:outline-none"
            disabled={loading}
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search bar */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-550" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search actions or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>

          {/* Action type filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'roadmap', label: 'Roadmaps' },
              { id: 'chat', label: 'Chatbot' },
              { id: 'auth', label: 'Access' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActionFilter(filter.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${
                  actionFilter === filter.id
                    ? 'bg-indigo-650 text-white border-transparent shadow-md'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-350'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* List Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-xs text-slate-450 font-medium">Loading history logs...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/10 px-4">
            <div className="p-4 bg-slate-850/50 rounded-full text-slate-500 mb-4 border border-slate-800/80">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">No Activities Found</h4>
            <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
              {searchTerm || actionFilter !== 'all'
                ? "No matching logs were found with the applied search criteria or filters."
                : "You haven't generated any roadmaps or asked queries yet. Start by generating a career roadmap!"}
            </p>
          </div>
        ) : (
          /* Timeline view */
          <div className="relative border-l-2 border-slate-850 ml-4 pl-6 md:pl-8 space-y-6">
            {filteredHistory.map((item) => {
              const { label, colorClass, icon } = getActionConfig(item.action);
              const isFailed = item.status === 'failed';
              
              return (
                <div key={item.id} className="relative group animate-slide-in">
                  
                  {/* Timeline bullet */}
                  <span className={`absolute -left-[35px] md:-left-[43px] top-1.5 p-2 rounded-full border shadow-inner flex items-center justify-center z-10 transition-colors ${
                    isFailed 
                      ? 'bg-rose-950 text-rose-400 border-rose-900/60' 
                      : 'bg-slate-900 group-hover:bg-slate-850 text-slate-400 border-slate-800'
                  }`}>
                    {icon}
                  </span>

                  {/* Card content */}
                  <div className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200">
                    
                    {/* Top Row: Type and Timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colorClass}`}>
                          {label}
                        </span>
                        {item.location && (
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center space-x-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>
                      
                      <span className="text-[10px] font-semibold text-slate-500">
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    {/* Details content */}
                    <p className="text-sm text-slate-350 leading-relaxed break-words font-medium">
                      {item.details}
                    </p>

                    {/* Footer: status pill */}
                    <div className="mt-3 flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isFailed ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                      }`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.status || 'Success'}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
