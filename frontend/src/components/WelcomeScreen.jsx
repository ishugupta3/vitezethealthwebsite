import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { slidesData } from "../data/slidesData";
import SlideCard from "./SlideCard";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    if (current < slidesData.length - 1) setCurrent(current + 1);
  };

  const prevSlide = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const skipSlides = () => {
    setCurrent(slidesData.length - 1);
  };

  const getStarted = () => {
    // Navigate to login screen
    navigate("/login");
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-green-400 via-white to-green-200 flex flex-col justify-between">
      {/* App Bar */}
      <div className="flex justify-end p-2 sm:p-4">
        <button
          onClick={skipSlides}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          Skip
        </button>
      </div>

      {/* Slide View */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-4"
        onClick={(e) => {
          const x = e.nativeEvent.offsetX;
          const width = e.currentTarget.offsetWidth;
          if (x < width / 2) prevSlide();
          else nextSlide();
        }}
      >
        <SlideCard {...slidesData[current]} />
      </div>

      {/* Bottom Card */}
      <div className="bg-gradient-to-b from-white to-green-500 rounded-t-3xl shadow-md px-6 py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          {slidesData[current].title}
        </h3>

        {/* Indicators + Button */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {slidesData.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ease-in-out rounded-full ${
                  i === current
                    ? "w-8 h-3 bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50 scale-110"
                    : "w-3 h-3 bg-green-200 hover:bg-green-300"
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={
              current === slidesData.length - 1 ? getStarted : nextSlide
            }
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-green-600 hover:to-green-700 animate-pulse"
          >
            {current === slidesData.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
