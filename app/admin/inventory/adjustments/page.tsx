'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductsDto } from '@/lib/data/mockData';
import Icon from '@/components/admin/Icon';

interface StockAdjustment {
  productId: number;
  currentStock: number;
  adjustment: number;
  reason: string;
  type: 'increase' | 'decrease';
}

export default function StockAdjustmentsPage() {
  const router = useRouter();
  const [products] = useState(getProductsDto());
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustment, setAdjustment] = useState<StockAdjustment>({
    productId: 0,
    currentStock: 0,
    adjustment: 0,
    reason: '',
    type: 'increase'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setAdjustment(prev => ({
        ...prev,
        productId: product.id,
        currentStock: product.quantityInStock
      }));
    }
  };

  const handleAdjustmentChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setAdjustment(prev => ({
      ...prev,
      adjustment: Math.abs(numValue)
    }));
  };

  const calculateNewStock = () => {
    if (adjustment.type === 'increase') {
      return adjustment.currentStock + adjustment.adjustment;
    } else {
      return Math.max(0, adjustment.currentStock - adjustment.adjustment);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || adjustment.adjustment === 0) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Stock adjustment:', adjustment);
      alert('Stock adjustment completed successfully!');
      
      // Reset form
      setSelectedProduct('');
      setAdjustment({
        productId: 0,
        currentStock: 0,
        adjustment: 0,
        reason: '',
        type: 'increase'
      });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Failed to adjust stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductData = products.find(p => p.id === parseInt(selectedProduct));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="chevron-right" className="h-5 w-5 transform rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Adjustments</h1>
            <p className="text-gray-600">Make corrections and adjustments to inventory levels</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Adjustment Form */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Make Stock Adjustment</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Selection */}
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                Select Product *
              </label>
              <select
                id="product"
                value={selectedProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Current: {product.quantityInStock} {product.unit}
                  </option>
                ))}
              </select>
            </div>

            {selectedProductData && (
              <>
                {/* Current Stock Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedProductData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedProductData.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedProductData.quantityInStock} {selectedProductData.unit}
                      </div>
                      <div className="text-sm text-gray-500">Current Stock</div>
                    </div>
                  </div>
                </div>

                {/* Adjustment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAdjustment(prev => ({ ...prev, type: 'increase' }))}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        adjustment.type === 'increase'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon name="plus" className="h-5 w-5 mx-auto mb-1" />
                      Increase Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustment(prev => ({ ...prev, type: 'decrease' }))}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        adjustment.type === 'decrease'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon name="x" className="h-5 w-5 mx-auto mb-1" />
                      Decrease Stock
                    </button>
                  </div>
                </div>

                {/* Adjustment Amount */}
                <div>
                  <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Quantity *
                  </label>
                  <input
                    type="number"
                    id="adjustment"
                    min="1"
                    value={adjustment.adjustment || ''}
                    onChange={(e) => handleAdjustmentChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Enter quantity to adjust"
                    required
                  />
                </div>

                {/* New Stock Preview */}
                {adjustment.adjustment > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-700">
                        <strong>New Stock Level:</strong>
                      </div>
                      <div className="text-lg font-semibold text-blue-900">
                        {calculateNewStock()} {selectedProductData.unit}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {adjustment.type === 'increase' ? '+' : '-'}{adjustment.adjustment} {selectedProductData.unit}
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Adjustment *
                  </label>
                  <select
                    id="reason"
                    value={adjustment.reason}
                    onChange={(e) => setAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="inventory_count">Physical Inventory Count</option>
                    <option value="damaged_goods">Damaged Goods</option>
                    <option value="expired_stock">Expired Stock</option>
                    <option value="supplier_return">Supplier Return</option>
                    <option value="customer_return">Customer Return</option>
                    <option value="theft_loss">Theft/Loss</option>
                    <option value="production_adjustment">Production Adjustment</option>
                    <option value="system_error">System Error Correction</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedProduct || adjustment.adjustment === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Apply Stock Adjustment'
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder="Search products..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => {
                const isLowStock = product.quantityInStock <= product.reorderLevel;
                const isOutOfStock = product.quantityInStock === 0;
                
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product.id.toString())}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedProduct === product.id.toString()
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm">🍃</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-gray-900'
                        }`}>
                          {product.quantityInStock} {product.unit}
                        </div>
                        {isLowStock && (
                          <div className="text-xs text-yellow-600">Low Stock</div>
                        )}
                        {isOutOfStock && (
                          <div className="text-xs text-red-600">Out of Stock</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}