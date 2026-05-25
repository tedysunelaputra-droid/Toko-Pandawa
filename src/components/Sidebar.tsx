/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Fuel, 
  Leaf, 
  Menu, 
  X 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpenMobile, 
  setIsOpenMobile 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'barang', name: 'Data Barang', icon: Package },
    { id: 'transaksi', name: 'Input Transaksi', icon: ShoppingCart },
    { id: 'bensin', name: 'Penjualan Bensin', icon: Fuel },
    { id: 'beras', name: 'Penjualan Beras', icon: Leaf },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`
          fixed top-[64px] bottom-0 left-0 z-40 w-64 border-r border-orange-500/20 bg-orange-600 text-white transition-transform duration-300 md:translate-x-0 md:static md:h-[calc(100vh-64px)] shadow-xl
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full py-6 px-4 justify-between">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all text-sm cursor-pointer
                    ${isActive 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-white hover:bg-orange-500 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-orange-100'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>


        </div>
      </aside>
    </>
  );
}
