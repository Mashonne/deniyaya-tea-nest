'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to orders list as the default orders page
    router.replace('/admin/orders/list');
  }, [router]);

  return null;
}