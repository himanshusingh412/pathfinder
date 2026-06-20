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
    
    if (!formData.subjects.trim()) newErrors.subjects = 'Subjects description is required';
    
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

          {/* Subjects studied */}
          <div>
            <label htmlFor="subjects" className="block text-sm font-semibold text-slate-300 mb-2">
              Subjects / Stream Details
            </label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              placeholder="e.g. Science with PCM, Commerce with IP, or General Subjects"
              className={`w-full bg-slate-950/60 border ${
                errors.subjects ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
              } rounded-lg py-3 px-4 text-white placeholder-slate-650 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.subjects && <p className="mt-1.5 text-xs text-red-400">{errors.subjects}</p>}
          </div>

          {/* Interests Checkboxes */}
          <div>
            <span className="block text-sm font-semibold text-slate-300 mb-2">
              Areas of Interest (Select all that apply)
            </span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INTEREST_OPTIONS.map((interest) => {
                const isChecked = formData.interests.includes(interest);
                return (
                  <label
                    key={interest}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-850 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleInterestChange(interest)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                    />
                    <span className="text-xs font-medium">{interest}</span>
                  </label>
                );
              })}
            </div>
            
            {/* Custom Input for 'Other' */}
            {formData.interests.includes('Other') && (
              <div className="mt-4 p-4 bg-slate-950/40 border border-slate-800 rounded-lg animate-fade-in">
                <label htmlFor="customInterest" className="block text-xs font-semibold text-slate-300 mb-2">
                  Please specify your other interests:
                </label>
                <input
                  type="text"
                  id="customInterest"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="e.g. Hospitality, Aviation, Psychology, Performing Arts"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 transition-all"
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
