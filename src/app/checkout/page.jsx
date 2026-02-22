"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import { IoArrowBack } from 'react-icons/io5'

export default function Checkout() {
  const { cartItems, getTotalPrice, getTotalItems } = useCart()
  const router = useRouter()
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Shipping Info
    sameAsShipping: true,
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: '',

    // Payment Info
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }))
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2)
    }
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }))
  }

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 3) value = value.slice(0, 3)
    setFormData(prev => ({
      ...prev,
      cvv: value
    }))
  }

  const validateBillingInfo = () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } = formData
    return firstName && lastName && email && phone && address && city && state && zipCode && country
  }

  const validateShippingInfo = () => {
    if (formData.sameAsShipping) return true
    const { shippingFirstName, shippingLastName, shippingAddress, shippingCity, shippingState, shippingZipCode, shippingCountry } = formData
    return shippingFirstName && shippingLastName && shippingAddress && shippingCity && shippingState && shippingZipCode && shippingCountry
  }

  const validatePaymentInfo = () => {
    if (paymentMethod === 'cash-on-delivery') {
      return true
    }
    // For credit card
    const { cardName, cardNumber, expiryDate, cvv } = formData
    return cardName && cardNumber.replace(/\s/g, '').length === 16 && expiryDate && cvv.length === 3
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !validateBillingInfo()) {
      alert('Please fill in all billing information')
      return
    }
    if (currentStep === 2 && !validateShippingInfo()) {
      alert('Please fill in all shipping information')
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    if (!validatePaymentInfo()) {
      alert('Please fill in valid payment information')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Create order object
      const order = {
        orderId: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString(),
        items: cartItems,
        billingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        shippingInfo: formData.sameAsShipping ? 
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          } : 
          {
            firstName: formData.shippingFirstName,
            lastName: formData.shippingLastName,
            address: formData.shippingAddress,
            city: formData.shippingCity,
            state: formData.shippingState,
            zipCode: formData.shippingZipCode,
            country: formData.shippingCountry,
          },
        subtotal: parseFloat(getTotalPrice()),
        tax: parseFloat((getTotalPrice() * 0.17).toFixed(2)),
        shipping: 0,
        total: parseFloat((parseFloat(getTotalPrice()) + parseFloat(getTotalPrice()) * 0.17).toFixed(2)),
        paymentMethod: paymentMethod === 'credit-card' ? 'Credit Card' : 'Cash on Delivery',
      }

      // Save order to localStorage
      localStorage.setItem('lastOrder', JSON.stringify(order))
      
      // Clear the cart
      localStorage.removeItem('cart')

      setIsProcessing(false)

      // Redirect to order summary
      router.push('/order-summary')
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-[#004b61] mb-4">Cart is Empty</h1>
          <p className="text-gray-600 text-lg mb-8">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/">
            <button className="bg-[#ff4c60] text-white font-bold py-3 px-10 rounded-md uppercase tracking-widest hover:bg-[#e63f52] transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = parseFloat(getTotalPrice())
  const tax = parseFloat((subtotal * 0.17).toFixed(2))
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/cart" className="flex items-center gap-2 text-[#004b61] hover:text-[#ff4c60] transition mb-8">
          <IoArrowBack size={20} />
          <span className="font-semibold">Back to Cart</span>
        </Link>

        <h1 className="text-4xl font-bold text-[#004b61] mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step <= currentStep
                    ? 'bg-[#ff4c60] text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    step < currentStep ? 'bg-[#ff4c60]' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {/* Step 1: Billing Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#004b61] mb-6">Billing Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#004b61] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#004b61] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#004b61] mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#004b61] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#004b61] mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                      placeholder="United States"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#004b61] mb-6">Shipping Information</h2>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-semibold text-[#004b61]">
                      Same as billing address
                    </label>
                  </div>

                  {!formData.sameAsShipping && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="shippingFirstName"
                            value={formData.shippingFirstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="John"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="shippingLastName"
                            value={formData.shippingLastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="New York"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="shippingState"
                            value={formData.shippingState}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="NY"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="shippingZipCode"
                            value={formData.shippingZipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="shippingCountry"
                          value={formData.shippingCountry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          placeholder="United States"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#004b61] mb-6">Payment Method</h2>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    {/* Credit Card Option */}
                    <div
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'credit-card'
                          ? 'border-[#ff4c60] bg-pink-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={paymentMethod === 'credit-card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-[#004b61]">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, or other cards</p>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                      onClick={() => setPaymentMethod('cash-on-delivery')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cash-on-delivery'
                          ? 'border-[#ff4c60] bg-pink-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash-on-delivery"
                          checked={paymentMethod === 'cash-on-delivery'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-[#004b61]">Cash on Delivery (COD)</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Card Form - Show only when credit card is selected */}
                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-[#004b61]">Card Details</h3>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#004b61] mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#004b61] mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleCVVChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60]"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          ℹ️ This is a demo checkout. Use any test card number (e.g., 4111 1111 1111 1111) for testing purposes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COD Info - Show only when COD is selected */}
                  {paymentMethod === 'cash-on-delivery' && (
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                      <h3 className="font-bold text-green-900 mb-3">Cash on Delivery Details</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                          <span className="font-bold">✓</span>
                          <span>You will pay the full amount when your order arrives</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">✓</span>
                          <span>Our delivery partner will contact you before delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">✓</span>
                          <span>You can inspect the products before making payment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">✓</span>
                          <span>Please have exact or close amount ready for faster transactions</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-[#004b61] font-bold rounded-lg hover:border-gray-400 transition-all"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="ml-auto px-6 py-3 bg-[#ff4c60] text-white font-bold rounded-lg hover:bg-[#e63f52] transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="ml-auto px-6 py-3 bg-[#ff4c60] text-white font-bold rounded-lg hover:bg-[#e63f52] transition-all disabled:bg-gray-400"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 space-y-6">
              <h2 className="text-2xl font-bold text-[#004b61]">Order Summary</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start gap-3 pb-3 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-[#004b61] text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#e34252] text-sm whitespace-nowrap">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax (17%)</span>
                  <span>Rs.{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-[#004b61] border-t border-gray-200 pt-4">
                <span>Total</span>
                <span className="text-[#ff4c60]">Rs.{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
