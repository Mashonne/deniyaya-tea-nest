'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getOrdersDto } from '@/lib/data/mockData';
import { OrderStatus } from '@/types/entities';
import Icon from '@/components/admin/Icon';

export default function PendingOrdersPage() {
  const [orders] = useState(getOrdersDto());
  const [searchTerm, setSearchTerm] = useState('');

  const pendingOrders = orders.filter(order => 
    order.status === OrderStatus.Pending &&
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toString().includes(searchTerm))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Processing:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.Shipped:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.Delivered:
        return 'bg-green-100 text-green-800';
      case OrderStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLevel = (orderDate: string, totalAmount: number) => {
    const daysSinceOrder = Math.floor((Date.now() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceOrder >= 3 || totalAmount >= 50000) {
      return { label: 'High', color: 'text-red-600 bg-red-50 border-red-200' };
    } else if (daysSinceOrder >= 1 || totalAmount >= 20000) {
      return { label: 'Medium', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    }
    return { label: 'Normal', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  const handleStatusUpdate = (orderId: number, newStatus: OrderStatus) => {
    // This would typically make an API call
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Orders</h1>
            <p className="text-gray-600">Orders waiting for processing and fulfillment</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/orders/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="plus" className="h-5 w-5" />
              <span>New Order</span>
            </Link>
            <Link
              href="/admin/orders/list"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="list" className="h-5 w-5" />
              <span>All Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="clock" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-900">
                {pendingOrders.length}
              </h3>
              <p className="text-yellow-700">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-900">
                {pendingOrders.filter(order => 
                  Math.floor((Date.now() - new Date(order.orderDate).getTime()) / (1000 * 60 * 60 * 24)) >= 3
                ).length}
              </h3>
              <p className="text-red-700">Urgent (3+ days)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="shopping-bag" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">
                {pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0) / 1000}K
              </h3>
              <p className="text-blue-700">Total Value (LKR)</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="users" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-900">
                {new Set(pendingOrders.map(order => order.customerId)).size}
              </h3>
              <p className="text-green-700">Unique Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
            placeholder="Search orders by customer name or order ID..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Orders ({pendingOrders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
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
              {pendingOrders.map((order) => {
                const priority = getPriorityLevel(order.orderDate, order.totalAmount);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-3">
                          <Icon name="shopping-bag" className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(order.id, OrderStatus.Processing)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs"
                        >
                          Process
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                          <Icon name="user" className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded">
                          <Icon name="cog" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pendingOrders.length === 0 && (
          <div className="text-center py-12">
            <Icon name="clock" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending orders</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No orders match your search criteria' : 'All orders have been processed!'}
            </p>
            <div className="flex justify-center space-x-3">
              <Link
                href="/admin/orders/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <Icon name="plus" className="h-4 w-4" />
                <span>Create Order</span>
              </Link>
              <Link
                href="/admin/orders/list"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                <Icon name="list" className="h-4 w-4" />
                <span>View All Orders</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}