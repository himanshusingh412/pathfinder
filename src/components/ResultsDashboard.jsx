import React, { useState } from 'react';
import { Compass, Map, Award, BookOpen, Download, GraduationCap, CheckCircle2, Globe, Video, X, ExternalLink, FileText } from 'lucide-react';

export default function ResultsDashboard({ roadmapData, studentName, onStartChat }) {
  const [activePdf, setActivePdf] = useState(null);

  if (!roadmapData) return null;

  const {
    interestDiscovery = [],
    careerPaths = [],
    roadmap = [],
    exams = [],
    colleges = [],
    skills = []
  } = roadmapData;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-fade-in print:bg-white print:text-black">
      
      {/* Action Header - Glass Header Card */}
      <div className="glass rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden print:border print:border-gray-300 print:bg-white print:shadow-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              🎓 Welcome, {studentName}!
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Let's discover your potential interests and explore paths before making big commitments. Below is your personalized AI-generated Discovery Roadmap.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto print:hidden shrink-0">
            <button
              onClick={onStartChat}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Talk to AI Counselor
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-200 text-sm font-bold rounded-xl border border-gray-700 transition-all active:scale-[0.98] print:hidden"
            >
              <Download size={16} />
              Download PDF / Print
            </button>
          </div>
        </div>
      </div>

      {/* 1. Interest Discovery Section */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
          <Compass className="text-indigo-400" size={22} />
          Step 1: Interest Discovery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interestDiscovery.map((item, idx) => (
            <div key={idx} className="glass rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden transition-all hover:border-indigo-500/40 print:border print:border-gray-300 print:bg-white print:shadow-none">
              <h3 className="text-lg font-bold text-white print:text-black mb-2">{item.interest}</h3>
              <p className="text-gray-300 print:text-gray-800 text-sm mb-4 leading-relaxed">{item.whyItFits}</p>
              
              {/* Sub Fields */}
              <div className="mb-4">
                <span className="text-[10px] text-gray-400 print:text-gray-600 uppercase font-semibold tracking-wider block mb-2">Deconstruct Subfields:</span>
                <div className="flex flex-wrap gap-2">
                  {item.subFields && item.subFields.map((field, fieldIdx) => (
                    <span key={fieldIdx} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Try This Week actions */}
              <div className="mt-4 pt-4 border-t border-gray-800/80 print:border-gray-250 bg-slate-950/40 print:bg-gray-100 p-4 rounded-xl">
                <span className="text-[10px] text-indigo-400 print:text-indigo-700 uppercase font-black tracking-wider block mb-2">🧪 Try This Week (Small Experiments):</span>
                <ul className="space-y-2">
                  {item.tryThisWeek && item.tryThisWeek.map((action, actionIdx) => (
                    <li key={actionIdx} className="flex items-start gap-2 text-xs text-gray-300 print:text-gray-850">
                      <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Suggested Career Paths */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
          <Compass className="text-purple-400" size={22} />
          Step 2: Recommended Career Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((career, idx) => {
            const demandColors = {
              High: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 print:bg-emerald-100 print:text-emerald-700',
              Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30 print:bg-amber-100 print:text-amber-700',
              Low: 'bg-rose-500/20 text-rose-300 border-rose-500/30 print:bg-rose-100 print:text-rose-700'
            };
            return (
              <div key={idx} className="glass rounded-2xl p-6 transition-all hover:border-indigo-500/40 relative overflow-hidden print:border print:border-gray-300 print:bg-white print:shadow-none flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-base font-bold text-white print:text-black">{career.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                      career.demandLevel === 'High' ? demandColors.High : 
                      career.demandLevel === 'Medium' ? demandColors.Medium : demandColors.Low
                    }`}>
                      {career.demandLevel}
                    </span>
                  </div>
                  <p className="text-gray-300 print:text-gray-800 text-sm leading-relaxed mb-4">{career.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800/80 print:border-gray-250 flex justify-between items-center text-xs">
                  <span className="text-gray-400 print:text-gray-600 font-semibold">Est. Salary Range:</span>
                  <span className="text-white print:text-black font-bold">{career.salaryRange}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Step-by-Step Exploration Roadmap */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
          <Map className="text-pink-400" size={22} />
          Step 3: Exploration Roadmap Timeline
        </h2>
        <div className="glass rounded-3xl p-6 md:p-8 space-y-8 relative print:border print:border-gray-300 print:bg-white">
          {/* Timeline Line (Hidden in print) */}
          <div className="absolute left-6 md:left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 opacity-30 print:hidden" />
          
          {roadmap.map((stepItem, idx) => (
            <div key={idx} className="relative pl-10 md:pl-12 group">
              {/* Timeline Bubble */}
              <div className="absolute left-1 md:left-3 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-300 z-10 print:bg-white print:text-black">
                {stepItem.step || idx + 1}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-bold text-white print:text-black group-hover:text-indigo-400 transition-colors">
                    {stepItem.title}
                  </h3>
                  <span className="inline-block mt-1 text-xs text-indigo-300 print:text-indigo-600 font-semibold">
                    ⏳ {stepItem.duration}
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-sm text-gray-300 print:text-gray-800 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Entrance Exams & Top Colleges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Entrance Exams */}
        {exams && exams.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
              <BookOpen className="text-indigo-400" size={22} />
              Key Target Entrance Exams
            </h2>
            <div className="space-y-4">
              {exams.map((exam, idx) => (
                <div key={idx} className="glass rounded-2xl p-5 space-y-3 print:border print:border-gray-300 print:bg-white flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white print:text-black mb-1">{exam.name}</h3>
                    <p className="text-xs text-gray-300 print:text-gray-800 leading-relaxed mb-3">{exam.description}</p>
                    <div className="bg-slate-900/60 print:bg-gray-100 p-3 rounded-xl border border-gray-850 print:border-gray-200 text-xs mb-3">
                      <span className="font-semibold text-indigo-300 print:text-indigo-650 block mb-1">Eligibility Criteria:</span>
                      {exam.eligibility}
                    </div>
                  </div>
                  
                  {/* Action Links */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/60 print:hidden">
                    {exam.officialLink && (
                      <a 
                        href={exam.officialLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 rounded-lg transition-all"
                      >
                        <Globe size={12} />
                        Official Site
                      </a>
                    )}
                    {exam.youtubeSearch && (
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exam.youtubeSearch)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-[11px] font-bold text-red-300 rounded-lg transition-all"
                      >
                        <Video size={12} />
                        Search Prep
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Colleges */}
        {colleges && colleges.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
              <GraduationCap className="text-pink-400" size={22} />
              Target Colleges & Universities
            </h2>
            <div className="space-y-4">
              {colleges.map((college, idx) => (
                <div key={idx} className="glass rounded-2xl p-5 space-y-3 print:border print:border-gray-300 print:bg-white">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-white print:text-black">{college.name}</h3>
                      <p className="text-[10px] text-gray-400 print:text-gray-600">📍 {college.location}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      college.type === 'Government' 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 print:bg-blue-100 print:text-blue-700' 
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30 print:bg-purple-100 print:text-purple-700'
                    }`}>
                      {college.type}
                    </span>
                  </div>
                  {college.ranking && (
                    <p className="text-xs text-gray-300 print:text-gray-800">
                      <strong className="text-indigo-300 print:text-indigo-650">Ranking:</strong> {college.ranking}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. Skills to Build */}
      {skills && skills.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
            <Award className="text-indigo-400" size={22} />
            Key Skill Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, idx) => (
              <div key={idx} className="glass rounded-2xl p-5 flex flex-col justify-between print:border print:border-gray-300 print:bg-white">
                <div className="flex justify-between items-center gap-2 mb-3">
                  <h3 className="font-bold text-white print:text-black text-sm">{skill.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    skill.importance === 'Must Have'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 print:bg-indigo-100 print:text-indigo-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700 print:bg-gray-100 print:text-gray-600'
                  }`}>
                    {skill.importance}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-800/80 print:border-gray-250 flex justify-between items-center text-xs">
                  <span className="text-gray-400 print:text-gray-600">Resources:</span>
                  {skill.resources && (skill.resources.startsWith('http') || skill.resources.toLowerCase().includes('.pdf')) ? (
                    <button
                      onClick={() => {
                        const url = skill.resources.startsWith('http') 
                          ? skill.resources 
                          : `https://roadmap.sh/pdfs/roadmaps/python.pdf`;
                        setActivePdf({ name: skill.name, url });
                      }}
                      className="text-indigo-400 hover:text-indigo-350 hover:underline font-semibold bg-transparent border-none cursor-pointer p-0 text-left active:scale-[0.98] outline-none"
                    >
                      View Study Path &rarr;
                    </button>
                  ) : (
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(skill.name + " resources")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-350 hover:underline font-semibold"
                    >
                      View Study Path &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in print:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            onClick={() => setActivePdf(null)}
          />

          {/* Modal Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative z-10 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2 truncate">
                  <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                    <FileText size={18} />
                  </span>
                  <span className="truncate">{activePdf.name} Study Plan</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate pr-4">
                  {activePdf.url}
                </p>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <a 
                  href={activePdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md hover:shadow-indigo-500/10 active:scale-95"
                  title="Open in new window (Chrome)"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Open in Chrome</span>
                </a>
                <button
                  onClick={() => setActivePdf(null)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF Body Container */}
            <div className="flex-1 bg-slate-950 relative">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(activePdf.url)}&embedded=true`}
                className="w-full h-full border-none relative z-10"
                title={activePdf.name}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
