"use client";
import { useState, useEffect } from 'react';

interface Product {
  name: string;
  isChecked: boolean;
}

type ThemeMode = 'light' | 'dark' | 'auto';

export default function ShoppingList() {
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [darkMode, setDarkMode] = useState(false);

  // Inicjalizacja trybu i produktów z localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    }

    // Dodaj listener dla zmian preferencji systemowych
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (themeMode === 'auto') {
        setDarkMode(e.matches);
        updateThemeClass(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aktualizuj localStorage przy zmianie produktów
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Obsługa zmiany trybu
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    
    if (themeMode === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      updateThemeClass(isDark);
    } else {
      setDarkMode(themeMode === 'dark');
      updateThemeClass(themeMode === 'dark');
    }
  }, [themeMode]);

  const updateThemeClass = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const cycleThemeMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
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

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return (
          <svg className="h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        );
      case 'auto':
        return (
          <svg className="h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,22c5.523,0 10,-4.477 10,-10s-4.477,-10 -10,-10s-10,4.477 -10,10s4.477,10 10,10Zm0,-1.5v-17c4.694,0 8.5,3.806 8.5,8.5c0,4.694 -3.806,8.5 -8.5,8.5Z" />
          </svg>
        );
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
            onClick={cycleThemeMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="text-gray-800 dark:text-white">
              {getThemeIcon()}
            </div>
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