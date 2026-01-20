import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/main-layout.tsx", [
    // Dashboard
    index("pages/dashboard.tsx"),
    
    // Master Data - Kurikulum & CPL-CPMK
    route("kurikulum", "pages/kurikulum.tsx"),
    route("profil-lulusan", "pages/profil-lulusan.tsx"),
    route("kompetensi-utama", "pages/kompetensi-utama.tsx"),
    route("cpl", "pages/cpl.tsx"),                      // Include Matrix CPL-PL
    route("bahan-kajian", "pages/bahan-kajian.tsx"),    // Include Matrix CPL-BK
    route("mata-kuliah", "pages/mata-kuliah.tsx"),      // Include Matrix CPL-MK
    
    // RPS & CPMK
    route("cpmk", "pages/cpmk.tsx"),
    route("rps", "pages/rps/index.tsx"),
    route("rps/new", "pages/rps/new.tsx", { id: "rps-new" }),
    route("rps/:id/edit", "pages/rps/new.tsx", { id: "rps-edit" }),
    
    // Laporan
    route("laporan", "pages/laporan.tsx"),
  ]),
] satisfies RouteConfig;
