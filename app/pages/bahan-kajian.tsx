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
import type { BahanKajian, AspekKUL, CPL } from "~/types";
import { ASPEK_KUL_OPTIONS } from "~/lib/constants";

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

// Dummy Bahan Kajian data
const initialBahanKajian: BahanKajian[] = [
  { id_bahan_kajian: "1", kode_bk: "BK-01", nama_bahan_kajian: "Algoritma dan Pemrograman", aspek: "P", ranah_keilmuan: "Ilmu Komputer Dasar", id_kurikulum: "1" },
  { id_bahan_kajian: "2", kode_bk: "BK-02", nama_bahan_kajian: "Struktur Data", aspek: "P", ranah_keilmuan: "Ilmu Komputer Dasar", id_kurikulum: "1" },
  { id_bahan_kajian: "3", kode_bk: "BK-03", nama_bahan_kajian: "Basis Data", aspek: "KK", ranah_keilmuan: "Sistem Informasi", id_kurikulum: "1" },
  { id_bahan_kajian: "4", kode_bk: "BK-04", nama_bahan_kajian: "Jaringan Komputer", aspek: "KK", ranah_keilmuan: "Infrastruktur TI", id_kurikulum: "1" },
  { id_bahan_kajian: "5", kode_bk: "BK-05", nama_bahan_kajian: "Rekayasa Perangkat Lunak", aspek: "KK", ranah_keilmuan: "Pengembangan Perangkat Lunak", id_kurikulum: "1" },
  { id_bahan_kajian: "6", kode_bk: "BK-06", nama_bahan_kajian: "Pengembangan Web", aspek: "KK", ranah_keilmuan: "Pengembangan Aplikasi", id_kurikulum: "1" },
  { id_bahan_kajian: "7", kode_bk: "BK-07", nama_bahan_kajian: "Etika Profesi TI", aspek: "S", ranah_keilmuan: "Etika dan Profesionalisme", id_kurikulum: "1" },
  { id_bahan_kajian: "8", kode_bk: "BK-08", nama_bahan_kajian: "Manajemen Proyek TI", aspek: "KU", ranah_keilmuan: "Manajemen", id_kurikulum: "1" },
];

// Aspek Badge Component
function AspekBadge({ aspek }: { aspek: AspekKUL }) {
  const colors: Record<AspekKUL, string> = {
    S: "bg-blue-100 text-blue-700",
    P: "bg-purple-100 text-purple-700",
    KU: "bg-amber-100 text-amber-700",
    KK: "bg-green-100 text-green-700",
  };
  
  const labels: Record<AspekKUL, string> = {
    S: "Sikap",
    P: "Pengetahuan",
    KU: "Keterampilan Umum",
    KK: "Keterampilan Khusus",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[aspek]}`} title={labels[aspek]}>
      {aspek}
    </span>
  );
}

export default function BahanKajianPage() {
  const [bkList, setBkList] = useState<BahanKajian[]>(initialBahanKajian);
  const [cplList] = useState<CPL[]>(dummyCPL);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAspek, setFilterAspek] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBK, setEditingBK] = useState<BahanKajian | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingBK, setDeletingBK] = useState<BahanKajian | null>(null);
  
  // Tab state for BK List vs Matrix
  const [activeTab, setActiveTab] = useState<"list" | "matrix">("list");
  
  // Matrix CPL-BK mappings (CPL -> BK[])
  const [matrixMappings, setMatrixMappings] = useState<Record<string, string[]>>({
    "1": ["7"],           // S1 -> BK-07
    "2": ["7"],           // S2 -> BK-07
    "3": ["1", "2"],      // P1 -> BK-01, BK-02
    "4": ["5"],           // P2 -> BK-05
    "5": ["1", "8"],      // KU1 -> BK-01, BK-08
    "6": ["8"],           // KU2 -> BK-08
    "7": ["3", "5", "6"], // KK1 -> BK-03, BK-05, BK-06
    "8": ["6"],           // KK2 -> BK-06
  });

  // Form state
  const [formData, setFormData] = useState({
    kode_bk: "",
    nama_bahan_kajian: "",
    aspek: "P" as AspekKUL,
    ranah_keilmuan: "",
  });

  // Filter Bahan Kajian
  const filteredBK = bkList.filter((bk) => {
    const matchSearch =
      bk.nama_bahan_kajian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.kode_bk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.ranah_keilmuan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAspek = filterAspek === "all" || bk.aspek === filterAspek;
    return matchSearch && matchAspek;
  });

  // Group by aspek for stats
  const aspekStats = ASPEK_KUL_OPTIONS.map((opt) => ({
    aspek: opt.label,
    value: opt.value,
    count: bkList.filter((bk) => bk.aspek === opt.value).length,
  }));

  // Handle form submit
  const handleSubmit = () => {
    if (editingBK) {
      setBkList((prev) =>
        prev.map((bk) =>
          bk.id_bahan_kajian === editingBK.id_bahan_kajian
            ? { ...bk, ...formData }
            : bk
        )
      );
    } else {
      const newBK: BahanKajian = {
        id_bahan_kajian: Date.now().toString(),
        ...formData,
        id_kurikulum: "1",
      };
      setBkList((prev) => [...prev, newBK]);
    }
    handleCloseDialog();
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingBK) {
      setBkList((prev) => prev.filter((bk) => bk.id_bahan_kajian !== deletingBK.id_bahan_kajian));
      setIsDeleteDialogOpen(false);
      setDeletingBK(null);
    }
  };

  // Open dialog
  const openDialog = (bk?: BahanKajian) => {
    if (bk) {
      setEditingBK(bk);
      setFormData({
        kode_bk: bk.kode_bk,
        nama_bahan_kajian: bk.nama_bahan_kajian,
        aspek: bk.aspek,
        ranah_keilmuan: bk.ranah_keilmuan,
      });
    } else {
      setEditingBK(null);
      const nextCode = `BK-${String(bkList.length + 1).padStart(2, "0")}`;
      setFormData({
        kode_bk: nextCode,
        nama_bahan_kajian: "",
        aspek: "P",
        ranah_keilmuan: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBK(null);
    setFormData({
      kode_bk: "",
      nama_bahan_kajian: "",
      aspek: "P",
      ranah_keilmuan: "",
    });
  };

  // Matrix functions
  const toggleMapping = (cplId: string, bkId: string) => {
    setMatrixMappings((prev) => {
      const current = prev[cplId] || [];
      if (current.includes(bkId)) {
        return { ...prev, [cplId]: current.filter((id) => id !== bkId) };
      } else {
        return { ...prev, [cplId]: [...current, bkId] };
      }
    });
  };

  const hasMapping = (cplId: string, bkId: string) => {
    return matrixMappings[cplId]?.includes(bkId) || false;
  };

  const countCPLMappings = (cplId: string) => {
    return matrixMappings[cplId]?.length || 0;
  };

  const countBKMappings = (bkId: string) => {
    return Object.values(matrixMappings).filter((bks) => bks.includes(bkId)).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total BK</p>
                <p className="text-2xl font-bold">{bkList.length}</p>
              </div>
              <Icons.Layers className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        {aspekStats.map((stat) => (
          <Card key={stat.value}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.value}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <AspekBadge aspek={stat.value as AspekKUL} />
              </div>
            </CardContent>
          </Card>
        ))}
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
                Daftar BK
              </Button>
              <Button
                variant={activeTab === "matrix" ? "default" : "outline"}
                onClick={() => setActiveTab("matrix")}
              >
                <Icons.Grid3X3 size={16} className="mr-2" />
                Matrix CPL-BK
              </Button>
            </div>
            {activeTab === "list" && (
              <Button onClick={() => openDialog()}>
                <Icons.Plus size={16} className="mr-2" />
                Tambah BK
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BK List Tab */}
      {activeTab === "list" && (
        <>
          {/* Action Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                  <div className="relative flex-1 max-w-sm">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari bahan kajian..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterAspek} onValueChange={setFilterAspek}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter Aspek" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Aspek</SelectItem>
                      {ASPEK_KUL_OPTIONS.map((opt) => (
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

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-medium text-muted-foreground">Keterangan Aspek:</span>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <AspekBadge aspek="S" /> Sikap
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <AspekBadge aspek="P" /> Pengetahuan
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <AspekBadge aspek="KU" /> Keterampilan Umum
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <AspekBadge aspek="KK" /> Keterampilan Khusus
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Bahan Kajian</CardTitle>
              <CardDescription>
                Total {filteredBK.length} bahan kajian ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Kode</TableHead>
                    <TableHead className="w-28">Aspek</TableHead>
                    <TableHead>Nama Bahan Kajian</TableHead>
                    <TableHead className="w-48">Ranah Keilmuan</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBK.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Icons.Layers size={40} className="opacity-50" />
                          <p>Tidak ada data bahan kajian</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBK.map((bk) => (
                      <TableRow key={bk.id_bahan_kajian}>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                            {bk.kode_bk}
                          </span>
                        </TableCell>
                        <TableCell>
                          <AspekBadge aspek={bk.aspek} />
                        </TableCell>
                        <TableCell className="font-medium">
                          {bk.nama_bahan_kajian}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {bk.ranah_keilmuan}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openDialog(bk)}
                            >
                              <Icons.Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingBK(bk);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Icons.Trash size={14} />
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

      {/* Matrix CPL-BK Tab */}
      {activeTab === "matrix" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Grid3X3 size={20} />
              Matrix CPL - Bahan Kajian
            </CardTitle>
            <CardDescription>
              Klik pada sel untuk menghubungkan CPL dengan Bahan Kajian
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
                    {bkList.map((bk) => (
                      <th
                        key={bk.id_bahan_kajian}
                        className="px-3 py-3 border-b text-center text-sm font-semibold text-gray-900 min-w-20"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{bk.kode_bk}</span>
                          <AspekBadge aspek={bk.aspek} />
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
                      {bkList.map((bk) => (
                        <td
                          key={bk.id_bahan_kajian}
                          className="px-3 py-3 border-b text-center"
                        >
                          <button
                            onClick={() => toggleMapping(cpl.id_cpl, bk.id_bahan_kajian)}
                            className={`w-8 h-8 rounded-md border-2 transition-all flex items-center justify-center ${
                              hasMapping(cpl.id_cpl, bk.id_bahan_kajian)
                                ? "bg-green-500 border-green-600 text-white"
                                : "bg-white border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {hasMapping(cpl.id_cpl, bk.id_bahan_kajian) && (
                              <Icons.Check size={16} />
                            )}
                          </button>
                        </td>
                      ))}
                      <td className="px-3 py-3 border-b border-l text-center font-semibold">
                        {countCPLMappings(cpl.id_cpl)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="sticky left-0 bg-gray-100 z-10 px-4 py-3 border-t-2">
                      Total CPL per BK
                    </td>
                    {bkList.map((bk) => (
                      <td key={bk.id_bahan_kajian} className="px-3 py-3 border-t-2 text-center">
                        {countBKMappings(bk.id_bahan_kajian)}
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
                    <li>Klik pada sel untuk menandai/menghapus relasi antara CPL dan Bahan Kajian</li>
                    <li>Kolom Total menunjukkan jumlah BK yang terhubung dengan CPL tersebut</li>
                    <li>Baris Total menunjukkan jumlah CPL yang didukung oleh setiap Bahan Kajian</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBK ? "Edit Bahan Kajian" : "Tambah Bahan Kajian Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingBK
                ? "Ubah informasi bahan kajian yang sudah ada"
                : "Tambahkan bahan kajian baru ke dalam kurikulum"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kode_bk">Kode BK</Label>
                <Input
                  id="kode_bk"
                  placeholder="BK-01"
                  value={formData.kode_bk}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kode_bk: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspek">Aspek (sesuai KUL)</Label>
                <Select
                  value={formData.aspek}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, aspek: value as AspekKUL }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aspek" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPEK_KUL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_bahan_kajian">Nama Bahan Kajian</Label>
              <Input
                id="nama_bahan_kajian"
                placeholder="Contoh: Algoritma dan Pemrograman"
                value={formData.nama_bahan_kajian}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nama_bahan_kajian: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ranah_keilmuan">Ranah Keilmuan</Label>
              <Input
                id="ranah_keilmuan"
                placeholder="Contoh: Ilmu Komputer Dasar, Sistem Informasi, dll"
                value={formData.ranah_keilmuan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ranah_keilmuan: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Masukkan ranah keilmuan sesuai dengan bidang ilmu yang relevan
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.kode_bk.trim() || !formData.nama_bahan_kajian.trim() || !formData.ranah_keilmuan.trim()}
            >
              {editingBK ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Bahan Kajian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus bahan kajian "{deletingBK?.nama_bahan_kajian}"? Tindakan ini tidak dapat dibatalkan.
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
