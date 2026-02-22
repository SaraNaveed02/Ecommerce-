"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X, Search, User, ShoppingBag, LogOut } from "lucide-react"
import { useFilter } from '../context/FilterContext'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import Link from 'next/link'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [brand, setBrand] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const { setSelectedCategory, setSearchQuery } = useFilter()
  const { getTotalItems, cartItems, getTotalPrice, removeFromCart } = useCart()
  const { user, logout } = useUser()

  const categories = ['beauty', 'fragrances', 'furniture', 'groceries']

  // Brand names
  useEffect(() => {
    const getBrandName = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products")
        const data = await res.json()
        const category = [...new Set(data.products.map(product => product.category))]
        console.log(category)
        const uniqueData = [
          ...new Set(data.products.map(product => product.brand))
        ]
        setBrand(uniqueData)
      } catch (error) {
        console.error("error fethcing brand nanme", error)
      }
    }
    getBrandName()
  }, [])


  return (
    <nav className="bg-pink-500 text-white   z-80 top-0 sticky ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">

        {/* LEFT (Mobile) */}
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="relative">
            <input 
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setSearchQuery(e.target.value)
              }}
              className="bg-white text-gray-800 rounded px-3 py-2 text-xs w-32 focus:outline-none"
            />
            <Search size={16} className="absolute right-2 top-2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* LEFT (Desktop) */}
        <div className="hidden lg:flex gap-8 items-center font-medium tracking-wide ">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setSearchQuery(e.target.value)
              }}
              className="bg-white text-gray-800 rounded px-3 py-2 text-sm w-48 focus:outline-none"
            />
            <Search size={20} className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />
          </div>
          
          <a href='/' className="relative cursor-pointer 
text-white 
transition-colors duration-300
hover:text-blue-950
after:absolute after:left-0 after:-bottom-1
after:h-[2px] after:w-0
after:bg-blue-950
after:transition-all after:duration-300
hover:after:w-full">SHOP ALL</a>
          <a className="relative cursor-pointer text-white transition-colors duration-300 hover:text-blue-950
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:transition-all 
   after:bg-blue-950
  after:duration-300 hover:after:w-full">SHOP BUNDLES</a>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("category")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex realtive items-center gap-1 cursor-pointer transition-colors duration-300 hover:text-blue-950 after:left-0
    after:absolute    after:-bottom-1 after:h-[2px] after:w-0 after:transition-all after:bg-blue-950
  after:duration-300 hover:after:w-full ">
              CATEGORIES <ChevronDown size={16} />
            </button>

            {openMenu === "category" && (
              <div className="absolute top-full  left-0 bg-pink-500 w-72 p-6 space-y-3 shadow-xl max-h-96 overflow-y-auto">
                <p 
                  onClick={() => {
                    setSelectedCategory('')
                    setOpenMenu(null)
                  }}
                  className="cursor-pointer hover:underline text-white capitalize font-semibold"
                >
                  All Products
                </p>
                {categories.map((category, i) => (
                  <p 
                    key={i} 
                    onClick={() => {
                      setSelectedCategory(category)
                      setOpenMenu(null)
                    }}
                    className="cursor-pointer hover:underline text-white capitalize hover:font-semibold"
                  >
                    {category}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER LOGO */}
        <h1 className="text-2xl md:text-4xl font-normal font-fredoka tracking-tighter  uppercase">
          <span
            className="text-white relative"
            style={{
              textShadow: '0 0 10px rgba(255, 76, 96, 0.8), 0 0 20px rgba(255, 76, 96, 0.4)',
              WebkitTextStroke: '1px #ff4c60'
            }}
          >
            FUN
          </span>
          DAMENTALS
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-4 lg:gap-8 font-medium">

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-8 items-center ">
            <User size={20} className=' hover:text-blue-950' />
          </div>

          {/* Cart Icon (Mobile + Desktop) */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative hover:text-blue-950 cursor-pointer"
          >
            <ShoppingBag size={22} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Cart Sidebar Overlay */}
        {cartOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setCartOpen(false)}
          />
        )}

        {/* Cart Sidebar */}
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-40 transition-transform duration-300 overflow-y-auto ${
            cartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#004b61]">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex gap-3 pb-4 border-b border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 bg-[#f3f3f3] rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#004b61] text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-[#e34252] font-bold text-sm mt-1">
                          Rs.{item.price}
                        </p>
                        <div className="flex gap-2 items-center mt-2">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-[#ff4c60] hover:text-[#e63f52] font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-bold text-[#004b61] text-sm">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and Checkout */}
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#004b61]">Subtotal:</span>
                    <span className="font-bold text-[#ff4c60]">
                      Rs.{getTotalPrice()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Tax and shipping calculated at checkout
                  </p>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <Link href="/checkout" onClick={() => setCartOpen(false)}>
                      <button className="w-full bg-[#ff4c60] text-white font-bold py-3 rounded-md hover:bg-[#e63f52] transition-all">
                        Checkout
                      </button>
                    </Link>

                    <Link href="/cart" onClick={() => setCartOpen(false)}>
                      <button className="w-full border-2 border-[#004b61] text-[#004b61] font-bold py-3 rounded-md hover:bg-[#004b61] hover:text-white transition-all">
                        View Cart
                      </button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* Empty Cart */
              <div className="flex flex-col items-center justify-center h-96">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-600 text-center font-semibold mb-4">
                  Your cart is empty
                </p>
                <Link href="/" onClick={() => setCartOpen(false)}>
                  <button className="bg-[#ff4c60] text-white font-bold py-2 px-6 rounded-md hover:bg-[#e63f52] transition-all">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {mobileOpen && (
        <div className="lg:hidden h-screen bg-pink-600 p-6 space-y-4 text-white">
          <p>SHOP ALL</p>
          <p>SHOP BUNDLES</p>

          <div>
            <button
              onClick={() =>
                setOpenMenu(openMenu === "category" ? null : "category")
              }
              className="flex items-center justify-between w-full"
            >
              CATEGORIES <ChevronDown size={16} />
            </button>

            {openMenu === "category" && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pl-2">
                <p 
                  onClick={() => {
                    setSelectedCategory('')
                    setOpenMenu(null)
                  }}
                  className="cursor-pointer capitalize"
                >
                  All Products
                </p>
                {categories.map((category, i) => (
                  <p 
                    key={i} 
                    onClick={() => {
                      setSelectedCategory(category)
                      setOpenMenu(null)
                    }}
                    className="cursor-pointer capitalize"
                  >
                    {category}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>

  )
}

export default Navbar
