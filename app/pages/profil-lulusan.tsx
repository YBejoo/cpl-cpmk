import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
  Button,
  Input,
  Label,
  Textarea,
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
import type { ProfilLulusan } from "~/types";

// Dummy Profil Lulusan data sesuai struktur baru (Kode, Profil Lulusan, Deskripsi, Sumber)
const initialProfilLulusan: ProfilLulusan[] = [
  {
    id_profil: "1",
    kode_profil: "PL-01",
    profil_lulusan: "Software Engineer",
    deskripsi: "Mampu merancang, mengembangkan, dan memelihara sistem perangkat lunak yang efisien dan berkualitas tinggi sesuai dengan kebutuhan industri.",
    sumber: "KKNI Level 6, Asosiasi Profesi Informatika Indonesia",
    id_kurikulum: "1",
  },
  {
    id_profil: "2",
    kode_profil: "PL-02",
    profil_lulusan: "Data Analyst",
    deskripsi: "Mampu mengolah, menganalisis, dan menginterpretasi data untuk mendukung pengambilan keputusan bisnis secara akurat dan efektif.",
    sumber: "KKNI Level 6, Standar Kompetensi Data Science",
    id_kurikulum: "1",
  },
  {
    id_profil: "3",
    kode_profil: "PL-03",
    profil_lulusan: "IT Consultant",
    deskripsi: "Mampu memberikan solusi teknologi informasi yang tepat sesuai kebutuhan organisasi dan mampu berkomunikasi dengan pemangku kepentingan.",
    sumber: "KKNI Level 6, Standar Kompetensi Konsultan IT",
    id_kurikulum: "1",
  },
  {
    id_profil: "4",
    kode_profil: "PL-04",
    profil_lulusan: "System Administrator",
    deskripsi: "Mampu mengelola, memelihara, dan mengamankan infrastruktur sistem informasi dalam organisasi.",
    sumber: "KKNI Level 6, CompTIA Standards",
    id_kurikulum: "1",
  },
];

export default function ProfilLulusanPage() {
  const [profilList, setProfilList] = useState<ProfilLulusan[]>(initialProfilLulusan);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfil, setEditingProfil] = useState<ProfilLulusan | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProfil, setDeletingProfil] = useState<ProfilLulusan | null>(null);

  // Form state sesuai struktur baru
  const [formData, setFormData] = useState({
    kode_profil: "",
    profil_lulusan: "",
    deskripsi: "",
    sumber: "",
  });

  // Filter profil lulusan
  const filteredProfil = profilList.filter(
    (p) =>
      p.profil_lulusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kode_profil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submit
  const handleSubmit = () => {
    if (editingProfil) {
      setProfilList((prev) =>
        prev.map((p) =>
          p.id_profil === editingProfil.id_profil
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newProfil: ProfilLulusan = {
        id_profil: Date.now().toString(),
        ...formData,
        id_kurikulum: "1",
      };
      setProfilList((prev) => [...prev, newProfil]);
    }
    handleCloseDialog();
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingProfil) {
      setProfilList((prev) =>
        prev.filter((p) => p.id_profil !== deletingProfil.id_profil)
      );
      setIsDeleteDialogOpen(false);
      setDeletingProfil(null);
    }
  };

  // Open dialog
  const openDialog = (profil?: ProfilLulusan) => {
    if (profil) {
      setEditingProfil(profil);
      setFormData({
        kode_profil: profil.kode_profil,
        profil_lulusan: profil.profil_lulusan,
        deskripsi: profil.deskripsi,
        sumber: profil.sumber,
      });
    } else {
      setEditingProfil(null);
      const nextCode = `PL-${String(profilList.length + 1).padStart(2, "0")}`;
      setFormData({
        kode_profil: nextCode,
        profil_lulusan: "",
        deskripsi: "",
        sumber: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfil(null);
    setFormData({
      kode_profil: "",
      profil_lulusan: "",
      deskripsi: "",
      sumber: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profil</p>
                <p className="text-2xl font-bold">{profilList.length}</p>
              </div>
              <Icons.GraduationCap className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kurikulum Aktif</p>
                <p className="text-2xl font-bold">2024</p>
              </div>
              <Icons.BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari profil lulusan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => openDialog()}>
              <Icons.Plus size={16} className="mr-2" />
              Tambah Profil Lulusan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Profil Lulusan</CardTitle>
          <CardDescription>
            Total {filteredProfil.length} profil lulusan ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Kode</TableHead>
                <TableHead className="w-[180px]">Profil Lulusan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-[200px]">Sumber</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfil.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Icons.GraduationCap size={40} className="opacity-50" />
                      <p>Tidak ada data profil lulusan</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfil.map((profil) => (
                  <TableRow key={profil.id_profil}>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {profil.kode_profil}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {profil.profil_lulusan}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      <p className="line-clamp-2">{profil.deskripsi}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {profil.sumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openDialog(profil)}
                        >
                          <Icons.Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeletingProfil(profil);
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProfil ? "Edit Profil Lulusan" : "Tambah Profil Lulusan Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingProfil
                ? "Ubah informasi profil lulusan yang sudah ada"
                : "Tambahkan profil lulusan baru ke dalam kurikulum"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kode_profil">Kode Profil</Label>
                <Input
                  id="kode_profil"
                  placeholder="PL-01"
                  value={formData.kode_profil}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kode_profil: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profil_lulusan">Profil Lulusan</Label>
                <Input
                  id="profil_lulusan"
                  placeholder="Contoh: Software Engineer"
                  value={formData.profil_lulusan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profil_lulusan: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi lengkap profil lulusan..."
                rows={4}
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deskripsi: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sumber">Sumber</Label>
              <Input
                id="sumber"
                placeholder="Contoh: KKNI Level 6, Asosiasi Profesi"
                value={formData.sumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sumber: e.target.value,
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
              disabled={!formData.kode_profil.trim() || !formData.profil_lulusan.trim()}
            >
              {editingProfil ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Profil Lulusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus profil lulusan "
              {deletingProfil?.profil_lulusan}"? Tindakan ini tidak dapat
              dibatalkan.
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
