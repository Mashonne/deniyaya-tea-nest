'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductsDto } from '@/lib/data/mockData';
import Icon from '@/components/admin/Icon';

export default function InventoryPage() {
  const [products] = useState(getProductsDto());

  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => sum + (product.quantityInStock * product.price), 0);
  const lowStockItems = products.filter(product => product.quantityInStock <= product.reorderLevel).length;
  const outOfStockItems = products.filter(product => product.quantityInStock === 0).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const topProducts = products
    .sort((a, b) => (b.quantityInStock * b.price) - (a.quantityInStock * a.price))
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600">Monitor and manage your tea inventory levels</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/inventory/adjustments"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="adjustments" className="h-5 w-5" />
              <span>Stock Adjustments</span>
            </Link>
            <Link
              href="/admin/products/add"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="plus" className="h-5 w-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="cube" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
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
              <p className="text-gray-600">Total Stock Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{lowStockItems}</h3>
              <p className="text-gray-600">Low Stock Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{outOfStockItems}</h3>
              <p className="text-gray-600">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/inventory/overview"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Overview</h3>
              <p className="text-gray-600">View detailed inventory levels and movements</p>
            </div>
            <Icon name="chart-bar" className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/inventory/adjustments"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Adjustments</h3>
              <p className="text-gray-600">Make corrections and adjustments to inventory</p>
            </div>
            <Icon name="adjustments" className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/inventory/low-stock"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Alerts</h3>
              <p className="text-gray-600">Monitor items that need restocking</p>
              {lowStockItems > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                  {lowStockItems} items need attention
                </span>
              )}
            </div>
            <Icon name="warning" className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Top Products by Value */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Products by Stock Value</h3>
            <Link
              href="/admin/products/list"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Quantity
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => {
                const stockValue = product.quantityInStock * product.price;
                const isLowStock = product.quantityInStock <= product.reorderLevel;
                const isOutOfStock = product.quantityInStock === 0;
                
                let statusColor = 'bg-green-100 text-green-800';
                let statusLabel = 'In Stock';
                
                if (isOutOfStock) {
                  statusColor = 'bg-red-100 text-red-800';
                  statusLabel = 'Out of Stock';
                } else if (isLowStock) {
                  statusColor = 'bg-yellow-100 text-yellow-800';
                  statusLabel = 'Low Stock';
                }

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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantityInStock} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(stockValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}