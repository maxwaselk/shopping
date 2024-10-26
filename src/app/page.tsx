"use client";
import { useState, useEffect } from 'react';

interface Product {
  name: string;
  isChecked: boolean;
}

export default function ShoppingList() {
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode === null ? userPrefersDark : JSON.parse(savedDarkMode);
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleAddProduct = () => {
    if (product.trim() && !products.some(p => p.name === product.trim())) {
      setProducts([...products, { name: product.trim(), isChecked: false }]);
      setProduct('');
      showNotification('Produkt został dodany!');
    } else if (products.some(p => p.name === product.trim())) {
      showNotification('Ten produkt już istnieje na liście!');
    }
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
    showNotification('Produkt został usunięty!');
  };

  const handleToggleProduct = (index: number) => {
    const newProducts = products.map((prod, i) => {
      if (i === index) {
        return { ...prod, isChecked: !prod.isChecked };
      }
      return prod;
    });
    setProducts(newProducts);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const showNotification = (message: string) => {
    const alert = document.createElement('div');
    alert.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg bg-green-500 text-white shadow-lg transition-opacity duration-300';
    alert.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 2700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProduct();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md mx-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Lista Zakupów
          </h1>
          <button 
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {darkMode ? '☀️ Jasny' : '🌙 Ciemny'}
          </button>
        </header>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Dodaj produkt"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
          />
          <button 
            onClick={handleAddProduct}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            Dodaj
          </button>
        </div>

        <ul className="space-y-2">
          {products.map((prod, index) => (
            <li 
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-all duration-200"
            >
              <span 
                onClick={() => handleToggleProduct(index)}
                className={`text-gray-800 dark:text-white cursor-pointer relative ${
                  prod.isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''
                } before:absolute before:bottom-1/2 before:left-0 before:w-0 before:h-0.5 before:bg-current ${
                  prod.isChecked ? 'before:w-full' : 'before:w-0'
                } before:transition-all before:duration-300 hover:text-gray-600 dark:hover:text-gray-300`}
              >
                {prod.name}
              </span>
              <button 
                onClick={() => handleRemoveProduct(index)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}