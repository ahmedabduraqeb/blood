export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: 'sales_rep' | 'manager';
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  website: string;
  productName: string;
  price: number;
  quantity: number;
  link: string;
  image?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OrderCalculations {
  subtotal: number;
  totalItems: number;
  commission: number;
  netTotal: number;
  payNow: number;
  payOnDelivery: number;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  logo: string;
}
