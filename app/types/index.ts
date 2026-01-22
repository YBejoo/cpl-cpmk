// =====================
// ENTITY TYPES - Sistem RPS & CPMK (OBE)
// =====================

// Enum untuk aspek KUL & CPL (S=Sikap, P=Pengetahuan, KU=Keterampilan Umum, KK=Keterampilan Khusus)
export type AspekKUL = 'S' | 'P' | 'KU' | 'KK';
export type AspekCPL = AspekKUL; // CPL mengikuti aspek KUL

// Enum untuk sifat mata kuliah
export type SifatMK = 'Wajib' | 'Pilihan';

// Enum untuk status kurikulum
export type StatusKurikulum = 'Aktif' | 'Arsip';

// =====================
// 1. KURIKULUM - Root/Container Utama
// =====================
export interface Kurikulum {
  id_kurikulum: string;
  nama_kurikulum: string;
  tahun_berlaku: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 2. PROFIL LULUSAN (Kode, Profil Lulusan, Deskripsi, Sumber)
// =====================
export interface ProfilLulusan {
  id_profil: string;
  kode_profil: string;     // PL-01, PL-02, dst
  profil_lulusan: string;  // Nama profil: Software Engineer, Data Analyst, dll
  deskripsi: string;       // Deskripsi detail profil
  sumber: string;          // Sumber referensi profil
  id_kurikulum: string;
  kurikulum?: Kurikulum;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 3. KOMPETENSI UTAMA LULUSAN (Kode, Kompetensi Lulusan, Aspek)
// =====================
export interface KompetensiUtamaLulusan {
  id_kul: string;
  kode_kul: string;              // S1, P1, KU1, KK1, dst
  kompetensi_lulusan: string;    // Deskripsi kompetensi lulusan
  aspek: AspekKUL;               // S, P, KU, KK
  id_kurikulum: string;
  kurikulum?: Kurikulum;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 4. CAPAIAN PEMBELAJARAN LULUSAN (CPL) - Kode, Deskripsi, Aspek (Kompetensi)
// =====================
export interface CPL {
  id_cpl: string;
  kode_cpl: string;        // CPL-01, CPL-02 atau S1, P1, KK1, KU1
  deskripsi_cpl: string;   // Deskripsi capaian
  aspek: AspekCPL;         // Sikap, Pengetahuan, Keterampilan Umum/Khusus (dari KUL)
  id_kurikulum: string;
  kurikulum?: Kurikulum;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 5. BAHAN KAJIAN (Aspek, Kode, Nama, Ranah Keilmuan)
// =====================
export interface BahanKajian {
  id_bahan_kajian: string;
  kode_bk: string;             // BK-01, BK-02, dst
  nama_bahan_kajian: string;
  aspek: AspekKUL;             // S, P, KU, KK (sesuai KUL)
  ranah_keilmuan: string;      // Input text bebas
  id_kurikulum: string;
  kurikulum?: Kurikulum;
  created_at?: Date;
  updated_at?: Date;
}

// Legacy type alias untuk backward compatibility
export type KompetensiUtama = KompetensiUtamaLulusan;

// =====================
// 6. MATA KULIAH (MK) - 1 Bahan Kajian, Multiple CPL
// =====================
export interface MataKuliah {
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;        // 1-8
  sifat: SifatMK;
  deskripsi?: string;
  id_kurikulum: string;
  kurikulum?: Kurikulum;
  bahan_kajian?: BahanKajian;    // Hanya 1 Bahan Kajian
  cpl_list?: CPL[];              // Multiple CPL
  dosen_pengampu?: Dosen[];      // Dosen yang ditugaskan mengampu MK
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 7. DOSEN - Data Dosen Pengampu
// =====================
export interface Dosen {
  id_dosen: string;
  nip: string;
  nama_dosen: string;
  email?: string;
  bidang_keahlian?: string;
  jabatan_fungsional?: string;  // Asisten Ahli, Lektor, Lektor Kepala, Guru Besar
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 7. CAPAIAN PEMBELAJARAN MATA KULIAH (CPMK)
// =====================
export interface CPMK {
  id_cpmk: string;
  kode_cpmk: string;       // M1, M2, dst
  deskripsi_cpmk: string;
  bobot_persentase: number;
  kode_mk: string;
  id_cpl: string;          // Relasi ke CPL
  mata_kuliah?: MataKuliah;
  cpl?: CPL;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 8. SUB-CPMK
// =====================
export interface SubCPMK {
  id_sub_cpmk: string;
  kode_sub: string;        // L1.1, L1.2
  deskripsi_sub_cpmk: string;
  indikator: string;
  kriteria_penilaian: string;
  id_cpmk: string;
  cpmk?: CPMK;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// 9. RENCANA PEMBELAJARAN STUDI (RPS)
// =====================
export interface RPS {
  id_rps: string;
  kode_mk: string;
  versi: number;
  tgl_penyusunan: Date;
  dosen_pengampu: string;
  koordinator_rmk?: string;
  kaprodi?: string;
  deskripsi_mk?: string;
  pustaka_utama?: string;
  pustaka_pendukung?: string;
  media_pembelajaran?: string;
  status: 'Draft' | 'Menunggu Validasi' | 'Terbit';
  mata_kuliah?: MataKuliah;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// PIVOT/JUNCTION TABLES
// =====================

// Relasi Profil Lulusan - CPL (Many to Many)
export interface ProfilCPL {
  id_profil: string;
  id_cpl: string;
}

// Relasi CPL - Bahan Kajian (Many to Many)
export interface CPLBahanKajian {
  id_cpl: string;
  id_bahan_kajian: string;
}

// Relasi Mata Kuliah - Bahan Kajian (Many to Many)
export interface MKBahanKajian {
  kode_mk: string;
  id_bahan_kajian: string;
}

// Relasi CPL - Mata Kuliah / Matrix Mapping (Many to Many)
export interface CPLMataKuliah {
  id_cpl: string;
  kode_mk: string;
  kontribusi?: 'High' | 'Medium' | 'Low';
}

// Sub-CPMK - Pertemuan RPS (Many to Many)
export interface SubCPMKPertemuan {
  id_sub_cpmk: string;
  id_pertemuan: string;
}

// =====================
// PERTEMUAN (Detail RPS per Minggu)
// =====================
export interface Pertemuan {
  id_pertemuan: string;
  id_rps: string;
  pertemuan_ke: number;    // 1-16
  sub_cpmk_ids?: string[];
  bahan_kajian?: string;
  bentuk_pembelajaran: string;
  estimasi_waktu: number;  // dalam menit
  pengalaman_belajar?: string;
  indikator_penilaian?: string;
  bobot_penilaian: number;
  rps?: RPS;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// FORM TYPES
// =====================
export type KurikulumForm = Omit<Kurikulum, 'id_kurikulum' | 'created_at' | 'updated_at'>;
export type ProfilLulusanForm = Omit<ProfilLulusan, 'id_profil' | 'kurikulum' | 'created_at' | 'updated_at'>;
export type CPLForm = Omit<CPL, 'id_cpl' | 'kurikulum' | 'created_at' | 'updated_at'>;
export type KompetensiUtamaLulusanForm = Omit<KompetensiUtamaLulusan, 'id_kul' | 'kurikulum' | 'created_at' | 'updated_at'>;
export type BahanKajianForm = Omit<BahanKajian, 'id_bahan_kajian' | 'kurikulum' | 'created_at' | 'updated_at'>;
export type MataKuliahForm = Omit<MataKuliah, 'kurikulum' | 'bahan_kajian' | 'created_at' | 'updated_at'>;
export type CPMKForm = Omit<CPMK, 'id_cpmk' | 'mata_kuliah' | 'cpl' | 'created_at' | 'updated_at'>;
export type SubCPMKForm = Omit<SubCPMK, 'id_sub_cpmk' | 'cpmk' | 'created_at' | 'updated_at'>;
export type RPSForm = Omit<RPS, 'id_rps' | 'mata_kuliah' | 'created_at' | 'updated_at'>;
export type PertemuanForm = Omit<Pertemuan, 'id_pertemuan' | 'rps' | 'created_at' | 'updated_at'>;

// =====================
// API RESPONSE TYPES
// =====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =====================
// DASHBOARD STATS
// =====================
export interface DashboardStats {
  totalKurikulum: number;
  totalProfilLulusan: number;
  totalCPL: number;
  totalMataKuliah: number;
  totalCPMK: number;
  totalRPS: number;
  rpsSelesai: number;
  rpsDraft: number;
  kurikulumAktif?: Kurikulum[];
  kkm: number; // Kriteria Ketuntasan Minimal
}

// =====================
// MAHASISWA - Data Mahasiswa
// =====================
export interface Mahasiswa {
  nim: string;
  nama_mahasiswa: string;
  angkatan: number;
  prodi?: string;
  email?: string;
  foto_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// NILAI MAHASISWA - Nilai per CPMK/Sub-CPMK
// =====================
export interface NilaiMahasiswa {
  id_nilai: string;
  nim: string;
  kode_mk: string;
  id_cpmk: string;
  nilai: number;
  semester: string; // contoh: "2024/2025 Ganjil"
  mahasiswa?: Mahasiswa;
  mata_kuliah?: MataKuliah;
  cpmk?: CPMK;
  created_at?: Date;
  updated_at?: Date;
}

// =====================
// CHART DATA TYPES
// =====================
export interface CPLDistributionData {
  kode_cpl: string;
  aspek: AspekCPL;
  jumlah_mk: number;
}

export interface RPSStatusData {
  status: string;
  jumlah: number;
}

export interface RecentRPSUpdate {
  id_rps: string;
  nama_mk: string;
  dosen_pengampu: string;
  updated_at: Date;
}

// Grafik Profil Lulusan
export interface ProfilLulusanChartData {
  kode: string;
  nama: string;
  jumlah_cpl: number;
  persentase: number;
}

// Grafik CPL (Bahan Kajian)
export interface CPLChartData {
  kode: string;
  nama: string;
  rata_rata: number;
  jumlah_mk: number;
}

// Grafik Bahan Kajian (Mata Kuliah)
export interface BahanKajianChartData {
  kode: string;
  nama: string;
  rata_rata: number;
  jumlah_mahasiswa: number;
}

// Grafik Mahasiswa di bawah KKM per MK
export interface MahasiswaBawahKKMData {
  kode_mk: string;
  nama_mk: string;
  jumlah_dibawah_kkm: number;
  total_mahasiswa: number;
  persentase: number;
}

// Grafik CPMK per Mata Kuliah
export interface CPMKRataRataData {
  kode_cpmk: string;
  rata_rata: number;
  jumlah_mahasiswa: number;
}

// Data Nilai Mahasiswa per MK (from API)
export interface NilaiMahasiswaPerMK {
  nim: string;
  nama_mahasiswa: string;
  angkatan: number;
  nilai_per_cpmk: { kode_cpmk: string; nilai: number }[];
  nilai_akhir: number;
  status: 'Lulus' | 'Tidak Lulus';
}

// Data untuk Chart Nilai Mahasiswa Individual
export interface MahasiswaNilaiChartItem {
  kode_mk: string;
  nama_mk: string;
  nilai_akhir: number;
  status: string;
}
