'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';

interface OrdersListProps {
  onEdit: (order: Order) => void;
  refreshTrigger: number;
}

export default function OrdersList({ onEdit, refreshTrigger }: OrdersListProps) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, refreshTrigger]);

  const fetchOrders = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${currentUser.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    setDeletingId(orderId);
    try {
      const response = await fetch(`/api/orders?id=${orderId}&userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('An error occurred while deleting the order');
    } finally {
      setDeletingId(null);
    }
  };

  const calculateOrderTotal = (order: Order) => {
    const subtotal = order.price * order.quantity;
    const commission = subtotal * 0.1;
    const netTotal = subtotal - commission;
    return { subtotal, commission, netTotal };
  };

  const getTotalStats = () => {
    const totalOrders = orders.length;
    let totalAmount = 0;
    let totalCommission = 0;
    
    orders.forEach(order => {
      const { subtotal, commission } = calculateOrderTotal(order);
      totalAmount += subtotal;
      totalCommission += commission;
    });
    
    return {
      totalOrders,
      totalAmount,
      totalCommission,
      netAmount: totalAmount - totalCommission
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Amount</p>
          <p className="text-3xl font-bold">${stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Commission</p>
          <p className="text-3xl font-bold">${stats.totalCommission.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Net Amount</p>
          <p className="text-3xl font-bold">${stats.netAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">📋 My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start by adding your first order above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Net</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const { subtotal, commission, netTotal } = calculateOrderTotal(order);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {order.image && (
                            <img src={order.image} alt={order.productName} className="w-12 h-12 object-cover rounded-lg" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{order.productName}</p>
                            {order.notes && (
                              <p className="text-xs text-gray-500 mt-1">{order.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {order.website}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">${order.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${subtotal.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600">-${commission.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">${netTotal.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'approved' ? 'bg-green-100 text-green-800' :
                          order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'approved' ? '✓ Approved' :
                           order.status === 'rejected' ? '✗ Rejected' :
                           '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button
                            onClick={() => onEdit(order)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit Order"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            disabled={deletingId === order.id}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            title="Delete Order"
                          >
                            {deletingId === order.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
