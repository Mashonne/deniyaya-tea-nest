'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getOrdersDto, getProductsDto } from '@/lib/data/mockData';
import { OrderStatus } from '@/types/entities';
import Icon from '@/components/admin/Icon';

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

export default function SalesReportsPage() {
  const [orders] = useState(getOrdersDto());
  const [products] = useState(getProductsDto());
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue');

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
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }, [orders, timeRange]);

  // Calculate metrics
  const metrics: SalesMetrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = filteredOrders.filter(order => order.status === OrderStatus.Completed).length;
    const pendingOrders = filteredOrders.filter(order => order.status === OrderStatus.Pending).length;
    const cancelledOrders = filteredOrders.filter(order => order.status === OrderStatus.Cancelled).length;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completedOrders,
      pendingOrders,
      cancelledOrders
    };
  }, [filteredOrders]);

  // Calculate daily sales for the last 7 days
  const dailySales = useMemo(() => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      });
    }
    
    return last7Days;
  }, [filteredOrders]);

  // Calculate product performance
  const productPerformance = useMemo(() => {
    const productSales = new Map();
    
    filteredOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const product = products.find(p => p.name === item.productName);
        if (product) {
          const existing = productSales.get(product.id) || {
            name: product.name,
            type: product.type,
            quantity: 0,
            revenue: 0,
            orders: 0
          };
          
          existing.quantity += item.quantity;
          existing.revenue += item.totalPrice;
          existing.orders += 1;
          
          productSales.set(product.id, existing);
        }
      });
    });
    
    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders, products]);

  // Calculate customer performance
  const customerPerformance = useMemo(() => {
    const customerSales = new Map();
    
    filteredOrders.forEach(order => {
      // Use order ID as customer identifier since customerName might not be unique
      const customerId = order.customerName || order.id;
      const existing = customerSales.get(customerId) || {
        name: order.customerName || 'Unknown Customer',
        orders: 0,
        revenue: 0,
        lastOrder: order.createdAt
      };
      
      existing.orders += 1;
      existing.revenue += order.totalAmount;
      if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
        existing.lastOrder = order.createdAt;
      }
      
      customerSales.set(customerId, existing);
    });
    
    return Array.from(customerSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  const maxDailyRevenue = Math.max(...dailySales.map(day => day.revenue));

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Reports</h1>
            <p className="text-gray-600">Revenue analysis and sales performance metrics</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Sales Performance</h3>
          <div className="flex space-x-2">
            {[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
              { value: '1y', label: 'Last Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as '7d' | '30d' | '90d' | '1y')}
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
              <Icon name="chart-line" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</h3>
              <p className="text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="chart-bar" className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageOrderValue)}</h3>
              <p className="text-gray-600">Avg Order Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="users" className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{new Set(filteredOrders.map(o => o.customerId)).size}</h3>
              <p className="text-gray-600">Unique Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="user" className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-green-900">{metrics.completedOrders}</h3>
              <p className="text-green-700">Completed Orders</p>
              <p className="text-sm text-green-600 mt-1">
                {metrics.totalOrders > 0 ? ((metrics.completedOrders / metrics.totalOrders) * 100).toFixed(1) : 0}% completion rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="clock" className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-yellow-900">{metrics.pendingOrders}</h3>
              <p className="text-yellow-700">Pending Orders</p>
              <p className="text-sm text-yellow-600 mt-1">
                {metrics.totalOrders > 0 ? ((metrics.pendingOrders / metrics.totalOrders) * 100).toFixed(1) : 0}% pending
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon name="x" className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-red-900">{metrics.cancelledOrders}</h3>
              <p className="text-red-700">Cancelled Orders</p>
              <p className="text-sm text-red-600 mt-1">
                {metrics.totalOrders > 0 ? ((metrics.cancelledOrders / metrics.totalOrders) * 100).toFixed(1) : 0}% cancelled
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Sales Chart (Last 7 Days) */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Sales (Last 7 Days)</h3>
        <div className="space-y-4">
          {dailySales.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4 w-24">
                <span className="text-sm font-medium text-gray-700">{day.date}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0}%` }}
                  >
                    {day.revenue > 0 && (
                      <span className="text-white text-xs font-medium">{formatCurrency(day.revenue)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm text-gray-600">{day.orders} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🍃</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className="text-sm text-gray-500">{product.quantity} units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers by Revenue</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {customerPerformance.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Icon name="user" className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(customer.revenue)}</div>
                    <div className="text-sm text-gray-500">Last: {formatDate(customer.lastOrder)}</div>
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