/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X,
  Search,
  Package,
  AlertTriangle
} from 'lucide-react';
import { Barang } from '../types';

interface DataBarangViewProps {
  barangList: Barang[];
  onAddBarang: (barang: Omit<Barang, 'id'>) => void;
  onUpdateBarang: (barang: Barang) => void;
  onDeleteBarang: (id: string) => void;
}

export default function DataBarangView({
  barangList,
  onAddBarang,
  onUpdateBarang,
  onDeleteBarang
}: DataBarangViewProps) {
  const [nama, setNama] = useState('');
  const [hargaModal, setHargaModal] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [initialStokStr, setInitialStokStr] = useState('0'); // default initial stock
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Trigger add or update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !hargaModal || !hargaJual) return;

    const modalNum = Math.max(0, parseFloat(hargaModal));
    const jualNum = Math.max(0, parseFloat(hargaJual));
    const labelStok = Math.max(0, parseInt(initialStokStr, 10) || 0);

    if (editingId) {
      // Find current item to preserve its stock level if we don't modify it
      const currentItem = barangList.find(b => b.id === editingId);
      onUpdateBarang({
        id: editingId,
        nama: nama.trim(),
        hargaModal: modalNum,
        hargaJual: jualNum,
        stok: currentItem ? currentItem.stok : labelStok // preserve stock
      });
      setEditingId(null);
    } else {
      onAddBarang({
        nama: nama.trim(),
        hargaModal: modalNum,
        hargaJual: jualNum,
        stok: labelStok
      });
    }

    // Reset inputs
    setNama('');
    setHargaModal('');
    setHargaJual('');
    setInitialStokStr('0');
  };

  // Trigger edit mode
  const handleEdit = (item: Barang) => {
    setEditingId(item.id);
    setNama(item.nama);
    setHargaModal(item.hargaModal.toString());
    setHargaJual(item.hargaJual.toString());
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setNama('');
    setHargaModal('');
    setHargaJual('');
    setInitialStokStr('0');
  };

  // Filter list by search query
  const filteredList = barangList.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format a string or number into Rupiah display format (e.g. 2.500)
  const formatNumberToCurrency = (val: string | number): string => {
    if (val === undefined || val === null || val === '') return '';
    const cleanNumStr = val.toString().replace(/\D/g, '');
    if (!cleanNumStr) return '';
    const num = parseInt(cleanNumStr, 10);
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
        <h1 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-1.5">
          <span>📦</span> Data Barang
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Tambahkan produk baru, perbarui harga modal/jual, dan lihat tingkat ketersediaan stok barang.
        </p>
      </div>

      {/* Form Card exactly replicating the top part of Image 2 */}
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-50">
          <Plus className="w-4 h-4 text-orange-600" />
          <h2 className="text-orange-600 font-extrabold text-xs uppercase tracking-wider">
            {editingId ? 'Edit Data Barang' : 'Tambah Barang Baru'}
          </h2>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="ml-auto text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <X className="w-3.5 h-3.5" /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Output match placeholder "Nama Barang" */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">Nama Barang</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Barang"
              className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-semibold"
            />
          </div>

          {/* Harga Modal placeholder "Harga Modal (Rp)" */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">Harga Modal (Rp)</label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={formatNumberToCurrency(hargaModal)}
              onChange={(e) => {
                const rawVal = e.target.value.replace(/\D/g, '');
                setHargaModal(rawVal);
              }}
              placeholder="Harga Modal (Rp)"
              className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono font-bold"
            />
          </div>

          {/* Harga Jual placeholder "Harga Jual (Rp)" */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">Harga Jual (Rp)</label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={formatNumberToCurrency(hargaJual)}
              onChange={(e) => {
                const rawVal = e.target.value.replace(/\D/g, '');
                setHargaJual(rawVal);
              }}
              placeholder="Harga Jual (Rp)"
              className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono font-bold"
            />
          </div>

          {/* Input Stok Awal (only shown for new items) */}
          {!editingId ? (
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-bold text-gray-600">Stok Awal</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="0"
                  value={initialStokStr}
                  onChange={(e) => setInitialStokStr(e.target.value)}
                  placeholder="0"
                  className="col-span-1 bg-orange-50/20 border border-orange-200 rounded-lg px-2 py-2 text-center text-xs text-gray-950 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono font-bold"
                />
                <button
                  type="submit"
                  className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95 text-center"
                >
                  Tambah Barang
                </button>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95 w-full"
            >
              Simpan Perubahan
            </button>
          )}
        </form>
      </div>

      {/* List Container as visualized in Image 2 */}
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b border-orange-50">
          <div className="flex items-center gap-1.5 animate-pulse">
            <span className="text-xs">📋</span>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Daftar Barang ({filteredList.length})
            </h2>
          </div>

          {/* Search bar helper */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-orange-50/10 hover:bg-orange-50/20 border border-orange-200 rounded-full pl-8 pr-3 py-1 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Package className="w-10 h-10 text-orange-200 mb-2" />
            <h3 className="font-bold text-gray-750 text-xs">Tidak Ada Barang</h3>
            <p className="text-gray-500 text-[11px] max-w-sm mt-0.5">
              {searchQuery ? 'Cobalah kata kunci lain' : 'Belum ada barang terdaftar. Tambahkan barang pertama Anda menggunakan form di atas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto orange-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-orange-100/50">
                  <th className="py-3 px-3">Nama Barang</th>
                  <th className="py-3 px-2 text-right">Harga Modal</th>
                  <th className="py-3 px-2 text-right">Harga Jual</th>
                  <th className="py-3 px-2 text-center">Stok</th>
                  <th className="py-3 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/40">
                {filteredList.map((item) => {
                  const isLowStock = item.stok <= 5;
                  
                  return (
                    <tr key={item.id} className="hover:bg-orange-50/20 transition-all">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{item.nama}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-gray-600 font-medium">
                        Rp {item.hargaModal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-orange-600 font-bold">
                        Rp {item.hargaJual.toLocaleString('id-ID')}
                      </td>
                      
                      {/* Stok Badge styled as a green/yellow pill capsule matching Image 2 */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold font-mono
                          ${isLowStock 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                          }
                        `}>
                          {item.stok}
                        </span>
                      </td>

                      {/* Custom styled Edit/Delete button blocks exactly mimicking Image 2 */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit: orange icon inside warm rectangle outline */}
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 rounded border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
                            title="Edit data barang"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Delete: Trash in pink background / red outline or red icon */}
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus barang "${item.nama}"?`)) {
                                onDeleteBarang(item.id);
                              }
                            }}
                            className="p-1 rounded border border-red-200 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Hapus barang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
