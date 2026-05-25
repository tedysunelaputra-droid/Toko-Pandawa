/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Leaf, 
  Trash2, 
  LineChart, 
  Layers, 
  Plus, 
  Calendar,
  AlertCircle,
  Wheat,
  Activity
} from 'lucide-react';
import { TransaksiBeras, RiceFormat } from '../types';

interface PenjualanBerasViewProps {
  transaksiBerasList: TransaksiBeras[];
  onAddTransaksiBeras: (data: Omit<TransaksiBeras, 'id'>) => void;
  onDeleteTransaksiBeras: (id: string) => void;
  tanggal: string;
  setTanggal: (date: string) => void;
}

export default function PenjualanBerasView({
  transaksiBerasList,
  onAddTransaksiBeras,
  onDeleteTransaksiBeras,
  tanggal,
  setTanggal
}: PenjualanBerasViewProps) {
  const [merek, setMerek] = useState('');
  const [format, setFormat] = useState<RiceFormat>('Karung');
  const [jumlah, setJumlah] = useState('');
  const [hargaPerUnit, setHargaPerUnit] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Popular rice brands in Indonesia for quick select autocomplete
  const popularBrands = [
    'Rojolele', 'Pandan Wangi', 'IR 64 Ramos', 'Slyp Cianjur', 'Beras Merah Sokan', 'Beras Pandawa Super'
  ];

  // Helper to format a string or number into Rupiah display format (e.g. 2.500)
  const formatNumberToCurrency = (val: string | number): string => {
    if (val === undefined || val === null || val === '') return '';
    const cleanNumStr = val.toString().replace(/\D/g, '');
    if (!cleanNumStr) return '';
    const num = parseInt(cleanNumStr, 10);
    return num.toLocaleString('id-ID');
  };

  // Auto calculated total
  const calculatedTotal = (parseFloat(jumlah.replace(/,/g, '.')) || 0) * (parseFloat(hargaPerUnit) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!merek.trim()) {
      setErrorMsg('Silakan isi merek beras.');
      return;
    }

    const qty = parseFloat(jumlah.replace(/,/g, '.'));
    if (!qty || qty <= 0) {
      setErrorMsg('Masukkan jumlah yang valid (angka positif).');
      return;
    }

    const price = parseFloat(hargaPerUnit);
    if (!price || price <= 0) {
      setErrorMsg('Masukkan harga per unit yang valid.');
      return;
    }

    onAddTransaksiBeras({
      merek: merek.trim(),
      format,
      jumlah: qty,
      hargaPerUnit: price,
      totalPenjualan: qty * price,
      tanggal,
      keterangan: keterangan.trim() || `Beras ${merek} eceran`
    });

    // Reset fields
    setMerek('');
    setJumlah('');
    setHargaPerUnit('');
    setKeterangan('');
  };

  // Helper unit labels
  const getUnitSuffix = (selFormat: RiceFormat) => {
    switch (selFormat) {
      case 'Karung': return 'Sack/Karung';
      case 'Literan': return 'Liter';
      case 'Kiloan': return 'Kg';
      default: return 'unit';
    }
  };

  // Helper to format date cleanly in Indonesian without timezone shift issues
  const formatDateToIndo = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const day = parseInt(parts[2], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const year = parts[0];
      return `${day} ${months[monthIndex]} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  // State stats computations filtered dynamically by selected date (pergantian tanggal)
  const filteredBerasByDate = transaksiBerasList.filter(t => t.tanggal === tanggal);
  const totalOmzetBeras = filteredBerasByDate.reduce((sum, item) => sum + item.totalPenjualan, 0);
  const totalSacks = filteredBerasByDate.filter(b => b.format === 'Karung').reduce((sum, b) => sum + b.jumlah, 0);
  const totalLiters = filteredBerasByDate.filter(b => b.format === 'Literan').reduce((sum, b) => sum + b.jumlah, 0);
  const totalKilos = filteredBerasByDate.filter(b => b.format === 'Kiloan').reduce((sum, b) => sum + b.jumlah, 0);

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-1.5">
            <span>🌾</span> Pencatatan Penjualan Beras
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Kalkulator dinamis untuk menginput & memantau transaksi penjualan beras berdasarkan format Karung, Literan, maupun Kiloan.
          </p>
        </div>

        {/* Date Selector Quick Navigation */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/60 px-3 py-2 rounded-xl shrink-0 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-orange-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-orange-700 uppercase tracking-wider">Tanggal Laporan</span>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="bg-transparent text-xs font-bold text-orange-950 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Daily Banner Indicator */}
      <div className="bg-green-700 text-white px-4 py-2.5 rounded-xl shadow-sm text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"></span>
          Laporan Omzet Harian Tanggal: {formatDateToIndo(tanggal)}
        </span>
        <span className="bg-green-850 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">
          Otomatis Menyortir
        </span>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shrink-0 shadow-sm">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-0.5">Omzet Beras</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">Rp {totalOmzetBeras.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Karung */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-0.5">Total Karung</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">{totalSacks} Karung</p>
          </div>
        </div>

        {/* Literan */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-0.5">Total Literan</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">{totalLiters} Liter</p>
          </div>
        </div>

        {/* Kiloan */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 shadow-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-0.5">Total Kiloan</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">{totalKilos} Kg</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Form Input Beras */}
        <div className="col-span-1 lg:col-span-7 bg-white p-5 rounded-xl border border-orange-100 shadow-sm font-sans">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Input Transaksi Beras
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2 font-bold select-none">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Tanggal */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-bold cursor-pointer"
              />
            </div>

            {/* Merek Beras with quick autocomplete templates */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Merek Beras</label>
              <input
                type="text"
                required
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
                placeholder="cth: Rojolele Premium"
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-semibold"
              />
              
              {/* Quick Select Brand Buttons */}
              <div className="flex flex-wrap gap-1 mt-1.5 h-12 overflow-y-auto select-none">
                {popularBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setMerek(brand)}
                    className="text-[9px] bg-orange-100/50 hover:bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded border border-orange-200/40 transition-all cursor-pointer"
                  >
                    + {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Penjualan (Karung / Literan / Kiloan) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Format Penjualan</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Karung', 'Literan', 'Kiloan'] as RiceFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setFormat(fmt);
                      // Auto populate initial default common pricing estimate
                      if (!hargaPerUnit) {
                        if (fmt === 'Karung') setHargaPerUnit('320000');
                        else if (fmt === 'Literan') setHargaPerUnit('12500');
                        else if (fmt === 'Kiloan') setHargaPerUnit('15000');
                      }
                    }}
                    className={`
                      py-2.5 rounded-lg font-black text-xs text-center transition-all cursor-pointer border
                      ${format === fmt 
                        ? 'bg-orange-600 border-orange-600 text-white shadow' 
                        : 'bg-orange-50/10 border-orange-200 hover:bg-orange-50/30 text-gray-700'
                      }
                    `}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Jumlah */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600">
                  Jumlah ({getUnitSuffix(format)})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Jumlah terjual"
                  className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-mono font-bold"
                />
              </div>

              {/* Harga per Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600">
                  Harga per {getUnitSuffix(format)}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={formatNumberToCurrency(hargaPerUnit)}
                    onChange={(e) => {
                      const rawVal = e.target.value.replace(/\D/g, '');
                      setHargaPerUnit(rawVal);
                    }}
                    placeholder="Harga satuan"
                    className="w-full bg-orange-50/20 border border-orange-200 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Catatan Penjualan (Opsional)</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="cth: Dibeli pak haji"
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-semibold"
              />
            </div>

            {/* Automatic Subtotal calculations */}
            <div className="bg-orange-50/55 p-3 rounded-lg border border-orange-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Kalkulasi Total Belanja :</span>
              <span className="text-md font-black text-orange-600 font-mono">
                Rp {calculatedTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center"
            >
              Simpan Penjualan Beras
            </button>
          </form>
        </div>

        {/* Right column: Recent Transactions History for Rice */}
        <div className="col-span-1 lg:col-span-5 bg-white p-5 rounded-xl border border-orange-100 shadow-sm h-full">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Daftar Transaksi Beras Hari Ini ({formatDateToIndo(tanggal)})
          </h2>

          {filteredBerasByDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Leaf className="w-10 h-10 text-orange-200 mb-2" />
              <p className="text-xs text-gray-400 font-bold">Belum ada data penjualan beras pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto max-h-[540px] orange-scrollbar pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-orange-100/50">
                      <th className="py-2 px-2.5">Merek & Format</th>
                      <th className="py-2 text-center">Jumlah</th>
                      <th className="py-2 text-right">Total</th>
                      <th className="py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/40 select-none text-xs">
                    {filteredBerasByDate.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/10">
                        <td className="py-2 px-2.5">
                          <p className="font-extrabold text-gray-900">{item.merek}</p>
                          <div className="flex gap-1.5 items-center mt-0.5">
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                              {item.format}
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[125px] font-semibold">
                              {item.keterangan}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-gray-600">
                          {item.jumlah} {item.format === 'Karung' ? 'Krg' : (item.format === 'Literan' ? 'Ltr' : 'Kg')}
                        </td>
                        <td className="py-2 text-right font-mono font-black text-orange-600">
                          Rp {item.totalPenjualan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus transaksi beras ${item.merek} ini?`)) {
                                onDeleteBeras(item.id);
                              }
                            }}
                            className="p-1 rounded text-red-500 border border-red-50 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // Helper delete wrapper
  function onDeleteBeras(id: string) {
    onDeleteTransaksiBeras(id);
  }
}
