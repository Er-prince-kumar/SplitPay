import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Authentic Project Data - Exactly 5 Verified Projects
const projectsData = [
  {
    title: "AI-Health-Management",
    category: "Artificial Intelligence & Healthcare",
    description: "Intelligent healthcare platform featuring NLP-based symptom triage, severity classification, doctor discovery, EMR management, and Chart.js dashboards.",
    tags: ["NLP", "JavaScript", "Chart.js", "AI Triage", "HTML/CSS"],
    match: "99%",
    episode: "S01 E01",
    github: "https://github.com/Er-prince-kumar/AI-Health-Management"
  },
  {
    title: "Snake-game",
    category: "Interactive Game Engineering",
    description: "Retro arcade snake game built with modern JavaScript and HTML5 Canvas, featuring smooth keyboard controls, dynamic score tracking, and fluid collision physics.",
    tags: ["JavaScript", "HTML5 Canvas", "Game Dev", "Arcade"],
    match: "98%",
    episode: "S01 E02",
    github: "https://github.com/Er-prince-kumar/Snake-game"
  },
  {
    title: "AI-Study-",
    category: "Generative EdTech & Study AI",
    description: "Intelligent learning platform where students upload PDFs to automatically generate concise notes, adaptive quizzes, flashcards, and personalized study schedules.",
    tags: ["AI Notes", "PDF Extraction", "JavaScript", "Full-Stack"],
    match: "97%",
    episode: "S01 E03",
    github: "https://github.com/Er-prince-kumar/AI-Study-"
  },
  {
    title: "Career-Match",
    category: "AI Career Guidance & NLP",
    description: "AI-powered career matching platform that parses resumes using NLP, identifies skill gaps, and suggests personalized career paths for data-driven decisions.",
    tags: ["NLP", "Resume Parsing", "JavaScript", "Career AI"],
    match: "98%",
    episode: "S01 E04",
    github: "https://github.com/Er-prince-kumar/Career-Match"
  },
  {
    title: "Automatic Attendance Monitoring",
    category: "IoT Biometrics & Embedded Systems",
    description: "Hybrid RFID and face-recognition automatic attendance system automating classroom check-ins and lecture presence tracking.",
    tags: ["Arduino", "RFID", "Face Recognition", "Python", "C++"],
    match: "99%",
    episode: "S01 E05",
    github: null
  }
];

const Projects = () => {
  const containerRef = useRef(null);
  const folderBackRef = useRef(null);
  const folderFrontRef = useRef(null);
  const cardsRef = useRef([]);
  const mobileCardsRef = useRef([]);
  const mobileCarouselRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Set initial origins (Centered in viewport)
      gsap.set([folderBackRef.current, folderFrontRef.current], { 
        xPercent: -50, 
        yPercent: -50 
      });
      gsap.set(folderFrontRef.current, { transformOrigin: "bottom center" });
      
      // Dynamic pyramid layout for 5 projects (Top 3, Bottom 2 centered)
      const getCardCoords = (index, w, h, gapX, gapY) => {
        if (index < 3) {
          const x = (index - 1) * (w + gapX);
          const y = -0.58 * (h + gapY);
          return { x, y };
        } else {
          const col = index - 3;
          const x = (col === 0 ? -0.55 : 0.55) * (w + gapX);
          const y = 0.58 * (h + gapY);
          return { x, y };
        }
      };

      cardsRef.current.forEach((card) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          rotation: gsap.utils.random(-6, 6),
          scale: 0.85,
          x: 0,
          y: 0,
        });
      });

      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        if (isDesktop) {
          let floatTween;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 50%", 
              end: "bottom 50%",
              toggleActions: "play reverse play reverse",
              onEnter: () => { if (floatTween) floatTween.kill(); },
              onEnterBack: () => { if (floatTween) floatTween.kill(); },
              onLeave: () => { if (floatTween) floatTween.kill(); },
              onLeaveBack: () => { if (floatTween) floatTween.kill(); }
            },
            onComplete: () => {
              floatTween = gsap.to(cardsRef.current, {
                y: "+=10",
                rotation: "+=1",
                duration: 3.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                stagger: { amount: 1.5, from: "random" }
              });
            }
          });

          // 1. Folder opens with smooth rotation
          tl.to(folderFrontRef.current, {
            rotationX: -130,
            duration: 1.2,
            ease: "power3.inOut"
          });

          // 2. Cards rise up collectively
          tl.to(cardsRef.current, {
            y: -140,
            scale: 0.9,
            zIndex: 70,
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(1.2)"
          }, "-=0.6");

          // 3. Cards magically spread out into a 3-2 pyramid blockbuster layout
          tl.to(cardsRef.current, {
            x: (i) => {
              const w = Math.max(...cardsRef.current.map(c => c?.offsetWidth || 0)) || 360;
              const gapX = 40;
              const gapY = 36;
              const h = Math.max(...cardsRef.current.map(c => c?.offsetHeight || 0)) || 240;
              return getCardCoords(i, w, h, gapX, gapY).x;
            },
            y: (i) => {
              const w = Math.max(...cardsRef.current.map(c => c?.offsetWidth || 0)) || 360;
              const gapX = 40;
              const gapY = 36;
              const h = Math.max(...cardsRef.current.map(c => c?.offsetHeight || 0)) || 240;
              return getCardCoords(i, w, h, gapX, gapY).y;
            },
            rotation: () => gsap.utils.random(-2.5, 2.5),
            scale: 1,
            duration: 1.4,
            stagger: { amount: 0.35, from: "center" },
            ease: "expo.out"
          }, "-=0.2");
        }

        if (isMobile) {
          const cardW = window.innerWidth * 0.8;
          const gap = 20;
          
          mobileCardsRef.current.forEach((card, i) => {
            gsap.set(card, {
              x: -(i * (cardW + gap)), 
              y: 0,
              scale: 0.4,
              opacity: 0,
              rotation: gsap.utils.random(-15, 15)
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
            }
          });

          tl.to(folderFrontRef.current, {
            rotationX: -130,
            duration: 0.8,
            ease: "power3.inOut"
          });

          tl.to(mobileCardsRef.current, {
            y: -100,
            opacity: 1,
            scale: 0.85,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.2)"
          }, "-=0.4");

          tl.to(mobileCardsRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: (i) => i === 0 ? 1 : 0.92,
            opacity: (i) => i === 0 ? 1 : 0.5,
            duration: 0.8,
            stagger: 0.08,
            ease: "expo.out",
            onComplete: () => {
              if (mobileCarouselRef.current) {
                mobileCarouselRef.current.style.overflowX = 'auto';
                mobileCarouselRef.current.style.pointerEvents = 'auto';
              }
            }
          }, "-=0.2");
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={containerRef} className="bg-[#0b0b0b] min-h-[100svh] md:min-h-[170vh] relative font-sans overflow-x-clip text-white w-full flex items-center justify-center py-24 md:py-40 select-none">
      
      {/* Background Netflix Cinematic Title Watermark */}
      <div className="absolute top-10 left-0 w-full flex items-start justify-center pointer-events-none z-0">
        <h1 className="text-[14vw] sm:text-[17vw] md:text-[20vw] font-black text-white/[0.03] tracking-tighter leading-none whitespace-nowrap uppercase">
          ORIGINALS
        </h1>
      </div>

      {/* Ambient Crimson Glow behind folder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] bg-red-600/15 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Perspective Container */}
      <div className="mt-12 relative w-full max-w-7xl h-full flex items-center justify-center perspective-[2000px] z-10">
        
        {/* Origin Container */}
        <div className="relative w-0 h-0 transform-style-3d">
          
          {/* Folder Back */}
          <div 
            ref={folderBackRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video bg-[#141414] rounded-[24px] border border-red-600/40 shadow-[0_20px_50px_rgba(229,9,20,0.25)] flex items-center justify-center"
            style={{ zIndex: 5 }}
          >
            <div className="absolute -top-6 left-6 w-32 h-8 bg-[#1f1f1f] rounded-t-xl border-t border-red-600/30" />
            <div className="relative z-10 text-red-600 font-mono font-black text-2xl tracking-widest uppercase opacity-60">
              ARCHIVE_SLOTS
            </div>
          </div>

          {/* Desktop Project Cards */}
          {projectsData.map((project, i) => {
            const CardTag = project.github ? 'a' : 'div';
            const linkProps = project.github ? {
              href: project.github,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {};

            return (
              <div 
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="hidden md:block absolute w-[80vw] md:w-[31vw] max-w-[365px] aspect-[16/10] will-change-transform"
                style={{ zIndex: 10 + i }}
              >
                <CardTag
                  {...linkProps}
                  className={`w-full h-full rounded-[24px] overflow-hidden border border-white/15 bg-[#141414]/95 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9)] transition-all duration-500 group hover:scale-[1.04] hover:border-red-600 hover:shadow-[0_35px_80px_rgba(229,9,20,0.35)] hover:-translate-y-2 relative z-10 p-6 flex flex-col justify-between block ${project.github ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Top Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500 bg-red-600/10 px-2.5 py-1 rounded border border-red-600/20">
                      {project.episode}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-red-400 font-bold">{project.match} Match</span>
                      <span className="text-[10px] font-mono border border-white/30 px-1 text-white/70">HD</span>
                    </div>
                  </div>

                  {/* Middle Title & Description */}
                  <div className="space-y-1.5 my-auto">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight group-hover:text-red-500 transition-colors duration-300 flex items-center justify-between">
                      <span>{project.title}</span>
                      {project.github && (
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      )}
                    </h3>
                    <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Tech Tags & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono text-white/70 bg-white/5 px-2 py-0.5 rounded group-hover:border-red-600/30 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.github ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-400 font-bold shrink-0">
                        Code &rarr;
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        IoT Hardware
                      </span>
                    )}
                  </div>

                  {/* Red Glowing Corner Accent */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-red-600 group-hover:shadow-[0_0_15px_#E50914] transition-all" />
                </CardTag>
              </div>
            );
          })}

          {/* Folder Front Flap */}
          <div 
            ref={folderFrontRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video pointer-events-none will-change-transform"
            style={{ zIndex: 60 }}
          >
            <div className="absolute bottom-0 w-full h-[85%] bg-[#1c1c1c] rounded-b-[24px] rounded-t-md shadow-[0_-5px_20px_rgba(0,0,0,0.8)] flex flex-col justify-end p-6 border-t border-red-600/40">
              <div className="w-20 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Swipeable Carousel */}
      <div 
        ref={mobileCarouselRef}
        className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-auto py-12 flex items-center gap-6 px-[12.5vw] pointer-events-none z-[100] snap-x snap-mandatory overflow-x-hidden hide-scrollbar"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        {projectsData.map((project, i) => {
          const MobCardTag = project.github ? 'a' : 'div';
          const mobLinkProps = project.github ? {
            href: project.github,
            target: "_blank",
            rel: "noopener noreferrer"
          } : {};

          return (
            <div 
              key={`mob-${i}`}
              ref={el => mobileCardsRef.current[i] = el}
              className="shrink-0 w-[78vw] aspect-[16/11] snap-center will-change-transform relative z-10 pointer-events-auto"
            >
              <MobCardTag
                {...mobLinkProps}
                className="w-full h-full rounded-[24px] overflow-hidden border border-white/15 bg-[#141414] p-5 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.9)] block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 bg-red-600/10 px-2 py-0.5 rounded">
                    {project.episode}
                  </span>
                  <span className="text-xs font-mono text-red-400 font-bold">{project.match} Match</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white flex items-center justify-between">
                    <span>{project.title}</span>
                    {project.github && <span className="text-xs text-red-500 font-mono">&rarr;</span>}
                  </h3>
                  <p className="text-xs text-white/70 font-light line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.github ? (
                    <span className="text-[10px] font-mono text-red-400 font-bold">GitHub</span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Hardware System</span>
                  )}
                </div>
              </MobCardTag>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Projects;