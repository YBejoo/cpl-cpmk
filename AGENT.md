# 🤖 SI-CAP Backend Development Agent Guide

## 📋 Project Overview

**Project:** SI-CAP (Sistem Informasi Capaian Pembelajaran)  
**Purpose:** Backend API untuk manajemen RPS, CPMK, dan CPL berbasis OBE (Outcome-Based Education)  
**Tech Stack:** Bun + Hono + Drizzle ORM + Cloudflare Workers + D1 Database

---

## 🛠️ Technology Stack

### Runtime & Package Manager
- **Bun** - Fast JavaScript runtime & package manager
- Version: Latest stable (1.1+)
- Used for: Development, testing, bundling

### Web Framework
- **Hono** - Ultrafast web framework for Edge
- Version: ^4.x
- Features: Middleware, routing, validation, OpenAPI

### ORM & Database
- **Drizzle ORM** - TypeScript ORM with type-safe queries
- **Cloudflare D1** - SQLite-compatible serverless database
- Migrations: Drizzle Kit

### Deployment
- **Cloudflare Workers** - Edge computing platform
- **Wrangler** - Cloudflare CLI tool

---

## 📁 Project Structure

```
si-cap-api/
├── src/
│   ├── index.ts                 # Entry point, Hono app initialization
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.ts              # Authentication routes
│   │   ├── kurikulum.ts         # Kurikulum CRUD
│   │   ├── profil-lulusan.ts    # Profil Lulusan CRUD
│   │   ├── kompetensi-utama.ts  # KUL CRUD
│   │   ├── cpl.ts               # CPL CRUD + Matrix CPL-PL
│   │   ├── bahan-kajian.ts      # Bahan Kajian CRUD + Matrix CPL-BK
│   │   ├── mata-kuliah.ts       # Mata Kuliah CRUD + Matrix CPL-MK
│   │   ├── dosen.ts             # Dosen CRUD + Penugasan
│   │   ├── cpmk.ts              # CPMK & Sub-CPMK CRUD
│   │   ├── rps.ts               # RPS CRUD
│   │   └── laporan.ts           # Reporting endpoints
│   ├── db/
│   │   ├── schema.ts            # Drizzle schema definitions
│   │   ├── relations.ts         # Table relations
│   │   ├── index.ts             # DB client export
│   │   └── migrations/          # SQL migrations
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── cors.ts              # CORS configuration
│   │   ├── logger.ts            # Request logging
│   │   └── error-handler.ts     # Global error handling
│   ├── services/
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── kurikulum.service.ts
│   │   ├── cpl.service.ts
│   │   ├── matrix.service.ts    # Matrix calculations
│   │   └── ...
│   ├── validators/
│   │   ├── auth.validator.ts    # Zod schemas for auth
│   │   ├── kurikulum.validator.ts
│   │   └── ...
│   ├── types/
│   │   ├── index.ts             # Shared types
│   │   └── env.d.ts             # Environment types
│   └── utils/
│       ├── response.ts          # Standard API response
│       ├── pagination.ts        # Pagination helpers
│       └── helpers.ts           # Utility functions
├── drizzle/
│   └── migrations/              # Generated migrations
├── tests/
│   ├── unit/
│   └── integration/
├── wrangler.toml                # Cloudflare Workers config
├── drizzle.config.ts            # Drizzle configuration
├── package.json
├── tsconfig.json
└── .dev.vars                    # Local environment variables
```

---

## 📊 Database Schema (Drizzle)

### Core Entities

```typescript
// src/db/schema.ts

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ==================== USERS & AUTH ====================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  nama: text('nama').notNull(),
  role: text('role', { enum: ['admin', 'kaprodi', 'dosen'] }).notNull().default('dosen'),
  id_prodi: text('id_prodi').references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PRODI ====================
export const prodi = sqliteTable('prodi', {
  id: text('id').primaryKey(),
  kode_prodi: text('kode_prodi').notNull().unique(),
  nama_prodi: text('nama_prodi').notNull(),
  fakultas: text('fakultas').notNull(),
  jenjang: text('jenjang', { enum: ['D3', 'D4', 'S1', 'S2', 'S3'] }).notNull(),
  akreditasi: text('akreditasi'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KURIKULUM ====================
export const kurikulum = sqliteTable('kurikulum', {
  id: text('id').primaryKey(),
  nama_kurikulum: text('nama_kurikulum').notNull(),
  tahun_berlaku: integer('tahun_berlaku').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  id_prodi: text('id_prodi').notNull().references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PROFIL LULUSAN ====================
export const profilLulusan = sqliteTable('profil_lulusan', {
  id: text('id').primaryKey(),
  kode_profil: text('kode_profil').notNull(), // PL-01, PL-02
  profil_lulusan: text('profil_lulusan').notNull(),
  deskripsi: text('deskripsi').notNull(),
  sumber: text('sumber').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KOMPETENSI UTAMA LULUSAN (KUL) ====================
export const kompetensiUtama = sqliteTable('kompetensi_utama', {
  id: text('id').primaryKey(),
  kode_kul: text('kode_kul').notNull(), // S1, P1, KU1, KK1
  kompetensi_lulusan: text('kompetensi_lulusan').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPL (Capaian Pembelajaran Lulusan) ====================
export const cpl = sqliteTable('cpl', {
  id: text('id').primaryKey(),
  kode_cpl: text('kode_cpl').notNull(), // CPL-01 atau S1, P1
  deskripsi_cpl: text('deskripsi_cpl').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-PL ====================
export const matrixCplPl = sqliteTable('matrix_cpl_pl', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_profil: text('id_profil').notNull().references(() => profilLulusan.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== BAHAN KAJIAN ====================
export const bahanKajian = sqliteTable('bahan_kajian', {
  id: text('id').primaryKey(),
  kode_bk: text('kode_bk').notNull(), // BK-01, BK-02
  nama_bahan_kajian: text('nama_bahan_kajian').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  ranah_keilmuan: text('ranah_keilmuan').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-BK ====================
export const matrixCplBk = sqliteTable('matrix_cpl_bk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_bk: text('id_bk').notNull().references(() => bahanKajian.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== DOSEN ====================
export const dosen = sqliteTable('dosen', {
  id: text('id').primaryKey(),
  nip: text('nip').notNull().unique(),
  nama_dosen: text('nama_dosen').notNull(),
  email: text('email'),
  bidang_keahlian: text('bidang_keahlian'),
  jabatan_fungsional: text('jabatan_fungsional', { 
    enum: ['Tenaga Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] 
  }),
  id_prodi: text('id_prodi').references(() => prodi.id),
  id_user: text('id_user').references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATA KULIAH ====================
export const mataKuliah = sqliteTable('mata_kuliah', {
  id: text('id').primaryKey(),
  kode_mk: text('kode_mk').notNull().unique(),
  nama_mk: text('nama_mk').notNull(),
  sks: integer('sks').notNull(),
  semester: integer('semester').notNull(), // 1-8
  sifat: text('sifat', { enum: ['Wajib', 'Pilihan'] }).notNull(),
  deskripsi: text('deskripsi'),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  id_bahan_kajian: text('id_bahan_kajian').references(() => bahanKajian.id), // 1 BK per MK
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-MK ====================
export const matrixCplMk = sqliteTable('matrix_cpl_mk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PENUGASAN DOSEN (MK-Dosen) ====================
export const penugasanDosen = sqliteTable('penugasan_dosen', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_dosen: text('id_dosen').notNull().references(() => dosen.id, { onDelete: 'cascade' }),
  is_koordinator: integer('is_koordinator', { mode: 'boolean' }).notNull().default(false),
  tahun_akademik: text('tahun_akademik').notNull(), // 2024/2025
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPMK ====================
export const cpmk = sqliteTable('cpmk', {
  id: text('id').primaryKey(),
  kode_cpmk: text('kode_cpmk').notNull(), // CPMK-1, CPMK-2
  deskripsi_cpmk: text('deskripsi_cpmk').notNull(),
  bobot_persentase: real('bobot_persentase').notNull(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== SUB-CPMK ====================
export const subCpmk = sqliteTable('sub_cpmk', {
  id: text('id').primaryKey(),
  kode_sub: text('kode_sub').notNull(), // L1.1, L1.2
  deskripsi_sub_cpmk: text('deskripsi_sub_cpmk').notNull(),
  indikator: text('indikator').notNull(),
  kriteria_penilaian: text('kriteria_penilaian').notNull(),
  id_cpmk: text('id_cpmk').notNull().references(() => cpmk.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS ====================
export const rps = sqliteTable('rps', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id),
  versi: integer('versi').notNull().default(1),
  tahun_akademik: text('tahun_akademik').notNull(),
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  tgl_penyusunan: integer('tgl_penyusunan', { mode: 'timestamp' }),
  tgl_validasi: integer('tgl_validasi', { mode: 'timestamp' }),
  status: text('status', { enum: ['Draft', 'Menunggu Validasi', 'Terbit'] }).notNull().default('Draft'),
  deskripsi_mk: text('deskripsi_mk'),
  pustaka_utama: text('pustaka_utama'),
  pustaka_pendukung: text('pustaka_pendukung'),
  id_koordinator: text('id_koordinator').references(() => dosen.id),
  id_kaprodi: text('id_kaprodi').references(() => dosen.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS MINGGU ====================
export const rpsMinggu = sqliteTable('rps_minggu', {
  id: text('id').primaryKey(),
  id_rps: text('id_rps').notNull().references(() => rps.id, { onDelete: 'cascade' }),
  minggu_ke: integer('minggu_ke').notNull(),
  id_sub_cpmk: text('id_sub_cpmk').references(() => subCpmk.id),
  materi: text('materi').notNull(),
  metode_pembelajaran: text('metode_pembelajaran'), // JSON array
  waktu_menit: integer('waktu_menit').notNull().default(150),
  pengalaman_belajar: text('pengalaman_belajar'),
  bentuk_penilaian: text('bentuk_penilaian'), // JSON array
  bobot_penilaian: real('bobot_penilaian'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

---

## 🔌 API Endpoints Design

### Authentication
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login, returns JWT
POST   /api/auth/refresh          # Refresh token
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Get current user
```

### Kurikulum
```
GET    /api/kurikulum             # List all (with filters)
GET    /api/kurikulum/:id         # Get by ID
POST   /api/kurikulum             # Create
PUT    /api/kurikulum/:id         # Update
DELETE /api/kurikulum/:id         # Delete
PATCH  /api/kurikulum/:id/activate # Set as active
```

### Profil Lulusan
```
GET    /api/profil-lulusan                    # List all
GET    /api/profil-lulusan/:id                # Get by ID
POST   /api/profil-lulusan                    # Create
PUT    /api/profil-lulusan/:id                # Update
DELETE /api/profil-lulusan/:id                # Delete
GET    /api/profil-lulusan/kurikulum/:id      # Get by kurikulum
```

### Kompetensi Utama (KUL)
```
GET    /api/kul                   # List all
GET    /api/kul/:id               # Get by ID
POST   /api/kul                   # Create
PUT    /api/kul/:id               # Update
DELETE /api/kul/:id               # Delete
GET    /api/kul/kurikulum/:id     # Get by kurikulum
GET    /api/kul/aspek/:aspek      # Get by aspek (S/P/KU/KK)
```

### CPL
```
GET    /api/cpl                   # List all
GET    /api/cpl/:id               # Get by ID
POST   /api/cpl                   # Create
PUT    /api/cpl/:id               # Update
DELETE /api/cpl/:id               # Delete
GET    /api/cpl/kurikulum/:id     # Get by kurikulum

# Matrix CPL-PL
GET    /api/cpl/matrix/pl         # Get matrix CPL-Profil Lulusan
POST   /api/cpl/matrix/pl         # Save matrix mappings
```

### Bahan Kajian
```
GET    /api/bahan-kajian                      # List all
GET    /api/bahan-kajian/:id                  # Get by ID
POST   /api/bahan-kajian                      # Create
PUT    /api/bahan-kajian/:id                  # Update
DELETE /api/bahan-kajian/:id                  # Delete
GET    /api/bahan-kajian/kurikulum/:id        # Get by kurikulum

# Matrix CPL-BK
GET    /api/bahan-kajian/matrix/cpl           # Get matrix CPL-BK
POST   /api/bahan-kajian/matrix/cpl           # Save matrix mappings
```

### Mata Kuliah
```
GET    /api/mata-kuliah                       # List all
GET    /api/mata-kuliah/:id                   # Get by ID
POST   /api/mata-kuliah                       # Create
PUT    /api/mata-kuliah/:id                   # Update
DELETE /api/mata-kuliah/:id                   # Delete
GET    /api/mata-kuliah/kurikulum/:id         # Get by kurikulum
GET    /api/mata-kuliah/semester/:sem         # Get by semester

# Matrix CPL-MK
GET    /api/mata-kuliah/matrix/cpl            # Get matrix CPL-MK
POST   /api/mata-kuliah/matrix/cpl            # Save matrix mappings

# Penugasan Dosen
GET    /api/mata-kuliah/:id/dosen             # Get assigned dosen
POST   /api/mata-kuliah/:id/dosen             # Assign dosen
DELETE /api/mata-kuliah/:id/dosen/:dosenId    # Remove dosen
```

### Dosen
```
GET    /api/dosen                 # List all
GET    /api/dosen/:id             # Get by ID
POST   /api/dosen                 # Create
PUT    /api/dosen/:id             # Update
DELETE /api/dosen/:id             # Delete
GET    /api/dosen/:id/mata-kuliah # Get assigned MK
GET    /api/dosen/search          # Search dosen (for dropdown)
```

### CPMK & Sub-CPMK
```
GET    /api/cpmk                  # List all
GET    /api/cpmk/:id              # Get by ID with sub-cpmk
POST   /api/cpmk                  # Create
PUT    /api/cpmk/:id              # Update
DELETE /api/cpmk/:id              # Delete
GET    /api/cpmk/mata-kuliah/:id  # Get CPMK by MK

# Sub-CPMK
POST   /api/cpmk/:id/sub          # Create sub-cpmk
PUT    /api/cpmk/:id/sub/:subId   # Update sub-cpmk
DELETE /api/cpmk/:id/sub/:subId   # Delete sub-cpmk
```

### RPS
```
GET    /api/rps                   # List all
GET    /api/rps/:id               # Get by ID with minggu
POST   /api/rps                   # Create
PUT    /api/rps/:id               # Update
DELETE /api/rps/:id               # Delete
GET    /api/rps/mata-kuliah/:id   # Get RPS by MK

# RPS Workflow
PATCH  /api/rps/:id/submit        # Submit for validation
PATCH  /api/rps/:id/validate      # Validate (Kaprodi only)
PATCH  /api/rps/:id/reject        # Reject (Kaprodi only)

# RPS Minggu
GET    /api/rps/:id/minggu        # Get all minggu
POST   /api/rps/:id/minggu        # Add minggu
PUT    /api/rps/:id/minggu/:mingguId  # Update minggu
DELETE /api/rps/:id/minggu/:mingguId  # Delete minggu
```

### Laporan
```
GET    /api/laporan/cpl-mk        # Matrix CPL-MK report
GET    /api/laporan/cpl-progress  # CPL achievement progress
GET    /api/laporan/rps-status    # RPS completion status
GET    /api/laporan/mk-dosen      # MK-Dosen assignment report
GET    /api/laporan/export/:type  # Export (pdf, excel)
```

---

## 🔧 Setup & Configuration

### 1. Initialize Project
```bash
# Create project
mkdir si-cap-api && cd si-cap-api
bun init

# Install dependencies
bun add hono @hono/zod-validator zod drizzle-orm
bun add -d drizzle-kit wrangler @cloudflare/workers-types typescript

# Optional: Auth & Utils
bun add hono-jwt bcryptjs nanoid
bun add -d @types/bcryptjs
```

### 2. Wrangler Configuration
```toml
# wrangler.toml
name = "si-cap-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "si-cap-db"
database_id = "your-database-id"

[env.development]
vars = { ENVIRONMENT = "development" }

[env.staging]
vars = { ENVIRONMENT = "staging" }
```

### 3. Drizzle Configuration
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
```

### 4. TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["@cloudflare/workers-types", "bun-types"],
    "lib": ["ES2022"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 📝 Code Patterns & Examples

### Entry Point (index.ts)
```typescript
// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { drizzle } from 'drizzle-orm/d1';

import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import * as schema from './db/schema';

// Routes
import authRoutes from './routes/auth';
import kurikulumRoutes from './routes/kurikulum';
import cplRoutes from './routes/cpl';
import mataKuliahRoutes from './routes/mata-kuliah';
import dosenRoutes from './routes/dosen';
import rpsRoutes from './routes/rps';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
};

type Variables = {
  db: ReturnType<typeof drizzle>;
  user: { id: string; email: string; role: string };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://si-cap.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Database middleware
app.use('*', async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  c.set('db', db);
  await next();
});

// Error handler
app.onError(errorHandler);

// Health check
app.get('/', (c) => c.json({ 
  status: 'ok', 
  message: 'SI-CAP API v1.0',
  timestamp: new Date().toISOString()
}));

// Public routes
app.route('/api/auth', authRoutes);

// Protected routes
app.use('/api/*', authMiddleware);
app.route('/api/kurikulum', kurikulumRoutes);
app.route('/api/cpl', cplRoutes);
app.route('/api/mata-kuliah', mataKuliahRoutes);
app.route('/api/dosen', dosenRoutes);
app.route('/api/rps', rpsRoutes);

// 404 handler
app.notFound((c) => c.json({ success: false, error: 'Not Found' }, 404));

export default app;
```

### Route Example (mata-kuliah.ts)
```typescript
// src/routes/mata-kuliah.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { mataKuliah, matrixCplMk, penugasanDosen, cpl, dosen } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';

const app = new Hono();

// Validators
const createMKSchema = z.object({
  kode_mk: z.string().min(1),
  nama_mk: z.string().min(1),
  sks: z.number().int().min(1).max(6),
  semester: z.number().int().min(1).max(8),
  sifat: z.enum(['Wajib', 'Pilihan']),
  deskripsi: z.string().optional(),
  id_kurikulum: z.string(),
  id_bahan_kajian: z.string().optional(),
});

// GET /api/mata-kuliah
app.get('/', async (c) => {
  const db = c.get('db');
  const { kurikulum, semester, sifat } = c.req.query();

  try {
    let query = db.select().from(mataKuliah);
    
    // Apply filters
    const conditions = [];
    if (kurikulum) conditions.push(eq(mataKuliah.id_kurikulum, kurikulum));
    if (semester) conditions.push(eq(mataKuliah.semester, parseInt(semester)));
    if (sifat) conditions.push(eq(mataKuliah.sifat, sifat as 'Wajib' | 'Pilihan'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(mataKuliah.semester, mataKuliah.kode_mk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch mata kuliah'), 500);
  }
});

// GET /api/mata-kuliah/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.id, id),
      with: {
        bahanKajian: true,
        cplList: {
          with: { cpl: true }
        },
        dosenPengampu: {
          with: { dosen: true }
        }
      }
    });

    if (!result) {
      return c.json(errorResponse('Mata kuliah not found'), 404);
    }

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch mata kuliah'), 500);
  }
});

// POST /api/mata-kuliah
app.post('/', zValidator('json', createMKSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(mataKuliah).values({ id, ...data });

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(result[0], 'Mata kuliah created'), 201);
  } catch (error) {
    return c.json(errorResponse('Failed to create mata kuliah'), 500);
  }
});

// PUT /api/mata-kuliah/:id
app.put('/:id', zValidator('json', createMKSchema.partial()), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(mataKuliah)
      .set({ ...data, updated_at: new Date() })
      .where(eq(mataKuliah.id, id));

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(result[0], 'Mata kuliah updated'));
  } catch (error) {
    return c.json(errorResponse('Failed to update mata kuliah'), 500);
  }
});

// DELETE /api/mata-kuliah/:id
app.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    await db.delete(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(null, 'Mata kuliah deleted'));
  } catch (error) {
    return c.json(errorResponse('Failed to delete mata kuliah'), 500);
  }
});

// ==================== Matrix CPL-MK ====================

// GET /api/mata-kuliah/matrix/cpl
app.get('/matrix/cpl', async (c) => {
  const db = c.get('db');
  const { kurikulum } = c.req.query();

  try {
    // Get all CPL
    const cplList = await db.select().from(cpl)
      .where(kurikulum ? eq(cpl.id_kurikulum, kurikulum) : undefined);

    // Get all MK
    const mkList = await db.select().from(mataKuliah)
      .where(kurikulum ? eq(mataKuliah.id_kurikulum, kurikulum) : undefined);

    // Get all mappings
    const mappings = await db.select().from(matrixCplMk);

    // Build matrix
    const matrix = cplList.map(cplItem => ({
      cpl: cplItem,
      mappings: mkList.map(mk => ({
        mk,
        isLinked: mappings.some(m => m.id_cpl === cplItem.id && m.id_mk === mk.id)
      }))
    }));

    return c.json(successResponse({ cplList, mkList, matrix }));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch matrix'), 500);
  }
});

// POST /api/mata-kuliah/matrix/cpl
const matrixSchema = z.object({
  mappings: z.array(z.object({
    id_cpl: z.string(),
    id_mk: z.string(),
  }))
});

app.post('/matrix/cpl', zValidator('json', matrixSchema), async (c) => {
  const db = c.get('db');
  const { mappings } = c.req.valid('json');

  try {
    // Clear existing mappings
    await db.delete(matrixCplMk);

    // Insert new mappings
    if (mappings.length > 0) {
      await db.insert(matrixCplMk).values(
        mappings.map(m => ({ id: nanoid(), ...m }))
      );
    }

    return c.json(successResponse(null, 'Matrix saved successfully'));
  } catch (error) {
    return c.json(errorResponse('Failed to save matrix'), 500);
  }
});

// ==================== Penugasan Dosen ====================

// GET /api/mata-kuliah/:id/dosen
app.get('/:id/dosen', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      penugasan: penugasanDosen,
      dosen: dosen
    })
    .from(penugasanDosen)
    .innerJoin(dosen, eq(penugasanDosen.id_dosen, dosen.id))
    .where(eq(penugasanDosen.id_mk, id));

    return c.json(successResponse(result.map(r => ({
      ...r.dosen,
      is_koordinator: r.penugasan.is_koordinator,
      tahun_akademik: r.penugasan.tahun_akademik,
      semester_akademik: r.penugasan.semester_akademik
    }))));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch dosen'), 500);
  }
});

// POST /api/mata-kuliah/:id/dosen
const penugasanSchema = z.object({
  dosen_ids: z.array(z.string()),
  tahun_akademik: z.string(),
  semester_akademik: z.enum(['Ganjil', 'Genap']),
  koordinator_id: z.string().optional()
});

app.post('/:id/dosen', zValidator('json', penugasanSchema), async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');
  const { dosen_ids, tahun_akademik, semester_akademik, koordinator_id } = c.req.valid('json');

  try {
    // Remove existing assignments for this MK and period
    await db.delete(penugasanDosen).where(
      and(
        eq(penugasanDosen.id_mk, mkId),
        eq(penugasanDosen.tahun_akademik, tahun_akademik),
        eq(penugasanDosen.semester_akademik, semester_akademik)
      )
    );

    // Insert new assignments
    if (dosen_ids.length > 0) {
      await db.insert(penugasanDosen).values(
        dosen_ids.map(dosenId => ({
          id: nanoid(),
          id_mk: mkId,
          id_dosen: dosenId,
          tahun_akademik,
          semester_akademik,
          is_koordinator: dosenId === koordinator_id
        }))
      );
    }

    return c.json(successResponse(null, 'Dosen assigned successfully'));
  } catch (error) {
    return c.json(errorResponse('Failed to assign dosen'), 500);
  }
});

export default app;
```

### Response Utility
```typescript
// src/utils/response.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(
  data: T, 
  message?: string,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta
  };
}

export function errorResponse(error: string, details?: unknown): ApiResponse {
  return {
    success: false,
    error,
    ...(process.env.NODE_ENV === 'development' && details ? { details } : {})
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

### Auth Middleware
```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
}

// Role-based middleware
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    
    if (!user || !roles.includes(user.role)) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    
    await next();
  };
}
```

---

## 🚀 Deployment Commands

### Development
```bash
# Run locally with D1 local database
bun run dev
# or
wrangler dev --local --persist

# Run Drizzle Studio (for DB inspection)
bun run db:studio
```

### Database Migration
```bash
# Generate migration
bun run db:generate

# Apply migration to local D1
wrangler d1 migrations apply si-cap-db --local

# Apply migration to production D1
wrangler d1 migrations apply si-cap-db --remote
```

### Production Deployment
```bash
# Deploy to Cloudflare Workers
wrangler deploy

# Deploy to staging
wrangler deploy --env staging

# View logs
wrangler tail
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "wrangler dev --local --persist",
    "deploy": "wrangler deploy",
    "deploy:staging": "wrangler deploy --env staging",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "wrangler d1 migrations apply si-cap-db --local",
    "db:migrate:prod": "wrangler d1 migrations apply si-cap-db --remote",
    "db:studio": "drizzle-kit studio",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "test:watch": "bun test --watch"
  }
}
```

---

## ⚠️ Important Notes

### Aspek Enum Values
- **S** = Sikap
- **P** = Pengetahuan
- **KU** = Keterampilan Umum
- **KK** = Keterampilan Khusus

### Business Rules
1. **Kurikulum** - Bisa lebih dari 1 kurikulum aktif per prodi (multiple active)
2. **MK → BK** - 1 MK memiliki 1 Bahan Kajian
3. **MK → CPL** - 1 MK memiliki minimal 2 CPL
4. **RPS** - Harus divalidasi Kaprodi sebelum Terbit
5. **CPMK** - Total bobot harus 100%
6. **Penugasan Dosen** - 1 MK bisa memiliki multiple dosen, 1 koordinator
7. **KKM** - Kriteria Ketuntasan Minimal yang dapat diatur oleh Kaprodi (default: 70)

### Frontend Integration
- Base URL: `https://si-cap-api.workers.dev` (production)
- Local: `http://localhost:8787`
- Auth: Send `Authorization: Bearer <token>` header
- Content-Type: `application/json`

### Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📈 Dashboard Analytics API Endpoints (NEW)

### KKM Settings
```typescript
// GET /api/settings/kkm - Get current KKM value
// PUT /api/settings/kkm - Update KKM value (Kaprodi only)
{
  "kkm": 70 // 0-100
}
```

### Profil Lulusan Chart Data
```typescript
// GET /api/dashboard/profil-lulusan
// Response: Array of Profil Lulusan with achievement percentage
interface ProfilLulusanChartData {
  kode: string;           // PL1, PL2, PL3
  nama: string;           // Software Engineer, etc
  jumlah_cpl: number;     // Related CPL count
  persentase: number;     // Achievement percentage (0-100)
}
```

### CPL/Bahan Kajian Chart Data
```typescript
// GET /api/dashboard/cpl
// Response: Array of CPL (Bahan Kajian) with average scores
interface CPLChartData {
  kode: string;           // BK1, BK2, BK3
  nama: string;           // Pemrograman Dasar, etc
  rata_rata: number;      // Average score (0-100)
  jumlah_mk: number;      // Related MK count
}
```

### Bahan Kajian/Mata Kuliah Chart Data
```typescript
// GET /api/dashboard/mata-kuliah
// Response: Array of MK with average scores
interface BahanKajianChartData {
  kode: string;           // MK1, MK2, MK3
  nama: string;           // Algoritma & Pemrograman, etc
  rata_rata: number;      // Average score (0-100)
  jumlah_mahasiswa: number;
}
```

### Mahasiswa di Bawah KKM per MK
```typescript
// GET /api/dashboard/mahasiswa-bawah-kkm/:kode_mk
// Response: Trend data per semester
interface MahasiswaBawahKKMData {
  kode_mk: string;            // Semester identifier
  nama_mk: string;            // Semester name (2023/2024 Ganjil)
  jumlah_dibawah_kkm: number; // Count below KKM
  total_mahasiswa: number;    // Total students
  persentase: number;         // Percentage below KKM
}
```

### CPMK Average per MK
```typescript
// GET /api/dashboard/cpmk/:kode_mk
// Response: Array of CPMK average scores
interface CPMKRataRataData {
  kode_cpmk: string;      // CPMK1, CPMK2, CPMK3
  rata_rata: number;      // Average score (0-100)
  jumlah_mahasiswa: number;
}
```

### Mahasiswa Grade Data
```typescript
// GET /api/dashboard/mahasiswa/:nim
// Response: Student's grades per MK
interface NilaiMahasiswaPerMK {
  nim: string;
  nama_mahasiswa: string;
  angkatan: number;
  nilai_per_cpmk: { kode_cpmk: string; nilai: number }[];
  nilai_akhir: number;
  status: 'Lulus' | 'Tidak Lulus';
}
```

---

## 🎓 Mahasiswa Schema (NEW)

```typescript
// ==================== MAHASISWA ====================
export const mahasiswa = sqliteTable('mahasiswa', {
  nim: text('nim').primaryKey(),
  nama_mahasiswa: text('nama_mahasiswa').notNull(),
  angkatan: integer('angkatan').notNull(),
  id_prodi: text('id_prodi').notNull().references(() => prodi.id),
  email: text('email'),
  foto_url: text('foto_url'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== NILAI MAHASISWA ====================
export const nilaiMahasiswa = sqliteTable('nilai_mahasiswa', {
  id: text('id').primaryKey(),
  nim: text('nim').notNull().references(() => mahasiswa.nim, { onDelete: 'cascade' }),
  kode_mk: text('kode_mk').notNull().references(() => mataKuliah.kode_mk, { onDelete: 'cascade' }),
  id_cpmk: text('id_cpmk').notNull().references(() => cpmk.id, { onDelete: 'cascade' }),
  nilai: real('nilai').notNull(), // 0-100
  semester: text('semester').notNull(), // "2024/2025 Ganjil"
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== SETTINGS (KKM) ====================
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
// Default: { key: 'kkm', value: '70' }
```

---

## 📚 References

- [Hono Documentation](https://hono.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
- [Bun Documentation](https://bun.sh)
