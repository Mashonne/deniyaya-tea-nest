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
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  }
  return false;
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
}