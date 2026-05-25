/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Fuel, 
  Flame, 
  Trash2, 
  LineChart, 
  DollarSign, 
  Plus, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TransaksiBensin } from '../types';

interface PenjualanBensinViewProps {
  transaksiBensinList: TransaksiBensin[];
  onAddTransaksiBensin: (data: Omit<TransaksiBensin, 'id'>) => void;
  onDeleteTransaksiBensin: (id: string) => void;
  tanggal: string;
  setTanggal: (date: string) => void;
}

export default function PenjualanBensinView({
  transaksiBensinList,
  onAddTransaksiBensin,
  onDeleteTransaksiBensin,
  tanggal,
  setTanggal
}: PenjualanBensinViewProps) {
  const [tipeBotol, setTipeBotol] = useState<12000 | 15000 | 20000>(12000);
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto calculated total
  const calculatedTotal = parseFloat(jumlah.replace(/,/g, '.')) ? parseFloat(jumlah.replace(/,/g, '.')) * tipeBotol : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const qty = parseFloat(jumlah.replace(/,/g, '.'));
    if (!qty || qty <= 0) {
      setErrorMsg('Silakan masukkan jumlah botol yang valid.');
      return;
    }

    onAddTransaksiBensin({
      tipeBotol,
      jumlah: qty,
      totalPenjualan: qty * tipeBotol,
      tanggal,
      keterangan: keterangan.trim() || 'Penjualan bensin eceran'
    });

    // Reset fields except date
    setJumlah('');
    setKeterangan('');
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

  // Compute stats filtered dynamically by the selected date (pergantian tanggal)
  const filteredBensinByDate = transaksiBensinList.filter(t => t.tanggal === tanggal);
  const totalPendapatan = filteredBensinByDate.reduce((sum, item) => sum + item.totalPenjualan, 0);
  const totalBotol = filteredBensinByDate.reduce((sum, item) => sum + item.jumlah, 0);

  const count12k = filteredBensinByDate.filter(t => t.tipeBotol === 12000).reduce((sum, t) => sum + t.jumlah, 0);
  const sales12k = count12k * 12000;

  const count15k = filteredBensinByDate.filter(t => t.tipeBotol === 15000).reduce((sum, t) => sum + t.jumlah, 0);
  const sales15k = count15k * 15000;

  const count20k = filteredBensinByDate.filter(t => t.tipeBotol === 20000).reduce((sum, t) => sum + t.jumlah, 0);
  const sales20k = count20k * 20000;

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-1.5">
            <span>⛽</span> Pencatatan Penjualan Bensin
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Kalkulator dan pencatat penjualan bensin eceran terstruktur dengan pilihan botol Rp 12.000, Rp 15.000, dan Rp 20.000.
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
      <div className="bg-orange-600 text-white px-4 py-2.5 rounded-xl shadow-sm text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
          Laporan Omzet Harian Tanggal: {formatDateToIndo(tanggal)}
        </span>
        <span className="bg-orange-700 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">
          Otomatis Menyortir
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 shadow-sm">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-0.5">Omzet Bensin ({formatDateToIndo(tanggal).split(' ').slice(0, 1).join('')})</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
            <Fuel className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-0.5">Bensin Terjual</p>
            <p className="text-lg font-black text-gray-900 tracking-tight">{totalBotol} Botol</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-0.5">Item Terlaris Hari Ini</p>
            <p className="text-sm font-black text-gray-900">
              {totalBotol === 0 ? '-' : (count15k >= count12k && count15k >= count20k ? 'Botol 15.000' : (count20k >= count12k ? 'Botol 20.000' : 'Botol 12.000'))}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        <div className="bg-orange-50/40 border border-orange-100 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded">Botol 12K</span>
            <p className="text-xl font-black text-gray-900 mt-2">{count12k} Botol</p>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">Omzet: <span className="font-extrabold text-orange-600">Rp {sales12k.toLocaleString('id-ID')}</span></p>
        </div>

        <div className="bg-amber-50/40 border border-amber-200/60 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">Botol 15K</span>
            <p className="text-xl font-black text-gray-900 mt-2">{count15k} Botol</p>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">Omzet: <span className="font-extrabold text-orange-600">Rp {sales15k.toLocaleString('id-ID')}</span></p>
        </div>

        <div className="bg-red-50/30 border border-red-100/60 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-red-800 uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded">Botol 20K</span>
            <p className="text-xl font-black text-gray-900 mt-2">{count20k} Botol</p>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">Omzet: <span className="font-extrabold text-orange-600">Rp {sales20k.toLocaleString('id-ID')}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Calculator & Input Form */}
        <div className="col-span-1 lg:col-span-6 bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Kalkulator Transaksi Bensin
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

            {/* Pilihan Harga Botol */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Jenis Botol Bensin</label>
              <div className="grid grid-cols-3 gap-2">
                {[12000, 15000, 20000].map((harga) => (
                  <button
                    key={harga}
                    type="button"
                    onClick={() => setTipeBotol(harga as 12000 | 15000 | 20000)}
                    className={`
                      py-2.5 rounded-lg font-black text-xs text-center transition-all cursor-pointer border
                      ${tipeBotol === harga 
                        ? 'bg-orange-600 border-orange-600 text-white shadow' 
                        : 'bg-orange-50/10 border-orange-200 hover:bg-orange-50/30 text-gray-700'
                      }
                    `}
                  >
                    Rp {harga.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Botol */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Jumlah Botol</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="cth: 5 atau 1.5"
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-mono font-bold"
              />
            </div>

            {/* Catatan / Keterangan */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600">Keterangan (Opsional)</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="cth: Pembeli motor scoopy"
                className="bg-orange-50/20 border border-orange-200 rounded-lg px-3 py-2 text-xs text-gray-950 focus:outline-none focus:border-orange-500 transition-all font-semibold"
              />
            </div>

            {/* Automatic Total Box */}
            <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Subtotal Otomatis :</span>
              <span className="text-md font-black text-orange-600 font-mono">
                Rp {calculatedTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center"
            >
              Simpan Penjualan Bensin
            </button>
          </form>
        </div>

        {/* Right column: Recent Transactions History */}
        <div className="col-span-1 lg:col-span-6 bg-white p-5 rounded-xl border border-orange-100 shadow-sm h-full">
          <h2 className="text-orange-600 text-xs font-black uppercase tracking-wider mb-4">
            Daftar Pembelian Hari Ini ({formatDateToIndo(tanggal)})
          </h2>

          {filteredBensinByDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Fuel className="w-10 h-10 text-orange-250 mb-2" />
              <p className="text-xs text-gray-400 font-bold">Belum ada data penjualan bensin pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto max-h-[460px] orange-scrollbar pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-orange-100/50">
                      <th className="py-2 px-2.5">Bensin</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Total</th>
                      <th className="py-2 text-right">Tanggal</th>
                      <th className="py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/40 select-none text-xs">
                    {filteredBensinByDate.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/10">
                        <td className="py-2 px-2.5">
                          <p className="font-extrabold text-gray-900">Botol {item.tipeBotol.toLocaleString('id-ID')}</p>
                          <span className="text-[10px] text-gray-400 block truncate max-w-[130px] font-semibold" title={item.keterangan}>
                            {item.keterangan}
                          </span>
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-gray-600">{item.jumlah}</td>
                        <td className="py-2 text-right font-mono font-black text-orange-600">
                          Rp {item.totalPenjualan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 text-right font-mono text-gray-400 text-[10px]">
                          {item.tanggal.split('-').slice(1).join('/')}
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => {
                              if (confirm('Hapus transaksi bensin ini?')) {
                                onDeleteTransaksiBensin(item.id);
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
}
