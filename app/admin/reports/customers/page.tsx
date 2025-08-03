'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getCustomersDto, getOrdersDto } from '@/lib/data/mockData';
import { OrderStatus } from '@/types/entities';
import Icon from '@/components/admin/Icon';

interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  repeatCustomerRate: number;
  churnRate: number;
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
  avgOrderValue: number;
  totalRevenue: number;
  color: string;
}

export default function CustomerAnalyticsPage() {
  const [customers] = useState(getCustomersDto());
  const [orders] = useState(getOrdersDto());
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');
  const [sortBy, setSortBy] = useState<'value' | 'orders' | 'recent'>('value');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const daysBack = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }, [orders, timeRange]);

  // Enhanced customer data with analytics
  const customerAnalytics = useMemo(() => {
    return customers.map(customer => {
      const customerOrders = filteredOrders.filter(order => order.customerName === customer.name);
      const totalOrders = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      
      const lastOrderDate = customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map(order => new Date(order.createdAt).getTime())))
        : null;
      
      const daysSinceLastOrder = lastOrderDate 
        ? Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      // Customer segments
      let segment = 'new';
      if (totalSpent > 100000) segment = 'vip';
      else if (totalSpent > 50000) segment = 'loyal';
      else if (totalOrders > 5) segment = 'regular';
      else if (totalOrders > 0) segment = 'active';
      
      // Risk assessment
      let riskLevel = 'low';
      if (daysSinceLastOrder && daysSinceLastOrder > 90) riskLevel = 'high';
      else if (daysSinceLastOrder && daysSinceLastOrder > 30) riskLevel = 'medium';
      
      return {
        ...customer,
        totalOrders,
        totalSpent,
        avgOrderValue,
        lastOrderDate,
        daysSinceLastOrder,
        segment,
        riskLevel,
        isActive: daysSinceLastOrder ? daysSinceLastOrder <= 30 : false,
        isNew: totalOrders <= 1,
        isReturning: totalOrders > 1
      };
    });
  }, [customers, filteredOrders]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...customerAnalytics].sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'recent':
          if (!a.lastOrderDate && !b.lastOrderDate) return 0;
          if (!a.lastOrderDate) return 1;
          if (!b.lastOrderDate) return -1;
          return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
        default:
          return 0;
      }
    });
  }, [customerAnalytics, sortBy]);

  // Calculate overall metrics
  const metrics: CustomerAnalytics = useMemo(() => {
    const totalCustomers = customerAnalytics.length;
    const activeCustomers = customerAnalytics.filter(c => c.isActive).length;
    const newCustomers = customerAnalytics.filter(c => c.isNew).length;
    const returningCustomers = customerAnalytics.filter(c => c.isReturning).length;
    
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrderCount = filteredOrders.length;
    const averageOrderValue = totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0;
    
    const customersWithOrders = customerAnalytics.filter(c => c.totalOrders > 0).length;
    const customerLifetimeValue = customersWithOrders > 0 ? totalRevenue / customersWithOrders : 0;
    
    const repeatCustomerRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
    const churnRate = totalCustomers > 0 ? ((totalCustomers - activeCustomers) / totalCustomers) * 100 : 0;

    return {
      totalCustomers,
      activeCustomers,
      newCustomers,
      returningCustomers,
      averageOrderValue,
      customerLifetimeValue,
      repeatCustomerRate,
      churnRate
    };
  }, [customerAnalytics, filteredOrders]);

  // Customer segments
  const customerSegments: CustomerSegment[] = useMemo(() => {
    const segments = [
      { id: 'vip', name: 'VIP Customers', description: 'Spent > LKR 100,000', color: 'from-purple-500 to-purple-600' },
      { id: 'loyal', name: 'Loyal Customers', description: 'Spent LKR 50,000 - 100,000', color: 'from-blue-500 to-blue-600' },
      { id: 'regular', name: 'Regular Customers', description: '5+ orders', color: 'from-green-500 to-green-600' },
      { id: 'active', name: 'Active Customers', description: '1-4 orders', color: 'from-yellow-500 to-yellow-600' },
      { id: 'new', name: 'New Customers', description: 'No orders yet', color: 'from-gray-500 to-gray-600' }
    ];

    return segments.map(segment => {
      const segmentCustomers = customerAnalytics.filter(c => c.segment === segment.id);
      const count = segmentCustomers.length;
      const percentage = metrics.totalCustomers > 0 ? (count / metrics.totalCustomers) * 100 : 0;
      const totalRevenue = segmentCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
      const avgOrderValue = count > 0 ? totalRevenue / segmentCustomers.reduce((sum, c) => sum + c.totalOrders, 0) : 0;

      return {
        ...segment,
        count,
        percentage,
        avgOrderValue: isNaN(avgOrderValue) ? 0 : avgOrderValue,
        totalRevenue
      };
    }).filter(segment => segment.count > 0);
  }, [customerAnalytics, metrics.totalCustomers]);

  const getSegmentBadge = (segment: string) => {
    const segmentColors = {
      vip: 'bg-purple-100 text-purple-800',
      loyal: 'bg-blue-100 text-blue-800',
      regular: 'bg-green-100 text-green-800',
      active: 'bg-yellow-100 text-yellow-800',
      new: 'bg-gray-100 text-gray-800'
    };
    
    const segmentLabels = {
      vip: 'VIP',
      loyal: 'Loyal',
      regular: 'Regular',
      active: 'Active',
      new: 'New'
    };

    return {
      color: segmentColors[segment as keyof typeof segmentColors] || 'bg-gray-100 text-gray-800',
      label: segmentLabels[segment as keyof typeof segmentLabels] || 'Unknown'
    };
  };

  const getRiskBadge = (riskLevel: string) => {
    const riskColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return {
      color: riskColors[riskLevel as keyof typeof riskColors] || 'bg-gray-100 text-gray-800',
      label: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)
    };
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Analytics</h1>
            <p className="text-gray-600">Customer behavior insights and segmentation analysis</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Customer Performance</h3>
          <div className="flex space-x-2">
            {[
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
              { value: '1y', label: 'Last Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as '30d' | '90d' | '1y')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  timeRange === range.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="users" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{metrics.totalCustomers}</h3>
              <p className="text-gray-600">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="user" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{metrics.activeCustomers}</h3>
              <p className="text-gray-600">Active Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-bar" className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.customerLifetimeValue)}</h3>
              <p className="text-gray-600">Avg Customer LTV</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-line" className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{metrics.repeatCustomerRate.toFixed(1)}%</h3>
              <p className="text-gray-600">Repeat Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerSegments.map((segment) => (
            <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{segment.name}</h4>
                <span className="text-sm text-gray-500">{segment.count} customers</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-medium">{segment.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium">{formatCurrency(segment.totalRevenue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${segment.color} h-2 rounded-full`}
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="user-plus" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-green-900">{metrics.newCustomers}</h3>
              <p className="text-green-700">New Customers</p>
              <p className="text-sm text-green-600 mt-1">
                {metrics.totalCustomers > 0 ? ((metrics.newCustomers / metrics.totalCustomers) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="users" className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-blue-900">{metrics.returningCustomers}</h3>
              <p className="text-blue-700">Returning Customers</p>
              <p className="text-sm text-blue-600 mt-1">
                {metrics.totalCustomers > 0 ? ((metrics.returningCustomers / metrics.totalCustomers) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="warning" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-red-900">{metrics.churnRate.toFixed(1)}%</h3>
              <p className="text-red-700">Churn Rate</p>
              <p className="text-sm text-red-600 mt-1">
                {metrics.totalCustomers - metrics.activeCustomers} inactive customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Customer Details</h3>
          <div className="flex space-x-2">
            {[
              { value: 'value', label: 'By Value' },
              { value: 'orders', label: 'By Orders' },
              { value: 'recent', label: 'By Recent Activity' }
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => setSortBy(sort.value as 'value' | 'orders' | 'recent')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  sortBy === sort.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Analysis ({sortedCustomers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.slice(0, 50).map((customer) => {
                const segmentBadge = getSegmentBadge(customer.segment);
                const riskBadge = getRiskBadge(customer.riskLevel);

                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-3">
                          <Icon name="user" className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email || customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.totalOrders > 0 ? formatCurrency(customer.avgOrderValue) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${segmentBadge.color}`}>
                        {segmentBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskBadge.color}`}>
                        {riskBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.lastOrderDate ? formatDate(customer.lastOrderDate.toISOString()) : 'Never'}
                      </div>
                      {customer.daysSinceLastOrder && (
                        <div className="text-sm text-gray-500">
                          {customer.daysSinceLastOrder} days ago
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded font-medium text-xs">
                          Contact
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

        {sortedCustomers.length === 0 && (
          <div className="text-center py-12">
            <Icon name="users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">No customer data available for the selected time range</p>
          </div>
        )}
      </div>
    </div>
  );
}