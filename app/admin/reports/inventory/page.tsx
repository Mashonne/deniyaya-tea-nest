'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getProductsDto, getOrdersDto } from '@/lib/data/mockData';
import { TeaType } from '@/types/entities';
import Icon from '@/components/admin/Icon';

interface InventoryMetrics {
  totalProducts: number;
  totalStockValue: number;
  averageStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  fastMovingItems: number;
  slowMovingItems: number;
}

export default function InventoryReportsPage() {
  const [products] = useState(getProductsDto());
  const [orders] = useState(getOrdersDto());
  const [selectedCategory, setSelectedCategory] = useState<TeaType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'value' | 'turnover' | 'stock'>('value');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate product turnover rates
  const productTurnover = useMemo(() => {
    const turnoverMap = new Map();
    
    products.forEach(product => {
      const productOrders = orders.flatMap(order => 
        order.orderItems.filter(item => item.productName === product.name)
      );
      
      const totalSold = productOrders.reduce((sum, item) => sum + item.quantity, 0);
      const turnoverRate = product.quantityInStock > 0 ? totalSold / product.quantityInStock : 0;
      
      turnoverMap.set(product.id, {
        ...product,
        totalSold,
        turnoverRate,
        stockValue: product.quantityInStock * product.price,
        isLowStock: product.quantityInStock <= product.reorderLevel,
        isOutOfStock: product.quantityInStock === 0,
        isOverstock: product.quantityInStock > (product.reorderLevel * 3),
        isFastMoving: turnoverRate > 2,
        isSlowMoving: turnoverRate < 0.5
      });
    });
    
    return Array.from(turnoverMap.values());
  }, [products, orders]);

  // Filter by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return productTurnover;
    return productTurnover.filter(product => product.type === selectedCategory);
  }, [productTurnover, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.stockValue - a.stockValue;
        case 'turnover':
          return b.turnoverRate - a.turnoverRate;
        case 'stock':
          return b.quantityInStock - a.quantityInStock;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  // Calculate metrics
  const metrics: InventoryMetrics = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalStockValue = filteredProducts.reduce((sum, product) => sum + product.stockValue, 0);
    const averageStockValue = totalProducts > 0 ? totalStockValue / totalProducts : 0;
    const lowStockItems = filteredProducts.filter(product => product.isLowStock && !product.isOutOfStock).length;
    const outOfStockItems = filteredProducts.filter(product => product.isOutOfStock).length;
    const overstockItems = filteredProducts.filter(product => product.isOverstock).length;
    const fastMovingItems = filteredProducts.filter(product => product.isFastMoving).length;
    const slowMovingItems = filteredProducts.filter(product => product.isSlowMoving).length;

    return {
      totalProducts,
      totalStockValue,
      averageStockValue,
      lowStockItems,
      outOfStockItems,
      overstockItems,
      fastMovingItems,
      slowMovingItems
    };
  }, [filteredProducts]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    return Object.values(TeaType).map(type => {
      const categoryProducts = productTurnover.filter(p => p.type === type);
      const totalValue = categoryProducts.reduce((sum, p) => sum + p.stockValue, 0);
      const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantityInStock, 0);
      
      return {
        type,
        count: categoryProducts.length,
        value: totalValue,
        quantity: totalQuantity,
        percentage: metrics.totalStockValue > 0 ? (totalValue / metrics.totalStockValue) * 100 : 0
      };
    }).filter(category => category.count > 0);
  }, [productTurnover, metrics.totalStockValue]);

  const getStockStatus = (product: any) => {
    if (product.isOutOfStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (product.isLowStock) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (product.isOverstock) return { label: 'Overstock', color: 'bg-purple-100 text-purple-800' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const getTurnoverStatus = (turnoverRate: number) => {
    if (turnoverRate > 2) return { label: 'Fast Moving', color: 'bg-green-100 text-green-800' };
    if (turnoverRate < 0.5) return { label: 'Slow Moving', color: 'bg-red-100 text-red-800' };
    return { label: 'Normal', color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/admin/reports"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="chevron-right" className="h-5 w-5 transform rotate-180" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Reports</h1>
            <p className="text-gray-600">Stock analysis, turnover rates, and inventory insights</p>
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
              <h3 className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalStockValue)}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{metrics.lowStockItems + metrics.outOfStockItems}</h3>
              <p className="text-gray-600">Items Need Attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-line" className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{metrics.fastMovingItems}</h3>
              <p className="text-gray-600">Fast Moving Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-red-900">{metrics.outOfStockItems}</h3>
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
              <h3 className="text-2xl font-bold text-yellow-900">{metrics.lowStockItems}</h3>
              <p className="text-yellow-700">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="archive" className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-purple-900">{metrics.overstockItems}</h3>
              <p className="text-purple-700">Overstock</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="clock" className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-orange-900">{metrics.slowMovingItems}</h3>
              <p className="text-orange-700">Slow Moving</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((category) => (
            <div key={category.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  {category.type.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <span className="text-sm text-gray-500">{category.count} items</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium">{formatCurrency(category.value)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{category.quantity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {category.percentage.toFixed(1)}% of total value
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TeaType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="all">All Categories</option>
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
              onChange={(e) => setSortBy(e.target.value as 'value' | 'turnover' | 'stock')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="value">Stock Value</option>
              <option value="turnover">Turnover Rate</option>
              <option value="stock">Stock Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Detailed Product Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Product Analysis ({sortedProducts.length})
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
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnover Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const turnoverStatus = getTurnoverStatus(product.turnoverRate);

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
                      <div className="text-sm font-medium text-gray-900">
                        {product.quantityInStock} {product.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reorder: {product.reorderLevel} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.stockValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        @ {formatCurrency(product.price)}/{product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.turnoverRate.toFixed(2)}x
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.totalSold} sold
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${turnoverStatus.color}`}>
                        {turnoverStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href="/admin/inventory/adjustments"
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs"
                        >
                          Adjust
                        </Link>
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
            <Icon name="chart-bar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}