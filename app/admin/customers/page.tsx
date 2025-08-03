'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/customers/list');
  }, [router]);

  return null;
}