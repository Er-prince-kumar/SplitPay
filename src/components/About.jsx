import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import avatarImg from '../assets/Portfolio/prince_avatar.png';

gsap.registerPlugin(ScrollTrigger);

const About = ({ onOpenResume }) => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // --- Cinematic Stagger Entrance on Scroll ---
    gsap.fromTo(
      cardRefs.current,
      { y: 80, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // --- Interactive Magnetic Mouse Spotlight per Bento Card ---
    const cards = cardRefs.current;
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const cleanups = [];
    cards.forEach((card) => {
      if (!card) return;
      const listener = (e) => handleMouseMove(e, card);
      card.addEventListener('mousemove', listener);
      cleanups.push(() => card.removeEventListener('mousemove', listener));
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] text-white py-32 px-6 md:px-12 flex flex-col justify-center select-none overflow-hidden"
    >
      {/* Background Cinematic Red Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-black/80 backdrop-blur-2xl border border-red-600/40 text-xs font-mono uppercase tracking-widest text-white shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-red-500 font-bold">EPISODE 01</span>
            <span className="text-white/40">|</span>
            <span>ABOUT THE ENGINEER</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            EPISODE SYNOPSIS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-700 drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">
              ORIGIN &amp; VISION.
            </span>
          </h2>
        </div>

        {/* Bento Grid Layout with Interactive Mouse Light Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Bio & Academic Core (Span 7) */}
          <div
            ref={addToRefs}
            className="md:col-span-7 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-red-600/60 transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-white/5 font-mono text-7xl font-black pointer-events-none">
              01
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-3.5">
                <img 
                  src={avatarImg} 
                  alt="Prince Kumar" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-600/80 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                />
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Cast &amp; Background</h3>
                  <span className="text-[11px] font-mono text-white/50 block">Lead Engineer // LPU</span>
                </div>
              </div>
              <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                I am <span className="text-white font-bold drop-shadow">Prince Kumar</span>, a Computer Science &amp; Engineering scholar at <strong className="text-white">Lovely Professional University (LPU)</strong>, Punjab.
              </p>
              <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
                Specializing in Artificial Intelligence, Machine Learning, and Full-Stack Systems. I build real-world engineering solutions spanning NLP healthcare triage platforms, automated IoT RFID classroom attendance systems, and high-performance algorithms.
              </p>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-2 relative z-10">
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-red-600/30 text-xs font-mono text-red-400 font-bold">LPU CGPA: 7.33</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">C++ &amp; Python</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">AI &amp; NLP</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">MySQL &amp; DBMS</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">IoT &amp; Hardware</span>
            </div>
          </div>

          {/* Card 2: Certifications & Accolades (Span 5) */}
          <div
            ref={addToRefs}
            className="md:col-span-5 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-red-600/60 transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-white/5 font-mono text-7xl font-black pointer-events-none">
              02
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Milestones &amp; Accolades</h3>
              <ul className="space-y-3 text-xs md:text-sm text-white/80 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span><strong className="text-white">Oracle Cloud Infrastructure 2025 AI Foundations Associate</strong> &bull; Oracle (Aug '25)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span><strong className="text-white">Introduction to Artificial Intelligence</strong> &bull; Infosys (Feb '26)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span><strong className="text-white">Solved 10+ Problems on LeetCode</strong> &bull; Algorithmic mastery in C++ &amp; Python (Feb '26)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span><strong className="text-white">WNS Cares Foundation</strong> &bull; Educated 50-60 students on cyber safety &amp; data privacy (Jul '26)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span><strong className="text-white">Healthy Habits for Healthy Life</strong> &bull; EDUTECH HUB (Oct '25)</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4 font-mono text-xs text-white/40 relative z-10 flex items-center justify-between">
              <span>// VERIFIED CREDENTIALS</span>
              <span className="text-red-500 font-bold">4 CERTIFICATES</span>
            </div>
          </div>

          {/* Card 3: Academic Timeline Seasons (Span 12) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between hover:border-red-600/60 transition-all duration-500 overflow-hidden relative group"
          >
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Academic Seasons &bull; Education Track</h3>
                <p className="text-base md:text-lg font-bold text-white mt-1">Foundation in Engineering &amp; Computer Sciences</p>
              </div>
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                2022 &rarr; 2026 PRESENT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {/* College */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-600/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>SEASON 03</span>
                  <span className="text-red-400 font-bold">AUG '25 - PRESENT</span>
                </div>
                <h4 className="text-base font-black text-white">Lovely Professional University</h4>
                <p className="text-xs text-white/70">Bachelor of Technology &bull; Computer Science and Engineering</p>
                <div className="pt-2">
                  <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-600/40 text-xs font-mono font-bold">
                    CGPA: 7.33
                  </span>
                  <span className="text-xs font-mono text-white/50 ml-2">Punjab, India</span>
                </div>
              </div>

              {/* Intermediate */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-600/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>SEASON 02</span>
                  <span>APR '23 - MAR '25</span>
                </div>
                <h4 className="text-base font-black text-white">+2 High School</h4>
                <p className="text-xs text-white/70">Intermediate Education &bull; Senior Secondary</p>
                <div className="pt-2">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white/90 border border-white/20 text-xs font-mono font-bold">
                    Score: 60.4%
                  </span>
                  <span className="text-xs font-mono text-white/50 ml-2">TiwariPur, Buxar</span>
                </div>
              </div>

              {/* Matriculation */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-600/40 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>SEASON 01</span>
                  <span>APR '22 - MAR '23</span>
                </div>
                <h4 className="text-base font-black text-white">SKR High School</h4>
                <p className="text-xs text-white/70">Matriculation &bull; Secondary School Examination</p>
                <div className="pt-2">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white/90 border border-white/20 text-xs font-mono font-bold">
                    Score: 70.6%
                  </span>
                  <span className="text-xs font-mono text-white/50 ml-2">TiwariPur, Buxar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Technical Ecosystem (Span 12) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-red-600/60 transition-all duration-500 overflow-hidden relative group"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="space-y-2 text-left relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Production Tech Stack</h3>
              <p className="text-base md:text-lg font-semibold text-white">Equipped with core algorithms, languages, databases, and IoT hardware.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 relative z-10">
              {['C++', 'Python', 'C', 'Java', 'JavaScript', 'MySQL', 'DBMS', 'HTML5', 'CSS3', 'Chart.js', 'Arduino', 'RFID', 'Git & GitHub'].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-white shadow-inner hover:bg-red-600/20 hover:border-red-600/40 hover:scale-105 transition-all"
                >
                  {tech}
                </span>
              ))}
              <button
                type="button"
                onClick={onOpenResume}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.6)]"
              >
                View CV &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;