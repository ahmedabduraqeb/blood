import fs from 'fs';
import path from 'path';
import { Order, User } from '@/types';

const DB_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');

function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'sales_rep'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        role: 'sales_rep'
      },
      {
        id: '3',
        name: 'Admin Manager',
        email: 'admin@example.com',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        role: 'manager'
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

export function getOrders(): Order[] {
  ensureDbExists();
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveOrders(orders: Order[]): void {
  ensureDbExists();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function getUsers(): User[] {
  ensureDbExists();
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}
