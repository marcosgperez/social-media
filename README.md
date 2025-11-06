# Social Media Challenge - Documentación Técnica

Aplicación de red social desarrollada con Next.js, TypeScript y Supabase como challenge técnico full-stack.

**Demo en vivo:** [Desplegado en Vercel](https://challenge.marcosfs.dev/)

---
https://challenge.marcosfs.dev/
---

## Stack Tecnológico

- **Framework:** Next.js 16 con TypeScript
- **Estilos:** Tailwind CSS 4
- **Estado Global:** Redux Toolkit
- **Backend/DB:** Supabase (PostgreSQL + Storage)
- **Autenticación:** NextAuth.js
- **Documentación:** Storybook 8
- **Deploy:** Vercel

---

## Funcionalidades Implementadas

### Autenticación
- Sistema de login/registro con validación
- Sesiones persistentes con NextAuth.js
- Protección de rutas privadas

### Feed de Posts
- Visualización de posts en tiempo real
- Carga de imágenes mediante Supabase Storage
- Sistema de likes con actualización optimista
- Interfaz responsiva y adaptable

### Gestión de Contenido
- Creación de posts con texto e imágenes
- Upload de archivos a bucket de Supabase
- Validación de formularios
- Manejo de estados de carga

---

## Arquitectura e Integraciones

### Supabase
- **Base de datos:** Tablas para usuarios, posts y likes con relaciones SQL
- **Storage:** Bucket público para imágenes de posts
- **RLS:** Row Level Security configurado para seguridad de datos
- **Views:** Vistas SQL para optimizar queries complejas

### Redux Toolkit
- Slices separados para auth y posts
- Middleware para sincronización con Supabase
- Estado normalizado para rendimiento óptimo
- Thunks para operaciones asíncronas

### Storybook
- Componentes documentados (PostCard, CreatePostForm, Header, etc.)
- Stories con diferentes estados y variantes
- Integración con Tailwind CSS
- Configuración para desarrollo aislado

### Vercel
- Deploy automático desde repositorio
- Variables de entorno configuradas
- Subdominio personalizado apuntando a portfolio personal
- Optimización de assets y SSR

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Completar con credenciales de Supabase y NextAuth

# Ejecutar en desarrollo
npm run dev

# Ejecutar Storybook
npm run storybook

# Build para producción
npm run build
```

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## Estructura del Proyecto

```
├── components/          # Componentes React reutilizables
├── pages/              # Rutas y API routes de Next.js
│   ├── api/           # Endpoints backend
│   ├── feed.tsx       # Vista principal del feed
│   └── login.tsx      # Vista de autenticación
├── lib/
│   ├── features/      # Slices de Redux (auth, posts)
│   └── supabase/      # Cliente y queries de Supabase
├── interfaces/         # Tipos TypeScript
├── scripts/           # Scripts SQL para setup de DB
└── .storybook/        # Configuración de Storybook
```

---

## Base de Datos

El proyecto incluye scripts SQL en `/scripts` para configurar:
- Tablas de usuarios, posts y likes
- Vistas optimizadas para queries
- Políticas RLS para seguridad
- Configuración de Storage bucket

---

## Notas Técnicas

- **Optimización de imágenes:** Next.js Image con lazy loading
- **Caché:** Estrategias de revalidación en API routes
- **Seguridad:** Variables sensibles en servidor, validación en backend
- **Performance:** Code splitting automático, bundle optimizado