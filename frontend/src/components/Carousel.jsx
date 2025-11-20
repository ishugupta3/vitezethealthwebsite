import React, { useState, useEffect, useRef } from 'react';

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= items.length) {
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
          }, 500);
          return prevIndex;
        }
        return nextIndex;
      });
    }, 3500);
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
    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-white-100 to-white-100 shadow-lg">
      {/* Responsive wrapper: full width 16:9 on mobile, smaller fixed size on laptop */}
      <div
        className={`
          aspect-[16/9] w-full
          md:aspect-[21/10]
          md:w-3/5 md:max-w-[720px]
          bg-black
          flex items-center justify-center
          overflow-hidden
          mx-auto
        `}
        style={{ minHeight: '180px' }}
      >
        <div
          ref={slideRef}
          className="flex transition-transform duration-500 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center bg-white">
              <img
                src={item.image || '/placeholder-image.jpg'}
                alt={item.title || `Slide ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            className={`
              w-2 h-1 rounded-full border border-white outline-none transition-colors
              ${index === currentIndex % items.length ? 'bg-green-500' : 'bg-white hover:bg-white'}
            `}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls (Laptop only) */}
      <button
        onClick={() => setCurrentIndex((currentIndex - 1 + items.length) % items.length)}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 justify-center items-center rounded-full bg-white/80 hover:bg-indigo-200 shadow transition"
        aria-label="Previous"
      >
        <span className="text-xl text-green-700">&lt;</span>
      </button>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 justify-center items-center rounded-full bg-white/80 hover:bg-indigo-200 shadow transition"
        aria-label="Next"
      >
        <span className="text-xl text-green-700">&gt;</span>
      </button>
    </div>
  );
};

export default Carousel;
