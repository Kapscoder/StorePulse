# 🏪 StorePulse — Store Rating Management System

A full-stack web application for managing store ratings. Built with **Express + Prisma + MongoDB** (backend) and **React + TailwindCSS** (frontend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB replica set)
- npm 9+

### 1. Backend Setup

```bash
cd backend

# Copy env template and configure
cp .env.example .env
# Edit .env: set DATABASE_URL with your MongoDB connection string

# Install dependencies
npm install

# Push Prisma schema & indexes to MongoDB
npx prisma db push

# Seed the admin user
npm run db:seed

# Start the dev server
npm run dev
```

> **Default Admin Credentials:**
> - Email: `admin@storepulse.com`
> - Password: `Admin@1234`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **System Administrator** | Dashboard stats, manage users & stores, view all data |
| **Normal User** | Register, browse stores, submit/modify ratings (1–5) |
| **Store Owner** | View their store's ratings dashboard and average score |

---

## 🔐 Form Validation Rules

| Field | Rule |
|-------|------|
| **Name** | 2–60 characters |
| **Email** | Valid email format |
| **Password** | 8–16 chars, min 1 uppercase, min 1 special character |
| **Address** | Max 400 characters |
| **Rating** | 1–5 (decimals allowed, e.g. 3.5) |

---

## 🏗️ Project Structure

```
StorePulse/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     ← DB schema (users, stores, ratings)
│   │   └── seed.ts           ← Seeds default admin
│   └── src/
│       ├── controllers/      ← Route handlers
│       ├── middleware/       ← Auth, validators
│       ├── routes/           ← Route definitions
│       ├── lib/              ← Prisma client singleton
│       └── index.ts          ← Express app entry
└── frontend/
    └── src/
        ├── api/              ← Axios instance
        ├── components/       ← Reusable UI (Navbar, StarRating, SortableTable)
        ├── context/          ← Auth context (JWT)
        ├── pages/
        │   ├── admin/        ← Admin dashboard, user/store management
        │   ├── user/         ← Store browser with ratings
        │   └── owner/        ← Store owner dashboard
        └── utils/            ← Zod validation schemas
```

---

## 📡 API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | Public | Normal user registration |
| `POST` | `/api/auth/login` | Public | Login (all roles) |
| `POST` | `/api/auth/change-password` | Any role | Update password |
| `GET` | `/api/auth/me` | Any role | Get current user |

### Admin (requires admin role)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/dashboard` | Totals: users, stores, ratings |
| `GET` | `/api/admin/users` | List users (filterable + sortable) |
| `POST` | `/api/admin/users` | Create user (admin or normal_user) |
| `GET` | `/api/admin/users/:id` | View user details |
| `GET` | `/api/admin/stores` | List stores (filterable + sortable) |
| `POST` | `/api/admin/stores` | Create store + store_owner account |
| `GET` | `/api/admin/stores/:id` | View store details |

### Normal User
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stores` | Browse stores with ratings |
| `POST` | `/api/ratings` | Submit rating (1–5) |
| `PUT` | `/api/ratings/:storeId` | Update existing rating |

### Store Owner
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/owner/dashboard` | View raters + average rating |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js, TypeScript |
| ORM | Prisma 5 |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | express-validator (backend), Zod (frontend) |
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Styling | TailwindCSS v4 |
| HTTP Client | Axios |
