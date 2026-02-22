"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdCheckCircle } from 'react-icons/md'
import { FiDownload, FiPrinter } from 'react-icons/fi'

export default function OrderSummary() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder')
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Simple PDF download simulation
    alert('PDF download feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#004b61]">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-[#004b61] mb-4">No Order Found</h1>
          <p className="text-gray-600 text-lg mb-8">Please complete a purchase to view your order summary.</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center mb-8">
          <div className="flex justify-center mb-6">
            <MdCheckCircle size={80} className="text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004b61] mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-2xl font-bold text-[#ff4c60] mb-2">
            {order.orderId}
          </p>
          <p className="text-gray-500">Order placed on {order.date}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#004b61] text-[#004b61] font-bold rounded-lg hover:bg-[#004b61] hover:text-white transition-all"
          >
            <FiPrinter size={20} />
            Print Order
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#ff4c60] text-[#ff4c60] font-bold rounded-lg hover:bg-[#ff4c60] hover:text-white transition-all"
          >
            <FiDownload size={20} />
            Download Invoice
          </button>
        </div>

        <div className="print:hidden">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#004b61] mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-20 h-20 flex-shrink-0 bg-[#f3f3f3] rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#004b61] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mb-2">{item.category}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-600">
                          Qty: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: <span className="font-semibold">Rs.{item.price}</span>
                        </p>
                      </div>
                      <p className="font-bold text-[#ff4c60] text-lg">
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Billing Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#004b61] mb-6">Billing Address</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">
                {order.billingInfo.firstName} {order.billingInfo.lastName}
              </p>
              <p>{order.billingInfo.address}</p>
              <p>
                {order.billingInfo.city}, {order.billingInfo.state} {order.billingInfo.zipCode}
              </p>
              <p>{order.billingInfo.country}</p>
              <p className="pt-2 border-t border-gray-200">
                <span className="text-gray-500">Email: </span>
                {order.billingInfo.email}
              </p>
              <p>
                <span className="text-gray-500">Phone: </span>
                {order.billingInfo.phone}
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#004b61] mb-6">Shipping Address</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
              <p>{order.shippingInfo.country}</p>
              <p className="pt-4 border-t border-gray-200 mt-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  ✓ Order will be shipped to this address
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#004b61] mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span className="font-semibold">Rs.{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Tax (17%)</span>
              <span className="font-semibold">Rs.{order.tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-[#004b61]">Total</span>
            <span className="text-3xl font-bold text-[#ff4c60]">Rs.{order.total.toFixed(2)}</span>
          </div>

          <div className={`p-4 rounded-lg ${
            order.paymentMethod === 'Cash on Delivery'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Payment Method: </span>
              <span className={order.paymentMethod === 'Cash on Delivery' ? 'text-blue-700 font-semibold' : ''}>
                {order.paymentMethod}
              </span>
            </p>
            {order.paymentMethod === 'Cash on Delivery' && (
              <p className="text-sm text-blue-700 mt-2">
                ℹ️ Please keep the exact or close amount ready when our delivery partner arrives
              </p>
            )}
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Order Status: </span>
              <span className="text-green-600 font-semibold">✓ Confirmed</span>
            </p>
          </div>
        </div>

        {/* Shipping Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#004b61] mb-6">Estimated Delivery Timeline</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
                <div className="w-1 h-12 bg-gray-300 my-2"></div>
              </div>
              <div>
                <p className="font-bold text-[#004b61]">Order Confirmed</p>
                <p className="text-sm text-gray-500">Today - Your order has been confirmed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">→</div>
                <div className="w-1 h-12 bg-gray-300 my-2"></div>
              </div>
              <div>
                <p className="font-bold text-[#004b61]">Processing</p>
                <p className="text-sm text-gray-500">1-2 days - Your order is being processed</p>
              </div>
            </div>

            {order.paymentMethod === 'Cash on Delivery' && (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center">→</div>
                  <div className="w-1 h-12 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <p className="font-bold text-[#004b61]">Awaiting Payment</p>
                  <p className="text-sm text-gray-500">2-3 days - Ready for delivery with payment collection</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">→</div>
                <div className="w-1 h-12 bg-gray-300 my-2"></div>
              </div>
              <div>
                <p className="font-bold text-[#004b61]">Shipped</p>
                <p className="text-sm text-gray-500">{order.paymentMethod === 'Cash on Delivery' ? '3-5' : '3-5'} days - Your order has been shipped</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">→</div>
              </div>
              <div>
                <p className="font-bold text-[#004b61]">Delivered</p>
                <p className="text-sm text-gray-500">5-7 days - Estimated delivery date</p>
                {order.paymentMethod === 'Cash on Delivery' && (
                  <p className="text-xs text-orange-600 mt-1">💰 Payment will be collected at delivery</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 md:p-8 mt-8">
          <h3 className="font-bold text-[#004b61] mb-2">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <button className="text-blue-600 font-bold hover:underline">
            Contact Customer Support →
          </button>
        </div>

        {/* Continue Shopping Button */}
        <div className="print:hidden mt-8 text-center">
          <Link href="/">
            <button className="bg-[#ff4c60] text-white font-bold py-3 px-10 rounded-md uppercase tracking-widest hover:bg-[#e63f52] transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
