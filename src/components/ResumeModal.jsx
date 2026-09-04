import React, { useEffect } from 'react';

const ResumeModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md transition-all duration-300 select-text"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#121212] border border-red-600/40 rounded-2xl shadow-[0_25px_70px_rgba(229,9,20,0.25)] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Netflix Style Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-red-500 uppercase">
              NETFLIX CAST PROFILE // CURRICULUM VITAE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/Prince_Kumar_CV.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5 text-white"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
              Open Full
            </a>

            <a
              href="/Prince_Kumar_CV.html"
              download="Prince_Kumar_CV.html"
              className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,9,20,0.6)]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download CV
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors text-white text-lg font-bold cursor-pointer"
              aria-label="Close CV Modal"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Scrollable CV Document Body - Exactly Matches the New Official CV */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-8 font-sans text-white/90">
          
          {/* Header Section */}
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Prince Kumar
              </h2>
              <div className="text-xs font-mono space-y-1 mt-2 text-white/80">
                <div>
                  <strong className="text-white">LinkedIn:</strong>{' '}
                  <a href="https://www.linkedin.com/in/cse-prince-kumar/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                    https://www.linkedin.com/in/cse-prince-kumar/
                  </a>
                </div>
                <div>
                  <strong className="text-white">GitHub:</strong>{' '}
                  <a href="https://github.com/Er-prince-kumar" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                    https://github.com/Er-prince-kumar
                  </a>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono space-y-1 text-white/80 md:text-right">
              <div>
                <strong className="text-white">E-mail:</strong>{' '}
                <a href="mailto:princebxr2000@gmail.com" className="text-red-400 hover:underline">
                  princebxr2000@gmail.com
                </a>
              </div>
              <div>
                <strong className="text-white">Mobile:</strong>{' '}
                <a href="tel:+917717723919" className="text-white hover:underline">
                  +91-7717723919
                </a>
              </div>
            </div>
          </div>

          {/* Section 1: SKILLS */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              SKILLS
            </h3>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-white/85">
              <li><strong className="text-white">Languages:</strong> C++, Python, C, Java</li>
              <li><strong className="text-white">Frameworks Libraries:</strong> HTML and CSS</li>
              <li><strong className="text-white">Tools &amp; Platforms:</strong> My SQL, Git hub, geeks for geeks</li>
              <li><strong className="text-white">Core CS Fundamentals:</strong> DBMS, SQL, OOPs</li>
              <li><strong className="text-white">Soft Skills:</strong> Problem-Solving, Team Player, Project Management, Adaptability, Quick learner</li>
            </ul>
          </div>

          {/* Section 2: TRAINING */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              TRAINING
            </h3>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-base text-white">
                  WNS Cares Foundation
                </div>
                <div className="text-xs font-mono text-red-400 font-bold">
                  Jul' 26
                </div>
              </div>
              <ul className="list-disc list-inside text-xs md:text-sm text-white/80 font-light leading-relaxed">
                <li>Empowered 50-60 students with practical knowledge of cyberbullying prevention, personal data security, and safe digital behavior through interactive leaning sessions.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: PROJECTS */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              PROJECTS
            </h3>
            
            <div className="space-y-4">
              {/* Project 1 */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-base">
                    Automatic Attendance Monitoring
                  </div>
                  <div className="text-xs font-mono text-red-400 font-bold">Apr' 26</div>
                </div>
                <ul className="list-disc list-inside text-xs md:text-sm text-white/80 space-y-1.5 font-light leading-relaxed">
                  <li><strong className="text-white">Technologies:</strong> Arduino, RFID, Face Recognition.</li>
                  <li>Developed a hybrid RFID and face-recognition based automatic attendance system to automate classroom attendance.</li>
                  <li>The system identifies students, monitors their presence during lectures, and records attendance based on predefined time and presence conditions, reducing manual attendance effort and improving reliability</li>
                </ul>
              </div>

              {/* Project 2 */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    <span>AI-Health-Management</span>
                    <span className="text-white/40">|</span>
                    <a
                      href="https://github.com/Er-prince-kumar/AI-Health-Management"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:underline text-xs font-mono"
                    >
                      GitHub &rarr;
                    </a>
                  </div>
                  <div className="text-xs font-mono text-red-400 font-bold">Aug' 26</div>
                </div>
                <ul className="list-disc list-inside text-xs md:text-sm text-white/80 space-y-1.5 font-light leading-relaxed">
                  <li>Built an AI-powered healthcare platform featuring NLP-based symptom triage, severity classification, and specialty recommendations.</li>
                  <li>Developed modules for doctor discovery, appointment scheduling, EMR management, and medication adherence tracking.</li>
                  <li>Created responsive dashboards and data visualizations using HTML, CSS, JavaScript, and Chart.js..</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: CERTIFICATES */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              CERTIFICATES
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm">
              <li className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-white">Oracle Cloud Infrastructure 2025 AI Foundations Associate certification. | <strong className="text-red-400">Oracle</strong></span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-white/60">Aug'25</span>
                  <a href="/certificate_oracle_ai.jpg" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40 text-[11px] font-mono hover:bg-red-600 hover:text-white transition-colors">
                    View
                  </a>
                </div>
              </li>

              <li className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-white">Healthy Habits for Healthy Life | <strong className="text-red-400">EDUTECH HUB</strong></span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-white/60">Oct' 25</span>
                  <a href="/certificate_edutech_habits.png" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40 text-[11px] font-mono hover:bg-red-600 hover:text-white transition-colors">
                    View
                  </a>
                </div>
              </li>

              <li className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-white">Introduction to Artificial Intelligence | <strong className="text-red-400">Infosys</strong></span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-white/60">Feb'26</span>
                  <a href="/certificate_infosys_ai.png" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40 text-[11px] font-mono hover:bg-red-600 hover:text-white transition-colors">
                    View
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Section 5: ACHIEVEMENTS */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              ACHIEVEMENTS
            </h3>
            <div className="p-3.5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-xs md:text-sm">
              <span className="text-white/90">
                Solved 10+ coding problems on <strong className="text-white">LeetCode</strong>, sharpening problem-solving skills.
              </span>
              <span className="text-xs font-mono text-red-400 font-bold shrink-0">
                Feb' 26
              </span>
            </div>
          </div>

          {/* Section 6: EDUCATION */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-red-500 font-bold border-b border-white/15 pb-1.5">
              EDUCATION
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-base text-white">Lovely Professional University</div>
                  <div className="text-xs text-white/80 italic">
                    Bachelor of Technology - Computer Science and Engineering; <span className="text-red-400 font-mono not-italic font-bold">CGPA: 7.33</span>
                  </div>
                </div>
                <div className="text-left md:text-right text-xs font-mono">
                  <div className="text-white">Punjab, India</div>
                  <div className="text-white/60">Aug' 25 - Present</div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-base text-white">+2 High School</div>
                  <div className="text-xs text-white/80 italic">
                    Intermediate; <span className="text-white/90 font-mono not-italic font-bold">Percentage: 60.4</span>
                  </div>
                </div>
                <div className="text-left md:text-right text-xs font-mono">
                  <div className="text-white">TiwariPur, Buxar</div>
                  <div className="text-white/60">Apr' 23 &ndash; Mar' 25</div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-base text-white">SKR High School</div>
                  <div className="text-xs text-white/80 italic">
                    Matriculation; <span className="text-white/90 font-mono not-italic font-bold">Percentage: 70.6</span>
                  </div>
                </div>
                <div className="text-left md:text-right text-xs font-mono">
                  <div className="text-white">TiwariPur, Buxar</div>
                  <div className="text-white/60">Apr' 22 - Mar' 23</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-[#181818] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
          <span>PRINCE KUMAR &bull; LOVELY PROFESSIONAL UNIVERSITY</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
