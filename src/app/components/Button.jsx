// components/AnimatedButton.jsx
"use client"
import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const AnimatedButton = ({ text, onClick, product, quantity = 1 }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
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
      <span className="relative z-10">{isAdded ? '✓ Added to Cart' : text}</span>
    </button>
  );
};

export default AnimatedButton;