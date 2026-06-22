import React, { useState } from 'react';

const INTEREST_OPTIONS = [
  'Technology & Coding',
  'Medicine & Healthcare',
  'Law & Judiciary',
  'Arts & Creative Design',
  'Business & Commerce',
  'Pure Science & Research',
  'Sports & Physical Education',
  'Teaching & Social Work',
  'Media & Journalism',
  'Finance & Economics',
  'Other'
];

export default function StudentForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    studentClass: '',
    interests: [],
    subjects: '',
    marks: '',
    language: '',
    location: ''
  });

  const [customInterest, setCustomInterest] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedElective, setSelectedElective] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [customElective, setCustomElective] = useState('');
  const [isOpenInterests, setIsOpenInterests] = useState(false);

  React.useEffect(() => {
    if (formData.studentClass === '10') {
      setFormData(prev => ({ ...prev, subjects: 'General School Subjects (Maths, Science, Social Studies)' }));
    } else if (formData.studentClass === '12') {
      let core = selectedStream;
      if (selectedStream === 'Other') {
        core = customStream || '';
      }
      
      let electiveStr = '';
      if (selectedElective) {
        if (selectedElective === 'Other') {
          electiveStr = customElective ? ` with ${customElective}` : '';
        } else if (selectedElective !== 'None') {
          electiveStr = ` with ${selectedElective}`;
        }
      }
      
      setFormData(prev => ({ ...prev, subjects: core ? `${core}${electiveStr}` : '' }));
    } else {
      setFormData(prev => ({ ...prev, subjects: '' }));
    }
  }, [formData.studentClass, selectedStream, selectedElective, customStream, customElective]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.studentClass) newErrors.studentClass = 'Please select your class';
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    } else if (formData.interests.includes('Other') && !customInterest.trim()) {
      newErrors.interests = 'Please specify your other interests in the text field';
    }
    
    if (!formData.subjects.trim()) {
      newErrors.subjects = formData.studentClass === '12' 
        ? 'Please select your stream and elective' 
        : 'Subjects description is required';
    }
    
    if (formData.marks === '') {
      newErrors.marks = 'Marks are required';
    } else {
      const m = Number(formData.marks);
      if (isNaN(m) || m < 0 || m > 100) {
        newErrors.marks = 'Marks must be a number between 0 and 100';
      }
    }
    
    if (!formData.language) newErrors.language = 'Please select your language preference';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Replace 'Other' with the user's custom typed value
      const processedInterests = formData.interests.map((interest) => 
        interest === 'Other' ? customInterest.trim() : interest
      );
      
      onSubmit({
        ...formData,
        interests: processedInterests
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Pathfinder<span className="text-indigo-500">AI</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Empowering Indian students in Class 10 & 12 with personalized career roadmap recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Aarav Sharma"
              className={`w-full bg-slate-950/60 border ${
                errors.name ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
              } rounded-lg py-3 px-4 text-white placeholder-slate-650 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Student Class */}
            <div>
              <label htmlFor="studentClass" className="block text-sm font-semibold text-slate-300 mb-2">
                Class / Standard
              </label>
              <select
                id="studentClass"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleInputChange}
                className={`w-full bg-slate-950/60 border ${
                  errors.studentClass ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                } rounded-lg py-3 px-4 text-slate-300 focus:outline-none focus:ring-4 transition-all`}
              >
                <option value="">Select Class</option>
                <option value="10">Class 10</option>
                <option value="12">Class 12</option>
              </select>
              {errors.studentClass && <p className="mt-1.5 text-xs text-red-400">{errors.studentClass}</p>}
            </div>

            {/* Marks */}
            <div>
              <label htmlFor="marks" className="block text-sm font-semibold text-slate-300 mb-2">
                Overall Marks Percentage (%)
              </label>
              <input
                type="number"
                id="marks"
                name="marks"
                min="0"
                max="100"
                value={formData.marks}
                onChange={handleInputChange}
                placeholder="e.g. 85"
                className={`w-full bg-slate-950/60 border ${
                  errors.marks ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                } rounded-lg py-3 px-4 text-white placeholder-slate-650 focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.marks && <p className="mt-1.5 text-xs text-red-400">{errors.marks}</p>}
            </div>
          </div>

          {/* Subjects Selection */}
          {formData.studentClass === '10' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Subjects / Stream Details
              </label>
              <input
                type="text"
                value="General School Subjects (Maths, Science, Social Studies, Languages)"
                disabled
                className="w-full bg-slate-950/40 border border-slate-850 rounded-lg py-3 px-4 text-slate-400 cursor-not-allowed text-sm"
              />
            </div>
          ) : formData.studentClass === '12' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Core Stream Selection */}
                <div>
                  <label htmlFor="coreStream" className="block text-sm font-semibold text-slate-300 mb-2">
                    Core Stream
                  </label>
                  <select
                    id="coreStream"
                    value={selectedStream}
                    onChange={(e) => {
                      setSelectedStream(e.target.value);
                      if (e.target.value !== 'Other') setCustomStream('');
                    }}
                    className={`w-full bg-slate-950/60 border ${
                      errors.subjects ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                    } rounded-lg py-3 px-4 text-slate-300 text-sm focus:outline-none focus:ring-4 transition-all`}
                  >
                    <option value="">Select Core Stream</option>
                    <option value="Science (PCM)">Science (PCM - Physics, Chemistry, Math)</option>
                    <option value="Science (PCB)">Science (PCB - Physics, Chemistry, Biology)</option>
                    <option value="Science (PCMB)">Science (PCMB - Physics, Chemistry, Math, Biology)</option>
                    <option value="Commerce (with Mathematics)">Commerce (with Mathematics)</option>
                    <option value="Commerce (without Mathematics)">Commerce (without Mathematics)</option>
                    <option value="Humanities / Arts">Humanities / Arts</option>
                    <option value="Other">Other / Custom Stream</option>
                  </select>
                </div>

                {/* Elective / 5th Subject */}
                <div>
                  <label htmlFor="electiveSubject" className="block text-sm font-semibold text-slate-300 mb-2">
                    Elective / 5th Subject
                  </label>
                  <select
                    id="electiveSubject"
                    value={selectedElective}
                    onChange={(e) => {
                      setSelectedElective(e.target.value);
                      if (e.target.value !== 'Other') setCustomElective('');
                    }}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg py-3 px-4 text-slate-300 text-sm focus:outline-none focus:ring-4 transition-all"
                  >
                    <option value="">Select Elective</option>
                    <option value="Computer Science / IP">Computer Science / Information Practices (IP)</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Economics">Economics</option>
                    <option value="Fine Arts / Design">Fine Arts / Design</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="None">None / English Only</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>
              </div>

              {/* Custom Stream Input */}
              {selectedStream === 'Other' && (
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg animate-fade-in">
                  <label htmlFor="customStream" className="block text-xs font-semibold text-slate-350 mb-2">
                    Specify Custom Stream
                  </label>
                  <input
                    type="text"
                    id="customStream"
                    value={customStream}
                    onChange={(e) => setCustomStream(e.target.value)}
                    placeholder="e.g. Vocational Courses, Agricultural Science"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-white placeholder-slate-650 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              {/* Custom Elective Input */}
              {selectedElective === 'Other' && (
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg animate-fade-in">
                  <label htmlFor="customElective" className="block text-xs font-semibold text-slate-350 mb-2">
                    Specify Custom Elective
                  </label>
                  <input
                    type="text"
                    id="customElective"
                    value={customElective}
                    onChange={(e) => setCustomElective(e.target.value)}
                    placeholder="e.g. Music, Painting, Home Science"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-white placeholder-slate-650 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              )}
              {errors.subjects && <p className="text-xs text-red-400">{errors.subjects}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Subjects / Stream Details
              </label>
              <input
                type="text"
                placeholder="Please select Class/Standard first"
                disabled
                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg py-3 px-4 text-slate-500 cursor-not-allowed text-sm"
              />
            </div>
          )}

          {/* Areas of Interest Dropdown */}
          <div className="relative">
            <span className="block text-sm font-semibold text-slate-300 mb-2">
              Areas of Interest (Select all that apply)
            </span>
            <button
              type="button"
              onClick={() => setIsOpenInterests(!isOpenInterests)}
              className={`w-full flex items-center justify-between bg-slate-950/60 border ${
                errors.interests ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
              } rounded-lg py-3 px-4 text-left text-slate-300 hover:border-slate-700 transition-all cursor-pointer`}
            >
              <span className="truncate text-sm">
                {formData.interests.length > 0 
                  ? formData.interests.join(', ') 
                  : 'Select your interests'}
              </span>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpenInterests ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpenInterests && (
              <>
                <div 
                  className="fixed inset-0 z-10 cursor-default" 
                  onClick={() => setIsOpenInterests(false)} 
                />
                
                <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto p-2 space-y-1 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1">
                    {INTEREST_OPTIONS.map((interest) => {
                      const isChecked = formData.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestChange(interest)}
                          className={`flex items-center space-x-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            isChecked
                              ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                              : 'border-transparent bg-slate-950/40 text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 pointer-events-none"
                          />
                          <span className="text-xs font-semibold">{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Custom Input for 'Other' */}
            {formData.interests.includes('Other') && (
              <div className="mt-4 p-4 bg-slate-950/40 border border-slate-800 rounded-lg animate-fade-in">
                <label htmlFor="customInterest" className="block text-xs font-semibold text-slate-350 mb-2">
                  Please specify your other interests:
                </label>
                <input
                  type="text"
                  id="customInterest"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="e.g. Hospitality, Aviation, Psychology, Performing Arts"
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2.5 px-3 text-white placeholder-slate-650 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}
            
            {errors.interests && <p className="mt-1.5 text-xs text-red-400">{errors.interests}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preferred Language */}
            <div>
              <span className="block text-sm font-semibold text-slate-300 mb-2">
                Preferred Language
              </span>
              <div className="flex space-x-6 py-2">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="English"
                    checked={formData.language === 'English'}
                    onChange={handleInputChange}
                    className="border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                  <span className="text-sm font-medium">English</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="Hindi"
                    checked={formData.language === 'Hindi'}
                    onChange={handleInputChange}
                    className="border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                  <span className="text-sm font-medium">Hindi (हिंदी)</span>
                </label>
              </div>
              {errors.language && <p className="mt-1.5 text-xs text-red-400">{errors.language}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-300 mb-2">
                City / State in India
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Mumbai, Bihar, Uttar Pradesh"
                className={`w-full bg-slate-950/60 border ${
                  errors.location ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                } rounded-lg py-3 px-4 text-white placeholder-slate-650 focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.location && <p className="mt-1.5 text-xs text-red-400">{errors.location}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold transition-all ${
              isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 focus:ring-4 focus:ring-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating Roadmap...</span>
              </div>
            ) : (
              'Generate Career Roadmap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
