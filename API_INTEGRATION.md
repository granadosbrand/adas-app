# ADAS App - Integración con API

## Configuración Completada

### 1. Variables de Entorno
- **Archivo**: `.env` y `.env.example`
- **Variable**: `API_BASE_URL=http://localhost:8080`
- **Configuración**: `config/env.ts` para gestionar variables de entorno
- **App.json**: Añadida configuración en `extra.API_BASE_URL`

### 2. Tipos TypeScript
- **Archivo**: `types/api.types.ts`
- **Tipos definidos**:
  - `User`, `CreateUserRequest`
  - `UserSettings`, `UpdateSettingsRequest`
  - `ModeType`, `ModeResponse`
  - `Relapse`, `CreateRelapseRequest`, `ListRelapsesParams`
  - `Checkpoint`, `CreateCheckpointRequest`, `UpdateCheckpointStatusRequest`, `ListCheckpointsParams`
  - `ApiError`, `ApiResponse`

### 3. Servicios API
- **Cliente HTTP**: `services/api/client.ts` - Cliente base con métodos GET, POST, PUT, PATCH, DELETE
- **Servicios**:
  - `services/api/users.service.ts` - Gestión de usuarios y configuraciones
  - `services/api/relapses.service.ts` - Gestión de recaídas
  - `services/api/checkpoints.service.ts` - Gestión de checkpoints
  - `services/api/index.ts` - Exportación centralizada

### 4. Store Global
- **Archivo**: `store/useUserStore.ts`
- **Funcionalidades**:
  - Almacena usuario autenticado
  - Persiste en AsyncStorage
  - Gestiona estado de autenticación
  - Métodos: `setUser`, `setSettings`, `setMode`, `logout`, `hydrate`

### 5. Pantallas Actualizadas

#### Auth Screen (`app/auth.tsx`)
- Toggle entre Login y Registro
- **Registro**: Crea usuario con username y timezone automática
- **Login**: Busca usuario por ID
- Validación y feedback con toasts
- Redirección automática a home tras éxito

#### Set Button (`components/set-home/SetButton.tsx`)
- Ahora crea recaídas via API (`relapsesService.createRelapse`)
- Validación de usuario autenticado
- Manejo de errores con feedback
- Mantiene animaciones y haptic feedback

#### Avances Screen (`app/(drawer)/(tabs)/avances.tsx`)
- Carga datos desde API (relapses y checkpoints)
- Muestra estadísticas reales:
  - Total de recaídas
  - Checkpoints logrados
  - Gráfico semanal basado en datos reales
- Pull-to-refresh para actualizar datos
- Vista detallada de cada recaída con información de dificultad y checkpoint vinculado

#### Profile Screen (`app/(drawer)/user/index.tsx`)
- Muestra información del usuario autenticado
- ID, username, timezone, fecha de creación
- Avatar con iniciales

#### Logout Screen (`app/(drawer)/logout/index.tsx`)
- Confirmación antes de cerrar sesión
- Limpia store y redirige a auth

#### Index Screen (`app/index.tsx`)
- Navegación condicional basada en autenticación
- Redirige a `/auth` si no hay usuario
- Redirige a home si está autenticado

## Endpoints Integrados

### Users & Settings
- ✅ `POST /api/v1/users` - Crear usuario
- ✅ `GET /api/v1/users/{userId}` - Obtener usuario
- ✅ `PUT /api/v1/users/{userId}/settings` - Actualizar settings
- ✅ `GET /api/v1/users/{userId}/settings` - Obtener settings
- ✅ `GET /api/v1/users/{userId}/mode` - Obtener modo (evaluation/survivor)
- ✅ `POST /api/v1/users/{userId}/activate-survivor` - Activar survivor

### Relapses
- ✅ `POST /api/v1/users/{userId}/relapses` - Crear recaída
- ✅ `GET /api/v1/users/{userId}/relapses` - Listar recaídas

### Checkpoints
- ✅ `GET /api/v1/users/{userId}/checkpoints/pending` - Obtener checkpoint pendiente
- ✅ `POST /api/v1/users/{userId}/checkpoints` - Crear checkpoint
- ✅ `PATCH /api/v1/checkpoints/{checkpointId}/status` - Actualizar estado
- ✅ `GET /api/v1/users/{userId}/checkpoints` - Listar checkpoints

## Flujo de Usuario

1. **Primera vez**: Usuario ve pantalla de auth
2. **Registro**: Ingresa username → crea cuenta → obtiene ID
3. **Login**: Ingresa ID → valida contra API → accede a la app
4. **Uso**: Botón SET registra recaídas en API
5. **Avances**: Muestra datos reales desde API
6. **Perfil**: Ver información de cuenta
7. **Logout**: Cierra sesión y vuelve a auth

## Próximos Pasos (Opcionales)

- Implementar pantalla de configuración para `UserSettings`
- Agregar vista de checkpoints pendientes en home
- Mostrar modo actual (evaluation/survivor) en alguna parte de la UI
- Implementar funcionalidad para crear checkpoints manuales
- Agregar filtros de fecha en pantalla de avances
- Implementar manejo offline con sincronización
