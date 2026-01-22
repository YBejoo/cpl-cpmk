import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
  Badge,
  Input,
  Label,
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type {
  DashboardStats,
  ProfilLulusanChartData,
  CPLChartData,
  BahanKajianChartData,
  MahasiswaBawahKKMData,
  CPMKRataRataData,
  Mahasiswa,
  MataKuliah,
  MahasiswaNilaiChartItem,
  NilaiMahasiswaPerMK,
} from "~/types";

// =====================
// =====================
// DUMMY DATA
// =====================

// Data Profil Lulusan
const profilLulusanData: ProfilLulusanChartData[] = [
  { kode: "PL1", nama: "Software Engineer", jumlah_cpl: 8, persentase: 85 },
  { kode: "PL2", nama: "Data Analyst", jumlah_cpl: 6, persentase: 78 },
  { kode: "PL3", nama: "System Administrator", jumlah_cpl: 5, persentase: 72 },
  { kode: "PL4", nama: "IT Consultant", jumlah_cpl: 7, persentase: 80 },
  { kode: "PL5", nama: "Project Manager", jumlah_cpl: 4, persentase: 68 },
];

// Data CPL (Bahan Kajian)
const cplData: CPLChartData[] = [
  { kode: "BK1", nama: "Pemrograman Dasar", rata_rata: 82, jumlah_mk: 12 },
  { kode: "BK2", nama: "Basis Data", rata_rata: 78, jumlah_mk: 8 },
  { kode: "BK3", nama: "Jaringan Komputer", rata_rata: 75, jumlah_mk: 6 },
  { kode: "BK4", nama: "Sistem Informasi", rata_rata: 80, jumlah_mk: 10 },
  { kode: "BK5", nama: "Kecerdasan Buatan", rata_rata: 72, jumlah_mk: 5 },
  { kode: "BK6", nama: "Keamanan Siber", rata_rata: 76, jumlah_mk: 4 },
  { kode: "BK7", nama: "Mobile Development", rata_rata: 79, jumlah_mk: 7 },
];

// Data Bahan Kajian (Mata Kuliah)
const bahanKajianData: BahanKajianChartData[] = [
  { kode: "MK1", nama: "Algoritma & Pemrograman", rata_rata: 78, jumlah_mahasiswa: 120 },
  { kode: "MK2", nama: "Struktur Data", rata_rata: 72, jumlah_mahasiswa: 115 },
  { kode: "MK3", nama: "Basis Data", rata_rata: 80, jumlah_mahasiswa: 110 },
  { kode: "MK4", nama: "Pemrograman Web", rata_rata: 85, jumlah_mahasiswa: 108 },
  { kode: "MK5", nama: "Jaringan Komputer", rata_rata: 68, jumlah_mahasiswa: 105 },
  { kode: "MK6", nama: "Sistem Operasi", rata_rata: 74, jumlah_mahasiswa: 102 },
  { kode: "MK7", nama: "Rekayasa Perangkat Lunak", rata_rata: 82, jumlah_mahasiswa: 98 },
  { kode: "MK8", nama: "Machine Learning", rata_rata: 70, jumlah_mahasiswa: 45 },
];

// Data Mata Kuliah untuk dropdown
const mataKuliahList: MataKuliah[] = [
  { kode_mk: "MK001", nama_mk: "Algoritma & Pemrograman", sks: 3, semester: 1, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK002", nama_mk: "Struktur Data", sks: 3, semester: 2, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK003", nama_mk: "Basis Data", sks: 3, semester: 3, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK004", nama_mk: "Pemrograman Web", sks: 3, semester: 4, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK005", nama_mk: "Jaringan Komputer", sks: 3, semester: 5, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK006", nama_mk: "Sistem Operasi", sks: 3, semester: 3, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK007", nama_mk: "Rekayasa Perangkat Lunak", sks: 3, semester: 5, sifat: "Wajib", id_kurikulum: "1" },
  { kode_mk: "MK008", nama_mk: "Machine Learning", sks: 3, semester: 6, sifat: "Pilihan", id_kurikulum: "1" },
];

// Data Mahasiswa dibawah KKM per semester
const mahasiswaBawahKKMPerMK: Record<string, MahasiswaBawahKKMData[]> = {
  MK001: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 15, total_mahasiswa: 120, persentase: 12.5 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 12, total_mahasiswa: 118, persentase: 10.2 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 18, total_mahasiswa: 125, persentase: 14.4 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 10, total_mahasiswa: 122, persentase: 8.2 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 8, total_mahasiswa: 130, persentase: 6.2 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 14, total_mahasiswa: 128, persentase: 10.9 },
  ],
  MK002: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 20, total_mahasiswa: 115, persentase: 17.4 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 18, total_mahasiswa: 112, persentase: 16.1 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 22, total_mahasiswa: 120, persentase: 18.3 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 15, total_mahasiswa: 118, persentase: 12.7 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 12, total_mahasiswa: 125, persentase: 9.6 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 16, total_mahasiswa: 122, persentase: 13.1 },
  ],
  MK003: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 10, total_mahasiswa: 110, persentase: 9.1 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 8, total_mahasiswa: 108, persentase: 7.4 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 12, total_mahasiswa: 115, persentase: 10.4 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 6, total_mahasiswa: 112, persentase: 5.4 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 9, total_mahasiswa: 120, persentase: 7.5 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 11, total_mahasiswa: 118, persentase: 9.3 },
  ],
  MK004: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 5, total_mahasiswa: 108, persentase: 4.6 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 7, total_mahasiswa: 105, persentase: 6.7 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 8, total_mahasiswa: 112, persentase: 7.1 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 4, total_mahasiswa: 110, persentase: 3.6 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 6, total_mahasiswa: 115, persentase: 5.2 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 9, total_mahasiswa: 118, persentase: 7.6 },
  ],
  MK005: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 25, total_mahasiswa: 105, persentase: 23.8 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 22, total_mahasiswa: 102, persentase: 21.6 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 28, total_mahasiswa: 110, persentase: 25.5 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 18, total_mahasiswa: 108, persentase: 16.7 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 15, total_mahasiswa: 112, persentase: 13.4 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 20, total_mahasiswa: 115, persentase: 17.4 },
  ],
  MK006: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 18, total_mahasiswa: 102, persentase: 17.6 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 15, total_mahasiswa: 100, persentase: 15.0 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 20, total_mahasiswa: 108, persentase: 18.5 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 12, total_mahasiswa: 105, persentase: 11.4 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 10, total_mahasiswa: 110, persentase: 9.1 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 14, total_mahasiswa: 112, persentase: 12.5 },
  ],
  MK007: [
    { kode_mk: "Sem 1", nama_mk: "2021/2022 Ganjil", jumlah_dibawah_kkm: 8, total_mahasiswa: 98, persentase: 8.2 },
    { kode_mk: "Sem 2", nama_mk: "2021/2022 Genap", jumlah_dibawah_kkm: 6, total_mahasiswa: 95, persentase: 6.3 },
    { kode_mk: "Sem 3", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 10, total_mahasiswa: 102, persentase: 9.8 },
    { kode_mk: "Sem 4", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 5, total_mahasiswa: 100, persentase: 5.0 },
    { kode_mk: "Sem 5", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 7, total_mahasiswa: 105, persentase: 6.7 },
    { kode_mk: "Sem 6", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 9, total_mahasiswa: 108, persentase: 8.3 },
  ],
  MK008: [
    { kode_mk: "Sem 1", nama_mk: "2022/2023 Ganjil", jumlah_dibawah_kkm: 12, total_mahasiswa: 45, persentase: 26.7 },
    { kode_mk: "Sem 2", nama_mk: "2022/2023 Genap", jumlah_dibawah_kkm: 10, total_mahasiswa: 42, persentase: 23.8 },
    { kode_mk: "Sem 3", nama_mk: "2023/2024 Ganjil", jumlah_dibawah_kkm: 8, total_mahasiswa: 48, persentase: 16.7 },
    { kode_mk: "Sem 4", nama_mk: "2023/2024 Genap", jumlah_dibawah_kkm: 6, total_mahasiswa: 50, persentase: 12.0 },
  ],
};

// Data CPMK rata-rata per MK
const cpmkRataRataPerMK: Record<string, CPMKRataRataData[]> = {
  MK001: [
    { kode_cpmk: "CPMK1", rata_rata: 82, jumlah_mahasiswa: 120 },
    { kode_cpmk: "CPMK2", rata_rata: 75, jumlah_mahasiswa: 120 },
    { kode_cpmk: "CPMK3", rata_rata: 78, jumlah_mahasiswa: 120 },
    { kode_cpmk: "CPMK4", rata_rata: 85, jumlah_mahasiswa: 120 },
  ],
  MK002: [
    { kode_cpmk: "CPMK1", rata_rata: 70, jumlah_mahasiswa: 115 },
    { kode_cpmk: "CPMK2", rata_rata: 72, jumlah_mahasiswa: 115 },
    { kode_cpmk: "CPMK3", rata_rata: 68, jumlah_mahasiswa: 115 },
  ],
  MK003: [
    { kode_cpmk: "CPMK1", rata_rata: 80, jumlah_mahasiswa: 110 },
    { kode_cpmk: "CPMK2", rata_rata: 78, jumlah_mahasiswa: 110 },
    { kode_cpmk: "CPMK3", rata_rata: 82, jumlah_mahasiswa: 110 },
    { kode_cpmk: "CPMK4", rata_rata: 76, jumlah_mahasiswa: 110 },
    { kode_cpmk: "CPMK5", rata_rata: 79, jumlah_mahasiswa: 110 },
  ],
  MK004: [
    { kode_cpmk: "CPMK1", rata_rata: 88, jumlah_mahasiswa: 108 },
    { kode_cpmk: "CPMK2", rata_rata: 85, jumlah_mahasiswa: 108 },
    { kode_cpmk: "CPMK3", rata_rata: 82, jumlah_mahasiswa: 108 },
  ],
  MK005: [
    { kode_cpmk: "CPMK1", rata_rata: 65, jumlah_mahasiswa: 105 },
    { kode_cpmk: "CPMK2", rata_rata: 68, jumlah_mahasiswa: 105 },
    { kode_cpmk: "CPMK3", rata_rata: 70, jumlah_mahasiswa: 105 },
    { kode_cpmk: "CPMK4", rata_rata: 66, jumlah_mahasiswa: 105 },
  ],
  MK006: [
    { kode_cpmk: "CPMK1", rata_rata: 72, jumlah_mahasiswa: 102 },
    { kode_cpmk: "CPMK2", rata_rata: 74, jumlah_mahasiswa: 102 },
    { kode_cpmk: "CPMK3", rata_rata: 76, jumlah_mahasiswa: 102 },
  ],
  MK007: [
    { kode_cpmk: "CPMK1", rata_rata: 84, jumlah_mahasiswa: 98 },
    { kode_cpmk: "CPMK2", rata_rata: 80, jumlah_mahasiswa: 98 },
    { kode_cpmk: "CPMK3", rata_rata: 82, jumlah_mahasiswa: 98 },
    { kode_cpmk: "CPMK4", rata_rata: 78, jumlah_mahasiswa: 98 },
  ],
  MK008: [
    { kode_cpmk: "CPMK1", rata_rata: 68, jumlah_mahasiswa: 45 },
    { kode_cpmk: "CPMK2", rata_rata: 72, jumlah_mahasiswa: 45 },
    { kode_cpmk: "CPMK3", rata_rata: 70, jumlah_mahasiswa: 45 },
  ],
};

// Data Mahasiswa
const mahasiswaList: Mahasiswa[] = [
  { nim: "2021001", nama_mahasiswa: "Ahmad Fauzi", angkatan: 2021, prodi: "Teknik Informatika", email: "ahmad@mail.com" },
  { nim: "2021002", nama_mahasiswa: "Budi Santoso", angkatan: 2021, prodi: "Teknik Informatika", email: "budi@mail.com" },
  { nim: "2021003", nama_mahasiswa: "Citra Dewi", angkatan: 2021, prodi: "Teknik Informatika", email: "citra@mail.com" },
  { nim: "2021004", nama_mahasiswa: "Dian Pratama", angkatan: 2021, prodi: "Teknik Informatika", email: "dian@mail.com" },
  { nim: "2022001", nama_mahasiswa: "Eka Putra", angkatan: 2022, prodi: "Teknik Informatika", email: "eka@mail.com" },
  { nim: "2022002", nama_mahasiswa: "Fitri Handayani", angkatan: 2022, prodi: "Teknik Informatika", email: "fitri@mail.com" },
  { nim: "2022003", nama_mahasiswa: "Gilang Ramadhan", angkatan: 2022, prodi: "Teknik Informatika", email: "gilang@mail.com" },
  { nim: "2023001", nama_mahasiswa: "Hana Permata", angkatan: 2023, prodi: "Teknik Informatika", email: "hana@mail.com" },
  { nim: "2023002", nama_mahasiswa: "Irfan Maulana", angkatan: 2023, prodi: "Teknik Informatika", email: "irfan@mail.com" },
];

// Data Nilai Mahasiswa per MK
const nilaiMahasiswaPerMK: Record<string, Record<string, NilaiMahasiswaPerMK>> = {
  "2021001": {
    MK001: {
      nim: "2021001",
      nama_mahasiswa: "Ahmad Fauzi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 85 },
        { kode_cpmk: "CPMK2", nilai: 78 },
        { kode_cpmk: "CPMK3", nilai: 82 },
        { kode_cpmk: "CPMK4", nilai: 88 },
      ],
      nilai_akhir: 83.25,
      status: "Lulus",
    },
    MK002: {
      nim: "2021001",
      nama_mahasiswa: "Ahmad Fauzi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 72 },
        { kode_cpmk: "CPMK2", nilai: 68 },
        { kode_cpmk: "CPMK3", nilai: 75 },
      ],
      nilai_akhir: 71.67,
      status: "Lulus",
    },
    MK003: {
      nim: "2021001",
      nama_mahasiswa: "Ahmad Fauzi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 90 },
        { kode_cpmk: "CPMK2", nilai: 85 },
        { kode_cpmk: "CPMK3", nilai: 88 },
      ],
      nilai_akhir: 87.67,
      status: "Lulus",
    },
    MK004: {
      nim: "2021001",
      nama_mahasiswa: "Ahmad Fauzi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 92 },
        { kode_cpmk: "CPMK2", nilai: 88 },
        { kode_cpmk: "CPMK3", nilai: 85 },
      ],
      nilai_akhir: 88.33,
      status: "Lulus",
    },
  },
  "2021002": {
    MK001: {
      nim: "2021002",
      nama_mahasiswa: "Budi Santoso",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 65 },
        { kode_cpmk: "CPMK2", nilai: 70 },
        { kode_cpmk: "CPMK3", nilai: 68 },
        { kode_cpmk: "CPMK4", nilai: 72 },
      ],
      nilai_akhir: 68.75,
      status: "Tidak Lulus",
    },
    MK002: {
      nim: "2021002",
      nama_mahasiswa: "Budi Santoso",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 60 },
        { kode_cpmk: "CPMK2", nilai: 65 },
        { kode_cpmk: "CPMK3", nilai: 62 },
      ],
      nilai_akhir: 62.33,
      status: "Tidak Lulus",
    },
  },
  "2021003": {
    MK001: {
      nim: "2021003",
      nama_mahasiswa: "Citra Dewi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 78 },
        { kode_cpmk: "CPMK2", nilai: 82 },
        { kode_cpmk: "CPMK3", nilai: 80 },
        { kode_cpmk: "CPMK4", nilai: 85 },
      ],
      nilai_akhir: 81.25,
      status: "Lulus",
    },
    MK003: {
      nim: "2021003",
      nama_mahasiswa: "Citra Dewi",
      angkatan: 2021,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 75 },
        { kode_cpmk: "CPMK2", nilai: 78 },
        { kode_cpmk: "CPMK3", nilai: 72 },
      ],
      nilai_akhir: 75.0,
      status: "Lulus",
    },
  },
  "2022001": {
    MK001: {
      nim: "2022001",
      nama_mahasiswa: "Eka Putra",
      angkatan: 2022,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 88 },
        { kode_cpmk: "CPMK2", nilai: 85 },
        { kode_cpmk: "CPMK3", nilai: 90 },
        { kode_cpmk: "CPMK4", nilai: 92 },
      ],
      nilai_akhir: 88.75,
      status: "Lulus",
    },
  },
  "2022002": {
    MK001: {
      nim: "2022002",
      nama_mahasiswa: "Fitri Handayani",
      angkatan: 2022,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 72 },
        { kode_cpmk: "CPMK2", nilai: 75 },
        { kode_cpmk: "CPMK3", nilai: 70 },
        { kode_cpmk: "CPMK4", nilai: 78 },
      ],
      nilai_akhir: 73.75,
      status: "Lulus",
    },
    MK002: {
      nim: "2022002",
      nama_mahasiswa: "Fitri Handayani",
      angkatan: 2022,
      nilai_per_cpmk: [
        { kode_cpmk: "CPMK1", nilai: 68 },
        { kode_cpmk: "CPMK2", nilai: 65 },
        { kode_cpmk: "CPMK3", nilai: 70 },
      ],
      nilai_akhir: 67.67,
      status: "Tidak Lulus",
    },
  },
};

// Stats
const stats: DashboardStats = {
  totalKurikulum: 3,
  totalProfilLulusan: 5,
  totalCPL: 15,
  totalMataKuliah: 142,
  totalCPMK: 350,
  totalRPS: 120,
  rpsSelesai: 98,
  rpsDraft: 22,
  kurikulumAktif: [
    { id_kurikulum: "1", nama_kurikulum: "Kurikulum OBE 2024", tahun_berlaku: 2024, is_active: true },
    { id_kurikulum: "2", nama_kurikulum: "Kurikulum KKNI 2020", tahun_berlaku: 2020, is_active: true },
  ],
  kkm: 70,
};

// Warna untuk chart
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316"];

// =====================
// COMPONENTS
// =====================

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  iconColor?: string;
  iconBgColor?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={iconColor} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Searchable Select Component
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  labelKey,
  valueKey,
}: {
  options: any[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  labelKey: string;
  valueKey: string;
}) {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt[labelKey].toLowerCase().includes(search.toLowerCase()) ||
    opt[valueKey].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Tidak ditemukan
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <SelectItem key={opt[valueKey]} value={opt[valueKey]}>
                {opt[valueKey]} - {opt[labelKey]}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}

export default function DashboardPage() {
  // State untuk KKM
  const [kkm, setKkm] = useState(stats.kkm);

  // State untuk dropdown MK (grafik garis & lingkaran)
  const [selectedMK, setSelectedMK] = useState("MK001");

  // State untuk dropdown Mahasiswa
  const [selectedMahasiswa, setSelectedMahasiswa] = useState("2021001");

  // State untuk search mahasiswa
  const [mahasiswaSearch, setMahasiswaSearch] = useState("");

  // Filter mahasiswa berdasarkan search
  const filteredMahasiswa = mahasiswaList.filter(
    (m) =>
      m.nama_mahasiswa.toLowerCase().includes(mahasiswaSearch.toLowerCase()) ||
      m.nim.includes(mahasiswaSearch)
  );

  // Data mahasiswa yang dipilih
  const selectedMahasiswaData = mahasiswaList.find((m) => m.nim === selectedMahasiswa);

  // Data nilai mahasiswa untuk semua MK
  const nilaiMahasiswaTerpilih = nilaiMahasiswaPerMK[selectedMahasiswa] || {};

  // Compute grafik berdasarkan KKM
  const profilLulusanWithKKM = useMemo(() => {
    return profilLulusanData.map((pl) => ({
      ...pl,
      status: pl.persentase >= kkm ? "Lulus" : "Tidak Lulus",
    }));
  }, [kkm]);

  const cplWithKKM = useMemo(() => {
    return cplData.map((cpl) => ({
      ...cpl,
      status: cpl.rata_rata >= kkm ? "Lulus" : "Tidak Lulus",
    }));
  }, [kkm]);

  const bkWithKKM = useMemo(() => {
    return bahanKajianData.map((bk) => ({
      ...bk,
      status: bk.rata_rata >= kkm ? "Lulus" : "Tidak Lulus",
    }));
  }, [kkm]);

  // Data untuk grafik garis mahasiswa di bawah KKM
  const mahasiswaBawahKKM = mahasiswaBawahKKMPerMK[selectedMK] || mahasiswaBawahKKMPerMK.MK001;

  // Data untuk pie chart CPMK
  const cpmkData = cpmkRataRataPerMK[selectedMK] || cpmkRataRataPerMK.MK001;

  // Nama MK terpilih
  const selectedMKData = mataKuliahList.find((mk) => mk.kode_mk === selectedMK);

  // Data untuk grafik mahasiswa individual
  const mahasiswaNilaiChartData = Object.entries(nilaiMahasiswaTerpilih).map(([kodeMK, nilai]) => ({
    kode_mk: kodeMK,
    nama_mk: mataKuliahList.find((mk) => mk.kode_mk === kodeMK)?.nama_mk || kodeMK,
    nilai_akhir: nilai.nilai_akhir,
    status: nilai.nilai_akhir >= kkm ? "Lulus" : "Tidak Lulus",
  }));

  return (
    <div className="space-y-6">
      {/* Row 1: KKM Setting & Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* KKM Input Card */}
        <Card className="lg:col-span-1 border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="kkm" className="text-sm font-medium flex items-center gap-2">
                <Icons.Settings size={16} className="text-primary" />
                Batas KKM
              </Label>
              <Input
                id="kkm"
                type="number"
                min={0}
                max={100}
                value={kkm}
                onChange={(e) => setKkm(Number(e.target.value))}
                className="text-lg font-bold text-center"
              />
              <p className="text-xs text-muted-foreground text-center">
                Perubahan KKM akan mempengaruhi semua grafik
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <StatCard
          title="Total Mata Kuliah"
          value={stats.totalMataKuliah}
          subtitle="Semester Genap 2024/2025"
          icon={Icons.Book}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Kurikulum Aktif"
          value={stats.kurikulumAktif?.length || 0}
          subtitle={stats.kurikulumAktif?.map((k) => k.nama_kurikulum).join(", ") || "-"}
          icon={Icons.BookOpen}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Total CPL"
          value={stats.totalCPL}
          subtitle="Capaian Pembelajaran Lulusan"
          icon={Icons.Target}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
        <StatCard
          title="Total CPMK"
          value={stats.totalCPMK}
          subtitle="Capaian Pembelajaran MK"
          icon={Icons.CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
      </div>

      {/* Row 2: Grafik Profil Lulusan (Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Users size={20} className="text-blue-600" />
            Grafik Profil Lulusan
          </CardTitle>
          <CardDescription>
            Persentase pencapaian setiap Profil Lulusan (PL1, PL2, PL3, ...) | KKM: {kkm}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profilLulusanWithKKM} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="kode" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProfilLulusanChartData;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                        <p className="font-bold">{data.kode} - {data.nama}</p>
                        <p className="text-sm">Persentase: <span className="font-semibold">{data.persentase}%</span></p>
                        <p className="text-sm">Jumlah CPL: {data.jumlah_cpl}</p>
                        <Badge variant={data.persentase >= kkm ? "default" : "destructive"}>
                          {data.persentase >= kkm ? "Di Atas KKM" : "Di Bawah KKM"}
                        </Badge>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <ReferenceLine y={kkm} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `KKM: ${kkm}`, fill: '#ef4444', fontSize: 12 }} />
              <Bar
                dataKey="persentase"
                name="Persentase Pencapaian (%)"
                radius={[4, 4, 0, 0]}
              >
                {profilLulusanWithKKM.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.persentase >= kkm ? "#3b82f6" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Grafik CPL/Bahan Kajian */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grafik CPL (Bahan Kajian) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Target size={20} className="text-purple-600" />
              Grafik Capaian Pembelajaran Lulusan
            </CardTitle>
            <CardDescription>
              Rata-rata nilai per Bahan Kajian (BK1, BK2, BK3, ...) | KKM: {kkm}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cplWithKKM} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="kode" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CPLChartData;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                          <p className="font-bold">{data.kode} - {data.nama}</p>
                          <p className="text-sm">Rata-rata: <span className="font-semibold">{data.rata_rata}</span></p>
                          <p className="text-sm">Jumlah MK: {data.jumlah_mk}</p>
                          <Badge variant={data.rata_rata >= kkm ? "default" : "destructive"}>
                            {data.rata_rata >= kkm ? "Di Atas KKM" : "Di Bawah KKM"}
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={kkm} stroke="#ef4444" strokeDasharray="5 5" />
                <Bar dataKey="rata_rata" name="Rata-rata Nilai" radius={[4, 4, 0, 0]}>
                  {cplWithKKM.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rata_rata >= kkm ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grafik Bahan Kajian (Mata Kuliah) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Book size={20} className="text-amber-600" />
              Grafik Bahan Kajian (Mata Kuliah)
            </CardTitle>
            <CardDescription>
              Rata-rata nilai per Mata Kuliah (MK1, MK2, MK3, ...) | KKM: {kkm}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bkWithKKM} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="kode" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as BahanKajianChartData;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                          <p className="font-bold">{data.kode} - {data.nama}</p>
                          <p className="text-sm">Rata-rata: <span className="font-semibold">{data.rata_rata}</span></p>
                          <p className="text-sm">Jumlah Mahasiswa: {data.jumlah_mahasiswa}</p>
                          <Badge variant={data.rata_rata >= kkm ? "default" : "destructive"}>
                            {data.rata_rata >= kkm ? "Di Atas KKM" : "Di Bawah KKM"}
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={kkm} stroke="#ef4444" strokeDasharray="5 5" />
                <Bar dataKey="rata_rata" name="Rata-rata Nilai" radius={[4, 4, 0, 0]}>
                  {bkWithKKM.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rata_rata >= kkm ? "#f59e0b" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Grafik Mahasiswa di Bawah KKM per MK (Line Chart) + Pie Chart CPMK */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icons.TrendingDown size={20} className="text-red-600" />
                Mahasiswa di Bawah KKM per Mata Kuliah
              </CardTitle>
              <CardDescription>
                Tren jumlah mahasiswa yang tidak memenuhi KKM ({kkm}) per semester
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <SearchableSelect
                options={mataKuliahList}
                value={selectedMK}
                onChange={setSelectedMK}
                placeholder="Pilih Mata Kuliah"
                searchPlaceholder="Cari MK..."
                labelKey="nama_mk"
                valueKey="kode_mk"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Line Chart - Mahasiswa di bawah KKM */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium mb-4">
                {selectedMKData?.nama_mk || "Mata Kuliah"} - Tren Mahasiswa di Bawah KKM
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={mahasiswaBawahKKM} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nama_mk" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as MahasiswaBawahKKMData;
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                            <p className="font-bold">{data.nama_mk}</p>
                            <p className="text-sm text-red-600">Di Bawah KKM: <span className="font-semibold">{data.jumlah_dibawah_kkm}</span></p>
                            <p className="text-sm">Total Mahasiswa: {data.total_mahasiswa}</p>
                            <p className="text-sm">Persentase: {data.persentase.toFixed(1)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="jumlah_dibawah_kkm"
                    name="Jumlah Mahasiswa di Bawah KKM"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - CPMK */}
            <div>
              <h4 className="text-sm font-medium mb-4">Rata-rata Nilai per CPMK</h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={cpmkData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="rata_rata"
                    nameKey="kode_cpmk"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {cpmkData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.rata_rata >= kkm ? COLORS[index % COLORS.length] : "#ef4444"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CPMKRataRataData;
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                            <p className="font-bold">{data.kode_cpmk}</p>
                            <p className="text-sm">Rata-rata: <span className="font-semibold">{data.rata_rata}</span></p>
                            <p className="text-sm">Jumlah Mahasiswa: {data.jumlah_mahasiswa}</p>
                            <Badge variant={data.rata_rata >= kkm ? "default" : "destructive"}>
                              {data.rata_rata >= kkm ? "Di Atas KKM" : "Di Bawah KKM"}
                            </Badge>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 5: Grafik per Mahasiswa */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icons.User size={20} className="text-green-600" />
                Grafik Nilai per Mahasiswa
              </CardTitle>
              <CardDescription>
                Lihat detail pencapaian nilai setiap mahasiswa per Mata Kuliah
              </CardDescription>
            </div>
            <div className="w-full sm:w-72">
              <Select value={selectedMahasiswa} onValueChange={setSelectedMahasiswa}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Mahasiswa" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Cari NIM/Nama..."
                      value={mahasiswaSearch}
                      onChange={(e) => setMahasiswaSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredMahasiswa.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Tidak ditemukan
                      </div>
                    ) : (
                      filteredMahasiswa.map((mhs) => (
                        <SelectItem key={mhs.nim} value={mhs.nim}>
                          {mhs.nim} - {mhs.nama_mahasiswa}
                        </SelectItem>
                      ))
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Info Mahasiswa */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icons.User size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedMahasiswaData?.nama_mahasiswa || "-"}</h3>
                    <p className="text-sm text-muted-foreground">NIM: {selectedMahasiswaData?.nim || "-"}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Angkatan:</span>
                    <span className="font-medium">{selectedMahasiswaData?.angkatan || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program Studi:</span>
                    <span className="font-medium">{selectedMahasiswaData?.prodi || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedMahasiswaData?.email || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Ringkasan Nilai</h4>
                <div className="space-y-2">
                  {mahasiswaNilaiChartData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada data nilai</p>
                  ) : (
                    mahasiswaNilaiChartData.map((mk) => (
                      <div key={mk.kode_mk} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{mk.kode_mk}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mk.nilai_akhir.toFixed(1)}</span>
                          <Badge variant={mk.status === "Lulus" ? "default" : "destructive"} className="text-xs">
                            {mk.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chart Nilai per MK */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium mb-4">Nilai Akhir per Mata Kuliah</h4>
              {mahasiswaNilaiChartData.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <Icons.FileText size={48} className="mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">Belum ada data nilai untuk mahasiswa ini</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mahasiswaNilaiChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="kode_mk"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as MahasiswaNilaiChartItem;
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                              <p className="font-bold">{data.kode_mk}</p>
                              <p className="text-sm text-muted-foreground">{data.nama_mk}</p>
                              <p className="text-sm">Nilai Akhir: <span className="font-semibold">{data.nilai_akhir.toFixed(1)}</span></p>
                              <Badge variant={data.status === "Lulus" ? "default" : "destructive"}>
                                {data.status}
                              </Badge>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <ReferenceLine y={kkm} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `KKM: ${kkm}`, fill: '#ef4444', fontSize: 12 }} />
                    <Bar dataKey="nilai_akhir" name="Nilai Akhir" radius={[4, 4, 0, 0]}>
                      {mahasiswaNilaiChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.nilai_akhir >= kkm ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}