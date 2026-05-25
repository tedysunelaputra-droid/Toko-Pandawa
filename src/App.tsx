/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Store, Menu, X, HelpCircle, RefreshCw, Calendar } from 'lucide-react';
import { 
  Barang, 
  Transaksi, 
  TransaksiBensin, 
  TransaksiBeras 
} from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DataBarangView from './components/DataBarangView';
import InputTransaksiView from './components/InputTransaksiView';
import PenjualanBensinView from './components/PenjualanBensinView';
import PenjualanBerasView from './components/PenjualanBerasView';

// --- INITIAL SEED DATA (Conforms exactly to user images 1, 2, and 3) ---
const initialBarangSeed: Barang[] = [
  { id: 'aqua-600', nama: 'Aqua 600Ml', hargaModal: 2000, hargaJual: 3000, stok: 8 },
  { id: 'indomie-gr', nama: 'Indomie Goreng Special', hargaModal: 2800, hargaJual: 3500, stok: 40 },
  { id: 'minyak-1l', nama: 'Minyak Goreng Bimoli 1L', hargaModal: 14000, hargaJual: 16500, stok: 15 },
  { id: 'telur-kg', nama: 'Telur Ayam Ras (kg)', hargaModal: 24000, hargaJual: 27000, stok: 10 }
];

// Seed to preserve the exact spreadsheet logs pictured in the mockup
const initialTransaksiSeed: Transaksi[] = [
  {
    id: 't4',
    barangId: 'aqua-600',
    namaBarang: 'Aqua 600Ml',
    jenis: 'Terjual',
    jumlah: 15,
    hargaJual: 3000,
    totalModal: 30000,
    totalPenjualan: 45000,
    keuntungan: 15000,
    tanggal: '2026-04-04'
  },
  {
    id: 't3',
    barangId: 'aqua-600',
    namaBarang: 'Aqua 600Ml',
    jenis: 'Masuk',
    jumlah: 8,
    hargaJual: null,
    totalModal: null,
    totalPenjualan: null,
    keuntungan: null,
    tanggal: '2026-04-04'
  },
  {
    id: 't2',
    barangId: 'aqua-600',
    namaBarang: 'Aqua 600Ml',
    jenis: 'Terjual',
    jumlah: 5,
    hargaJual: 3000,
    totalModal: 10000,
    totalPenjualan: 15000,
    keuntungan: 5000,
    tanggal: '2026-04-04'
  },
  {
    id: 't1',
    barangId: 'aqua-600',
    namaBarang: 'Aqua 600Ml',
    jenis: 'Masuk',
    jumlah: 20,
    hargaJual: null,
    totalModal: null,
    totalPenjualan: null,
    keuntungan: null,
    tanggal: '2026-04-04'
  }
];

// Initial seed for Petrol sales
const initialBensinSeed: TransaksiBensin[] = [
  { id: 'b1', tipeBotol: 12000, jumlah: 3, totalPenjualan: 36000, tanggal: '2026-05-25', keterangan: 'Motor Supra B 2850 KA' },
  { id: 'b2', tipeBotol: 15000, jumlah: 2, totalPenjualan: 30000, tanggal: '2026-05-25', keterangan: 'Vario eceran' },
  { id: 'b3', tipeBotol: 20000, jumlah: 1, totalPenjualan: 20000, tanggal: '2026-05-24', keterangan: 'Scoopy keliling' }
];

// Initial seed for Rice sales
const initialBerasSeed: TransaksiBeras[] = [
  { id: 'r1', merek: 'Pandan Wangi', format: 'Karung', jumlah: 2, hargaPerUnit: 310000, totalPenjualan: 620000, tanggal: '2026-05-25', keterangan: 'Pak Haji Rohman' },
  { id: 'r2', merek: 'IR 64 Ramos', format: 'Literan', jumlah: 6, hargaPerUnit: 12500, totalPenjualan: 75000, tanggal: '2026-05-25', keterangan: 'Eceran harian bu sastro' },
  { id: 'r3', merek: 'Slyp Cianjur', format: 'Kiloan', jumlah: 10, hargaPerUnit: 15000, totalPenjualan: 150000, tanggal: '2026-05-24', keterangan: 'Untuk warung nasi padang' }
];

export default function App() {
  // Navigation active tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Core Stock Database State
  const [barangList, setBarangList] = useState<Barang[]>(() => {
    const saved = localStorage.getItem('pandawa_barang');
    if (saved) {
      try {
        const parsed: Barang[] = JSON.parse(saved);
        // Automatically upscale old single-digit values to thousands
        return parsed.map((item) => ({
          ...item,
          hargaModal: item.hargaModal < 100 ? item.hargaModal * 1000 : item.hargaModal,
          hargaJual: item.hargaJual < 100 ? item.hargaJual * 1000 : item.hargaJual
        }));
      } catch (e) {
        return initialBarangSeed;
      }
    }
    return initialBarangSeed;
  });

  // Stock transactions lists
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(() => {
    const saved = localStorage.getItem('pandawa_transaksi');
    if (saved) {
      try {
        const parsed: Transaksi[] = JSON.parse(saved);
        // Automatically upscale old single-digit transaction details to thousands
        return parsed.map((t) => {
          const hargaJual = t.hargaJual !== null && t.hargaJual < 100 ? t.hargaJual * 1000 : t.hargaJual;
          const totalModal = t.totalModal !== null && t.totalModal < 1000 ? t.totalModal * 1000 : t.totalModal;
          const totalPenjualan = t.totalPenjualan !== null && t.totalPenjualan < 1000 ? t.totalPenjualan * 1000 : t.totalPenjualan;
          const keuntungan = t.keuntungan !== null && Math.abs(t.keuntungan) < 1000 ? t.keuntungan * 1000 : t.keuntungan;
          return {
            ...t,
            hargaJual,
            totalModal,
            totalPenjualan,
            keuntungan
          };
        });
      } catch (e) {
        return initialTransaksiSeed;
      }
    }
    return initialTransaksiSeed;
  });

  // Bensin eceran lists
  const [transaksiBensinList, setTransaksiBensinList] = useState<TransaksiBensin[]>(() => {
    const saved = localStorage.getItem('pandawa_bensin');
    return saved ? JSON.parse(saved) : initialBensinSeed;
  });

  // Beras lists
  const [transaksiBerasList, setTransaksiBerasList] = useState<TransaksiBeras[]>(() => {
    const saved = localStorage.getItem('pandawa_beras');
    return saved ? JSON.parse(saved) : initialBerasSeed;
  });

  // Unified Global Date State (Shared across all forms and lists for ultimate long-term UX)
  const [globalTanggal, setGlobalTanggal] = useState<string>(() => {
    const saved = localStorage.getItem('pandawa_global_tanggal');
    return saved || '2026-05-25'; // Match current system date matching active seeds
  });

  // Write changes to localStorage
  useEffect(() => {
    localStorage.setItem('pandawa_global_tanggal', globalTanggal);
  }, [globalTanggal]);

  useEffect(() => {
    localStorage.setItem('pandawa_barang', JSON.stringify(barangList));
  }, [barangList]);

  useEffect(() => {
    localStorage.setItem('pandawa_transaksi', JSON.stringify(transaksiList));
  }, [transaksiList]);

  useEffect(() => {
    localStorage.setItem('pandawa_bensin', JSON.stringify(transaksiBensinList));
  }, [transaksiBensinList]);

  useEffect(() => {
    localStorage.setItem('pandawa_beras', JSON.stringify(transaksiBerasList));
  }, [transaksiBerasList]);

  // --- ACTIONS FOR BARANG MANAGEMENT ---
  const handleAddBarang = (item: Omit<Barang, 'id'>) => {
    const newBarang: Barang = {
      ...item,
      id: `b-${Date.now()}`
    };
    setBarangList((prev) => [newBarang, ...prev]);
  };

  const handleUpdateBarang = (updatedItem: Barang) => {
    setBarangList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    
    // Also update transaction list description items retroactively
    setTransaksiList((prev) =>
      prev.map((t) => 
        t.barangId === updatedItem.id 
          ? { ...t, namaBarang: updatedItem.nama } 
          : t
      )
    );
  };

  const handleDeleteBarang = (id: string) => {
    setBarangList((prev) => prev.filter((item) => item.id !== id));
    // Remove matches to clean orphan transactions or keep logs
    setTransaksiList((prev) => prev.filter((t) => t.barangId !== id));
  };


  // --- ACTIONS FOR CORE TRANSACTIONS ---
  const handleAddTransaksi = (data: {
    barangId: string;
    jenis: 'Masuk' | 'Terjual';
    jumlah: number;
    tanggal: string;
  }) => {
    const product = barangList.find((b) => b.id === data.barangId);
    if (!product) return;

    let totalModal: number | null = null;
    let totalPenjualan: number | null = null;
    let keuntungan: number | null = null;
    let hargaJualVal: number | null = null;

    if (data.jenis === 'Terjual') {
      hargaJualVal = product.hargaJual;
      totalModal = data.jumlah * product.hargaModal;
      totalPenjualan = data.jumlah * product.hargaJual;
      keuntungan = totalPenjualan - totalModal;
    }

    const newTx: Transaksi = {
      id: `t-${Date.now()}`,
      barangId: data.barangId,
      namaBarang: product.nama,
      jenis: data.jenis,
      jumlah: data.jumlah,
      hargaJual: hargaJualVal,
      totalModal,
      totalPenjualan,
      keuntungan,
      tanggal: data.tanggal
    };

    // Update product stock level automatically!
    setBarangList((prev) =>
      prev.map((b) => {
        if (b.id === data.barangId) {
          const updatedStock = data.jenis === 'Masuk' 
            ? b.stok + data.jumlah 
            : Math.max(0, b.stok - data.jumlah);
          return { ...b, stok: updatedStock };
        }
        return b;
      })
    );

    // Save transaction at the head/start of list
    setTransaksiList((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaksi = (id: string) => {
    const targetTx = transaksiList.find((t) => t.id === id);
    if (!targetTx) return;

    // Refund stock count of the catalog product back
    setBarangList((prev) =>
      prev.map((b) => {
        if (b.id === targetTx.barangId) {
          const revertedStock = targetTx.jenis === 'Masuk'
            ? Math.max(0, b.stok - targetTx.jumlah)
            : b.stok + targetTx.jumlah;
          return { ...b, stok: revertedStock };
        }
        return b;
      })
    );

    setTransaksiList((prev) => prev.filter((t) => t.id !== id));
  };


  // --- ACTIONS FOR BENSIN ---
  const handleAddTransaksiBensin = (data: Omit<TransaksiBensin, 'id'>) => {
    const newTx: TransaksiBensin = {
      ...data,
      id: `ben-${Date.now()}`
    };
    setTransaksiBensinList((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaksiBensin = (id: string) => {
    setTransaksiBensinList((prev) => prev.filter((t) => t.id !== id));
  };


  // --- ACTIONS FOR BERAS ---
  const handleAddTransaksiBeras = (data: Omit<TransaksiBeras, 'id'>) => {
    const newTx: TransaksiBeras = {
      ...data,
      id: `ber-${Date.now()}`
    };
    setTransaksiBerasList((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaksiBeras = (id: string) => {
    setTransaksiBerasList((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset database to default seed state
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang data Toko Pandawa ke pengaturan awal bawaan?')) {
      setBarangList(initialBarangSeed);
      setTransaksiList(initialTransaksiSeed);
      setTransaksiBensinList(initialBensinSeed);
      setTransaksiBerasList(initialBerasSeed);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans flex flex-col selection:bg-orange-200">
      
      {/* 1. Header (Top Navigation exactly matching screenshot orange color theme) */}
      <header className="sticky top-0 z-50 bg-orange-600 text-white px-4 md:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="p-1 rounded-lg hover:bg-orange-700 md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {isOpenMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Shop Roof and title "Toko Pandawa" */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-lg md:text-xl tracking-wide select-none">
              Toko Pandawa
            </span>
          </div>
        </div>

        {/* Action Header Items with Global Date Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Global Date Picker for instant date-switching */}
          <div className="flex items-center gap-1.5 bg-orange-700 hover:bg-orange-800 border border-orange-500/40 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all shadow-inner select-none shrink-0">
            <Calendar className="w-3.5 h-3.5 text-orange-200" />
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-black text-white/90 uppercase tracking-widest leading-none">Tanggal Aktif</span>
              <input
                type="date"
                value={globalTanggal}
                onChange={(e) => setGlobalTanggal(e.target.value)}
                className="bg-transparent text-[11px] font-black text-white focus:outline-none cursor-pointer leading-tight h-3.5 w-[94px] sm:w-[105px]"
              />
            </div>
          </div>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs font-bold bg-orange-700 hover:bg-orange-850 text-white px-3 py-1.5 rounded-xl border border-orange-400/30 transition-all shadow-sm shrink-0"
            title="Saran Reset data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content Panels */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Responsive Drawer Navigator */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
        />

        {/* Content view screen */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              transaksi={transaksiList} 
              barang={barangList} 
              onDeleteTransaksi={handleDeleteTransaksi}
              selectedDate={globalTanggal}
              setSelectedDate={setGlobalTanggal}
            />
          )}

          {activeTab === 'barang' && (
            <DataBarangView 
              barangList={barangList}
              onAddBarang={handleAddBarang}
              onUpdateBarang={handleUpdateBarang}
              onDeleteBarang={handleDeleteBarang}
            />
          )}

          {activeTab === 'transaksi' && (
            <InputTransaksiView 
              barangList={barangList}
              transaksiList={transaksiList}
              onAddTransaksi={handleAddTransaksi}
              tanggal={globalTanggal}
              setTanggal={setGlobalTanggal}
            />
          )}

          {activeTab === 'bensin' && (
            <PenjualanBensinView 
              transaksiBensinList={transaksiBensinList}
              onAddTransaksiBensin={handleAddTransaksiBensin}
              onDeleteTransaksiBensin={handleDeleteTransaksiBensin}
              tanggal={globalTanggal}
              setTanggal={setGlobalTanggal}
            />
          )}

          {activeTab === 'beras' && (
            <PenjualanBerasView 
              transaksiBerasList={transaksiBerasList}
              onAddTransaksiBeras={handleAddTransaksiBeras}
              onDeleteTransaksiBeras={handleDeleteTransaksiBeras}
              tanggal={globalTanggal}
              setTanggal={setGlobalTanggal}
            />
          )}
        </main>

      </div>

      {/* Modern, non-intrusive footer context */}
      <footer className="bg-[#FAF0E6] text-center py-4 border-t border-orange-100 text-xs text-[#8C7A6E]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>© 2026 Admin Toko Pandawa. Seluruh data tersimpan secara lokal di peramban Anda.</p>
          <div className="flex justify-center gap-4 text-[11px] font-bold text-orange-600">
            <span>Ketersediaan Stok: Aktif</span>
            <span>•</span>
            <span>Bensin Eceran Terintegrasi</span>
            <span>•</span>
            <span>Kasir Beras Mandiri</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
