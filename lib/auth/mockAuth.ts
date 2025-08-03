interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  password: string;
}

interface Customer {
  id: string;
  email: string;
  name: string;
  role: "customer";
  password: string;
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "admin@deniyaya.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

// Updated mock customer data to match mockData.ts
const mockcustomer: Customer[] = [
  {
    id: "1",
    email: "saman.perera@email.com",
    password: "customer123",
    name: "Saman Perera",
    role: "customer",
  },
  {
    id: "2",
    email: "kumari.silva@email.com",
    password: "customer123",
    name: "Kumari Silva",
    role: "customer",
  },
  {
    id: "3",
    email: "rajesh.fernando@email.com",
    password: "customer123",
    name: "Rajesh Fernando",
    role: "customer",
  },
  // Keep the original test account
  {
    id: "4",
    email: "customer@deniyaya.com",
    password: "customer123",
    name: "Test Customer",
    role: "customer",
  },
];

export async function signIn(
  email: string,
  password: string
): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
}

export async function signInCustomer(
  email: string,
  password: string
): Promise<Customer | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockcustomer.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminUser");
  }
}

export function signOutCustomer() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isCustomerAuthenticated");
    localStorage.removeItem("customerUser");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAdminAuthenticated") === "true";
  }
  return false;
}

export function isCustomerAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isCustomerAuthenticated") === "true";
  }
  return false;
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
}

export function getCustomerUser(): Customer | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("customerUser");
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
}
