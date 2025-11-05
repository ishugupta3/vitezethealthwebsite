import React, { useState, useEffect, useRef } from 'react';

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= items.length) {
          // Reset to 0 without animation
          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = 'none';
              setCurrentIndex(0);
              setTimeout(() => {
                if (slideRef.current) {
                  slideRef.current.style.transition = 'transform 0.5s ease-in-out';
                }
              }, 50);
            }
          }, 500); // After transition duration
          return prevIndex; // Keep current for smooth transition
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div
        ref={slideRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={item.image || '/placeholder-image.jpg'}
              alt={item.title || `Slide ${index + 1}`}
              className="w-full h-40 sm:h-56 md:h-72 lg:h-80 xl:h-[400px] 2xl:h-[450px] object-contain object-center"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex % items.length ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
