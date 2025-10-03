# 🔐 Guía de Autenticación y Registro de Recaídas

## 📋 Resumen de Cambios

He implementado un sistema completo de autenticación con Supabase y funcionalidad para registrar recaídas en tu app.

## ✅ Lo que se implementó

### 1. **Store de Autenticación** (`store/useAuthStore.ts`)

Un store de Zustand que maneja:
- ✅ Inicio de sesión
- ✅ Registro de usuarios
- ✅ Cierre de sesión
- ✅ Persistencia de sesión
- ✅ Registro de recaídas en Supabase
- ✅ Notificaciones con toast (usando Burnt)

### 2. **Componente de Autenticación** (`components/Auth.tsx`)

- ✅ Formulario de login/registro con estilo de tu app (NativeWind)
- ✅ Usa `TextInput` nativo de React Native
- ✅ Usa tu componente `CustomButton`
- ✅ Validación básica
- ✅ Loading states
- ✅ Manejo de teclado con `KeyboardAvoidingView`

### 3. **Protección de Rutas** (`app/index.tsx`)

- ✅ Verifica si hay sesión activa
- ✅ Muestra pantalla de login si no hay sesión
- ✅ Redirige al home si hay sesión
- ✅ Loading screen mientras verifica

### 4. **Inicialización** (`app/_layout.tsx`)

- ✅ Inicializa el auth store al cargar la app
- ✅ Escucha cambios en la autenticación

### 5. **Logout Funcional** (`app/(drawer)/logout/index.tsx`)

- ✅ Cierra sesión correctamente
- ✅ Redirige a la pantalla de login
- ✅ Confirmación antes de cerrar sesión

### 6. **Componente de Recaídas** (`components/RelapseButton.tsx`)

- ✅ Modal para registrar recaídas
- ✅ 3 niveles de dificultad (Leve, Moderada, Severa)
- ✅ Guarda en Supabase automáticamente
- ✅ UI consistente con tu diseño

## 🚀 Cómo usar

### Autenticación

El sistema de autenticación ya está completamente integrado:

1. Al abrir la app, si no hay sesión, se muestra el formulario de login
2. El usuario puede iniciar sesión o registrarse
3. Una vez autenticado, se redirige automáticamente al home
4. La sesión persiste (AsyncStorage)

### Registrar Recaídas

#### Opción 1: Usar el componente RelapseButton

```tsx
import RelapseButton from '@/components/RelapseButton';

function MiPantalla() {
  return (
    <View>
      <RelapseButton />
    </View>
  );
}
```

#### Opción 2: Llamar directamente al store

```tsx
import useAuthStore from '@/store/useAuthStore';

function MiComponente() {
  const registerRelapse = useAuthStore((state) => state.registerRelapse);

  const handleRelapse = async () => {
    try {
      // 1 = Leve, 2 = Moderada, 3 = Severa
      await registerRelapse(3);
    } catch (error) {
      // Error ya manejado con toast
    }
  };

  return (
    <CustomButton onPress={handleRelapse}>
      Registrar Recaída
    </CustomButton>
  );
}
```

### Acceder a datos del usuario

```tsx
import useAuthStore from '@/store/useAuthStore';

function MiComponente() {
  const { user, session } = useAuthStore();

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Text>ID: {user?.id}</Text>
    </View>
  );
}
```

### Verificar si hay sesión

```tsx
import useAuthStore from '@/store/useAuthStore';

function MiComponente() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Text>No hay sesión activa</Text>;
  }

  return <Text>Usuario autenticado</Text>;
}
```

## 🗄️ Estructura de la tabla en Supabase

Asegúrate de tener esta tabla en tu base de datos de Supabase:

```sql
CREATE TABLE relapses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  happened_at TIMESTAMPTZ NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas más rápidas
CREATE INDEX idx_relapses_user_id ON relapses(user_id);
CREATE INDEX idx_relapses_happened_at ON relapses(happened_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE relapses ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias recaídas
CREATE POLICY "Users can view own relapses"
  ON relapses FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propias recaídas
CREATE POLICY "Users can insert own relapses"
  ON relapses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 🎨 Variables de entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_KEY=tu_anon_key_de_supabase
```

## 📱 Ejemplo de uso completo

Aquí está cómo podrías integrar el botón de recaídas en tu pantalla de asistente:

```tsx
// app/(drawer)/(tabs)/asistente.tsx
import RelapseButton from '@/components/RelapseButton';
import { View, Text } from 'react-native';

export default function AsistenteScreen() {
  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-work-black mb-6">
        Asistente de Recuperación
      </Text>
      
      {/* Tus otros componentes */}
      
      <View className="mt-8">
        <RelapseButton />
      </View>
    </View>
  );
}
```

## 🔧 Funciones disponibles en el store

### `useAuthStore`

- `session`: Sesión actual de Supabase
- `user`: Usuario actual
- `loading`: Estado de carga
- `signIn(email, password)`: Iniciar sesión
- `signUp(email, password)`: Registrarse
- `signOut()`: Cerrar sesión
- `registerRelapse(difficulty)`: Registrar una recaída (1-3)
- `initialize()`: Inicializar el store (se llama automáticamente)

## 🎯 Próximos pasos sugeridos

1. **Consultar recaídas**: Crear funciones para obtener el historial de recaídas
2. **Estadísticas**: Mostrar gráficas de progreso
3. **Recordatorios**: Implementar notificaciones push
4. **Perfil de usuario**: Agregar campos adicionales (nombre, foto, etc.)

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor de Expo

### Error: "User not authenticated"
- Asegúrate de que el usuario haya iniciado sesión
- Verifica que `initialize()` se haya llamado en `_layout.tsx`

### No se guarda la sesión
- Verifica que AsyncStorage esté instalado
- Limpia el cache: `expo start --clear`

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ Variables de entorno configuradas
2. ✅ Tabla `relapses` creada en Supabase
3. ✅ RLS policies configuradas
4. ✅ Usuario autenticado antes de registrar recaídas

---

¡Listo! Tu app ahora tiene autenticación completa y puede registrar recaídas en Supabase. 🎉
