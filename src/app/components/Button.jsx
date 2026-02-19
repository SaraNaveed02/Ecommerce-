// components/AnimatedButton.jsx
import React from "react";

const AnimatedButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative overflow-hidden bg-[#ff4c60] text-white font-bold py-3 px-4
        rounded-md uppercase tracking-widest text-xs transition-all
        whitespace-nowrap
        before:absolute before:top-0 before:left-0 before:h-full before:w-0
        before:bg-blue-950 before:transition-all before:duration-500 before:ease-out
        hover:before:w-full
        hover:text-white
      "
    >
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default AnimatedButton;