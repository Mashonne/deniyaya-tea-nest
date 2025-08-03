"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface TeaProduct {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<TeaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate product loading
  useEffect(() => {
    const mockProducts: TeaProduct[] = [
      {
        id: 1,
        name: "Ceylon Black Tea",
        type: "Black Tea",
        price: 12.99,
        description: "Premium high-grown Ceylon black tea with rich flavor",
        image: "/tea1.jpg",
        inStock: true,
      },
      {
        id: 2,
        name: "Green Tea Supreme",
        type: "Green Tea",
        price: 15.99,
        description: "Fresh green tea leaves with delicate aroma",
        image: "/tea2.jpg",
        inStock: true,
      },
      {
        id: 3,
        name: "Herbal Chamomile",
        type: "Herbal Tea",
        price: 9.99,
        description: "Soothing chamomile blend for relaxation",
        image: "/tea3.jpg",
        inStock: false,
      },
      {
        id: 4,
        name: "Earl Grey Classic",
        type: "Flavored Black Tea",
        price: 13.99,
        description: "Traditional Earl Grey with bergamot oil",
        image: "/tea4.jpg",
        inStock: true,
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Navigation Banner */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">
                Deniyaya Tea Factory
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-gray-600 hover:text-green-600 transition"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-green-600 transition"
              >
                About
              </a>
              <a
                href="#products"
                className="text-gray-600 hover:text-green-600 transition"
              >
                Products
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-green-600 transition"
              >
                Contact
              </a>
              <a
                href="/admin/signin"
                className="text-gray-600 hover:text-green-600 transition"
              >
                Admin
              </a>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Order Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-amber-900/80"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Premium Ceylon Tea
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            From the misty hills of Deniyaya, Sri Lanka - Experience the finest
            tea tradition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
              Explore Our Collection
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-900 transition">
              Learn Our Story
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For generations, our family has been crafting the finest Ceylon
              tea in the heart of Deniyaya, where the perfect climate and rich
              soil create tea leaves of exceptional quality.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organic Farming</h3>
              <p className="text-gray-600">
                We use only the finest organic methods to grow our tea leaves
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Altitude</h3>
              <p className="text-gray-600">
                Our tea gardens are located at optimal elevations for premium
                quality
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Tradition</h3>
              <p className="text-gray-600">
                Passed down through generations of tea masters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Premium Collection
            </h2>
            <p className="text-xl text-gray-600">
              Discover our handpicked selection of the finest Ceylon teas
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-green-200 to-amber-200 flex items-center justify-center">
                    <span className="text-4xl">🍃</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {product.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                          product.inStock
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Tea Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The Ceylon Black Tea is absolutely divine! Rich flavor and
                perfect aroma."
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "We serve Deniyaya tea in our restaurant. Our customers love the
                quality!"
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Emma Davis</h4>
                  <p className="text-sm text-gray-600">Health Coach</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The green tea is perfect for my morning routine. Fresh and
                energizing!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-green-100">
              Ready to experience the finest Ceylon tea?
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-green-100">
                      Deniyaya, Mirissa, Sri Lanka
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-green-100">+94 41 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">✉️</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-green-100">info@deniyayatea.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-green-800 text-white placeholder-green-200 border border-green-700 focus:outline-none focus:border-green-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-green-800 text-white placeholder-green-200 border border-green-700 focus:outline-none focus:border-green-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-green-800 text-white placeholder-green-200 border border-green-700 focus:outline-none focus:border-green-500"
                ></textarea>
                <button className="w-full bg-white text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p>&copy; 2024 Deniyaya Tea Factory. All rights reserved.</p>
              <p className="text-gray-400 mt-2">
                Crafting the finest Ceylon tea since 1950
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a
                href="/admin/signin"
                className="text-gray-400 hover:text-white transition text-sm"
              >
                Staff Login
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
