/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Schema for Goods/Product
export interface Barang {
  id: string;
  nama: string;
  hargaModal: number;
  hargaJual: number;
  stok: number;
}

// Transaction item types matching the dashboard spreadsheet
export interface Transaksi {
  id: string;
  barangId: string;
  namaBarang: string;
  jenis: 'Masuk' | 'Terjual';
  jumlah: number;
  hargaJual: number | null; // null for incoming items
  totalModal: number | null; // null for incoming items
  totalPenjualan: number | null; // null for incoming items
  keuntungan: number | null; // null for incoming items
  tanggal: string; // formate YYYY-MM-DD
}

// Gasoline Transaction
export interface TransaksiBensin {
  id: string;
  tipeBotol: 12000 | 15000 | 20000;
  jumlah: number;
  totalPenjualan: number;
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
}

// Rice Brand/Format Transaction
export type RiceFormat = 'Karung' | 'Literan' | 'Kiloan';

export interface TransaksiBeras {
  id: string;
  merek: string;
  format: RiceFormat;
  jumlah: number;
  hargaPerUnit: number;
  totalPenjualan: number;
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
}
