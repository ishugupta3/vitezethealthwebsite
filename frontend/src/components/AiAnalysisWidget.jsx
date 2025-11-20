import React, { useState, useEffect } from 'react';
import { FaBrain, FaArrowRight, FaShieldAlt, FaBolt } from 'react-icons/fa';
import photo from "../assets/images/zetGenie.png";

const AnimatedButton = ({ onTap }) => {
  const [borderRotation, setBorderRotation] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const [shimmerPosition, setShimmerPosition] = useState(-1);
  const [brainFloat, setBrainFloat] = useState(0);
  const [scaleDirection, setScaleDirection] = useState(1); // 1 for zoom in, -1 for zoom out

  useEffect(() => {
    const borderInterval = setInterval(() => {
      setBorderRotation(prev => prev + 1);
    }, 80);

    const pulseInterval = setInterval(() => {
      setPulseScale(prev => {
        if (scaleDirection === 1 && prev < 1.04) {
          return prev + 0.003;
        } else if (scaleDirection === 1 && prev >= 1.04) {
          setScaleDirection(-1);
          return prev;
        } else if (scaleDirection === -1 && prev > 1) {
          return prev - 0.003;
        } else if (scaleDirection === -1 && prev <= 1) {
          setScaleDirection(1);
          return prev;
        }
        return prev;
      });
    }, 160);

    const shimmerInterval = setInterval(() => {
      setShimmerPosition(prev => (prev > 2 ? -1 : prev + 0.06));
    }, 90);

    const brainFloatInterval = setInterval(() => {
      setBrainFloat(prev => (prev === 0 ? 3 : 0));
    }, 1800);

    return () => {
      clearInterval(borderInterval);
      clearInterval(pulseInterval);
      clearInterval(shimmerInterval);
      clearInterval(brainFloatInterval);
    };
  }, [scaleDirection]);

  return (
    <button
      type="button"
      onClick={onTap}
      className="relative cursor-pointer focus:outline-none group"
      style={{
        transform: `scale(${pulseScale})`,
        transition: 'transform 0.2s ease-out',
      }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-[2px] rounded-full blur-[6px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `conic-gradient(from ${borderRotation}deg, rgba(34,197,94,0.7), rgba(59,130,246,0.8), rgba(56,189,248,0.8), rgba(34,197,94,0.7))`,
        }}
      />

      {/* Button body */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-500 rounded-full px-5 py-2.5 sm:px-7 sm:py-3.5 shadow-[0_12px_30px_rgba(16,185,129,0.45)] overflow-hidden border border-emerald-300/40 group-hover:shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition-all duration-300">
        {/* Glass overlay */}
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />

        {/* Shimmer */}
        <div
          className="absolute inset-0 rounded-full opacity-40 mix-blend-screen"
          style={{
            background:
              'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
            transform: `translateX(${shimmerPosition * 120}%)`,
            transition: 'transform 0.12s linear',
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-center space-x-2 text-white font-semibold tracking-wide">
          <FaBrain
            className="text-sm sm:text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            style={{
              transform: `rotate(${borderRotation * 0.12}deg) translateY(${brainFloat}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
          <span className="text-xs sm:text-sm uppercase">
            Analyze Reports
          </span>
          <FaArrowRight
            className="text-xs sm:text-sm transform transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </div>
      </div>
    </button>
  );
};

const AiAnalysisWidget = ({ onUploadClick }) => {
  return (
    <div className="mx-4 my-6">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Soft gradient background shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/40 via-white to-sky-300/40 blur-2xl -z-10" />

        {/* Main card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(15,118,110,0.25)] border border-white/60">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400 opacity-70" />

          <div className="flex flex-row items-start">
            {/* Logo */}
            <div className="mr-4 -ml-1 mb-0 flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/60 to-sky-400/60 rounded-2xl blur-sm opacity-80" />
                <div className="relative bg-white/90 rounded-2xl p-2.5 shadow-[0_10px_25px_rgba(148,163,184,0.45)]">
                  <img
                    src={photo}
                    alt="ZetGenie AI"
                    className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Text + CTA */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-1 leading-snug">
                AI Medical <span className="text-slate-800">Analysis</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-[0.95rem] mb-4 leading-relaxed">
                Upload your lab reports, prescriptions or scans and get smart AI-powered explanations in seconds.
              </p>

              <div className="flex items-center space-x-3">
                <AnimatedButton onTap={onUploadClick} />
                <span className="hidden sm:inline text-[11px] text-slate-500">
                  PDF, image & text reports supported.
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200 flex items-center shadow-sm">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                  <FaShieldAlt className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <p className="text-emerald-800 text-xs font-semibold">
                    Secure & Private
                  </p>
                  <p className="text-emerald-700/80 text-[10px] mt-0.5">
                    Data encrypted, no sharing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50/80 rounded-2xl p-3 border border-sky-200 flex items-center shadow-sm">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-2">
                  <FaBolt className="text-sky-600 text-sm" />
                </div>
                <div>
                  <p className="text-sky-800 text-xs font-semibold">
                    Instant Results
                  </p>
                  <p className="text-sky-700/80 text-[10px] mt-0.5">
                    Summary & key alerts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle note */}
          <p className="mt-4 text-[10px] text-slate-400">
            Not a substitute for professional medical advice. Always consult your doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisWidget;
