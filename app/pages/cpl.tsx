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
import type { CPL, AspekCPL, ProfilLulusan } from "~/types";
import { ASPEK_CPL_OPTIONS } from "~/lib/constants";

// Dummy CPL data sesuai struktur (Kode, Aspek sesuai KUL, Deskripsi)
const initialCPLs: CPL[] = [
  { id_cpl: "1", kode_cpl: "S1", aspek: "S", deskripsi_cpl: "Bertakwa kepada Tuhan YME dan mampu menunjukkan sikap religius dalam kehidupan sehari-hari", id_kurikulum: "1" },
  { id_cpl: "2", kode_cpl: "S2", aspek: "S", deskripsi_cpl: "Menjunjung tinggi nilai kemanusiaan dalam menjalankan tugas berdasarkan agama, moral, dan etika", id_kurikulum: "1" },
  { id_cpl: "3", kode_cpl: "P1", aspek: "P", deskripsi_cpl: "Menguasai konsep teoritis bidang teknologi informasi secara umum dan mendalam", id_kurikulum: "1" },
  { id_cpl: "4", kode_cpl: "P2", aspek: "P", deskripsi_cpl: "Menguasai prinsip-prinsip rekayasa perangkat lunak dan metodologi pengembangan sistem", id_kurikulum: "1" },
  { id_cpl: "5", kode_cpl: "KU1", aspek: "KU", deskripsi_cpl: "Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif", id_kurikulum: "1" },
  { id_cpl: "6", kode_cpl: "KU2", aspek: "KU", deskripsi_cpl: "Mampu menunjukkan kinerja mandiri, bermutu, dan terukur", id_kurikulum: "1" },
  { id_cpl: "7", kode_cpl: "KK1", aspek: "KK", deskripsi_cpl: "Mampu merancang dan mengembangkan sistem informasi yang efisien", id_kurikulum: "1" },
  { id_cpl: "8", kode_cpl: "KK2", aspek: "KK", deskripsi_cpl: "Mampu mengembangkan aplikasi berbasis web dan mobile dengan framework modern", id_kurikulum: "1" },
];

// Dummy Profil Lulusan
const dummyProfilLulusan: ProfilLulusan[] = [
  { id_profil: "1", kode_profil: "PL-01", profil_lulusan: "Software Engineer", deskripsi: "Pengembang perangkat lunak", sumber: "KKNI", id_kurikulum: "1" },
  { id_profil: "2", kode_profil: "PL-02", profil_lulusan: "Data Analyst", deskripsi: "Analis data", sumber: "KKNI", id_kurikulum: "1" },
  { id_profil: "3", kode_profil: "PL-03", profil_lulusan: "System Analyst", deskripsi: "Analis sistem", sumber: "KKNI", id_kurikulum: "1" },
  { id_profil: "4", kode_profil: "PL-04", profil_lulusan: "IT Consultant", deskripsi: "Konsultan IT", sumber: "KKNI", id_kurikulum: "1" },
];

// Aspek Badge Component
function AspekBadge({ aspek }: { aspek: AspekCPL }) {
  const colors: Record<AspekCPL, string> = {
    S: "bg-blue-100 text-blue-700",
    P: "bg-purple-100 text-purple-700",
    KU: "bg-amber-100 text-amber-700",
    KK: "bg-green-100 text-green-700",
  };
  
  const labels: Record<AspekCPL, string> = {
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

export default function CPLPage() {
  const [cplList, setCplList] = useState<CPL[]>(initialCPLs);
  const [profilLulusanList] = useState<ProfilLulusan[]>(dummyProfilLulusan);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAspek, setFilterAspek] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCPL, setEditingCPL] = useState<CPL | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCPL, setDeletingCPL] = useState<CPL | null>(null);
  
  // Tab state for CPL List vs Matrix
  const [activeTab, setActiveTab] = useState<"list" | "matrix">("list");
  
  // Matrix CPL-PL mappings
  const [matrixMappings, setMatrixMappings] = useState<Record<string, string[]>>({
    "1": ["1", "2"],      // S1 -> PL-01, PL-02
    "2": ["1", "3"],      // S2 -> PL-01, PL-03
    "3": ["1", "2"],      // P1 -> PL-01, PL-02
    "4": ["1", "3", "4"], // P2 -> PL-01, PL-03, PL-04
    "5": ["1", "2", "4"], // KU1 -> PL-01, PL-02, PL-04
    "6": ["1", "2", "3"], // KU2 -> PL-01, PL-02, PL-03
    "7": ["1"],           // KK1 -> PL-01
    "8": ["1", "2"],      // KK2 -> PL-01, PL-02
  });

  // Form state
  const [formData, setFormData] = useState({
    kode_cpl: "",
    aspek: "S" as AspekCPL,
    deskripsi_cpl: "",
  });

  // Filter CPL
  const filteredCPL = cplList.filter((c) => {
    const matchSearch =
      c.kode_cpl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.deskripsi_cpl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAspek = filterAspek === "all" || c.aspek === filterAspek;
    return matchSearch && matchAspek;
  });

  // Group by aspek for stats
  const aspekStats = ASPEK_CPL_OPTIONS.map((opt) => ({
    aspek: opt.label,
    value: opt.value,
    count: cplList.filter((c) => c.aspek === opt.value).length,
  }));

  // Handle form submit
  const handleSubmit = () => {
    if (editingCPL) {
      setCplList((prev) =>
        prev.map((c) =>
          c.id_cpl === editingCPL.id_cpl
            ? { ...c, kode_cpl: formData.kode_cpl, aspek: formData.aspek, deskripsi_cpl: formData.deskripsi_cpl }
            : c
        )
      );
    } else {
      const newCPL: CPL = {
        id_cpl: Date.now().toString(),
        kode_cpl: formData.kode_cpl,
        aspek: formData.aspek,
        deskripsi_cpl: formData.deskripsi_cpl,
        id_kurikulum: "1",
      };
      setCplList((prev) => [...prev, newCPL]);
    }
    handleCloseDialog();
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingCPL) {
      setCplList((prev) => prev.filter((c) => c.id_cpl !== deletingCPL.id_cpl));
      setIsDeleteDialogOpen(false);
      setDeletingCPL(null);
    }
  };

  // Auto generate kode based on aspek
  const generateKode = (aspek: AspekCPL) => {
    const existingCodes = cplList.filter(c => c.aspek === aspek).map(c => c.kode_cpl);
    let num = 1;
    let newCode = `${aspek}${num}`;
    while (existingCodes.includes(newCode)) {
      num++;
      newCode = `${aspek}${num}`;
    }
    return newCode;
  };

  // Open dialog
  const openDialog = (cpl?: CPL) => {
    if (cpl) {
      setEditingCPL(cpl);
      setFormData({
        kode_cpl: cpl.kode_cpl,
        aspek: cpl.aspek,
        deskripsi_cpl: cpl.deskripsi_cpl,
      });
    } else {
      setEditingCPL(null);
      setFormData({
        kode_cpl: "",
        aspek: "S",
        deskripsi_cpl: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCPL(null);
    setFormData({
      kode_cpl: "",
      aspek: "S",
      deskripsi_cpl: "",
    });
  };

  // Matrix functions
  const toggleMapping = (cplId: string, plId: string) => {
    setMatrixMappings((prev) => {
      const current = prev[cplId] || [];
      if (current.includes(plId)) {
        return { ...prev, [cplId]: current.filter((id) => id !== plId) };
      } else {
        return { ...prev, [cplId]: [...current, plId] };
      }
    });
  };

  const hasMapping = (cplId: string, plId: string) => {
    return matrixMappings[cplId]?.includes(plId) || false;
  };

  const countCPLMappings = (cplId: string) => {
    return matrixMappings[cplId]?.length || 0;
  };

  const countPLMappings = (plId: string) => {
    return Object.values(matrixMappings).filter((pls) => pls.includes(plId)).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total CPL</p>
                <p className="text-2xl font-bold">{cplList.length}</p>
              </div>
              <Icons.Target className="h-8 w-8 text-muted-foreground/50" />
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
                <AspekBadge aspek={stat.value as AspekCPL} />
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
                Daftar CPL
              </Button>
              <Button
                variant={activeTab === "matrix" ? "default" : "outline"}
                onClick={() => setActiveTab("matrix")}
              >
                <Icons.Grid3X3 size={16} className="mr-2" />
                Matrix CPL-PL
              </Button>
            </div>
            {activeTab === "list" && (
              <Button onClick={() => openDialog()}>
                <Icons.Plus size={16} className="mr-2" />
                Tambah CPL
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CPL List Tab */}
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
                      placeholder="Cari CPL..."
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
                      {ASPEK_CPL_OPTIONS.map((opt) => (
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
              <CardTitle>Daftar Capaian Pembelajaran Lulusan</CardTitle>
              <CardDescription>
                Total {filteredCPL.length} CPL ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Kode</TableHead>
                    <TableHead className="w-28">Aspek</TableHead>
                    <TableHead>Deskripsi CPL</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCPL.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Icons.Target size={40} className="opacity-50" />
                          <p>Tidak ada data CPL</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCPL.map((cpl) => (
                      <TableRow key={cpl.id_cpl}>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                            {cpl.kode_cpl}
                          </span>
                        </TableCell>
                        <TableCell>
                          <AspekBadge aspek={cpl.aspek} />
                        </TableCell>
                        <TableCell className="font-medium">
                          {cpl.deskripsi_cpl}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openDialog(cpl)}
                            >
                              <Icons.Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingCPL(cpl);
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

      {/* Matrix CPL-PL Tab */}
      {activeTab === "matrix" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Grid3X3 size={20} />
              Matrix CPL - Profil Lulusan
            </CardTitle>
            <CardDescription>
              Klik pada sel untuk menghubungkan CPL dengan Profil Lulusan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="sticky left-0 bg-gray-50 z-20 px-4 py-3 border-b border-r text-left text-sm font-semibold text-gray-900 min-w-60">
                      CPL
                    </th>
                    {profilLulusanList.map((pl) => (
                      <th
                        key={pl.id_profil}
                        className="px-3 py-3 border-b text-center text-sm font-semibold text-gray-900 min-w-24"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{pl.kode_profil}</span>
                          <span className="text-xs font-normal text-muted-foreground truncate max-w-20" title={pl.profil_lulusan}>
                            {pl.profil_lulusan}
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
                        <span className="text-muted-foreground text-xs line-clamp-1 max-w-48 mt-1" title={cpl.deskripsi_cpl}>
                          {cpl.deskripsi_cpl}
                        </span>
                      </td>
                      {profilLulusanList.map((pl) => (
                        <td
                          key={pl.id_profil}
                          className="px-3 py-3 border-b text-center"
                        >
                          <button
                            onClick={() => toggleMapping(cpl.id_cpl, pl.id_profil)}
                            className={`w-8 h-8 rounded-md border-2 transition-all flex items-center justify-center ${
                              hasMapping(cpl.id_cpl, pl.id_profil)
                                ? "bg-green-500 border-green-600 text-white"
                                : "bg-white border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {hasMapping(cpl.id_cpl, pl.id_profil) && (
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
                      Total CPL per PL
                    </td>
                    {profilLulusanList.map((pl) => (
                      <td key={pl.id_profil} className="px-3 py-3 border-t-2 text-center">
                        {countPLMappings(pl.id_profil)}
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
                    <li>Klik pada sel untuk menandai/menghapus relasi antara CPL dan Profil Lulusan</li>
                    <li>Kolom Total menunjukkan jumlah PL yang terhubung dengan CPL tersebut</li>
                    <li>Baris Total menunjukkan jumlah CPL yang mendukung setiap Profil Lulusan</li>
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
              {editingCPL ? "Edit CPL" : "Tambah CPL Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingCPL
                ? "Ubah informasi Capaian Pembelajaran Lulusan"
                : "Tambahkan CPL baru ke dalam kurikulum"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aspek">Aspek</Label>
                <Select
                  value={formData.aspek}
                  onValueChange={(value) => {
                    const aspek = value as AspekCPL;
                    setFormData((prev) => ({
                      ...prev,
                      aspek,
                      kode_cpl: editingCPL ? prev.kode_cpl : generateKode(aspek),
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aspek" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPEK_CPL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kode_cpl">Kode CPL</Label>
                <Input
                  id="kode_cpl"
                  placeholder="S1, P1, KU1, KK1"
                  value={formData.kode_cpl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kode_cpl: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi_cpl">Deskripsi CPL</Label>
              <Textarea
                id="deskripsi_cpl"
                placeholder="Deskripsi capaian pembelajaran lulusan..."
                rows={4}
                value={formData.deskripsi_cpl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deskripsi_cpl: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.kode_cpl.trim() || !formData.deskripsi_cpl.trim()}
            >
              {editingCPL ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus CPL</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus CPL "{deletingCPL?.kode_cpl}"? Tindakan ini tidak dapat dibatalkan.
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
