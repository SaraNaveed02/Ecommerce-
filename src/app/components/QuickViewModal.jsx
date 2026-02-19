"use client"
import { useState } from "react"
import Link from "next/link"
import { IoMdClose } from "react-icons/io"

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !product) return null

  const originalPrice = (product.price / (1 - (product.discountPercentage || 0) / 100)).toFixed(0)
  const images = product.images && product.images.length ? product.images : [product.thumbnail]
  const reviewsCount = product.stock ? (product.stock % 20) || 12 : 45
  const freeShippingThreshold = 1500
  const amountNeeded = Math.max(0, freeShippingThreshold - product.price * quantity)

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="relative w-[95vw] max-w-4xl max-h-[90vh] bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line - Dark Red */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c41e3a] z-10" />

        {/* Left Section - Product Image (40%) */}
        <div className="w-full sm:w-[42%] bg-[#f0f0f0] flex flex-col items-center justify-center p-8 min-h-[320px] relative">
          {/* Promotional Text */}
          <span className="absolute top-6 left-6 text-2xl font-bold text-gray-700 tracking-wide drop-shadow-sm uppercase">
            {product.category?.replace(/-/g, " ") || "Quick View"}
          </span>

          {/* Product Image */}
          <img
            src={images[currentImageIndex]}
            alt={product.title}
            className="w-3/4 max-h-64 object-contain"
          />

          {/* Image Carousel Dots */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Product Details (60%) */}
        <div className="w-full sm:w-[58%] p-6 sm:p-8 overflow-y-auto flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors z-20"
          >
            <IoMdClose size={28} />
          </button>

          {/* Product Name */}
          <h2 className="text-[#004b61] font-bold text-lg sm:text-xl pr-10">
            {product.title}
          </h2>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#ff4c60] text-base">
              {"★".repeat(Math.min(5, Math.round(product.rating || 5)))}
              <span className="text-gray-300">{"★".repeat(5 - Math.min(5, Math.round(product.rating || 5)))}</span>
            </div>
            <span className="text-gray-400 text-sm">{reviewsCount} reviews</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#004b61] font-bold text-xl">Rs.{product.price}</span>
            <span className="text-gray-400 line-through text-sm">Rs.{originalPrice}</span>
          </div>

          {/* Description (Truncated) */}
          <p className="text-gray-500 text-sm mt-4 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="px-4 py-2.5 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="px-5 py-2.5 font-semibold text-[#004b61] border-x border-gray-300 min-w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2.5 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button className="bg-[#ff4c60] hover:bg-[#e34252] text-white font-bold py-2.5 px-6 rounded uppercase text-xs tracking-wider transition-colors whitespace-nowrap">
              Add To Cart
            </button>
          </div>

          {/* Shipping Offer */}
          <div className="flex items-center gap-3 mt-6 py-4 border-b border-gray-200">
            <span className="text-gray-600">📦</span>
            <p className="text-gray-600 text-sm">
              {amountNeeded > 0 ? (
                <>Spend Rs.{amountNeeded} More for Free Shipping</>
              ) : (
                <>You qualify for Free Shipping</>
              )}
            </p>
          </div>

          {/* Product Specs */}
          <div className="mt-4 space-y-1.5 text-sm">
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">SKU:</span> {product.id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">TYPE:</span> {product.category || "—"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">VENDOR:</span>{" "}
              <span className="text-[#004b61]">{product.brand || "—"}</span>
            </p>
          </div>

          {/* View Details Link */}
          <Link
            href={`/productsSection/${product.id}`}
            className="mt-4 text-blue-600 hover:underline text-sm inline-block"
            onClick={onClose}
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuickViewModal
