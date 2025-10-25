# 🚀 Prompt para Bolt.new — App TalentConnect

Crea una aplicación móvil en **React Native con Expo** llamada **"TalentConnect"**, una versión simplificada de **Workana**.

## 📱 Funcionalidades principales

### 1. Autenticación
- Login y registro de usuarios usando **Supabase Auth** (email y password).  
- Persistencia de sesión.  
- Pantalla de bienvenida (Onboarding simple).  
- Si el usuario está autenticado → redirige a Home.

### 2. CRUD de Perfiles
- Cada usuario puede **crear, leer, actualizar y eliminar** su propio perfil de talento.  
- Campos del perfil:
  - `nombre`
  - `descripcion`
  - `habilidades` (texto o array simple)
  - `experiencia`
  - `tarifa_por_hora`
  - `foto` (opcional, con upload simple)
- Los datos se guardan en la tabla `profiles` de Supabase.

### 3. Explorar Talentos
- Pantalla pública que lista todos los perfiles disponibles.  
- Búsqueda por nombre o habilidad.  
- Al tocar un perfil → abrir pantalla de detalle con información completa.

### 4. Reclutamiento básico
- Botón **"Contactar"** que simula el envío de un mensaje (solo interfaz).  
- No requiere backend adicional de mensajería.

---

## 🧱 Estructura del proyecto

```
/src
 ├── /screens
 │    ├── Home.tsx
 │    ├── Login.tsx
 │    ├── Register.tsx
 │    ├── ProfileList.tsx
 │    ├── ProfileDetail.tsx
 │    └── EditProfile.tsx
 ├── /components
 │    ├── ProfileCard.tsx
 │    ├── Input.tsx
 │    └── Button.tsx
 ├── /lib
 │    └── supabase.ts
 └── /store
      └── useAuthStore.ts
```

---

## ⚙️ Configuración de Supabase

- Crear un proyecto en [https://supabase.com](https://supabase.com)  
- Añadir las variables al archivo `.env`:

```
SUPABASE_URL=tu_url_aqui
SUPABASE_ANON_KEY=tu_key_aqui
```

### 🗃️ Tabla `profiles` (SQL de ejemplo)

```sql
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  nombre text,
  descripcion text,
  habilidades text,
  experiencia text,
  tarifa_por_hora numeric,
  foto text,
  created_at timestamp default now()
);
```

---

## 🎯 Objetivo

Crear una **app base funcional y limpia**, con:
- Autenticación
- CRUD conectado a Supabase
- Estructura modular
- Despliegue inmediato en **Expo Go**

Sin diseño avanzado ni características extra — solo lo esencial para ampliar después.

---

## ▶️ Instrucciones de ejecución

```bash
# Instalar dependencias
npm install

# Iniciar la app en Expo Go
npx expo start
```

---

✨ **Resultado esperado:**  
Una app mínima tipo Workana donde los usuarios pueden crear su perfil, ver los de otros talentos y autenticarse con Supabase.
