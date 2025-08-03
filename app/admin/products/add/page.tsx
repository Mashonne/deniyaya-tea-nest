'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TeaType } from '@/types/entities';
import Icon from '@/components/admin/Icon';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  type: z.nativeEnum(TeaType),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantityInStock: z.number().min(0, 'Stock quantity cannot be negative'),
  reorderLevel: z.number().min(0, 'Reorder level cannot be negative'),
  unit: z.string().default('g'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'g',
      reorderLevel: 10,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Product data:', data);
      
      // Show success message (you could use a toast library here)
      alert('Product added successfully!');
      
      // Reset form or redirect
      router.push('/admin/products/list');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
            <p className="text-gray-600">Add a new tea product to your inventory</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., Ceylon Black Tea Premium"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Tea Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tea Type *
              </label>
              <select
                {...register('type')}
                id="type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
              >
                <option value="">Select tea type</option>
                {Object.values(TeaType).map(type => (
                  <option key={type} value={type}>
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                {...register('unit')}
                id="unit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (LKR) *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                id="price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="quantityInStock" className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock *
              </label>
              <input
                {...register('quantityInStock', { valueAsNumber: true })}
                type="number"
                id="quantityInStock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="0"
              />
              {errors.quantityInStock && (
                <p className="mt-1 text-sm text-red-600">{errors.quantityInStock.message}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div>
              <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level
              </label>
              <input
                {...register('reorderLevel', { valueAsNumber: true })}
                type="number"
                id="reorderLevel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="10"
              />
              {errors.reorderLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.reorderLevel.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Describe the tea's flavor, origin, brewing instructions, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}