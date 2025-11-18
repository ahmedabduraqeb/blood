'use client';

import React, { useState } from 'react';
import { Website } from '@/types';

const POPULAR_WEBSITES: Website[] = [
  { id: '1', name: 'Shein', url: 'https://www.shein.com', logo: '🛍️' },
  { id: '2', name: 'Alibaba', url: 'https://www.alibaba.com', logo: '🏭' },
  { id: '3', name: 'Amazon', url: 'https://www.amazon.com', logo: '📦' },
  { id: '4', name: 'AliExpress', url: 'https://www.aliexpress.com', logo: '🛒' },
  { id: '5', name: 'eBay', url: 'https://www.ebay.com', logo: '🏪' },
  { id: '6', name: 'Etsy', url: 'https://www.etsy.com', logo: '🎨' },
];

interface WebsiteSelectorProps {
  selectedWebsite: string;
  onSelect: (website: string) => void;
}

export default function WebsiteSelector({ selectedWebsite, onSelect }: WebsiteSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredWebsites = POPULAR_WEBSITES.filter(website =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (websiteName: string) => {
    onSelect(websiteName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Website <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={selectedWebsite || searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!selectedWebsite) {
              onSelect(e.target.value);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or select a website..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-2">Popular Websites</p>
              {filteredWebsites.length > 0 ? (
                filteredWebsites.map(website => (
                  <button
                    key={website.id}
                    onClick={() => handleSelect(website.name)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="text-2xl">{website.logo}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{website.name}</p>
                      <p className="text-xs text-gray-500">{website.url}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  No websites found. Type to add custom website.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedWebsite && (
        <div className="mt-2 flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {selectedWebsite}
            <button
              onClick={() => {
                onSelect('');
                setSearchTerm('');
              }}
              className="ml-2 hover:text-blue-900"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
