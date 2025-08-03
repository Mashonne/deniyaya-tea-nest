'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductsDto } from '@/lib/data/mockData';
import { TeaType } from '@/types/entities';
import Icon from '@/components/admin/Icon';

export default function LowStockProductsPage() {
  const [products] = useState(getProductsDto());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TeaType | 'all'>('all');

  const lowStockProducts = products.filter(product => {
    const isLowStock = product.quantityInStock <= product.reorderLevel;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return isLowStock && matchesSearch && matchesType;
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

  const getUrgencyLevel = (current: number, reorder: number) => {
    if (current === 0) return { label: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' };
    if (current <= reorder * 0.5) return { label: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Low Stock Products</h1>
            <p className="text-gray-600">Products that need restocking attention</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/products/add"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="plus" className="h-5 w-5" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/products/list"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="list" className="h-5 w-5" />
              <span>All Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-900">
                {products.filter(p => p.quantityInStock === 0).length}
              </h3>
              <p className="text-red-700">Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-900">
                {products.filter(p => p.quantityInStock > 0 && p.quantityInStock <= p.reorderLevel).length}
              </h3>
              <p className="text-yellow-700">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="list" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">
                {lowStockProducts.length}
              </h3>
              <p className="text-blue-700">Total Items Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
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
                placeholder="Search by product name..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tea Type Filter */}
          <div className="sm:w-48">
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
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Low Stock Products ({lowStockProducts.length})
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantityInStock, product.reorderLevel);
                const urgency = getUrgencyLevel(product.quantityInStock, product.reorderLevel);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl">🍃</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(product.price)} / {product.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {product.type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{product.quantityInStock} {product.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.reorderLevel} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs">
                          Restock
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

        {lowStockProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="cube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No low stock products</h3>
            <p className="text-gray-500 mb-4">All products are well stocked!</p>
            <Link
              href="/admin/products/list"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              <Icon name="list" className="h-4 w-4" />
              <span>View All Products</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}