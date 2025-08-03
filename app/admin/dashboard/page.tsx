'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth/mockAuth';
import { 
  mockDashboardStats, 
  mockLowStockItems, 
  mockRecentOrders 
} from '@/lib/data/mockData';
import { OrderStatus } from '@/types/entities';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Processing:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.Completed:
        return 'bg-green-100 text-green-800';
      case OrderStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your tea shop's performance and operations</p>
      </div>
      
      {user && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white/90">Welcome back,</p>
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm text-white/80 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Products Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-2xl font-bold text-gray-900">{mockDashboardStats.totalProducts}</dd>
                  <dd className="text-xs text-green-600 font-medium">Active inventory</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-amber-100 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd className="text-2xl font-bold text-gray-900">{mockDashboardStats.lowStockItems}</dd>
                  <dd className="text-xs text-amber-600 font-medium">Need reorder</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Orders Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Orders</dt>
                  <dd className="text-2xl font-bold text-gray-900">{mockDashboardStats.todayOrders}</dd>
                  <dd className="text-xs text-blue-600 font-medium">New orders</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Revenue</dt>
                  <dd className="text-2xl font-bold text-gray-900">{formatCurrency(mockDashboardStats.todayRevenue)}</dd>
                  <dd className="text-xs text-green-600 font-medium">Sales today</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Low Stock Items */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {mockLowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-lg">🍃</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-amber-700 font-medium">{item.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-800">
                      {item.currentStock} / {item.reorderLevel} min
                    </p>
                    <p className="text-xs text-amber-600 font-medium">Reorder needed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName || 'Walk-in Customer'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="group bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Product</span>
            </div>
          </button>
          <button className="group bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold border-2 border-green-200 hover:border-green-300 hover:bg-green-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>View Orders</span>
            </div>
          </button>
          <button className="group bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold border-2 border-green-200 hover:border-green-300 hover:bg-green-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Reports</span>
            </div>
          </button>
          <button className="group bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold border-2 border-green-200 hover:border-green-300 hover:bg-green-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Inventory</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}