'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products list as the default products page
    router.replace('/admin/products/list');
  }, [router]);

  return null;
}