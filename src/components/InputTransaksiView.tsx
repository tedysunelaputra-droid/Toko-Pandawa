/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowDownCircle, 
  ShoppingCart, 
  Layers, 
  Plus, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { Transaksi, Barang } from '../types';

interface InputTransaksiViewProps {
  barangList: Barang[];
  transaksiList: Transaksi[];
  tanggal: string;
  setTanggal: (date: string) => void;
  onAddTransaksi: (data: {
    barangId: string;
    jenis: 'Masuk' | 'Terjual';
    jumlah: number;
    tanggal: string;
  }) => void;
}

export default function InputTransaksiView({
  barangList,
  transaksiList,
  onAddTransaksi,
  tanggal,
  setTanggal
}: InputTransaksiViewProps) {
  const [jenis, setJenis] = useState<'Masuk' | 'Terjual'>('Masuk');
  const [barangId, setBarangId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [barangSearch, setBarangSearch] = useState('');

  // Find selected product to show stock information
  const selectedProduct = barangList.find((b) => b.id === barangId);

  // Filter products by search term for quick selection
  const filteredProducts = barangList.filter((item) =>
    item.nama.toLowerCase().includes(barangSearch.toLowerCase())
  );

  // Filter transactions by selected date (pergantian tanggal)
  const filteredTransaksiByDate = transaksiList.filter((t) => t.tanggal === tanggal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!barangId) {
      setErrorMsg('Silakan pilih barang terlebih dahulu.');
      return;
    }

    const qty = parseFloat(jumlah.replace(/,/g, '.'));
    if (!qty || qty <= 0) {
      setErrorMsg('Jumlah barang harus berupa angka positif.');
      return;
    }

    if (jenis === 'Terjual' && selectedProduct && selectedProduct.stok < qty) {
      setErrorMsg(`Stok tidak mencukupi. Stok saat ini untuk ${selectedProduct.nama} adalah ${selectedProduct.stok} pcs.`);
      return;
    }

    onAddTransaksi({
      barangId,
      jenis,
      jumlah: qty,
      tanggal
    });

    setSuccessMsg('Transaksi berhasil disimpan!');
    setJumlah('');
    
    // Auto clear success message
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Format date to MM/DD (e.g. 04/04) for recent transactions
  const formatRecentDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
        <h1 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-1.5">
          <span>📝</span> Input Transaksi Stok
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Catat transaksi stok masuk (kulakan) atau barang terjual untuk mengupdate persediaan secara otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Form Input Stok (Image 3 Left Panel) */}
        <div className="col-span-1 lg:col-span-7 bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Form Input Stok
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status alerts */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2 font-bold select-none">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs flex items-center gap-2 font-bold select-none">
                <Save className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Tanggal input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Tanggal</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-bold cursor-pointer"
              />
            </div>

            {/* Jenis Transaksi Group: Stok Masuk (Active Blue) vs Terjual (Active Gray/Orange) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Jenis Transaksi</label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Stok Masuk Option */}
                <button
                  type="button"
                  onClick={() => setJenis('Masuk')}
                  className={`
                    flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer
                    ${jenis === 'Masuk' 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'bg-orange-50/10 border border-orange-200 text-gray-750 hover:bg-orange-50/30'
                    }
                  `}
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Stok Masuk</span>
                </button>

                {/* Terjual Option */}
                <button
                  type="button"
                  onClick={() => setJenis('Terjual')}
                  className={`
                    flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer
                    ${jenis === 'Terjual' 
                      ? 'bg-orange-600 text-white shadow' 
                      : 'bg-orange-50/10 border border-orange-200 text-gray-750 hover:bg-orange-50/30'
                    }
                  `}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Terjual</span>
                </button>
              </div>
            </div>

            {/* Pilih Barang with Interactive Click-to-Search Badge Grid */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700">Cari & Pilih Barang (Klik Cepat)</label>
                {selectedProduct && (
                  <span className="text-[10px] font-black text-green-700 bg-green-150 px-2 py-0.5 rounded">
                    Stok Saat Ini: {selectedProduct.stok} pcs
                  </span>
                )}
              </div>

              {/* Search input for quick-find */}
              <div className="relative">
                <input
                  type="text"
                  value={barangSearch}
                  onChange={(e) => setBarangSearch(e.target.value)}
                  placeholder="Ketik nama produk untuk mencari..."
                  className="w-full bg-orange-50/10 border border-orange-200 rounded-lg pl-3 pr-8 py-2.5 text-xs text-gray-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-semibold"
                />
                {barangSearch && (
                  <button
                    type="button"
                    onClick={() => setBarangSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Interactive Clickable Grid/List */}
              <div className="border border-orange-100/80 rounded-lg p-2.5 bg-orange-50/10 max-h-[160px] overflow-y-auto space-y-1.5 orange-scrollbar">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-400 font-medium">
                    Barang &quot;{barangSearch}&quot; tidak ditemukan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredProducts.map((item) => {
                      const isSelected = item.id === barangId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBarangId(item.id)}
                          className={`
                            px-3 py-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border cursor-pointer select-none
                            ${isSelected 
                              ? 'bg-orange-600 border-orange-600 text-white shadow-sm font-bold scale-[0.98]' 
                              : 'bg-white border-orange-100 hover:bg-orange-50/30 hover:border-orange-200 text-gray-800'
                            }
                          `}
                        >
                          <div className="truncate flex flex-col">
                            <span className={`font-bold truncate max-w-[140px] ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                              {item.nama}
                            </span>
                            <span className={`text-[9px] ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                              Rp {item.hargaJual.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                            isSelected 
                              ? 'bg-orange-700 text-orange-50 border border-orange-500/30' 
                              : item.stok <= 10 
                                ? 'bg-red-50 text-red-600' 
                                : 'bg-gray-100 text-gray-750'
                          }`}>
                            Stok: {item.stok}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Fallback Selector */}
              <select
                required
                value={barangId}
                onChange={(e) => setBarangId(e.target.value)}
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-semibold cursor-pointer"
              >
                <option value="">-- Atau Pilih lewat Daftar Manual --</option>
                {barangList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} (Stok: {item.stok} | Rp {item.hargaJual.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Jumlah</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Masukkan jumlah (bisa desimal)"
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2.5 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-mono font-bold"
              />
            </div>

            {/* Simpan Transaksi Button inside card */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              Simpan Transaksi
            </button>
          </form>
        </div>

        {/* Right column: Transaksi Terbaru list (Image 3 Right Panel) */}
        <div className="col-span-1 lg:col-span-5 bg-white p-5 rounded-xl border border-orange-100 shadow-sm h-full">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Transaksi Hari Ini ({formatRecentDate(tanggal)})
          </h2>

          {filteredTransaksiByDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Layers className="w-10 h-10 text-orange-200 mb-2" />
              <p className="text-xs text-gray-400 font-bold">Belum ada transaksi pada tanggal ini ({formatRecentDate(tanggal)}).</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-[10px] font-black text-gray-400 pb-1.5 border-b border-orange-50 uppercase tracking-widest">
                <span className="col-span-5">Barang</span>
                <span className="col-span-3 text-center">Jenis</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Tgl</span>
              </div>

              {/* Show maximum 10 last transactions to keep layout gorgeous */}
              <div className="divide-y divide-orange-100/40 select-none text-xs">
                {filteredTransaksiByDate.slice(0, 15).map((t) => (
                  <div key={t.id} className="grid grid-cols-12 py-2 items-center">
                    <span className="col-span-5 font-bold text-gray-900 truncate pr-2" title={t.namaBarang}>
                      {t.namaBarang}
                    </span>
                    <span className="col-span-3 text-center">
                      {t.jenis === 'Terjual' ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-800">
                          Terjual
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                          Masuk
                        </span>
                      )}
                    </span>
                    <span className="col-span-2 text-center font-mono font-bold text-gray-600">
                      {t.jumlah}
                    </span>
                    <span className="col-span-2 text-right font-mono text-[10px] text-gray-400">
                      {formatRecentDate(t.tanggal)}
                    </span>
                  </div>
                ))}
              </div>
              {filteredTransaksiByDate.length > 15 && (
                <div className="text-center pt-2 border-t border-orange-50">
                  <span className="text-[10px] text-gray-400 font-bold">
                    Menampilkan 15 dari {filteredTransaksiByDate.length} transaksi di tanggal ini
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
