import React from "react";

const ScrollBanner = () => {
  return (
    <div className="relative overflow-hidden bg-pink-50 py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Duplicate content twice for seamless scroll */}
        {Array.from({ length: 2 }).map((_, outerIndex) => (
          <div key={outerIndex} className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="mx-8 font-bold text-sm text-pink-600">
                FREE SHIPPING ON ALL ORDERS ABOVE Rs.2,500 &nbsp; <span className="underline font-normal"> Shop now</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollBanner;
