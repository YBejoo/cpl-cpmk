import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
  Button,
  Badge,
  Input,
  Label,
  Textarea,
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import type { MataKuliah, BahanKajian, SifatMK, CPL, AspekKUL } from "~/types";
import { SEMESTER_OPTIONS, SIFAT_MK_OPTIONS, ASPEK_KUL_OPTIONS } from "~/lib/constants";

// Dummy CPL data
const dummyCPL: CPL[] = [
  { id_cpl: "1", kode_cpl: "S1", aspek: "S", deskripsi_cpl: "Bertakwa kepada Tuhan YME", id_kurikulum: "1" },
  { id_cpl: "2", kode_cpl: "S2", aspek: "S", deskripsi_cpl: "Menjunjung tinggi nilai kemanusiaan", id_kurikulum: "1" },
  { id_cpl: "3", kode_cpl: "P1", aspek: "P", deskripsi_cpl: "Menguasai konsep teoretis bidang TI", id_kurikulum: "1" },
  { id_cpl: "4", kode_cpl: "P2", aspek: "P", deskripsi_cpl: "Menguasai prinsip rekayasa perangkat lunak", id_kurikulum: "1" },
  { id_cpl: "5", kode_cpl: "KU1", aspek: "KU", deskripsi_cpl: "Mampu menerapkan pemikiran logis dan kritis", id_kurikulum: "1" },
  { id_cpl: "6", kode_cpl: "KU2", aspek: "KU", deskripsi_cpl: "Mampu menunjukkan kinerja mandiri", id_kurikulum: "1" },
  { id_cpl: "7", kode_cpl: "KK1", aspek: "KK", deskripsi_cpl: "Mampu merancang sistem informasi", id_kurikulum: "1" },
  { id_cpl: "8", kode_cpl: "KK2", aspek: "KK", deskripsi_cpl: "Mampu mengembangkan aplikasi web dan mobile", id_kurikulum: "1" },
];

// Dummy Bahan Kajian
const dummyBahanKajian: BahanKajian[] = [
  { id_bahan_kajian: "1", kode_bk: "BK-01", nama_bahan_kajian: "Algoritma dan Pemrograman", aspek: "P", ranah_keilmuan: "Ilmu Komputer Dasar", id_kurikulum: "1" },
  { id_bahan_kajian: "2", kode_bk: "BK-02", nama_bahan_kajian: "Struktur Data", aspek: "P", ranah_keilmuan: "Ilmu Komputer Dasar", id_kurikulum: "1" },
  { id_bahan_kajian: "3", kode_bk: "BK-03", nama_bahan_kajian: "Basis Data", aspek: "KK", ranah_keilmuan: "Sistem Informasi", id_kurikulum: "1" },
  { id_bahan_kajian: "4", kode_bk: "BK-04", nama_bahan_kajian: "Jaringan Komputer", aspek: "KK", ranah_keilmuan: "Infrastruktur TI", id_kurikulum: "1" },
  { id_bahan_kajian: "5", kode_bk: "BK-05", nama_bahan_kajian: "Rekayasa Perangkat Lunak", aspek: "KK", ranah_keilmuan: "Pengembangan Perangkat Lunak", id_kurikulum: "1" },
  { id_bahan_kajian: "6", kode_bk: "BK-06", nama_bahan_kajian: "Pengembangan Web", aspek: "KK", ranah_keilmuan: "Pengembangan Aplikasi", id_kurikulum: "1" },
  { id_bahan_kajian: "7", kode_bk: "BK-07", nama_bahan_kajian: "Etika Profesi TI", aspek: "S", ranah_keilmuan: "Etika dan Profesionalisme", id_kurikulum: "1" },
  { id_bahan_kajian: "8", kode_bk: "BK-08", nama_bahan_kajian: "Manajemen Proyek TI", aspek: "KU", ranah_keilmuan: "Manajemen", id_kurikulum: "1" },
];

// Dummy Mata Kuliah (1 BK, multiple CPL)
const initialMataKuliah: MataKuliah[] = [
  {
    kode_mk: "INF101",
    nama_mk: "Pemrograman Dasar",
    sks: 3,
    semester: 1,
    sifat: "Wajib",
    deskripsi: "Pengantar konsep pemrograman komputer",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[0], // BK-01
    cpl_list: [dummyCPL[2], dummyCPL[4]], // P1, KU1
  },
  {
    kode_mk: "INF102",
    nama_mk: "Struktur Data",
    sks: 3,
    semester: 2,
    sifat: "Wajib",
    deskripsi: "Konsep dan implementasi struktur data",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[1], // BK-02
    cpl_list: [dummyCPL[2], dummyCPL[4], dummyCPL[6]], // P1, KU1, KK1
  },
  {
    kode_mk: "INF201",
    nama_mk: "Basis Data",
    sks: 3,
    semester: 3,
    sifat: "Wajib",
    deskripsi: "Perancangan dan implementasi basis data",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[2], // BK-03
    cpl_list: [dummyCPL[3], dummyCPL[6]], // P2, KK1
  },
  {
    kode_mk: "INF301",
    nama_mk: "Pemrograman Web",
    sks: 3,
    semester: 4,
    sifat: "Wajib",
    deskripsi: "Pengembangan aplikasi berbasis web",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[5], // BK-06
    cpl_list: [dummyCPL[6], dummyCPL[7]], // KK1, KK2
  },
  {
    kode_mk: "INF302",
    nama_mk: "Jaringan Komputer",
    sks: 3,
    semester: 4,
    sifat: "Wajib",
    deskripsi: "Konsep dan implementasi jaringan komputer",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[3], // BK-04
    cpl_list: [dummyCPL[3], dummyCPL[6]], // P2, KK1
  },
  {
    kode_mk: "INF401",
    nama_mk: "Rekayasa Perangkat Lunak",
    sks: 3,
    semester: 5,
    sifat: "Wajib",
    deskripsi: "Metodologi pengembangan perangkat lunak",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[4], // BK-05
    cpl_list: [dummyCPL[3], dummyCPL[5], dummyCPL[6]], // P2, KU2, KK1
  },
  {
    kode_mk: "INF402",
    nama_mk: "Etika Profesi",
    sks: 2,
    semester: 6,
    sifat: "Wajib",
    deskripsi: "Etika dan profesionalisme di bidang TI",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[6], // BK-07
    cpl_list: [dummyCPL[0], dummyCPL[1]], // S1, S2
  },
  {
    kode_mk: "INF403",
    nama_mk: "Manajemen Proyek TI",
    sks: 3,
    semester: 7,
    sifat: "Pilihan",
    deskripsi: "Pengelolaan proyek teknologi informasi",
    id_kurikulum: "1",
    bahan_kajian: dummyBahanKajian[7], // BK-08
    cpl_list: [dummyCPL[4], dummyCPL[5]], // KU1, KU2
  },
];

// Aspek Badge Component
function AspekBadge({ aspek }: { aspek: AspekKUL }) {
  const colors: Record<AspekKUL, string> = {
    S: "bg-blue-100 text-blue-700",
    P: "bg-purple-100 text-purple-700",
    KU: "bg-amber-100 text-amber-700",
    KK: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[aspek]}`}>
      {aspek}
    </span>
  );
}

// CPL Tag Component
function CPLTag({ cpl }: { cpl: CPL }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
      {cpl.kode_cpl}
    </span>
  );
}

export default function MataKuliahPage() {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>(initialMataKuliah);
  const [cplList] = useState<CPL[]>(dummyCPL);
  const [bkList] = useState<BahanKajian[]>(dummyBahanKajian);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [filterSifat, setFilterSifat] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMK, setEditingMK] = useState<MataKuliah | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMK, setDeletingMK] = useState<MataKuliah | null>(null);
  
  // Tab state for MK List vs Matrix
  const [activeTab, setActiveTab] = useState<"list" | "matrix">("list");
  
  // Matrix CPL-MK mappings
  const [matrixMappings, setMatrixMappings] = useState<Record<string, string[]>>(() => {
    // Initialize from existing MK data
    const mappings: Record<string, string[]> = {};
    cplList.forEach(cpl => {
      mappings[cpl.id_cpl] = initialMataKuliah
        .filter(mk => mk.cpl_list?.some(c => c.id_cpl === cpl.id_cpl))
        .map(mk => mk.kode_mk);
    });
    return mappings;
  });

  // Form state
  const [formData, setFormData] = useState({
    kode_mk: "",
    nama_mk: "",
    sks: 3,
    semester: 1,
    sifat: "Wajib" as SifatMK,
    deskripsi: "",
    bahan_kajian_id: "",
    cpl_ids: [] as string[],
  });

  // Filter mata kuliah
  const filteredMK = mataKuliahList.filter((mk) => {
    const matchSearch =
      mk.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mk.nama_mk.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSemester =
      filterSemester === "all" || mk.semester.toString() === filterSemester;
    const matchSifat = filterSifat === "all" || mk.sifat === filterSifat;
    return matchSearch && matchSemester && matchSifat;
  });

  // Toggle CPL selection
  const toggleCPL = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      cpl_ids: prev.cpl_ids.includes(id)
        ? prev.cpl_ids.filter((cpl) => cpl !== id)
        : [...prev.cpl_ids, id],
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    const selectedBK = bkList.find((bk) => bk.id_bahan_kajian === formData.bahan_kajian_id);
    const selectedCPLs = cplList.filter((cpl) => formData.cpl_ids.includes(cpl.id_cpl));

    if (editingMK) {
      setMataKuliahList((prev) =>
        prev.map((mk) =>
          mk.kode_mk === editingMK.kode_mk
            ? {
                ...mk,
                nama_mk: formData.nama_mk,
                sks: formData.sks,
                semester: formData.semester,
                sifat: formData.sifat,
                deskripsi: formData.deskripsi,
                bahan_kajian: selectedBK,
                cpl_list: selectedCPLs,
              }
            : mk
        )
      );
    } else {
      const newMK: MataKuliah = {
        kode_mk: formData.kode_mk,
        nama_mk: formData.nama_mk,
        sks: formData.sks,
        semester: formData.semester,
        sifat: formData.sifat,
        deskripsi: formData.deskripsi,
        id_kurikulum: "1",
        bahan_kajian: selectedBK,
        cpl_list: selectedCPLs,
      };
      setMataKuliahList((prev) => [...prev, newMK]);
    }
    handleCloseDialog();
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingMK) {
      setMataKuliahList((prev) =>
        prev.filter((mk) => mk.kode_mk !== deletingMK.kode_mk)
      );
      setIsDeleteDialogOpen(false);
      setDeletingMK(null);
    }
  };

  // Open dialog
  const openDialog = (mk?: MataKuliah) => {
    if (mk) {
      setEditingMK(mk);
      setFormData({
        kode_mk: mk.kode_mk,
        nama_mk: mk.nama_mk,
        sks: mk.sks,
        semester: mk.semester,
        sifat: mk.sifat,
        deskripsi: mk.deskripsi || "",
        bahan_kajian_id: mk.bahan_kajian?.id_bahan_kajian || "",
        cpl_ids: mk.cpl_list?.map((cpl) => cpl.id_cpl) || [],
      });
    } else {
      setEditingMK(null);
      setFormData({
        kode_mk: "",
        nama_mk: "",
        sks: 3,
        semester: 1,
        sifat: "Wajib",
        deskripsi: "",
        bahan_kajian_id: "",
        cpl_ids: [],
      });
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMK(null);
  };

  // Matrix functions
  const toggleMatrixMapping = (cplId: string, mkKode: string) => {
    setMatrixMappings((prev) => {
      const current = prev[cplId] || [];
      if (current.includes(mkKode)) {
        return { ...prev, [cplId]: current.filter((kode) => kode !== mkKode) };
      } else {
        return { ...prev, [cplId]: [...current, mkKode] };
      }
    });
  };

  const hasMatrixMapping = (cplId: string, mkKode: string) => {
    return matrixMappings[cplId]?.includes(mkKode) || false;
  };

  const countCPLMatrixMappings = (cplId: string) => {
    return matrixMappings[cplId]?.length || 0;
  };

  const countMKMatrixMappings = (mkKode: string) => {
    return Object.values(matrixMappings).filter((mks) => mks.includes(mkKode)).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total MK</p>
                <p className="text-2xl font-bold">{mataKuliahList.length}</p>
              </div>
              <Icons.Book className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MK Wajib</p>
                <p className="text-2xl font-bold">{mataKuliahList.filter(mk => mk.sifat === "Wajib").length}</p>
              </div>
              <Badge>Wajib</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MK Pilihan</p>
                <p className="text-2xl font-bold">{mataKuliahList.filter(mk => mk.sifat === "Pilihan").length}</p>
              </div>
              <Badge variant="secondary">Pilihan</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total SKS</p>
                <p className="text-2xl font-bold">{mataKuliahList.reduce((sum, mk) => sum + mk.sks, 0)}</p>
              </div>
              <Icons.FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "list" ? "default" : "outline"}
                onClick={() => setActiveTab("list")}
              >
                <Icons.List size={16} className="mr-2" />
                Daftar MK
              </Button>
              <Button
                variant={activeTab === "matrix" ? "default" : "outline"}
                onClick={() => setActiveTab("matrix")}
              >
                <Icons.Grid3X3 size={16} className="mr-2" />
                Matrix CPL-MK
              </Button>
            </div>
            {activeTab === "list" && (
              <Button onClick={() => openDialog()}>
                <Icons.Plus size={16} className="mr-2" />
                Tambah MK
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MK List Tab */}
      {activeTab === "list" && (
        <>
          {/* Action Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                  <div className="relative flex-1 max-w-sm">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari mata kuliah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterSemester} onValueChange={setFilterSemester}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Semester</SelectItem>
                      {SEMESTER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSifat} onValueChange={setFilterSifat}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Sifat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Sifat</SelectItem>
                      {SIFAT_MK_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Mata Kuliah</CardTitle>
              <CardDescription>
                Total {filteredMK.length} mata kuliah ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Kode</TableHead>
                    <TableHead>Nama Mata Kuliah</TableHead>
                    <TableHead className="w-16 text-center">SKS</TableHead>
                    <TableHead className="w-20 text-center">Semester</TableHead>
                    <TableHead className="w-20">Sifat</TableHead>
                    <TableHead className="w-32">Bahan Kajian</TableHead>
                    <TableHead>CPL</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMK.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Icons.Book size={40} className="opacity-50" />
                          <p>Tidak ada data mata kuliah</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMK.map((mk) => (
                      <TableRow key={mk.kode_mk} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-sm text-blue-600 font-bold">
                          {mk.kode_mk}
                        </TableCell>
                        <TableCell className="font-medium">{mk.nama_mk}</TableCell>
                        <TableCell className="text-center">{mk.sks}</TableCell>
                        <TableCell className="text-center">{mk.semester}</TableCell>
                        <TableCell>
                          <Badge
                            variant={mk.sifat === "Wajib" ? "default" : "secondary"}
                          >
                            {mk.sifat}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {mk.bahan_kajian && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {mk.bahan_kajian.kode_bk}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {mk.cpl_list?.map((cpl) => (
                              <CPLTag key={cpl.id_cpl} cpl={cpl} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDialog(mk)}
                            >
                              <Icons.Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingMK(mk);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Icons.Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Matrix CPL-MK Tab */}
      {activeTab === "matrix" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Grid3X3 size={20} />
              Matrix CPL - Mata Kuliah
            </CardTitle>
            <CardDescription>
              Klik pada sel untuk menghubungkan CPL dengan Mata Kuliah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="sticky left-0 bg-gray-50 z-20 px-4 py-3 border-b border-r text-left text-sm font-semibold text-gray-900 min-w-48">
                      CPL
                    </th>
                    {mataKuliahList.map((mk) => (
                      <th
                        key={mk.kode_mk}
                        className="px-2 py-3 border-b text-center text-sm font-semibold text-gray-900 min-w-20"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">{mk.kode_mk}</span>
                          <span className="text-xs font-normal text-muted-foreground truncate max-w-16" title={mk.nama_mk}>
                            Sem {mk.semester}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-3 border-b border-l text-center text-sm font-semibold text-gray-900 min-w-16">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cplList.map((cpl, idx) => (
                    <tr key={cpl.id_cpl} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="sticky left-0 bg-inherit z-10 px-4 py-3 border-b border-r">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-blue-600">
                            {cpl.kode_cpl}
                          </span>
                          <AspekBadge aspek={cpl.aspek} />
                        </div>
                        <span className="text-muted-foreground text-xs line-clamp-1 max-w-40 mt-1" title={cpl.deskripsi_cpl}>
                          {cpl.deskripsi_cpl}
                        </span>
                      </td>
                      {mataKuliahList.map((mk) => (
                        <td
                          key={mk.kode_mk}
                          className="px-2 py-3 border-b text-center"
                        >
                          <button
                            onClick={() => toggleMatrixMapping(cpl.id_cpl, mk.kode_mk)}
                            className={`w-7 h-7 rounded-md border-2 transition-all flex items-center justify-center ${
                              hasMatrixMapping(cpl.id_cpl, mk.kode_mk)
                                ? "bg-green-500 border-green-600 text-white"
                                : "bg-white border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {hasMatrixMapping(cpl.id_cpl, mk.kode_mk) && (
                              <Icons.Check size={14} />
                            )}
                          </button>
                        </td>
                      ))}
                      <td className="px-3 py-3 border-b border-l text-center font-semibold">
                        {countCPLMatrixMappings(cpl.id_cpl)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="sticky left-0 bg-gray-100 z-10 px-4 py-3 border-t-2">
                      Total CPL per MK
                    </td>
                    {mataKuliahList.map((mk) => (
                      <td key={mk.kode_mk} className="px-2 py-3 border-t-2 text-center">
                        {countMKMatrixMappings(mk.kode_mk)}
                      </td>
                    ))}
                    <td className="px-3 py-3 border-t-2 border-l text-center">
                      {Object.values(matrixMappings).flat().length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Info Box */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-3">
                <Icons.AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Petunjuk Pengisian Matrix</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Klik pada sel untuk menandai/menghapus relasi antara CPL dan Mata Kuliah</li>
                    <li>Kolom Total menunjukkan jumlah MK yang mendukung CPL tersebut</li>
                    <li>Baris Total menunjukkan jumlah CPL yang dicapai oleh setiap Mata Kuliah</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMK ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </DialogTitle>
            <DialogDescription>
              Lengkapi informasi mata kuliah, pilih 1 Bahan Kajian dan pilih CPL yang relevan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kode_mk">Kode MK</Label>
                <Input
                  id="kode_mk"
                  placeholder="INF101"
                  value={formData.kode_mk}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, kode_mk: e.target.value }))
                  }
                  disabled={!!editingMK}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama_mk">Nama Mata Kuliah</Label>
                <Input
                  id="nama_mk"
                  placeholder="Pemrograman Dasar"
                  value={formData.nama_mk}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama_mk: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sks">SKS</Label>
                <Input
                  id="sks"
                  type="number"
                  min={1}
                  max={6}
                  value={formData.sks}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sks: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, semester: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sifat">Sifat</Label>
                <Select
                  value={formData.sifat}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, sifat: value as SifatMK }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sifat" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIFAT_MK_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi mata kuliah..."
                rows={2}
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Bahan Kajian (Pilih 1)</Label>
              <Select
                value={formData.bahan_kajian_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, bahan_kajian_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bahan Kajian" />
                </SelectTrigger>
                <SelectContent>
                  {bkList.map((bk) => (
                    <SelectItem key={bk.id_bahan_kajian} value={bk.id_bahan_kajian}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{bk.kode_bk}</span>
                        <span>-</span>
                        <span>{bk.nama_bahan_kajian}</span>
                        <AspekBadge aspek={bk.aspek} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Capaian Pembelajaran Lulusan (CPL) - Pilih minimal 2</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {cplList.map((cpl) => (
                    <label
                      key={cpl.id_cpl}
                      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        formData.cpl_ids.includes(cpl.id_cpl)
                          ? "bg-indigo-50 border border-indigo-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.cpl_ids.includes(cpl.id_cpl)}
                        onChange={() => toggleCPL(cpl.id_cpl)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{cpl.kode_cpl}</span>
                          <AspekBadge aspek={cpl.aspek} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{cpl.deskripsi_cpl}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Terpilih: {formData.cpl_ids.length} CPL
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.kode_mk.trim() ||
                !formData.nama_mk.trim() ||
                !formData.bahan_kajian_id ||
                formData.cpl_ids.length < 2
              }
            >
              {editingMK ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Mata Kuliah</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus mata kuliah "{deletingMK?.nama_mk}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
