# User Management App

Aplicación fullstack para gestión de usuarios con autenticación JWT, roles y CRUD completo.

---

# Tecnologías

## Backend

* .NET 10 / ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication (HS256)
* BCrypt (hash de contraseñas)
* Swagger

## Frontend

* React + Vite
* Ant Design
* React Hook Form

---

# Requisitos previos

* .NET 10
* Node.js 18+
* SQL Server (LocalDB, Express o Docker)
* Git

---

# Variables de entorno

## Backend (.NET User Secrets)

Este proyecto usa user-secrets para proteger datos sensibles.

### Configuración:

```bash
cd backend/UserManagement.Api

dotnet user-secrets init

dotnet user-secrets set "Jwt:Key" "SUPER_SECRET_KEY_12345678901234567890"

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost\\SQLEXPRESS;Database=UserManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

---

## Frontend (.env)

Crear archivo:

```env
VITE_API_URL=http://localhost:5186/api
```

---

# Instalación de dependencias

## Backend

Restaurar dependencias: ruta cd backend/UserManagement.Api

```bash
dotnet restore
```

Instalar herramienta de migraciones (si no está instalada):

```bash
dotnet tool install --global dotnet-ef
```

---

## Frontend

Instalar dependencias:

```bash
npm install
```

---

# Base de datos

La base de datos se gestiona mediante migraciones de Entity Framework Core.

Las migraciones se encuentran en:

```
backend/UserManagement.Infrastructure/Migrations
```

Para crear la base de datos y aplicar el esquema:

```bash
cd backend/UserManagement.Api

dotnet ef database update
```

Esto creará automáticamente la base de datos y las tablas necesarias.

## Datos iniciales

Al iniciar la aplicación, se crean automáticamente usuarios de prueba:

Admin:
[admin@demo.com](mailto:admin@demo.com) / Admin123!

Usuario:
[user@demo.com](mailto:user@demo.com) / User123!

---

# Ejecución del proyecto

## Backend

```bash
cd backend/UserManagement.Api

dotnet run
```

Swagger disponible en:

```
http://localhost:5186/swagger
```

---

## Frontend

```bash
cd frontend

npm install
npm run dev
```

App disponible en:

```
http://localhost:5173
```

---

# Autenticación

* JWT con firma HS256
* Expiración configurable
* Roles: admin / user

---

# Endpoints principales

## Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

## Users

* GET `/api/users` (admin)
* GET `/api/users/{id}`
* POST `/api/users` (admin)
* PUT `/api/users/{id}`
* DELETE `/api/users/{id}` (admin)

---

# Pruebas API

## Swagger

Accede a:

```
http://localhost:5186/swagger
```

### Autenticación

1. Ejecutar:

```
POST /api/auth/login
```

2. Body:

```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

3. Copiar el valor de:

```
accessToken
```

4. Click en **Authorize**

5. Pegar únicamente:

```
{token}
```

No es necesario escribir "Bearer", Swagger lo agrega automáticamente.

---

# Pruebas por endpoint

## Auth

### Registro

```
POST /api/auth/register
```

```json
{
  "email": "nuevo@demo.com",
  "password": "Admin123!",
  "name": "Nuevo Usuario"
}
```

---

### Login

```
POST /api/auth/login
```

```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

---

## Users

### Obtener usuarios (admin)

```
GET /api/users
```

Parámetros opcionales:

```
search=&page=1&size=10
```

---

### Obtener usuario por ID

```
GET /api/users/{id}
```

---

### Crear usuario (admin)

```
POST /api/users
```

```json
{
  "email": "test@demo.com",
  "name": "Usuario Test",
  "password": "Admin123!",
  "role": "user"
}
```

---

### Actualizar usuario

```
PUT /api/users/{id}
```

```json
{
  "name": "Usuario Actualizado",
  "password": "Admin123!",
  "role": "user",
  "isActive": true
}
```

Notas:

* El campo `password` es opcional
* Solo admin puede modificar `role` e `isActive`

---

### Eliminar usuario (admin)

```
DELETE /api/users/{id}
```

---

# Credenciales de prueba

```text
Admin:
admin@demo.com / Admin123!

Usuario:
user@demo.com / User123!
```

---

# Notas técnicas

* Las variables sensibles (JWT y DB) están fuera del repositorio usando user-secrets
* No se usan servicios externos de autenticación
* La base de datos se crea mediante migraciones de Entity Framework Core
* Seeder automático para datos iniciales
* Arquitectura limpia con separación en capas
* Frontend responsive y accesible

---

# Estructura del proyecto

```
/frontend
/backend
```

---

# Autor

Desarrollado como prueba técnica.
