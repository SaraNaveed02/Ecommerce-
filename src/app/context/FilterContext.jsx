"use client"
import React, { createContext, useContext, useState } from 'react'

const FilterContext = createContext()

export const FilterProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <FilterContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider')
  }
  return context
}
