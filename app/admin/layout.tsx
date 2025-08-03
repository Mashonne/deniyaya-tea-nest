'use client';

import { useRouter, usePathname } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import { signOut } from '@/lib/auth/mockAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignInPage = pathname === '/admin/signin';

  const handleSignOut = () => {
    signOut();
    router.push('/admin/signin');
  };

  return (
    <AuthGuard>
      {isSignInPage ? (
        // Sign-in page doesn't need the admin layout wrapper
        children
      ) : (
        // Other admin pages get the full layout
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
          {/* Admin navigation header */}
          <nav className="bg-white shadow-lg border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Deniyaya Tea Nest</h1>
                      <p className="text-xs text-green-600 font-medium">Admin Dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Welcome, Admin</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </nav>
          {/* Main content */}
          <main className="py-8">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthGuard>
  );
}