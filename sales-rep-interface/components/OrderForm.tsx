'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order, OrderCalculations } from '@/types';
import WebsiteSelector from './WebsiteSelector';

interface OrderFormProps {
  editingOrder?: Order | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function OrderForm({ editingOrder, onSuccess, onCancel }: OrderFormProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    website: '',
    productName: '',
    price: '',
    quantity: '',
    link: '',
    image: '',
    notes: ''
  });
  const [calculations, setCalculations] = useState<OrderCalculations>({
    subtotal: 0,
    totalItems: 0,
    commission: 0,
    netTotal: 0,
    payNow: 0,
    payOnDelivery: 0
  });
  const [notification, setNotification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        website: editingOrder.website,
        productName: editingOrder.productName,
        price: editingOrder.price.toString(),
        quantity: editingOrder.quantity.toString(),
        link: editingOrder.link,
        image: editingOrder.image || '',
        notes: editingOrder.notes || ''
      });
    }
  }, [editingOrder]);

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    const subtotal = price * quantity;
    const commission = subtotal * 0.1;
    const netTotal = subtotal - commission;
    const payNow = netTotal / 2;
    const payOnDelivery = netTotal / 2;

    setCalculations({
      subtotal,
      totalItems: quantity,
      commission,
      netTotal,
      payNow,
      payOnDelivery
    });
  }, [formData.price, formData.quantity]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setNotification('Please log in to submit an order');
      return;
    }

    if (!formData.website || !formData.productName || !formData.price || !formData.quantity || !formData.link) {
      setNotification('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = '/api/orders';
      const method = editingOrder ? 'PUT' : 'POST';
      const body = {
        ...formData,
        userId: currentUser.id,
        ...(editingOrder && { id: editingOrder.id })
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setNotification(data.message || (editingOrder ? 'Order updated successfully!' : 'Order submitted successfully, waiting for management approval ✔'));
        setFormData({
          website: '',
          productName: '',
          price: '',
          quantity: '',
          link: '',
          image: '',
          notes: ''
        });
        setTimeout(() => {
          setNotification('');
          onSuccess();
        }, 2000);
      } else {
        setNotification(data.error || 'Failed to submit order');
      }
    } catch (error) {
      setNotification('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingOrder ? '✏️ Edit Order' : '➕ Add New Order'}
        </h2>
        {editingOrder && onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-lg ${
          notification.includes('success') || notification.includes('✔')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Website Selector */}
          <div className="md:col-span-2">
            <WebsiteSelector
              selectedWebsite={formData.website}
              onSelect={(website) => setFormData({ ...formData, website })}
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="e.g., Moisturizing Cream / Perfume / Device"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price per Item <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200" />
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Calculations Display */}
        {(formData.price && formData.quantity) && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Order Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                <p className="text-xl font-bold text-gray-900">${calculations.subtotal.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Total Items</p>
                <p className="text-xl font-bold text-gray-900">{calculations.totalItems}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Commission (10%)</p>
                <p className="text-xl font-bold text-red-600">-${calculations.commission.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Net Total</p>
                <p className="text-xl font-bold text-green-600">${calculations.netTotal.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Pay Now (50%)</p>
                <p className="text-xl font-bold text-blue-600">${calculations.payNow.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">On Delivery (50%)</p>
                <p className="text-xl font-bold text-purple-600">${calculations.payOnDelivery.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? 'Submitting...' : (editingOrder ? 'Update Order' : 'Submit Order')}
        </button>
      </form>
    </div>
  );
}
