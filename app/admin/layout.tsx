'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import Sidebar from '@/components/admin/Sidebar';
import Icon from '@/components/admin/Icon';
import { signOut, getUser } from '@/lib/auth/mockAuth';
import { UserRole } from '@/types/entities';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignInPage = pathname === '/admin/signin';
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isSignInPage) {
      const currentUser = getUser();
      setUser(currentUser);
    }
  }, [isSignInPage]);

  const handleSignOut = () => {
    signOut();
    router.push('/admin/signin');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isSignInPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          userRole={user?.role || UserRole.Staff}
        />

        {/* Main content area - removed lg:ml-64 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation bar */}
          <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-green-100 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Icon name="menu" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Breadcrumb */}
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <div className="flex items-center">
                        <Icon name="home" className="h-4 w-4 text-gray-400" />
                        <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
                          {pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                {/* Notifications button */}
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                {/* Profile dropdown */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    {user && (
                      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                        <Icon name="user" className="h-4 w-4 text-green-500" />
                        <span>Welcome, {user.name}</span>
                      </div>
                    )}
                    <button 
                      onClick={handleSignOut}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-amber-50 py-8">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}