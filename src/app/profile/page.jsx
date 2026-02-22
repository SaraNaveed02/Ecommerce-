"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { IoArrowBack } from 'react-icons/io5'
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md'

export default function Profile() {
  const router = useRouter()
  const { user, updateProfile, logout, addAddress, updateAddress, deleteAddress } = useUser()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Read URL param on client side to avoid CSR bailout during prerender
    try {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab) setActiveTab(tab)
    } catch (e) {
      // window may be undefined during SSR; ignore safely
    }
    
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    })
  }, [user, router])

  const handleEditProfile = () => {
    updateProfile(editData)
    setIsEditing(false)
  }

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
      alert('Please fill in all required fields')
      return
    }
    
    if (editingAddressId) {
      updateAddress(editingAddressId, newAddress)
      setEditingAddressId(null)
    } else {
      addAddress(newAddress)
    }
    
    setNewAddress({
      type: 'home',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    })
    setShowAddressForm(false)
  }

  const handleEditAddress = (address) => {
    setNewAddress(address)
    setEditingAddressId(address.id)
    setShowAddressForm(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#004b61] mb-4">Loading...</h1>
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
          <span className="font-semibold">Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <h2 className="text-lg font-bold text-[#004b61]">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-pink-50 text-[#ff4c60] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Profile
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'orders'
                      ? 'bg-pink-50 text-[#ff4c60] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Orders
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-pink-50 text-[#ff4c60] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Addresses
                </button>

                <button
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-all mt-6"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#004b61]">My Profile</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-[#ff4c60] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e63f52] transition-all"
                    >
                      <MdEdit size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleEditProfile}
                        className="bg-[#ff4c60] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#e63f52] transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="border-2 border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:border-gray-400 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">First Name</p>
                        <p className="text-lg font-semibold text-[#004b61]">{user.firstName}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Name</p>
                        <p className="text-lg font-semibold text-[#004b61]">{user.lastName}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-lg font-semibold text-[#004b61]">{user.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="text-lg font-semibold text-[#004b61]">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#004b61] mb-6">My Orders</h2>

                {user.orderHistory && user.orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.orderHistory.map((order) => (
                      <div key={order.orderId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-[#004b61]">Order #{order.orderId}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {order.status || 'Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Items</p>
                            <p className="font-semibold text-[#004b61]">{order.items?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-semibold text-[#ff4c60]">Rs.{order.total?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-semibold text-[#004b61]">{order.paymentMethod || 'N/A'}</p>
                          </div>
                        </div>

                        <Link href={`/order-summary`}>
                          <button className="text-[#ff4c60] font-semibold hover:text-[#e63f52]">
                            View Details →
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
                    <Link href="/">
                      <button className="bg-[#ff4c60] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#e63f52] transition-all">
                        Start Shopping
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#004b61]">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true)
                        setEditingAddressId(null)
                        setNewAddress({
                          type: 'home',
                          fullName: '',
                          phone: '',
                          address: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          country: '',
                          isDefault: false,
                        })
                      }}
                      className="flex items-center gap-2 bg-[#ff4c60] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e63f52] transition-all"
                    >
                      <MdAdd size={18} />
                      Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="mb-6 p-6 border-2 border-pink-200 rounded-lg bg-pink-50">
                    <h3 className="text-lg font-bold text-[#004b61] mb-4">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm font-semibold text-[#004b61]">
                          Set as default address
                        </label>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={handleAddAddress}
                          className="bg-[#ff4c60] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#e63f52] transition-all"
                        >
                          {editingAddressId ? 'Update' : 'Save'} Address
                        </button>
                        <button
                          onClick={() => {
                            setShowAddressForm(false)
                            setEditingAddressId(null)
                          }}
                          className="border-2 border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:border-gray-400 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        {address.isDefault && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                            Default
                          </span>
                        )}
                        <p className="font-bold text-[#004b61] capitalize mb-2">{address.type} Address</p>
                        <p className="text-sm text-gray-700 mb-1">{address.fullName}</p>
                        <p className="text-sm text-gray-700 mb-1">{address.address}</p>
                        <p className="text-sm text-gray-700 mb-4">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">{address.phone}</p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-all"
                          >
                            <MdEdit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAddress(address.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-100 transition-all"
                          >
                            <MdDelete size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !showAddressForm && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg mb-4">No saved addresses yet</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="bg-[#ff4c60] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#e63f52] transition-all inline-flex items-center gap-2"
                      >
                        <MdAdd size={18} />
                        Add Your First Address
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
