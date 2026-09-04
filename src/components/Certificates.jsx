import React, { useState } from 'react';

const certificatesData = [
  {
    id: 'oracle-ai',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle University',
    issuedDate: 'August 15, 2025',
    validity: 'August 15, 2027',
    signatory: 'Damien Carey (Senior VP, Oracle University)',
    category: 'Cloud AI & Machine Learning',
    badge: 'ORACLE OFFICIAL',
    badgeColor: 'border-red-600/40 text-red-400 bg-red-600/10',
    description: 'Accreditation validating core knowledge of Artificial Intelligence, Machine Learning workloads, Generative AI fundamentals, and enterprise Oracle Cloud Infrastructure deployments.',
    image: '/certificate_oracle_ai.jpg',
    verifyUrl: 'https://www.linkedin.com/in/cse-prince-kumar/',
    verifyLabel: 'Verify on LinkedIn'
  },
  {
    id: 'infosys-ai',
    title: 'Introduction to Artificial Intelligence',
    issuer: 'Infosys | Springboard',
    issuedDate: 'February 12, 2026',
    validity: 'Lifetime Credential',
    signatory: 'Satheesha B. Nanjappa (Senior VP, Infosys)',
    category: 'Artificial Intelligence & Neural Nets',
    badge: 'INFOSYS SPRINGBOARD',
    badgeColor: 'border-blue-600/40 text-blue-400 bg-blue-600/10',
    description: 'Accredited coursework covering state-of-the-art AI paradigms, search algorithms, knowledge representation, NLP foundational concepts, and ethical AI applications.',
    image: '/certificate_infosys_ai.png',
    verifyUrl: 'https://verify.onwingspan.com',
    verifyLabel: 'Verify on Wingspan'
  },
  {
    id: 'edutech-habits',
    title: 'Healthy Habits for Healthy Life',
    issuer: 'EduTech Hub',
    issuedDate: 'October 26, 2025',
    validity: 'Credential ID: EDU/10/25/HHL-A164',
    signatory: 'EduTech Hub Academic Council',
    category: 'Professional Well-Being',
    badge: 'EDUTECH HUB',
    badgeColor: 'border-amber-600/40 text-amber-400 bg-amber-600/10',
    description: 'Certified program on mental resilience, peak productivity habits, and holistic well-being for high-performing technical engineering professionals.',
    image: '/certificate_edutech_habits.png',
    verifyUrl: 'mailto:info@edutechhub.in',
    verifyLabel: 'Verify via Email'
  },
  {
    id: 'wns-cybersmart',
    title: 'Digital Safety & Cybersecurity Educator (CyberSmart)',
    issuer: 'WNS Cares Foundation',
    issuedDate: 'July 2026',
    validity: 'Community Leadership Impact',
    signatory: 'WNS Cares Foundation Leadership Council',
    category: 'Cybersecurity & Community Leadership',
    badge: 'WNS CARES FOUNDATION',
    badgeColor: 'border-emerald-600/40 text-emerald-400 bg-emerald-600/10',
    description: 'Trained and certified in cybersecurity education, personally empowering 50-60 students with practical cyberbullying prevention, digital hygiene, and personal data privacy.',
    image: '/certificate_wns_cybersmart.png',
    pdfUrl: '/Prince_Kumar_CyberSmart.pdf',
    verifyUrl: '/Prince_Kumar_CyberSmart.pdf',
    verifyLabel: 'Download Full PDF'
  }
];

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section 
      id="certificates" 
      className="relative w-full bg-[#070707] text-white py-32 px-6 md:px-12 border-t border-white/5 select-none overflow-hidden"
    >
      {/* Crimson Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-black/80 backdrop-blur-2xl border border-red-600/40 text-xs font-mono uppercase tracking-widest text-white shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-red-500 font-bold">EPISODE 03</span>
              <span className="text-white/40">|</span>
              <span>LICENSES &amp; CERTIFICATIONS</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              VERIFIED CREDENTIALS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-700 drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">
                INDUSTRY ACCREDITED.
              </span>
            </h2>
            <p className="text-sm md:text-base text-white/60 font-light max-w-2xl">
              Verified certifications in Cloud AI, Neural Computing, Cybersecurity, and Professional Systems endorsed by industry leaders.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/cse-prince-kumar/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-white/10 border border-white/15 hover:border-red-600/50 text-white text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63A1.62 1.62 0 0 0 7.84 6.2Z"/>
              </svg>
              <span>View LinkedIn Profile &rarr;</span>
            </a>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificatesData.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#121212]/90 backdrop-blur-2xl border border-white/10 hover:border-red-600/50 rounded-2xl p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_rgba(229,9,20,0.2)] group relative overflow-hidden"
            >
              {/* Internal subtle crimson hover sheen */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/15 transition-all duration-500 pointer-events-none"></div>

              <div className="space-y-5">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded border text-[11px] font-mono font-bold tracking-wider ${cert.badgeColor}`}>
                    {cert.badge}
                  </span>
                  <span className="text-xs font-mono text-white/50">
                    {cert.issuedDate}
                  </span>
                </div>

                {/* Certificate Scan Thumbnail with Zoom Overlay */}
                <div 
                  onClick={() => setSelectedCert(cert)}
                  className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-black/60 cursor-pointer group/thumb"
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-red-600/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.8)] transform translate-y-2 group-hover/thumb:translate-y-0 transition-transform">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      Click to Enlarge
                    </span>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {cert.title}
                  </h3>
                  <div className="text-xs font-mono text-white/60 space-y-0.5">
                    <div><span className="text-white/40">Issuer:</span> {cert.issuer}</div>
                    <div><span className="text-white/40">Signatory / Credential:</span> {cert.signatory || cert.validity}</div>
                  </div>
                  <p className="text-xs text-white/70 font-light leading-relaxed pt-1">
                    {cert.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-red-600 text-white text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Inspect Certificate
                </button>

                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-transparent hover:bg-white/5 border border-white/15 text-white/80 hover:text-white text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <span>{cert.verifyLabel}</span>
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Certificate Full Preview Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-[#141414] border border-red-600/40 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(229,9,20,0.3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <span className="font-mono text-xs font-bold tracking-widest text-red-500 uppercase truncate max-w-md">
                  {selectedCert.issuer} // {selectedCert.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={selectedCert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                >
                  Open Original File
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors text-white font-bold text-lg"
                  aria-label="Close Preview"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 md:p-8 overflow-y-auto flex items-center justify-center bg-black/50">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-h-[68vh] w-auto object-contain rounded-lg border border-white/10 shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#181818] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
              <span>{selectedCert.signatory || selectedCert.validity}</span>
              <a
                href={selectedCert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                {selectedCert.verifyLabel} &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;
