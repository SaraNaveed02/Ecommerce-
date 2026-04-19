"use client"
import React, { useEffect, useState } from 'react'
import SingleProduct from './Singleproduct'
import { useFilter } from '../context/FilterContext'

const FetchingData = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12); 
  const [skip, setSkip] = useState(0);

  const { selectedCategory, searchQuery, sortBy, setSortBy } = useFilter()

  const getData = async (currentSkip) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${currentSkip}`, 
        { cache: "no-store" }
      );
      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.products]);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    getData(0);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const loadMore = () => {
    const nextSkip = skip + limit;
    setSkip(nextSkip);
    getData(nextSkip);
  };

  if (loading && products.length === 0) {
    return <div className="text-center p-10">Loading Products...</div>;
  }

  const progressPercentage = (products.length / total) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-4 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-[14px] text-[#004b61] font-medium">Sort by:</label>
          <div className="relative border-b border-[#004b61] min-w-[140px]">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent w-full py-1 text-[14px] text-[#004b61] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            {/* Custom Down Arrow */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#004b61]">
              ⌄
            </span>
          </div>
        </div>
        
        <span className="text-[#004b61] text-[14px] font-medium sm:text-right">
          {filteredProducts.length} Products
        </span>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <SingleProduct key={item.id} product={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-[#004b61] text-lg font-medium">No products found</p>
          </div>
        )}
      </div>

      {/* Load More Section */}
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