"use client"
import { useCart } from '../context/CartContext'
import Link from 'next/link'
import { IoArrowBack } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004b61] mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 text-lg mb-8">Looks like you haven't added anything yet!</p>
          <Link href="/">
            <button className="bg-[#ff4c60] text-white font-bold py-3 px-10 rounded-md uppercase tracking-widest hover:bg-[#e63f52] transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-[#004b61] hover:text-[#ff4c60] transition mb-8">
          <IoArrowBack size={20} />
          <span className="font-semibold">Continue Shopping</span>
        </Link>

        <h1 className="text-4xl font-bold text-[#004b61] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="bg-white rounded-lg shadow-sm p-6 flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-[#f3f3f3] rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-bold text-[#004b61] hover:text-[#ff4c60] transition line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 capitalize mt-1">{item.category}</p>
                  <p className="text-lg font-bold text-[#e34252] mt-2">
                    Rs.{item.price}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-[#e34252] transition p-1"
                  >
                    <MdClose size={24} />
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-[#004b61] hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-10 text-center py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-[#004b61] hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="font-bold text-[#004b61]">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 space-y-6">
              <h2 className="text-2xl font-bold text-[#004b61]">Order Summary</h2>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>Rs.{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>Rs.{(getTotalPrice() * 0.17).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-[#004b61]">
                <span>Total</span>
                <span className="text-[#ff4c60]">Rs.{(parseFloat(getTotalPrice()) + parseFloat(getTotalPrice()) * 0.17).toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <button className="w-full bg-[#ff4c60] text-white font-bold py-3 px-4 rounded-md uppercase tracking-widest text-sm hover:bg-[#e63f52] transition-all">
                    Proceed to Checkout
                  </button>
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md uppercase tracking-widest text-sm hover:border-gray-400 transition-all"
                >
                  Clear Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Free Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>100% Original</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
