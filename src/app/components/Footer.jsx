"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaArrowUp,FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        // Calculate progress percentage (0 to 100)
        setScrollProgress((currentScroll / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // SVG parameters for the circular border
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <footer className="bg-[#f6f3db] pt-20 pb-10 px-10 mt-20 relative border-t border-red-200">

    {/* Main Grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
  
      {/* About Us */}
      <div>
        <h3 className="text-[#004b61] font-bold text-lg mb-6">About Us</h3>
        <ul className="space-y-4 text-[#004b61]">
          <li className="hover:underline cursor-pointer">Our Story</li>
          <li className="hover:underline cursor-pointer">Our Philosophy</li>
          <li className="hover:underline cursor-pointer">Sustainability</li>
        </ul>
      </div>
  
      {/* Customer Service */}
      <div>
        <h3 className="text-[#004b61] font-bold text-lg mb-6">Customer Service</h3>
        <ul className="space-y-4 text-[#004b61]">
          <li className="hover:underline cursor-pointer">Contact Us</li>
          <li className="hover:underline cursor-pointer">FAQ's</li>
          <li className="hover:underline cursor-pointer">Refund Policy</li>
        </ul>
      </div>
  
      {/* Products */}
      <div>
        <h3 className="text-[#004b61] font-bold text-lg mb-6">Products</h3>
        <ul className="space-y-4 text-[#004b61]">
          <li className="hover:underline cursor-pointer">All Products</li>
          <li className="hover:underline cursor-pointer">New Arrivals</li>
          <li className="hover:underline cursor-pointer">Best Sellers</li>
        </ul>
      </div>
  
      {/* Follow Us */}
      <div>
        <h3 className="text-[#004b61] font-bold text-lg mb-6">Follow Us</h3>
        <div className="flex gap-6 text-[#004b61] text-xl">
        <a href="#" className=" transition-transform duration-300">
      <FaFacebookF size={20} />
    </a>

    {/* Instagram Icon */}
    <a href="#" className=" transition-transform duration-300">
      <FaInstagram size={22} />
    </a>

    {/* TikTok Icon */}
    <a href="#" className=" transition-transform duration-300">
      <FaTiktok size={20} />
    </a>
        </div>
      </div>
  
    </div>
  
    {/* Bottom Line */}
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-red-300 flex justify-between items-center">
      <p className="text-[#004b61] text-sm">
        © 2026, <span className="font-bold">Befundamentals.</span>
      </p>
    </div>
  
    {/* Floating Buttons */}
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-100">
  
      {/* WhatsApp */}
      <div className="bg-[#25D366] p-4 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform text-white text-2xl">
        <FaWhatsapp />
      </div>
  
      {/* Scroll To Top (NO CHANGE IN LOGIC) */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="relative w-14 h-14 bg-white rounded-full shadow-lg cursor-pointer flex items-center justify-center group"
      >
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="black"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.1s linear",
            }}
            strokeLinecap="round"
          />
        </svg>
  
        <FaArrowUp className="relative z-10 text-black text-sm group-hover:-translate-y-1 transition-transform" />
      </div>
  
    </div>
  
  </footer>
  
  );
};

export default Footer;