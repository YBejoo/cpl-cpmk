export const APP_NAME = "SI-CAP";
export const APP_DESCRIPTION = "Sistem Informasi Capaian Pembelajaran - Manajemen RPS & CPMK berbasis OBE";
export const PRODI_NAME = "Prodi Manajemen Informatika";
export const UNIVERSITAS_NAME = "Universitas Sriwijaya";

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { title: "Kurikulum", href: "/kurikulum", icon: "BookOpen" },
  { title: "Profil Lulusan", href: "/profil-lulusan", icon: "GraduationCap" },
  { title: "KUL", href: "/kompetensi-utama", icon: "Award" },
  { title: "CPL", href: "/cpl", icon: "Target" },
  { title: "Bahan Kajian", href: "/bahan-kajian", icon: "Layers" },
  { title: "Mata Kuliah", href: "/mata-kuliah", icon: "Book" },
  { title: "RPS", href: "/rps", icon: "FileText" },
  { title: "Laporan", href: "/laporan", icon: "BarChart3" },
] as const;

export const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - 5 + i;
  return { value: year.toString(), label: year.toString() };
});

export const SEMESTER_OPTIONS = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
  { value: "5", label: "Semester 5" },
  { value: "6", label: "Semester 6" },
  { value: "7", label: "Semester 7" },
  { value: "8", label: "Semester 8" },
];

export const SIFAT_MK_OPTIONS = [
  { value: "Wajib", label: "Wajib" },
  { value: "Pilihan", label: "Pilihan" },
];

// Aspek KUL & CPL (S=Sikap, P=Pengetahuan, KU=Keterampilan Umum, KK=Keterampilan Khusus)
export const ASPEK_OPTIONS = [
  { value: "S", label: "S - Sikap" },
  { value: "P", label: "P - Pengetahuan" },
  { value: "KU", label: "KU - Keterampilan Umum" },
  { value: "KK", label: "KK - Keterampilan Khusus" },
];

// Alias untuk backward compatibility
export const ASPEK_CPL_OPTIONS = ASPEK_OPTIONS;
export const ASPEK_KUL_OPTIONS = ASPEK_OPTIONS;

export const STATUS_RPS_OPTIONS = [
  { value: "Draft", label: "Draft" },
  { value: "Menunggu Validasi", label: "Menunggu Validasi" },
  { value: "Terbit", label: "Terbit" },
];

export const METODE_PEMBELAJARAN_OPTIONS = [
  { value: "ceramah", label: "Ceramah" },
  { value: "diskusi", label: "Diskusi" },
  { value: "praktikum", label: "Praktikum" },
  { value: "presentasi", label: "Presentasi" },
  { value: "project", label: "Project Based Learning" },
  { value: "studi_kasus", label: "Studi Kasus" },
  { value: "demonstrasi", label: "Demonstrasi" },
  { value: "collaborative", label: "Collaborative Learning" },
  { value: "problem_based", label: "Problem Based Learning" },
];

export const BENTUK_PENILAIAN_OPTIONS = [
  { value: "uts", label: "UTS" },
  { value: "uas", label: "UAS" },
  { value: "tugas", label: "Tugas" },
  { value: "kuis", label: "Kuis" },
  { value: "praktikum", label: "Praktikum" },
  { value: "project", label: "Project" },
  { value: "presentasi", label: "Presentasi" },
  { value: "portofolio", label: "Portofolio" },
  { value: "unjuk_kerja", label: "Unjuk Kerja" },
];

export const LEVEL_KKNI_OPTIONS = Array.from({ length: 9 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Level ${i + 1}`,
}));
