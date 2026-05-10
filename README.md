
# Saifna – Summer Rentals Platform (SaaS) 

**Multi-Tenant SaaS Platform for Summer Property Rentals**

Saifna هي منصة SaaS متطورة تربط بين أصحاب العقارات والعملاء لتأجير الشقق والأماكن الصيفية بطريقة منظمة وآمنة.

---

## نظرة عامة على المشروع

Saifna ليست مجرد نظام حجوزات عادي، بل **منصة SaaS Multi-Tenant** كاملة تسمح لعدة أصحاب عقارات بإدارة وحداتهم بشكل مستقل على نفس المنصة، مع عزل بيانات كامل لكل مالك.

### الفكرة الأساسية
- **أصحاب العقارات (Property Owners)**: يعرضون وحداتهم الصيفية ويديرون حجوزاتهم.
- **العملاء (Clients)**: يبحثون ويحجزون الأماكن المناسبة لفترة الصيف.
- **الأدمن**: يدير المنصة بالكامل.

---

## المميزات الرئيسية

- **Multi-Tenancy Architecture** مع عزل بيانات كامل لكل Owner
- **نظام حجز متقدم** (Booking System) مع إدارة التوافر
- **إشعارات Real-time** باستخدام Socket.IO
- **Role-Based Access Control (RBAC)**:
  - Super Admin
  - Property Owner
  - End User (Client)
- **داشبوردات منفصلة** حسب دور كل مستخدم
- **نظام الدفع والتحقق** عند Check-in
- **إدارة العقارات** (إضافة، تعديل، صور، توافر)
- **إدارة الحجوزات** والتقويم

---

## 🛠️ Tech Stack

| الطبقة              | التقنية                          |
|---------------------|----------------------------------|
| Backend             | NestJS + TypeScript             |
| Database            | PostgreSQL                      |
| ORM                 | Prisma                          |
| Real-time           | Socket.IO                       |
| Authentication      | JWT + RBAC                      |
| Multi-Tenancy       | Row Level Security / Schema     |
| Caching             | Redis                           |

---

## التحديات الهندسية التي تم حلها

- تصميم **Multi-Tenant SaaS** مع Data Isolation
- تنفيذ **RBAC** متقدم وآمن
- إدارة التوافر والحجوزات دون تعارض (Race Conditions)
- Real-time Notifications للعملاء وأصحاب العقارات
- فصل منطق كل Tenant بشكل نظيف
- Payment Verification Workflow

---

## الهيكل المعماري

- **Multi-Tenancy Design** (Tenant Isolation)
- **Clean Architecture** باستخدام NestJS
- **Event-Driven** للإشعارات الفورية
- **Role-Based Dashboards**
- **State Management** لدورة حياة الحجز

### الكيانات الرئيسية
- Users (Admin, Owner, Client)
- Properties / Units
- Bookings
- Payments
- Availability Calendar
- Notifications

---

## طريقة التشغيل

### المتطلبات
- Node.js (v18+)
- PostgreSQL
- Redis
- Yarn أو npm

### Installation

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/saifna.git
cd saifna

# تثبيت الـ dependencies
yarn install

# إعداد ملف البيئة
cp .env.example .env

# تشغيل Migrations
yarn prisma migrate dev

# تشغيل المشروع
yarn start:dev
