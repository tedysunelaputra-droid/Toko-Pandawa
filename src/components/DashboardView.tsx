/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Box, 
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Transaksi, Barang } from '../types';

interface DashboardViewProps {
  transaksi: Transaksi[];
  barang: Barang[];
  onDeleteTransaksi?: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function DashboardView({ 
  transaksi, 
  barang, 
  onDeleteTransaksi,
  selectedDate,
  setSelectedDate
}: DashboardViewProps) {
  const [showAllDates, setShowAllDates] = useState(false);

  // Helper to format currency
  const formatRupiah = (val: number | null) => {
    if (val === null) return '-';
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // Filter transactions
  const filteredTransaksi = showAllDates
    ? transaksi
    : transaksi.filter((t) => t.tanggal === selectedDate);

  // Calculate statistics based on filtered list
  const totalKeuntunganKotor = filteredTransaksi
    .filter((t) => t.jenis === 'Terjual')
    .reduce((sum, t) => sum + (t.totalPenjualan || 0), 0);

  const totalKeuntunganBersih = filteredTransaksi
    .filter((t) => t.jenis === 'Terjual')
    .reduce((sum, t) => sum + (t.keuntungan || 0), 0);

  const totalBarangTerjual = filteredTransaksi
    .filter((t) => t.jenis === 'Terjual')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalBarangMasuk = filteredTransaksi
    .filter((t) => t.jenis === 'Masuk')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalModalTerjual = filteredTransaksi
    .filter((t) => t.jenis === 'Terjual')
    .reduce((sum, t) => sum + (t.totalModal || 0), 0);

  // Human readable date formatting logic for title (e.g., "04 April 2026")
  const formatIndoDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parts[2];
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${day} ${months[monthNum - 1] || monthNum} ${year}`;
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  const formattedSelectedDate = formatIndoDate(selectedDate);

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      {/* Title Header with Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <span>📊</span> Dashboard Laporan Harian
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Pantau arus barang masuk, keluar, dan performa keuangan Toko Pandawa.
          </p>
        </div>

        {/* Date Selector strictly matching the visual theme */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="relative flex items-center bg-orange-50/50 border border-orange-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-orange-400 transition-all">
            <Calendar className="w-4 h-4 text-orange-600 mr-2" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowAllDates(false);
              }}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={() => setShowAllDates(!showAllDates)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer
              ${showAllDates 
                ? 'bg-orange-600 text-white shadow' 
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }
            `}
          >
            <RefreshCw className="w-3 h-3" />
            {showAllDates ? 'Filter Harian' : 'Semua Hari'}
          </button>
        </div>
      </div>

      {/* KPI Cards section strictly matching color schemes & typography from mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Keuntungan Kotor */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-0.5">
              Omzet Kotor
            </p>
            <p className="text-lg font-black text-gray-900 tracking-tight">
              {formatRupiah(totalKeuntunganKotor)}
            </p>
          </div>
        </div>

        {/* Card 2: Keuntungan Bersih */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-0.5">
              Keuntungan Bersih
            </p>
            <p className="text-lg font-black text-gray-900 tracking-tight">
              {formatRupiah(totalKeuntunganBersih)}
            </p>
          </div>
        </div>

        {/* Card 3: Barang Terjual (item) */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-0.5">
              Barang Terjual
            </p>
            <p className="text-lg font-black text-gray-900 tracking-tight">
              {totalBarangTerjual} pcs
            </p>
          </div>
        </div>

        {/* Card 4: Barang Masuk (item) */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 shadow-sm">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-0.5">
              Barang Masuk
            </p>
            <p className="text-lg font-black text-gray-900 tracking-tight">
              {totalBarangMasuk} pcs
            </p>
          </div>
        </div>

      </div>

      {/* Main Table Card as visualized in Image 1 but styled beautifully with High Density theme */}
      <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-orange-50">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📋</span>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wide">
              Laporan Transaksi — {showAllDates ? "Semua Periode" : formattedSelectedDate}
            </h2>
          </div>
          <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
            {filteredTransaksi.length} Catatan
          </span>
        </div>

        {filteredTransaksi.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <AlertCircle className="w-10 h-10 text-orange-300 mb-2" />
            <h3 className="font-bold text-gray-750 text-xs">Tidak Ada Transaksi</h3>
            <p className="text-gray-500 text-[11px] max-w-sm mt-0.5">
              Belum ada pencatatan barang masuk atau keluar untuk tanggal {formattedSelectedDate}. 
              Silakan input baru di menu "Input Transaksi".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto orange-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-orange-100/50">
                  <th className="py-3 px-3">Nama Barang</th>
                  <th className="py-3 px-2 text-center">Jenis</th>
                  <th className="py-3 px-2 text-center">Jumlah</th>
                  <th className="py-3 px-2 text-right">Harga Jual</th>
                  <th className="py-3 px-2 text-right">Total Penjualan</th>
                  <th className="py-3 px-2 text-right">Total Modal</th>
                  <th className="py-3 px-2 text-right">Keuntungan</th>
                  <th className="py-3 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/40">
                {filteredTransaksi.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/20 transition-all">
                    {/* Item Name */}
                    <td className="py-2.5 px-3 font-bold text-gray-900">{item.namaBarang}</td>
                    
                    {/* Transaction Type (Badge styling exactly matching Design HTML & mockup) */}
                    <td className="py-2.5 px-2 text-center">
                      {item.jenis === 'Terjual' ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                          Terjual
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Masuk
                        </span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-gray-600">
                      {item.jumlah}
                    </td>

                    {/* Unit Sale Price */}
                    <td className="py-2.5 px-2 text-right font-mono font-medium text-gray-600">
                      {formatRupiah(item.hargaJual)}
                    </td>

                    {/* Total Sale */}
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-orange-600">
                      {formatRupiah(item.totalPenjualan)}
                    </td>

                    {/* Total Capital */}
                    <td className="py-2.5 px-2 text-right font-mono font-medium text-gray-500">
                      {formatRupiah(item.totalModal)}
                    </td>

                    {/* Profit */}
                    <td className={`py-2.5 px-2 text-right font-mono font-black ${item.keuntungan !== null && item.keuntungan > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {formatRupiah(item.keuntungan)}
                    </td>

                    {/* Quick Delete */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => onDeleteTransaksi && onDeleteTransaksi(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-[10px] border border-red-100 bg-red-50/50 hover:bg-red-50 px-2 py-0.5 rounded transition-all cursor-pointer"
                        title="Hapus pencatatan"
                      >
                        Batal
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Totals Row with clean bottom row styling */}
                <tr className="bg-orange-50/40 font-bold border-t-2 border-orange-200">
                  <td className="py-3 px-3 text-orange-700 font-black uppercase tracking-wider">Total</td>
                  <td className="py-3 px-2"></td>
                  <td className="py-3 px-2 text-center font-mono text-gray-900 font-black">
                    {filteredTransaksi.reduce((sum, item) => sum + item.jumlah, 0)}
                  </td>
                  <td className="py-3 px-2"></td>
                  <td className="py-3 px-2 text-right font-mono text-orange-600 font-black">
                    {formatRupiah(totalKeuntunganKotor)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-gray-700">
                    {formatRupiah(totalModalTerjual)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-emerald-600 font-black">
                    {formatRupiah(totalKeuntunganBersih)}
                  </td>
                  <td className="py-3 px-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
