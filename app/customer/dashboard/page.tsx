"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Customer, Feedback, TeaType } from "@/types/entities";
import { mockProducts, mockCustomers, mockFeedback } from "@/lib/data/mockData";
import { signOutCustomer } from "@/lib/auth/mockAuth";

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  role: "customer";
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isCustomerAuthenticated");
    const customerUserStr = localStorage.getItem("customerUser");

    if (!isAuthenticated || !customerUserStr) {
      router.push("/customer/signin");
      return;
    }

    const customerUser: CustomerUser = JSON.parse(customerUserStr);

    // Load customer details from mockCustomers
    const customerData = mockCustomers.find(
      (c) => c.email === customerUser.email
    );

    if (customerData) {
      setCustomer(customerData);
    } else {
      // If customer not found in mockCustomers, create a basic customer object
      setCustomer({
        id: customerUser.id,
        name: customerUser.name,
        email: customerUser.email,
        phone: "Not provided",
        address: "Not provided",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isDeleted: false,
      });
    }

    // Load products
    setProducts(mockProducts.filter((p) => p.isActive && !p.isDeleted));

    // Load customer reviews - use customerUser.id to match with feedback
    const customerReviews = mockFeedback.filter(
      (f) => f.customerId === customerUser.id
    );
    setReviews(customerReviews);

    setIsLoading(false);
  }, [router]);

  const handleAddReview = (product: Product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct || !customer) return;

    const newReview: Feedback = {
      id: Date.now().toString(),
      customerId: customer.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isDeleted: false,
    };

    setReviews([...reviews, newReview]);
    setShowReviewModal(false);
    setReviewForm({ rating: 5, comment: "" });
    setSelectedProduct(null);
  };

  const handleSignOut = () => {
    signOutCustomer();
    router.push("/customer/signin");
  };

  const getTeaTypeColor = (type: TeaType) => {
    const colors = {
      [TeaType.BlackTea]: "bg-gray-800",
      [TeaType.GreenTea]: "bg-green-600",
      [TeaType.WhiteTea]: "bg-gray-300",
      [TeaType.HerbalTea]: "bg-purple-600",
      [TeaType.OolongTea]: "bg-orange-600",
      [TeaType.FlavoredTea]: "bg-pink-600",
      [TeaType.Other]: "bg-blue-600",
    };
    return colors[type] || "bg-gray-600";
  };

  const handleSubmitOrder = () => {

  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {customer?.name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{customer?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{customer?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg text-gray-900">
                {customer?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg text-gray-900">
                {customer?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Your Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">
              You haven't written any reviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Product Review
                    </h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Available for Review */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Products Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const hasReviewed = reviews.some((r) => r.id === product.id);
              return (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs text-white rounded-full ${getTeaTypeColor(
                          product.type
                        )}`}
                      >
                        {product.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleSubmitOrder()}
                        className="flex-1 w-fit px-3 py-2 text-white bg-green-600 rounded-md absolute top-0 right-0">
                        Place Order
                      </button>
                      {hasReviewed ? (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddReview(product)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                        >
                          Add Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Review for {selectedProduct.name}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${star <= reviewForm.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReview}
                disabled={!reviewForm.comment.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
