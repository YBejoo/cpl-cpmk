import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "~/components/header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icons,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";

// Dummy data untuk laporan
const laporanPerMK = [
  { kode_mk: "MI101", nama_mk: "Algoritma dan Pemrograman", total_cpmk: 5, total_cpl: 3, rata_rata_bobot: 8.5 },
  { kode_mk: "MI102", nama_mk: "Basis Data", total_cpmk: 4, total_cpl: 3, rata_rata_bobot: 8.0 },
  { kode_mk: "MI103", nama_mk: "Pemrograman Web", total_cpmk: 6, total_cpl: 4, rata_rata_bobot: 9.0 },
  { kode_mk: "MI201", nama_mk: "PBO", total_cpmk: 4, total_cpl: 3, rata_rata_bobot: 8.2 },
  { kode_mk: "MI203", nama_mk: "Pemrograman Mobile", total_cpmk: 5, total_cpl: 4, rata_rata_bobot: 8.8 },
];

const laporanPerCPL = [
  { id_cpl: "CPL-1", nama_cpl: "Mampu menerapkan pemikiran logis, kritis, sistematis", bobot: 10, total_mk: 8 },
  { id_cpl: "CPL-2", nama_cpl: "Mampu menunjukkan kinerja mandiri, bermutu", bobot: 8, total_mk: 6 },
  { id_cpl: "CPL-3", nama_cpl: "Mampu mengkaji implikasi pengembangan teknologi", bobot: 8, total_mk: 5 },
  { id_cpl: "CPL-4", nama_cpl: "Mampu menyusun deskripsi saintifik", bobot: 10, total_mk: 4 },
  { id_cpl: "CPL-5", nama_cpl: "Mampu mengambil keputusan secara tepat", bobot: 9, total_mk: 7 },
];

const laporanPerTahun = [
  { tahun: 2020, total_kurikulum: 1, total_cpl: 10, total_mk: 35 },
  { tahun: 2022, total_kurikulum: 1, total_cpl: 11, total_mk: 40 },
  { tahun: 2024, total_kurikulum: 1, total_cpl: 12, total_mk: 45 },
];

type LaporanType = "per-mk" | "per-cpl" | "per-tahun" | "per-cpmk";

const kurikulumOptions = [
  { value: "K2024", label: "Kurikulum 2024" },
  { value: "K2022", label: "Kurikulum 2022" },
  { value: "K2020", label: "Kurikulum 2020" },
];

export default function LaporanPage() {
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanType>("per-mk");
  const [selectedKurikulum, setSelectedKurikulum] = useState("K2024");

  const renderLaporanPerMK = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">No</TableHead>
          <TableHead className="w-24">Kode MK</TableHead>
          <TableHead>Nama Mata Kuliah</TableHead>
          <TableHead className="w-24 text-center">CPMK</TableHead>
          <TableHead className="w-24 text-center">CPL</TableHead>
          <TableHead className="w-32 text-center">Rata-rata Bobot</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laporanPerMK.map((item, index) => (
          <TableRow key={item.kode_mk}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.kode_mk}</Badge>
            </TableCell>
            <TableCell className="font-medium">{item.nama_mk}</TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{item.total_cpmk}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge>{item.total_cpl}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant={item.rata_rata_bobot >= 8.5 ? "default" : "secondary"}>
                {item.rata_rata_bobot.toFixed(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderLaporanPerCPL = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">No</TableHead>
          <TableHead className="w-24">Kode CPL</TableHead>
          <TableHead>Deskripsi CPL</TableHead>
          <TableHead className="w-24 text-center">Bobot</TableHead>
          <TableHead className="w-32 text-center">Total MK Terkait</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laporanPerCPL.map((item, index) => (
          <TableRow key={item.id_cpl}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.id_cpl}</Badge>
            </TableCell>
            <TableCell>{item.nama_cpl}</TableCell>
            <TableCell className="text-center">
              <Badge>{item.bobot}%</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{item.total_mk} MK</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderLaporanPerTahun = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">No</TableHead>
          <TableHead>Tahun Kurikulum</TableHead>
          <TableHead className="text-center">Total Kurikulum</TableHead>
          <TableHead className="text-center">Total CPL</TableHead>
          <TableHead className="text-center">Total Mata Kuliah</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laporanPerTahun.map((item, index) => (
          <TableRow key={item.tahun}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Badge variant="outline">Kurikulum {item.tahun}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{item.total_kurikulum}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge>{item.total_cpl}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{item.total_mk}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderContent = () => {
    switch (selectedLaporan) {
      case "per-mk":
        return renderLaporanPerMK();
      case "per-cpl":
        return renderLaporanPerCPL();
      case "per-tahun":
        return renderLaporanPerTahun();
      default:
        return renderLaporanPerMK();
    }
  };

  const getLaporanTitle = () => {
    switch (selectedLaporan) {
      case "per-mk":
        return "Laporan Per Mata Kuliah";
      case "per-cpl":
        return "Laporan Per CPL";
      case "per-tahun":
        return "Laporan Per Tahun Kurikulum";
      case "per-cpmk":
        return "Laporan Per CPMK";
      default:
        return "Laporan";
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="p-4 space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <Icons.ArrowLeft size={18} className="mr-2" />
          Kembali
        </Button>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className={`cursor-pointer transition-colors ${
              selectedLaporan === "per-mk" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedLaporan("per-mk")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icons.Book className="h-4 w-4" />
                Per Mata Kuliah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{laporanPerMK.length}</div>
              <p className="text-xs text-muted-foreground">Mata kuliah tercatat</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              selectedLaporan === "per-cpl" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedLaporan("per-cpl")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icons.Target className="h-4 w-4" />
                Per CPL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{laporanPerCPL.length}</div>
              <p className="text-xs text-muted-foreground">CPL terdefinisi</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              selectedLaporan === "per-tahun" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedLaporan("per-tahun")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icons.Calendar className="h-4 w-4" />
                Per Tahun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{laporanPerTahun.length}</div>
              <p className="text-xs text-muted-foreground">Periode kurikulum</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              selectedLaporan === "per-cpmk" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedLaporan("per-cpmk")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icons.FileCheck className="h-4 w-4" />
                Per CPMK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">CPMK terdefinisi</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.BarChart3 className="h-5 w-5" />
                Grafik Bobot CPL
              </CardTitle>
              <CardDescription>Distribusi bobot per CPL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {laporanPerCPL.map((cpl) => (
                  <div key={cpl.id_cpl} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cpl.id_cpl}</span>
                      <span className="font-medium">{cpl.bobot}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${cpl.bobot * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.BarChart3 className="h-5 w-5" />
                Grafik Mata Kuliah per CPL
              </CardTitle>
              <CardDescription>Jumlah MK yang mendukung setiap CPL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {laporanPerCPL.map((cpl) => (
                  <div key={cpl.id_cpl} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cpl.id_cpl}</span>
                      <span className="font-medium">{cpl.total_mk} MK</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${(cpl.total_mk / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{getLaporanTitle()}</CardTitle>
              <CardDescription>
                Data lengkap untuk analisis
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedKurikulum}
                onChange={(e) => setSelectedKurikulum(e.target.value)}
                options={kurikulumOptions}
                className="w-48"
              />
              <Button variant="outline">
                <Icons.Download size={18} className="mr-2" />
                Export Excel
              </Button>
              <Button variant="outline">
                <Icons.Printer size={18} className="mr-2" />
                Cetak PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
