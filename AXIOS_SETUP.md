# Axios Setup for NestJS Backend Integration

This setup provides a type-safe Axios configuration to connect your Nuxt 3 frontend with the NestJS backend API.

## 📁 Project Structure

```
vizdataproject/
├── types/
│   └── User.ts                 # TypeScript interfaces for User entity
├── services/
│   ├── http.ts                 # Axios HTTP client configuration
│   └── userService.ts          # User API service
├── plugins/
│   └── http.client.ts          # HTTP client initialization plugin
├── pages/
│   └── test_user.vue           # Test page to display users
├── .env.example                # Environment variables example
└── nuxt.config.ts              # Nuxt configuration with runtime config
```

## 🚀 Setup Instructions

### 1. Install Dependencies

Axios is already installed in your `package.json`:

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of your frontend project:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
NUXT_PUBLIC_API_URL=http://localhost:3000
```

**Note**: Make sure your NestJS backend is running on port 3000 (or update the URL accordingly).

### 3. Start the Backend

Navigate to your backend directory and start the NestJS server:

```bash
cd vizdataproject_be
npm run start:dev
```

The backend should be running at `http://localhost:3000`

### 4. Start the Frontend

```bash
cd vizdataproject
npm run dev
```

The frontend will run at `https://vizdataprojectbe-production.up.railway.app` (or the next available port)

### 5. Test the Setup

Visit the test page in your browser:

```
https://vizdataprojectbe-production.up.railway.app/test_user
```

This page will:
- Fetch all users from the `/users` endpoint
- Display them in a table format
- Show detailed user information when you click "View"
- Display the raw JSON response

## 📝 File Descriptions

### `types/User.ts`

TypeScript interfaces matching your NestJS backend schema:

```typescript
export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

### `services/http.ts`

Axios HTTP client with:
- Base URL configuration from environment variables
- Request/Response interceptors
- Authentication token handling
- Error handling for common HTTP status codes
- Logging for debugging

### `services/userService.ts`

User service with methods for:
- `getAllUsers()` - GET /users
- `getUserById(id)` - GET /users/:id
- `createUser(userData)` - POST /users
- `updateUser(id, userData)` - PATCH /users/:id
- `deleteUser(id)` - DELETE /users/:id
- `getUserCount()` - GET /users/count

### `plugins/http.client.ts`

Nuxt plugin that initializes the HTTP client with the API URL from runtime configuration.

## 🔧 Usage Examples

### Fetching Users in a Component

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService } from '~/services/userService';
import type { UserResponse } from '~/types/User';

const users = ref<UserResponse[]>([]);
const loading = ref(false);

const fetchUsers = async () => {
  loading.value = true;
  try {
    users.value = await userService.getAllUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
```

### Creating a New User

```vue
<script setup lang="ts">
import { userService } from '~/services/userService';
import type { CreateUserDto } from '~/types/User';

const createUser = async () => {
  const newUser: CreateUserDto = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'securePassword123',
    role: 'user'
  };

  try {
    const createdUser = await userService.createUser(newUser);
    console.log('User created:', createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
</script>
```

### Updating a User

```vue
<script setup lang="ts">
import { userService } from '~/services/userService';
import type { UpdateUserDto } from '~/types/User';

const updateUser = async (userId: string) => {
  const updates: UpdateUserDto = {
    username: 'updatedusername',
    isActive: true
  };

  try {
    const updatedUser = await userService.updateUser(userId, updates);
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
</script>
```

## 🔐 Authentication

The HTTP client is configured to automatically include JWT tokens in requests. To use authentication:

1. Store the token in localStorage after login:

```typescript
localStorage.setItem('auth_token', 'your-jwt-token');
```

2. The HTTP client will automatically add it to the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## 🌐 CORS Configuration

Make sure your NestJS backend has CORS enabled for your frontend URL. Check `src/main.ts` in your backend:

```typescript
app.enableCors({
  origin: ['https://vizdataprojectbe-production.up.railway.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});
```

## 🐛 Debugging

The HTTP client includes console logging:

```
[HTTP Request] GET /users
[HTTP Response] 200 /users
```

To see these logs, open your browser's Developer Console (F12).

## 📦 Backend API Endpoints

Based on the NestJS backend, the following endpoints are available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| GET | /users/count | Get total user count |
| GET | /users/:id | Get user by ID |
| POST | /users | Create a new user |
| PATCH | /users/:id | Update user by ID |
| DELETE | /users/:id | Delete user by ID |

## 🔄 Error Handling

The HTTP client handles common errors:

- **401 Unauthorized**: Redirects to login (can be customized)
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Backend error

All errors are logged to the console and can be caught in your components.

## 📚 Next Steps

1. Add more services for other entities (products, orders, etc.)
2. Implement authentication store with Pinia
3. Add loading states and error handling to your components
4. Create reusable composables for common API operations
5. Add request/response caching if needed

## 🛠️ Troubleshooting

### Backend connection fails

1. Check if the backend is running: `http://localhost:3000`
2. Verify CORS is enabled in the backend
3. Check the `.env` file has the correct API URL
4. Open browser console to see error messages

### Type errors

Make sure all TypeScript interfaces in `types/User.ts` match your backend DTOs.

## 📄 License

This setup is part of your VizData project.
