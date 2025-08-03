'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductsDto } from '@/lib/data/mockData';
import { TeaType } from '@/types/entities';
import Icon from '@/components/admin/Icon';

export default function InventoryOverviewPage() {
  const [products] = useState(getProductsDto());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TeaType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value'>('value');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return b.quantityInStock - a.quantityInStock;
      case 'value':
        return (b.quantityInStock * b.price) - (a.quantityInStock * a.price);
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStockStatus = (current: number, reorder: number) => {
    if (current === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (current <= reorder) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const getStockLevel = (current: number, reorder: number) => {
    const percentage = Math.min((current / (reorder * 2)) * 100, 100);
    let color = 'bg-green-500';
    
    if (current === 0) color = 'bg-red-500';
    else if (current <= reorder) color = 'bg-yellow-500';
    
    return { percentage, color };
  };

  const totalStockValue = sortedProducts.reduce((sum, product) => 
    sum + (product.quantityInStock * product.price), 0
  );

  const categoryBreakdown = Object.values(TeaType).map(type => {
    const categoryProducts = sortedProducts.filter(p => p.type === type);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.quantityInStock * p.price), 0);
    return {
      type,
      count: categoryProducts.length,
      value: totalValue,
      percentage: totalStockValue > 0 ? (totalValue / totalStockValue) * 100 : 0
    };
  }).filter(category => category.count > 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Overview</h1>
            <p className="text-gray-600">Detailed view of inventory levels and stock movements</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/inventory/adjustments"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="adjustments" className="h-5 w-5" />
              <span>Adjust Stock</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="chart-bar" className="h-5 w-5" />
              <span>Inventory Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="cube" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{sortedProducts.length}</h3>
              <p className="text-gray-600">Total Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-bar" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalStockValue)}</h3>
              <p className="text-gray-600">Total Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {sortedProducts.filter(p => p.quantityInStock <= p.reorderLevel && p.quantityInStock > 0).length}
              </h3>
              <p className="text-gray-600">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {sortedProducts.filter(p => p.quantityInStock === 0).length}
              </h3>
              <p className="text-gray-600">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((category) => (
            <div key={category.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {category.type.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <span className="text-sm text-gray-500">{category.count} items</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Value: {formatCurrency(category.value)}</span>
                  <span>{category.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Search by name..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tea Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Tea Type
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TeaType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="all">All Types</option>
              {Object.values(TeaType).map(type => (
                <option key={type} value={type}>
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'value')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="value">Stock Value</option>
              <option value="stock">Stock Quantity</option>
              <option value="name">Product Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Product Inventory ({sortedProducts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantityInStock, product.reorderLevel);
                const stockLevel = getStockLevel(product.quantityInStock, product.reorderLevel);
                const stockValue = product.quantityInStock * product.price;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">🍃</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {product.quantityInStock} {product.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reorder at: {product.reorderLevel} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${stockLevel.color}`}
                          style={{ width: `${stockLevel.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stockLevel.percentage.toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(stockValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs">
                          Adjust
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                          <Icon name="user" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="cube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}