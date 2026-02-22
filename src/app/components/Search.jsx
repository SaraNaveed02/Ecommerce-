"use client"
import { useEffect, useState } from "react"
import SingleProduct from "../productsSection/Singleproduct"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://dummyjson.com/products")
      const data = await res.json()

      setProducts(data.products)

      const uniqueCategories = [
        ...new Set(data.products.map(p => p.category))
      ]

      setCategories(uniqueCategories)
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Category Dropdown */}
      

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <SingleProduct key={product.id} product={product} />
        ))}
      </div>

    </div>
  )
}

export default ProductsPage