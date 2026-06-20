import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import ResultsDashboard from './components/ResultsDashboard';
import ChatBot from './components/ChatBot';
import { generateCareerRoadmap } from './utils/ai';

export default function App() {
  const [view, setView] = useState('form'); // 'form' | 'loading' | 'results'
  const [studentData, setStudentData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = async (formData) => {
    setStudentData(formData);
    setView('loading');
    setError(null);

    try {
      const result = await generateCareerRoadmap(formData);
      setRoadmapData(result);
      setView('results');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating the roadmap.');
      setView('form');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-4 py-4 print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div 
            onClick={() => {
              setView('form');
              setStudentData(null);
              setRoadmapData(null);
              setError(null);
              setShowChat(false);
            }} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="p-2 bg-indigo-650 rounded-lg text-white font-bold text-lg leading-none">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                Pathfinder<span className="text-indigo-550">AI</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Career Guide</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 max-w-2xl mx-auto bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-xl flex justify-between items-center print:hidden">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 p-1.5 hover:bg-rose-500/20 rounded-lg transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* View Routing */}
        {view === 'form' && (
          <StudentForm onSubmit={handleSubmit} isLoading={false} />
        )}

        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center print:hidden">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generating your personalized roadmap...</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              We are consulting AI to build your customized educational roadmap, colleges lists, exams, and key skills.
            </p>
          </div>
        )}

        {view === 'results' && roadmapData && studentData && (
          <ResultsDashboard 
            roadmapData={roadmapData} 
            studentName={studentData.name} 
            onStartChat={() => setShowChat(true)} 
          />
        )}
      </main>

      {/* Chat Bot Overlay */}
      {showChat && studentData && roadmapData && (
        <ChatBot 
          studentData={studentData} 
          roadmapData={roadmapData} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
}
