import React from "react";

const SlideCard = ({ title, description, image }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-4">
      <img
        src={image}
        alt={title}
        className="w-full h-80 object-cover rounded-xl shadow-lg mb-6"
      />
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent shadow-lg mb-3">{title}</h2>
      <p className="text-gray-700 text-lg max-w-md">{description}</p>
    </div>
  );
};

export default SlideCard;
