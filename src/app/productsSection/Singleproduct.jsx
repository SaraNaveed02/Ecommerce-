"use client"
import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import QuickViewModal from "../components/QuickViewModal";
import Button from "../components/Button"


const SingleProduct = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const isDiscounted = product.discountPercentage > 15;

    // Original price calculate karein
    const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

    return (
        <div className="group relative cursor-pointer flex flex-col h-full bg-white rounded-lg overflow-hidden transition-all border border-transparent hover:border-gray-100 shadow-sm">

            {/* Image Container */}
            <div className="relative h-64 bg-[#f3f3f3] flex items-center justify-center overflow-hidden">

                {/* 1. Badge Logic: Sirf isDiscounted true hone par dikhega */}
                {isDiscounted && (
                    <span className="absolute top-3 left-3 bg-[#e34252] text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                        -{Math.round(product.discountPercentage)}%
                    </span>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Eye + Quickshop */}
                <div className="
  absolute top-4 right-4 z-20
  opacity-0 translate-y-2
  group-hover:opacity-100
  group-hover:translate-y-0
  transition-all duration-300
">

                    <div className="relative group/eye">

                        <span className="
      absolute right-[115%]
      top-1/2 -translate-y-1/2
      bg-[#1e3a8a]
      text-white
      px-4 py-2
      text-[11px] font-bold uppercase tracking-wider
      whitespace-nowrap
      opacity-0
      translate-x-3
      transition-all duration-300
      group-hover/eye:opacity-100
      group-hover/eye:translate-x-0
      pointer-events-none
    ">
                            Quickshop

                            {/* Small arrow */}
                            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#1e3a8a] rotate-45"></span>
                        </span>

                        {/* Eye Button */}
                        <div
                            onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
                            className="
  relative
  w-12 h-12
  bg-white
  rounded-full
  flex items-center justify-center
  cursor-pointer
  shadow-md
  overflow-hidden
  group/eye
"
                        >

                            <span className="
    absolute left-0 top-0 h-full w-0
    bg-[#1e3a8a]
    transition-all duration-400 ease-out
    group-hover/eye:w-full
  "></span>

                            {/* Eye Icon */}
                            <MdOutlineRemoveRedEye
                                size={22}
                                className="relative z-10 text-black transition-colors duration-300 group-hover/eye:text-white"
                            />

                        </div>

                    </div>
                </div>




                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content Container */}
            <div className="p-4 text-center flex flex-col flex-1 items-center justify-between">
                <div className="w-full">
                    <h3 className="text-[#004b61] font-bold text-xs uppercase tracking-wider mb-2 h-10 line-clamp-2">
                        {product.title}
                    </h3>

                    {/* Ratings */}
                    <div className="flex justify-center items-center gap-1 mb-2">
                        <div className="flex text-[#ff4c60] text-xs">
                            {"★".repeat(Math.round(product.rating))}
                            <span className="text-gray-200">{"★".repeat(5 - Math.round(product.rating))}</span>
                        </div>
                        <span className="text-gray-400 text-[10px] ml-1">{product.stock % 20} reviews</span>
                    </div>

                    <div className="flex justify-center items-center gap-2 mb-4">
                        <span className="text-[#e34252] font-bold text-sm">
                            Rs.{product.price}
                        </span>

                        {isDiscounted ? (
                            <span className="text-gray-400 line-through text-xs font-medium">
                                Rs.{originalPrice}
                            </span>
                        ) : (
                            <span className="h-4 w-1"></span>
                        )}
                    </div>
                </div>

                <Button text="Add To Cart"/>
            </div>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </div>
    );
};

export default SingleProduct