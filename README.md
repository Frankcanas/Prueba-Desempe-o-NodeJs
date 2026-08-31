# 🏥 RiwiMediCare Plus API - Sistema de Solicitudes de Abastecimiento Médico

![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-blue.svg)
![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-blue.svg)
![Sequelize](https://img.shields.io/badge/Sequelize-v6.37-blueviolet.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D.svg)

---

## 👨‍💻 Información del Estudiante
* **Coder:** Frank Cañas
* **Clan:** Clan NodeJS
* **Repositorio de GitHub:** [https://github.com/Frankcanas/Prueba-Desempe-o-NodeJs](https://github.com/Frankcanas/Prueba-Desempe-o-NodeJs)

---

## 📖 Descripción del Proyecto
API REST construida para la empresa **RiwiMediCare Plus** encargada de digitalizar, controlar y administrar el ciclo de vida de las solicitudes de abastecimiento de medicamentos e insumos médicos distribuidos a diferentes clínicas y centros de atención hospitalaria.

El sistema garantiza integridad transaccional (ACID), control estricto de inventarios en almacenes, roles de seguridad con JWT y población masiva de datos iniciales vía JSON mediante Multer.

---

## 🚀 Tecnologías Utilizadas
* **Lenguaje:** TypeScript v5.7+
* **Entorno de Ejecución:** Node.js v20+
* **Framework Web:** Express.js v4.21+
* **Base de Datos Relacional:** PostgreSQL v15
* **ORM:** Sequelize v6.37
* **Autenticación:** JSON Web Token (`jsonwebtoken`) & `bcrypt`
* **Carga de Archivos / Seeders:** `multer` (procesamiento en memoria)
* **Documentación:** Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)
* **Contenedores:** Docker & Docker Compose

---

## 📁 Arquitectura del Proyecto (Clean Architecture por Capas)

```text
src/
├── config/             # Configuración de base de datos Sequelize
├── controllers/        # Controladores HTTP (Manejo de Request / Response)
├── docs/               # Configuración OpenAPI / Swagger JSDoc
├── dtos/               # Objetos de Transferencia de Datos y validaciones
├── interfaces/         # Interfaces y tipos estrictos de TypeScript
├── middlewares/        # Middlewares de Autenticación, Roles, Subidas y Errores
├── models/             # Modelos Sequelize y Relaciones (1 a N)
├── repositories/       # Capa de acceso y persistencia de datos (Data Access Layer)
├── routes/             # Enrutadores Express documentados con Swagger
├── services/           # Lógica y reglas de negocio del sistema
├── utils/              # Utilidades de JWT y funciones auxiliares
├── app.ts              # Configuración de la aplicación Express
└── server.ts           # Inicialización y arranque del servidor
uploads/                # Archivos JSON de prueba para el Seeder masivo
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=nodejs
DB_PASSWORD=123456
DB_NAME=riwimedicare_db

# Seguridad y Autenticación JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=2h

# Contenedores Docker
DB_CONTAINER_NAME=riwimedicare-db
APP_CONTAINER_NAME=riwimedicare-backend
DB_CPU_LIMIT=2
DB_MEM_LIMIT=512M
APP_CPU_LIMIT=2
APP_MEM_LIMIT=512M
```

---

## 🛠️ Instructivo de Instalación y Ejecución

### Opción 1: Ejecución con Docker Compose (Recomendado)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Frankcanas/Prueba-Desempe-o-NodeJs.git
   cd Prueba-Desempe-o-NodeJs
   ```
2. Levantar los contenedores de la base de datos PostgreSQL y de la API:
   ```bash
   docker compose up -d --build
   ```
3. Verificar el estado de los contenedores:
   ```bash
   docker compose ps
   ```

### Opción 2: Ejecución Local en Node.js

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Compilar TypeScript:
   ```bash
   npm run build
   ```
3. Ejecutar en modo desarrollo con recarga en vivo:
   ```bash
   npm run dev
   ```
4. O ejecutar en modo producción:
   ```bash
   npm start
   ```

---

## 📥 Carga Masiva de Datos Base (Seeders vía Endpoint)

Para poblar la base de datos con los usuarios, almacenes, clínicas y medicamentos de prueba mediante `multer`:

```bash
curl -X POST http://localhost:3000/api/v1/seeders/upload \
  -F "file=@uploads/seed_data.json"
```

### Usuarios Precargados por el Seeder:
* **Administrador:** `carlos.admin@riwimedicare.com` | Clave: `AdminPassword2026*`
* **Gestor de Solicitudes:** `maria.gestor@riwimedicare.com` | Clave: `GestorPassword2026*`

---

## 🌐 Documentación Interactiva con Swagger UI

Una vez levantada la API, accede en tu navegador a:

🔗 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📋 Resumen de Endpoints de la API

| Módulo | Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Público | Registro de usuarios (`Administrador` o `Gestor de Solicitudes`) |
| **Auth** | `POST` | `/api/v1/auth/login` | Público | Inicio de sesión y entrega de Token JWT |
| **Seeders**| `POST` | `/api/v1/seeders/upload` | Público / Admin | Carga masiva estructurada vía JSON con Multer |
| **Clínicas** | `GET` | `/api/v1/clinics` | Administrador | Listado paginado de clínicas |
| **Clínicas** | `POST` | `/api/v1/clinics` | Administrador | Registro de clínica con validación de NIT único |
| **Clínicas** | `GET` | `/api/v1/clinics/:id` | Administrador | Consulta de clínica por ID |
| **Clínicas** | `PUT` | `/api/v1/clinics/:id` | Administrador | Actualización de datos de clínica |
| **Clínicas** | `DELETE`| `/api/v1/clinics/:id` | Administrador | Eliminación lógica (*Soft Delete*) |
| **Almacenes**| `GET` | `/api/v1/warehouses` | Administrador | Listado de almacenes |
| **Almacenes**| `POST` | `/api/v1/warehouses` | Administrador | Registro de almacén y capacidad |
| **Almacenes**| `GET` | `/api/v1/warehouses/:id` | Administrador | Detalle de almacén con inventario |
| **Almacenes**| `PUT` | `/api/v1/warehouses/:id` | Administrador | Actualización de almacén |
| **Almacenes**| `DELETE`| `/api/v1/warehouses/:id`| Administrador | Eliminación lógica (*Soft Delete*) |
| **Medicamentos**| `GET` | `/api/v1/medicines` | Administrador | Listado de medicamentos con filtros |
| **Medicamentos**| `POST` | `/api/v1/medicines` | Administrador | Registro de medicamento en almacén con código único |
| **Medicamentos**| `GET` | `/api/v1/medicines/:id` | Administrador | Detalle de medicamento y almacén |
| **Medicamentos**| `PUT` | `/api/v1/medicines/:id` | Administrador | Actualización de stock y precios |
| **Medicamentos**| `DELETE`| `/api/v1/medicines/:id`| Administrador | Eliminación lógica (*Soft Delete*) |
| **Solicitudes**| `POST` | `/api/v1/supply-requests`| Admin / Gestor | Creación de solicitud con control de stock |
| **Solicitudes**| `GET` | `/api/v1/supply-requests`| Admin / Gestor | Listado de solicitudes con filtros y paginación |
| **Solicitudes**| `GET` | `/api/v1/supply-requests/clinic/:clinicId`| Admin / Gestor | Historial completo de solicitudes por clínica |
| **Solicitudes**| `GET` | `/api/v1/supply-requests/:id`| Admin / Gestor | Detalle de solicitud con relaciones |
| **Solicitudes**| `PATCH`| `/api/v1/supply-requests/:id/status`| Admin / Gestor | Actualización de ciclo de vida con descuento de inventario |
