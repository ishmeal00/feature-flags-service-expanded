# 🚀 Feature Flags Service — Community Edition

A lightweight **Feature Flags & Remote Config service** for startups and developers.  
Built with **Node.js + Express + Postgres + Redis + Next.js Admin UI**.  

This is the **Community Edition (Apache 2.0 License)**.  
For the **Enterprise Edition** with advanced features (RBAC, Billing, Analytics, Monitoring, SLA), please contact us.

---

## ✨ Features (Community Edition)
- ✅ Create and manage **Projects**.
- ✅ CRUD for **Feature Flags & Rules**.
- ✅ **Evaluate flags** per user/session.
- ✅ **Basic Admin UI** (Next.js + Tailwind).
- ✅ **JWT authentication** (register/login).
- ✅ **Postgres** database + schema included.
- ✅ Optional **Redis caching**.

---

## 🏗️ Tech Stack
- **Backend:** Node.js (Express), PostgreSQL, Redis  
- **Frontend (Admin UI):** Next.js, TailwindCSS  
- **Auth:** JWT (no refresh tokens in Community)  
- **License:** Apache 2.0  

---

## 📦 Installation

### 1. Clone
```bash
git clone https://github.com/your-username/feature-flags-community.git
cd feature-flags-community


cd backend
npm install

DATABASE_URL=postgres://user:password@localhost:5432/featureflags
PORT=4000
JWT_SECRET=supersecret

psql $DATABASE_URL -f sql/init_db.sql

npm run dev

cd ../admin
npm install
npm run dev
