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
import type { Kurikulum } from "~/types";
import { TAHUN_OPTIONS } from "~/lib/constants";

// Dummy data
const initialKurikulums: Kurikulum[] = [
  {
    id_kurikulum: "1",
    nama_kurikulum: "Kurikulum OBE 2024",
    tahun_berlaku: 2024,
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id_kurikulum: "2",
    nama_kurikulum: "Kurikulum KKNI 2020",
    tahun_berlaku: 2020,
    is_active: true,
    created_at: new Date("2020-02-10"),
  },
  {
    id_kurikulum: "3",
    nama_kurikulum: "Kurikulum 2016",
    tahun_berlaku: 2016,
    is_active: false,
    created_at: new Date("2016-03-05"),
  },
];

// Status Badge Component
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Aktif" : "Arsip"}
    </Badge>
  );
}

export default function KurikulumPage() {
  const [kurikulums, setKurikulums] = useState<Kurikulum[]>(initialKurikulums);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingKurikulum, setEditingKurikulum] = useState<Kurikulum | null>(null);
  const [deletingKurikulum, setDeletingKurikulum] = useState<Kurikulum | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nama_kurikulum: "",
    tahun_berlaku: new Date().getFullYear().toString(),
  });

  // Filter kurikulum
  const filteredKurikulums = kurikulums.filter((k) => {
    const matchSearch = k.nama_kurikulum
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && k.is_active) ||
      (filterStatus === "archive" && !k.is_active);
    return matchSearch && matchStatus;
  });

  // Handle form submit
  const handleSubmit = () => {
    if (editingKurikulum) {
      // Edit mode
      setKurikulums((prev) =>
        prev.map((k) =>
          k.id_kurikulum === editingKurikulum.id_kurikulum
            ? {
                ...k,
                nama_kurikulum: formData.nama_kurikulum,
                tahun_berlaku: parseInt(formData.tahun_berlaku),
              }
            : k
        )
      );
    } else {
      // Add mode
      const newKurikulum: Kurikulum = {
        id_kurikulum: Date.now().toString(),
        nama_kurikulum: formData.nama_kurikulum,
        tahun_berlaku: parseInt(formData.tahun_berlaku),
        is_active: false,
        created_at: new Date(),
      };
      setKurikulums((prev) => [...prev, newKurikulum]);
    }
    handleCloseDialog();
  };

  // Handle toggle active (bisa lebih dari 1 kurikulum aktif)
  const handleToggleActive = (id: string) => {
    setKurikulums((prev) =>
      prev.map((k) => ({
        ...k,
        is_active: k.id_kurikulum === id ? !k.is_active : k.is_active,
      }))
    );
  };

  // Handle copy/duplicate
  const handleCopy = (kurikulum: Kurikulum) => {
    const newKurikulum: Kurikulum = {
      id_kurikulum: Date.now().toString(),
      nama_kurikulum: `${kurikulum.nama_kurikulum} (Copy)`,
      tahun_berlaku: new Date().getFullYear(),
      is_active: false,
      created_at: new Date(),
    };
    setKurikulums((prev) => [...prev, newKurikulum]);
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingKurikulum) {
      setKurikulums((prev) =>
        prev.filter((k) => k.id_kurikulum !== deletingKurikulum.id_kurikulum)
      );
      setIsDeleteDialogOpen(false);
      setDeletingKurikulum(null);
    }
  };

  // Open dialog for add/edit
  const openDialog = (kurikulum?: Kurikulum) => {
    if (kurikulum) {
      setEditingKurikulum(kurikulum);
      setFormData({
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku.toString(),
      });
    } else {
      setEditingKurikulum(null);
      setFormData({
        nama_kurikulum: "",
        tahun_berlaku: new Date().getFullYear().toString(),
      });
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingKurikulum(null);
    setFormData({
      nama_kurikulum: "",
      tahun_berlaku: new Date().getFullYear().toString(),
    });
  };

  return (
    <div className="space-y-6">
        {/* Action Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kurikulum..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filter Status */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-45">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="archive">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add Button */}
              <Button onClick={() => openDialog()}>
                <Icons.Plus size={16} className="mr-2" />
                Tambah Kurikulum
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kurikulum</CardTitle>
            <CardDescription>
              Total {filteredKurikulums.length} kurikulum ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kurikulum</TableHead>
                  <TableHead className="w-25">Tahun</TableHead>
                  <TableHead className="w-25">Status</TableHead>
                  <TableHead className="w-50 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKurikulums.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Icons.Database size={40} className="opacity-50" />
                        <p>Tidak ada data kurikulum</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKurikulums.map((kurikulum) => (
                    <TableRow key={kurikulum.id_kurikulum}>
                      <TableCell className="font-medium">
                        {kurikulum.nama_kurikulum}
                      </TableCell>
                      <TableCell>{kurikulum.tahun_berlaku}</TableCell>
                      <TableCell>
                        <StatusBadge isActive={kurikulum.is_active} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(kurikulum)}
                          >
                            <Icons.Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(kurikulum)}
                          >
                            <Icons.Copy size={14} className="mr-1" />
                            Salin
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={kurikulum.is_active ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                            onClick={() => handleToggleActive(kurikulum.id_kurikulum)}
                          >
                            <Icons.Power size={14} className="mr-1" />
                            {kurikulum.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                          {!kurikulum.is_active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingKurikulum(kurikulum);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Icons.Trash size={14} />
                            </Button>
                          )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingKurikulum ? "Edit Kurikulum" : "Tambah Kurikulum Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingKurikulum
                ? "Ubah informasi kurikulum yang sudah ada"
                : "Tambahkan kurikulum baru ke dalam sistem"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama_kurikulum">Nama Kurikulum</Label>
              <Input
                id="nama_kurikulum"
                placeholder="Contoh: Kurikulum OBE 2024"
                value={formData.nama_kurikulum}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nama_kurikulum: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun_berlaku">Tahun Berlaku</Label>
              <Select
                value={formData.tahun_berlaku}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tahun_berlaku: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {TAHUN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.nama_kurikulum.trim()}
            >
              {editingKurikulum ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kurikulum</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kurikulum "
              {deletingKurikulum?.nama_kurikulum}"? Tindakan ini tidak dapat
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
