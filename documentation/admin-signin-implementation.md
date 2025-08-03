# Admin Sign-In Implementation Guide

## Overview
This document outlines the implementation of the admin sign-in page using Next.js, TypeScript, and Tailwind CSS. The sign-in page will serve as the entry point for administrators to access the protected admin dashboard.

## Requirements
- Next.js with App Router
- TypeScript
- Tailwind CSS (already configured)
- Client-side form validation
- Redirect to admin dashboard after successful sign-in
- Mock authentication (backend not implemented yet)

## File Structure
```
app/
├── admin/
│   ├── signin/
│   │   └── page.tsx         # Sign-in page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard (protected)
│   └── layout.tsx           # Admin layout wrapper
├── components/
│   └── admin/
│       ├── SignInForm.tsx   # Sign-in form component
│       └── AuthGuard.tsx    # Route protection component
└── lib/
    └── auth/
        └── mockAuth.ts      # Mock authentication logic
```

## Implementation Steps

### 1. Create Sign-In Page Route
**File:** `app/admin/signin/page.tsx`

```typescript
import SignInForm from '@/components/admin/SignInForm';

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage Deniyaya Tea Nest
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
```

### 2. Sign-In Form Component
**File:** `components/admin/SignInForm.tsx`

#### Features:
- Email and password fields
- Form validation
- Loading state
- Error handling
- Remember me checkbox
- Redirect after sign-in

#### Component Structure:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      if (formData.email === 'admin@deniyaya.com' && formData.password === 'admin123') {
        // Store auth state (temporary)
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Tailwind CSS Styling

#### Sign-In Form Design:
```jsx
<form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
  {error && (
    <div className="rounded-md bg-red-50 p-4">
      <p className="text-sm text-red-800">{error}</p>
    </div>
  )}
  
  <div className="space-y-4">
    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="admin@example.com"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
    </div>

    {/* Password Input */}
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
    </div>
  </div>

  {/* Remember Me */}
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        checked={formData.rememberMe}
        onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        Remember me
      </label>
    </div>

    <div className="text-sm">
      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
        Forgot password?
      </a>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      'Sign in'
    )}
  </button>
</form>
```

### 4. Route Protection
**File:** `components/admin/AuthGuard.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    
    if (!isAuthenticated) {
      router.push('/admin/signin');
    }
  }, [router]);

  return <>{children}</>;
}
```

### 5. Admin Layout with Protection
**File:** `app/admin/layout.tsx`

```typescript
import AuthGuard from '@/components/admin/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        {/* Admin navigation header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Deniyaya Tea Nest Admin</h1>
              </div>
              <div className="flex items-center">
                <button className="text-gray-500 hover:text-gray-700">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
        {/* Main content */}
        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
```

### 6. Mock Authentication Logic
**File:** `lib/auth/mockAuth.ts`

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@deniyaya.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const
  }
];

export async function signIn(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export function signOut() {
  localStorage.removeItem('isAdminAuthenticated');
  localStorage.removeItem('adminUser');
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('isAdminAuthenticated') === 'true';
}
```

## Testing Credentials
For development and testing, use these credentials:
- **Email:** admin@deniyaya.com
- **Password:** admin123

## Security Considerations
1. **HTTPS Only**: Ensure the application runs over HTTPS in production
2. **Input Validation**: Validate email format and password requirements
3. **Rate Limiting**: Implement login attempt limits (when backend is ready)
4. **Session Management**: Implement proper session handling with backend
5. **CSRF Protection**: Add CSRF tokens when backend is implemented

## Future Enhancements
1. **Backend Integration**: Connect to real authentication API
2. **OAuth Support**: Add Google/Facebook sign-in
3. **Two-Factor Authentication**: Enhanced security
4. **Password Reset**: Email-based password recovery
5. **Session Timeout**: Auto-logout after inactivity
6. **Role-Based Access**: Different permissions for admin/staff

## UI/UX Best Practices
1. **Loading States**: Show spinner during authentication
2. **Error Messages**: Clear, user-friendly error messages
3. **Keyboard Navigation**: Support Tab navigation
4. **Mobile Responsive**: Works on all device sizes
5. **Accessibility**: ARIA labels and keyboard support

## Implementation Checklist
- [ ] Create sign-in page route
- [ ] Build sign-in form component
- [ ] Add form validation
- [ ] Implement mock authentication
- [ ] Create auth guard component
- [ ] Set up protected routes
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Test redirect flow
- [ ] Add sign-out functionality