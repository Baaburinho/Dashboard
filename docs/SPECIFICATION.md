# PAOS v1.1 — Academic Memory Edition (AME)
### Complete Production Specification & Architectural Freeze Document

> **“Remember where you came from. Know where you are. Own where you're going.”**

---

## 1. Purpose

PAOS (Personal Academic Operating System) is a private academic management and memory system for a single student.

The system maintains a structured record of:
* Academic semesters
* Courses
* Grades
* GPA and CGPA
* Academic milestones
* Activities and assignments
* Exams
* Attendance
* Timetable
* Goals and tasks
* Personal academic notes
* Memories and reflections
* Achievements
* Documents
* Fees and payment records
* Academic history
* Audit history
* Backups and exports

The system is designed for long-term use from Semester 1 through graduation and beyond.

---

## 2. Production Architecture

```text
PAOS v1.1
│
├── Frontend
│   ├── React
│   ├── TypeScript
│   ├── Vite
│   ├── Tailwind CSS
│   ├── Lucide React
│   └── Recharts
│
├── Backend
│   ├── Node.js
│   ├── TypeScript
│   ├── Fastify
│   ├── Prisma
│   └── Zod
│
├── Primary Database
│   └── PostgreSQL
│
├── Local Persistence
│   └── IndexedDB (paosDB)
│
├── Portability
│   ├── JSON
│   ├── CSV
│   └── PDF
│
└── Data Integrity
    ├── Provenance
    ├── Snapshots
    ├── Soft Deletion
    ├── Audit Trail
    └── Schema Migrations
```

---

## 3. Storage Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| Primary database | PostgreSQL | Canonical and persistent application data |
| ORM | Prisma | Database access, relations and migrations |
| Local database | IndexedDB | Offline cache, local reads and temporary offline writes |
| Backup | JSON | Full portable application archive |
| Tabular export | CSV | Course and academic ledger export |
| Report export | PDF | PAOS Academic Journey Report |

### Source of Truth
PostgreSQL is the canonical source of truth.
IndexedDB is a local mirror/cache and offline persistence layer.
Local state must not silently overwrite newer server data.

---

## 4. Synchronization Rules

The application supports:
* Online reads from server-backed data
* Offline access to locally cached records
* Queueing of supported offline mutations
* Synchronization when connectivity returns
* Conflict detection
* Explicit conflict resolution where automatic merging is unsafe

Synchronization state:
`Synced` | `Pending` | `Offline` | `Conflict` | `Failed`

No silent data loss is permitted during synchronization.

---

## 5. Database Integrity

### 5.1 Schema Migration
Database changes use versioned Prisma migrations.
* Forward migration
* Backward compatibility where practical
* Migration validation
* Backup before destructive schema changes
* No destructive migration without explicit confirmation

### 5.2 Snapshots
Automatic snapshots are required before:
* Restore
* Factory reset
* Destructive migration
* Bulk import
* Large data replacement

Snapshot flow: `Preview → Validate → Snapshot → Confirm → Execute`

### 5.3 Soft Deletion
Important records use `isArchived` and `deletedAt`.
Deleted records remain recoverable unless explicitly and permanently purged.

---

## 6. Academic Provenance Model

Every important academic record contains provenance:
* **Verified**: Supported by an official source such as a certificate, grade sheet, or authoritative document.
* **Personal Record**: Entered by the student as part of their own academic history, milestone, or reflection.
* **Seeded**: Initial sample, template, or placeholder record.
* **Unverified**: Draft information that has not yet been confirmed.

---

## 7. Append-Only Audit Trail

Supported events:
`CREATE`, `UPDATE`, `SOFT_DELETE`, `RESTORE`, `IMPORT`, `EXPORT`, `SNAPSHOT`, `RESTORE_FROM_BACKUP`, `SCHEMA_MIGRATION`

Audit records are append-only and cannot be overwritten during normal application operation.

---

## 8. Brand Design System

| Token | HEX | Primary Use |
|---|---|---|
| **PAOS Gold** | `#C9A227` | Brand, achievements, milestones, active states |
| **Morning Yellow** | `#F4E7A1` | Highlights and selected surfaces |
| **Academic Ivory** | `#FFFDF5` | Main background canvas |
| **Paper White** | `#FFFFFF` | Content surfaces, modals, data tables |
| **PAOS Ink** | `#171714` | Primary text and numbers |
| **Stone Ink** | `#66645C` | Secondary text and timestamps |
| **Archive Line** | `#E8E1CF` | Borders and dividers |
| **Olive Success** | `#6B7D45` | Positive/verified states, on-track progress |
| **Amber Warning** | `#B7791F` | Deadlines (<48h) and exam warnings |
| **Deep Rust** | `#9B3D32` | Critical and destructive states |

---

## 9. Release Identifier

### `PAOS-v1.1-AME-FREEZE` 🔒
* **Product**: Personal Academic Operating System
* **Edition**: Academic Memory Edition
* **Status**: Production Architecture and Design Freeze Certified
