'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/mockAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't check auth on signin page
    if (pathname === '/admin/signin') {
      setIsChecking(false);
      return;
    }

    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/admin/signin');
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking auth
  if (isChecking && pathname !== '/admin/signin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}