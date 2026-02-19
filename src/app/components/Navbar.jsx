"use client"
import React from 'react'
import { useState, useEffect } from "react"

import { ChevronDown, Menu, X, Search, User, ShoppingBag } from "lucide-react"

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [brand, setBrand] = useState([])

  // Brand names
  useEffect(() => {
    const getBrandName = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products")
        const data = await res.json()
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

          <Search size={22} />
        </div>

        {/* LEFT (Desktop) */}
        <div className="hidden lg:flex gap-8 items-center font-medium tracking-wide ">
          <Search size={20} />
          <a className="relative cursor-pointer 
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

          {/* Brands Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("brand")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex realtive items-center gap-1 cursor-pointer transition-colors duration-300 hover:text-blue-950 after:left-0
    after:absolute    after:-bottom-1 after:h-[2px] after:w-0 after:transition-all after:bg-blue-950
  after:duration-300 hover:after:w-full ">
              BRANDS <ChevronDown size={16} />
            </button>

            {openMenu === "brand" && (
              <div className="absolute top-full  left-0 bg-pink-500 w-72 p-6 space-y-3 shadow-xl max-h-96 overflow-y-auto">
                {brand.map((item, i) => (
                  <p key={i} className="cursor-pointer hover:underline top-3">
                    {item}
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
            <a className="relative cursor-pointer text-white transition-colors duration-300 hover:text-blue-950
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:transition-all 
   after:bg-blue-950
  after:duration-300 hover:after:w-full">ACCESSORIES</a>
            <a className="relative cursor-pointer text-white transition-colors duration-300 hover:text-blue-950
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:transition-all 
   after:bg-blue-950
  after:duration-300 hover:after:w-full">MAKEUP</a>
            <User size={20} className=' hover:text-blue-950' />
          </div>

          {/* Cart Icon (Mobile + Desktop) */}
          <div className="relative hover:text-blue-950">
            <ShoppingBag size={22} />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
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
                setOpenMenu(openMenu === "brand" ? null : "brand")
              }
              className="flex items-center justify-between w-full"
            >
              BRANDS <ChevronDown size={16} />
            </button>

            {openMenu === "brand" && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pl-2">
                {brand.map((item, i) => (
                  <p key={i} className="cursor-pointer">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>


          <p>ACCESSORIES</p>
          <p>MAKEUP</p>
        </div>
      )}
    </nav>

  )
}

export default Navbar
