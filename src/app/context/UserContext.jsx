"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  const addAddress = (address) => {
    const addresses = user?.addresses || []
    const newAddresses = [...addresses, { ...address, id: Date.now() }]
    updateProfile({ addresses: newAddresses })
  }

  const updateAddress = (addressId, updatedAddress) => {
    const addresses = user?.addresses || []
    const newAddresses = addresses.map(addr => 
      addr.id === addressId ? { ...addr, ...updatedAddress } : addr
    )
    updateProfile({ addresses: newAddresses })
  }

  const deleteAddress = (addressId) => {
    const addresses = user?.addresses || []
    const newAddresses = addresses.filter(addr => addr.id !== addressId)
    updateProfile({ addresses: newAddresses })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
