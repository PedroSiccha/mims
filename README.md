# 🧩 MIMS

Este proyecto es una arquitectura de microservicios basada en **NestJS + PostgreSQL + Prisma + Docker + NATS**, con separación por contexto y comunicación asincrónica entre servicios.

## 📦 Servicios

* `user-service`: Gestión de usuarios y autenticación JWT.
* `order-service`: Creación y gestión de órdenes asociadas a usuarios.
* `postgres`: Base de datos común.
* `nats`: Mensajería entre servicios.

## 🚀 Tecnologías

* **NestJS** – Framework Node escalable.
* **Prisma ORM** – Acceso a base de datos.
* **PostgreSQL** – Base de datos relacional.
* **Docker & Compose** – Contenedores por servicio.
* **NATS** – Mensajería ligera entre microservicios.
* **Gitflow** – Flujo de ramas profesional.

## 🏗️ Arquitectura

```txt
          ┌────────────┐       NATS        ┌───────────────┐
          │user-service│ ────────────────▶ │order-service │
          └─────▲──────┘                   └─────▲─────────┘
                │ JWT                                      
                │                                         
         ┌──────┴──────┐                               
         │ PostgreSQL  │ <- Prisma ORM                 
         └─────────────┘
```

## 🧪 Cómo ejecutar el proyecto

### 1. 🔁 Clonar el repositorio

```bash
git clone https://github.com/PedroSiccha/mims.git
cd mims
```

### 2. 🧼 Limpiar entorno (opcional)

```bash
docker-compose down -v --remove-orphans
docker system prune -f
```

### 3. 🛠️ Revisar archivos `.env` por servicio

#### 📁 `user-service/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mims?schema=user_service
JWT_SECRET=supersecreto
JWT_EXPIRES_IN=3600s
```

#### 📁 `order-service/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mims?schema=order_service
```

> ⚠️ Ambos deben usar el mismo host y base (`mims`), pero schemas diferentes.

---

### 4. 🐳 Construir e iniciar todos los servicios

```bash
docker-compose build --no-cache
docker-compose up -d
```

### 5. 📦 Aplicar migración de esquemas con Prisma

```bash
docker-compose exec user-service npx prisma db push
docker-compose exec order-service npx prisma db push
```

### 6. ✅ Verificar conexión

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com", "password":"123456"}'
```

Si obtienes un token JWT, ¡todo está funcionando correctamente!
