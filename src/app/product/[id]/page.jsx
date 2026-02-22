"use client"
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../../components/Button'
import { useCart } from '../../context/CartContext'
import { IoArrowBack } from 'react-icons/io5'

export default function ProductDetail({ params }) {
  const { id } = use(params)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, { cache: 'no-store' })
        const data = await response.json()
        setProduct(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleIncrement = () => {
    setQuantity(q => q + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#004b61]">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#004b61] mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#ff4c60] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const originalPrice = (product.price / (1 - (product.discountPercentage || 0) / 100)).toFixed(2)
  const isDiscounted = (product.discountPercentage || 0) > 15

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <Link href="/" className="flex items-center gap-2 text-[#004b61] hover:text-[#ff4c60] transition mb-8">
          <IoArrowBack size={20} />
          <span className="font-semibold">Back to Products</span>
        </Link>
      </div>

      {/* Product Details Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative bg-[#f3f3f3] rounded-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center">
              {isDiscounted && (
                <span className="absolute top-4 left-4 bg-[#e34252] text-white text-sm font-bold px-3 py-2 rounded-full z-10">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-contain p-4 sm:p-8"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-2 rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? 'border-[#ff4c60]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#004b61] mb-2">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wider">
                  Brand: {product.brand}
                </p>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.round(product.rating || 0)
                        ? 'text-[#ff4c60]'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.toFixed(1) || 0} ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-bold text-[#e34252]">
                  Rs.{product.price}
                </span>
                {isDiscounted && (
                  <span className="text-xl text-gray-400 line-through">
                    Rs.{originalPrice}
                  </span>
                )}
              </div>
              {product.discountPercentage && (
                <p className="text-sm text-green-600 font-semibold">
                  Save {Math.round(product.discountPercentage)}% on this item
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#004b61]">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            {(product.category || product.weight || product.dimensions) && (
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-[#004b61]">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.category && (
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold text-[#004b61] capitalize">{product.category}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold text-[#004b61]">{product.weight}g</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector and Actions */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#004b61]">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-2 text-[#004b61] hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-2 text-[#004b61] hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="space-y-3 pt-4">
                <div onClick={(e) => e.preventDefault()}>
                  <Button
                    text="Add To Cart"
                    product={product}
                    quantity={quantity}
                  />
                </div>
                <Link href="/checkout" className="block">
                  <button className="w-full bg-[#004b61] text-white font-bold py-3 px-4 rounded-md uppercase tracking-widest text-xs hover:bg-[#003a47] transition-all">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg">✓</span>
                <span>Free shipping on orders over Rs.2000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg">✓</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg">✓</span>
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-[#004b61] mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#004b61]">{review.reviewerName}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-[#ff4c60]">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
