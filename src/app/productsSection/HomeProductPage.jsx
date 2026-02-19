"use client"
import React, { useEffect, useState } from 'react'
import SingleProduct from './Singleproduct'

const FetchingData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  // Ek baar mein kitne products dikhane hain
  const [limit] = useState(12); 
  // Kitne products skip karne hain (Next batch ke liye)
  const [skip, setSkip] = useState(0);

  const getData = async (currentSkip) => {
    try {
      // API call with limit and skip for pagination
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${currentSkip}`, 
        { cache: "no-store" }
      );
      const data = await response.json();
      
      // Purane products ke saath naye products add karna
      setProducts(prev => [...prev, ...data.products]);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(0);
  }, []);

  const loadMore = () => {
    const nextSkip = skip + limit;
    setSkip(nextSkip);
    getData(nextSkip);
  };

  if (loading && products.length === 0) {
    return <div className="text-center p-10">Loading Products...</div>;
  }

  // Progress bar percentage calculate karna (Image 3 ke liye)
  const progressPercentage = (products.length / total) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header Section */}
   {/* Header Section - Exactly as per image_7e6784 */}
<div className="flex justify-end items-center border-b border-gray-100 pb-4 mb-10 gap-8">
  <div className="flex items-center gap-3">
    <label className="text-[14px] text-[#004b61] font-medium">Sort by:</label>
    <div className="relative border-b border-[#004b61] min-w-[140px]">
      <select className="appearance-none bg-transparent w-full py-1 text-[14px] text-[#004b61] font-semibold focus:outline-none cursor-pointer">
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
      {/* Custom Down Arrow */}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#004b61]">
        ⌄
      </span>
    </div>
  </div>
  
  <span className="text-[#004b61] text-[14px] font-medium">
    {total} Products
  </span>
</div>
      {/* Responsive Grid */}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((item) => (
          <SingleProduct key={item.id} product={item} />
        ))}
      </div>

      {/* Load More Section (Image 3 Design) */}
      {products.length < total && (
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="w-full max-w-md text-center">
            <p className="text-[#004b61] text-lg mb-4 font-medium">
              You've viewed {products.length} of {total} products
            </p>
            {/* Progress Bar Container */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#004b61] h-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={loadMore}
            className="border-2 border-[#ff4c60] text-[#ff4c60] hover:bg-[#ff4c60] hover:text-white font-bold py-3 px-10 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default FetchingData;