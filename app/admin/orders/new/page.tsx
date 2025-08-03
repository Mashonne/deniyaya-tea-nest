'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/admin/Icon';

export default function NewOrderPage() {
  const router = useRouter();

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Order</h1>
            <p className="text-gray-600">Create a new order for a customer</p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
        <Icon name="clock" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This feature is currently under development. You'll be able to create new orders here soon.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}