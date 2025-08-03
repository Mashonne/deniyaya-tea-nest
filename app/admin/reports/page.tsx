'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getOrdersDto, getProductsDto, getCustomersDto } from '@/lib/data/mockData';
import Icon from '@/components/admin/Icon';

export default function ReportsPage() {
  const [orders] = useState(getOrdersDto());
  const [products] = useState(getProductsDto());
  const [customers] = useState(getCustomersDto());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Recent activity
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  const topSellingProducts = products
    .sort((a, b) => (b.quantityInStock * b.price) - (a.quantityInStock * a.price))
    .slice(0, 5);

  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Business insights and performance metrics</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Icon name="chart-line" className="h-5 w-5" />
              <span>Export All Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-line" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
              <p className="text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="shopping-bag" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
              <p className="text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="users" className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
              <p className="text-gray-600">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-bar" className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</h3>
              <p className="text-gray-600">Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/reports/sales"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Icon name="chart-line" className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Reports</h3>
          <p className="text-gray-600 mb-4">Revenue, orders, and sales performance analytics</p>
          <div className="flex items-center text-green-600 text-sm font-medium">
            <span>View Sales Reports</span>
            <Icon name="chevron-right" className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/reports/inventory"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Icon name="chart-bar" className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Reports</h3>
          <p className="text-gray-600 mb-4">Stock levels, movements, and inventory analytics</p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <span>View Inventory Reports</span>
            <Icon name="chevron-right" className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/reports/customers"
          className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <Icon name="users" className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Analytics</h3>
          <p className="text-gray-600 mb-4">Customer behavior, segmentation, and insights</p>
          <div className="flex items-center text-purple-600 text-sm font-medium">
            <span>View Customer Reports</span>
            <Icon name="chevron-right" className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/admin/orders/list" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    <div className="text-sm text-gray-500">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                    <div className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <Link href="/admin/products/list" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topSellingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🍃</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.type}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.quantityInStock} {product.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <Link href="/admin/customers/list" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Icon name="user" className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.totalOrders} orders</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}