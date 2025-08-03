'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from '@/components/admin/Icon';

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  customerType: z.enum(['Individual', 'Business']).default('Individual'),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: 'Individual',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Customer data:', data);
      
      // Show success message (you could use a toast library here)
      alert('Customer added successfully!');
      
      // Reset form or redirect
      router.push('/admin/customers/list');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Customer</h1>
            <p className="text-gray-600">Add a new customer to your database</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Customer Type */}
            <div>
              <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Type *
              </label>
              <select
                {...register('customerType')}
                id="customerType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
              >
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
              </select>
              {errors.customerType && (
                <p className="mt-1 text-sm text-red-600">{errors.customerType.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., +94 77 123 4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                {...register('address')}
                type="text"
                id="address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., 123 Main Street"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                {...register('city')}
                type="text"
                id="city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., Colombo"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                {...register('postalCode')}
                type="text"
                id="postalCode"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., 00100"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                id="notes"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Any additional notes about the customer..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
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
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}