import React, { act, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import NavBar from '../components/NavBar';
import Filters from '../components/Filters';
const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState();
  const [activeChecked, setActiveChecked] = useState(false)
  const [maxPrice, setMaxPrice] = useState(0)
  const [minPrice, setMinPrice] = useState(0)
  useEffect(() => {
    getProducts();

  }, [searchQuery, selectedCategory, activeChecked, minPrice, maxPrice])

  const getProducts = async () => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== 0) params.category = selectedCategory;
    if (activeChecked) params.is_active = activeChecked;
    if (minPrice) params.price__gte = minPrice;
    if (maxPrice) params.price__lte = maxPrice;
    const response = await api.get('product/', { params });
    setProducts(response.data)    
  }

  return (

    <div className="min-h-screen bg-gray-100">

      <NavBar
        search_needed={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Filters
        activeChecked={activeChecked}
        selectedCategory={selectedCategory}
        setActiveChecked={setActiveChecked}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}

        </div>
      </main>
    </div>
  );
};

export default Landing;