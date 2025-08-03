'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getOrdersDto } from '@/lib/data/mockData';
import { OrderStatus } from '@/types/entities';
import Icon from '@/components/admin/Icon';

export default function OrdersListPage() {
  const [orders] = useState(getOrdersDto());
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = orders.filter(order => {
    return filterStatus === 'all' || order.status === filterStatus;
  });

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

  const getStatusCounts = () => {
    return {
      all: orders.length,
      [OrderStatus.Pending]: orders.filter(o => o.status === OrderStatus.Pending).length,
      [OrderStatus.Processing]: orders.filter(o => o.status === OrderStatus.Processing).length,
      [OrderStatus.Completed]: orders.filter(o => o.status === OrderStatus.Completed).length,
      [OrderStatus.Cancelled]: orders.filter(o => o.status === OrderStatus.Cancelled).length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage customer orders and track order status</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/orders/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="plus" className="h-5 w-5" />
              <span>New Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterStatus === 'all'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders ({statusCounts.all})
          </button>
          {Object.values(OrderStatus).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Orders ({filteredOrders.length})
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
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                        <Icon name="shopping-bag" className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        {order.notes && (
                          <div className="text-sm text-gray-500" title={order.notes}>
                            {order.notes.substring(0, 30)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customerName || 'Walk-in Customer'}
                    </div>
                    {order.customerPhone && (
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.orderItems.slice(0, 2).map(item => item.productName).join(', ')}
                      {order.orderItems.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                        <Icon name="user" className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                        <Icon name="cog" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Icon name="shopping-bag" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              {filterStatus === 'all' 
                ? 'No orders have been placed yet' 
                : `No ${filterStatus.toLowerCase()} orders found`
              }
            </p>
            <Link
              href="/admin/orders/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              <Icon name="plus" className="h-4 w-4" />
              <span>Create First Order</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}