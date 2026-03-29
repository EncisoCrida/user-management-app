# User Management App

Aplicación fullstack para gestión de usuarios con autenticación JWT, roles y CRUD completo.

---

# Tecnologías

## Backend

* .NET 10 / ASP.NET Core Web API
* Entity Framework Core
* SQL Server (LocalDB recomendado)
* JWT Authentication (HS256)
* BCrypt (hash de contraseñas)
* Swagger

Nota:
Este proyecto utiliza .NET 10, asegúrese de tenerlo instalado antes de ejecutar.
https://dotnet.microsoft.com/download

## Frontend

* React + Vite
* Ant Design
* React Hook Form

---

# Requisitos previos

* .NET 10 
* Node.js 18+
* SQL Server Express o Visual Studio (para LocalDB)
* Git

---

# Variables de entorno

## Backend (.NET User Secrets)

Este proyecto usa user-secrets para proteger datos sensibles.

### Configuración

```bash
cd backend/UserManagement.Api

dotnet user-secrets init

dotnet user-secrets set "Jwt:Key" "SUPER_SECRET_KEY_12345678901234567890"
```

---

# Base de datos

### Configuración (LocalDB - recomendado)

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\MSSQLLocalDB;Database=UserManagementDB;Trusted_Connection=True;"
```

Luego ejecutar:

```bash
cd backend/UserManagement.Api

dotnet restore
dotnet ef database update
```

Esto creará automáticamente la base de datos y las tablas necesarias.

Nota:
LocalDB requiere SQL Server Express o Visual Studio instalado.

---

# Frontend (.env)

Crear archivo:

```env
VITE_API_URL=http://localhost:5186/api
```

---

# Instalación de dependencias

## Backend

```bash
cd backend/UserManagement.Api

dotnet restore
```

Instalar herramienta de migraciones (si no está instalada):

```bash
dotnet tool install --global dotnet-ef
```

---

## Frontend

```bash
cd frontend

npm install
```

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

4. Click en Authorize

5. Pegar únicamente:

```
{token}
```

Swagger agrega automáticamente el prefijo Bearer.

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

* Variables sensibles manejadas con user-secrets
* No se utilizan servicios externos de autenticación
* Base de datos gestionada con migraciones de Entity Framework Core
* Seeder automático para datos iniciales
* Arquitectura limpia por capas
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
