import React from 'react';

const PerformanceBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle modern dot matrix grid */}
      <div 
        className="absolute inset-0 opacity-[0.12]" 
        style={{
          backgroundImage: 'radial-gradient(#C6FF3D 0.75px, transparent 0.75px)',
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Primary Ambient Gradient Glows (CSS hardware accelerated) */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#1B1B3A]/70 via-[#0082FB]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-[35%] -left-[10%] w-[500px] h-[500px] bg-[#C6FF3D]/5 rounded-full blur-3xl" />
      <div className="absolute top-[65%] -right-[10%] w-[600px] h-[600px] bg-[#0082FB]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[5%] left-1/4 w-[500px] h-[400px] bg-[#1B1B3A]/60 rounded-full blur-3xl" />
    </div>
  );
};

export default PerformanceBackground;
