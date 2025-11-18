'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import OrderForm from '@/components/OrderForm';
import OrdersList from '@/components/OrdersList';
import { Order } from '@/types';

export default function Home() {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderSuccess = () => {
    setEditingOrder(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderForm 
          editingOrder={editingOrder}
          onSuccess={handleOrderSuccess}
          onCancel={handleCancelEdit}
        />
        
        <OrdersList 
          onEdit={handleEdit}
          refreshTrigger={refreshTrigger}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 OrderHub Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
