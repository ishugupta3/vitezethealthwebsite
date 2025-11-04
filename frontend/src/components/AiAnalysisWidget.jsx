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
    }, 100);

    const pulseInterval = setInterval(() => {
      setPulseScale(prev => {
        if (scaleDirection === 1 && prev < 1.05) {
          return prev + 0.003;
        } else if (scaleDirection === 1 && prev >= 1.05) {
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
    }, 200);

    const shimmerInterval = setInterval(() => {
      setShimmerPosition(prev => prev > 2 ? -1 : prev + 0.05);
    }, 100);

    const brainFloatInterval = setInterval(() => {
      setBrainFloat(prev => prev === 0 ? 2 : 0);
    }, 2000);

    return () => {
      clearInterval(borderInterval);
      clearInterval(pulseInterval);
      clearInterval(shimmerInterval);
      clearInterval(brainFloatInterval);
    };
  }, [scaleDirection]);

  return (
    <div
      className="relative cursor-pointer"
      style={{ transform: `scale(${pulseScale})` }}
      onClick={onTap}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from ${borderRotation}deg, rgba(59, 130, 246, 0.8), rgba(255, 255, 255, 0.8), rgba(59, 130, 246, 0.8), transparent)`,
          padding: '2px',
        }}
      >
        <div className="w-full h-full rounded-full bg-green-500"></div>
      </div>

      {/* Inner button */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-full px-6 py-3 shadow-lg overflow-hidden">
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)`,
            transform: `translateX(${shimmerPosition * 100}%)`,
          }}
        ></div>

        <div className="flex items-center justify-center space-x-2 text-white font-semibold">
          <FaBrain
            className="text-sm"
            style={{ transform: `rotate(${borderRotation * 0.1}deg) translateY(${brainFloat}px)` }}
          />
          <span>Analyze Now!</span>
          <FaArrowRight
            className="text-xs"
            style={{ transform: `translateX(${pulseScale === 1 ? 0 : 5}px)` }}
          />
        </div>
      </div>
    </div>
  );
};

const AiAnalysisWidget = ({ onUploadClick }) => {
  return (
    <div className="mx-4 my-6">
      <div className="bg-gradient-to-br from-white to-green-200 rounded-3xl p-6 shadow-xl border border-white/30">
        {/* Logo and Content */}
        <div className="flex items-start">
          {/* Logo */}
          <div className="mr-4 -ml-2">
            <img
              src={photo}
              alt="ZetGenie AI"
              className="w-24 h-40 object-contain"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-600 mb-1">
              AI Medical <span className="text-gray-700">Analysis</span>
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Upload your medical reports for instant AI-powered insights
            </p>

            {/* Animated Button */}
            <AnimatedButton onTap={onUploadClick} />
          </div>
        </div>

        {/* Features */}
        <div className="flex space-x-4 mt-6">
          <div className="flex-1 bg-green-100 rounded-xl p-3 border border-green-500">
            <div className="flex items-center">
              <FaShieldAlt className="text-green-600 mr-2 text-sm" />
              <span className="text-green-700 text-xs font-medium">Secure & Private</span>
            </div>
          </div>

          <div className="flex-1 bg-blue-100 rounded-xl p-3 border border-blue-300">
            <div className="flex items-center">
              <FaBolt className="text-blue-600 mr-2 text-sm" />
              <span className="text-blue-700 text-xs font-medium">Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisWidget;
