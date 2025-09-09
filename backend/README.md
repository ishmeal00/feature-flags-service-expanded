# Feature Flags Service — Community Edition

This is the **Community Edition** (Open Core) — a trimmed, free version licensed under Apache 2.0.

Includes:
- Core Feature Flags API (projects, flags, rules, evaluate)
- Basic Admin UI (Projects, Flags, Users)
- JWT-based authentication (no refresh tokens)
- Postgres + Redis support (optional)
- Simple SQL init script: sql/init_db.sql

Excluded from Community Edition:
- Stripe billing & metering
- Advanced Analytics dashboard
- CSRF/refresh-token rotation
- Enterprise deployment manifests (Helm/K8s)
