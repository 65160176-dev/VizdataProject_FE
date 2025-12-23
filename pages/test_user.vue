<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">User Management Test Page</h1>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading users...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error!</h4>
          <p>{{ error }}</p>
          <button @click="fetchUsers" class="btn btn-danger">
            Retry
          </button>
        </div>

        <!-- Success State -->
        <div v-else>
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">
                  Users List ({{ users.length }} users)
                </h5>
                <button @click="fetchUsers" class="btn btn-primary btn-sm">
                  <i class="fa fa-refresh"></i> Refresh
                </button>
              </div>
              
              <!-- Users Table -->
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="users.length === 0">
                      <td colspan="7" class="text-center py-4">
                        <p class="text-muted mb-0">No users found</p>
                      </td>
                    </tr>
                    <tr v-for="(user, index) in users" :key="user._id">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <strong>{{ user.username }}</strong>
                      </td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge bg-info">{{ user.role }}</span>
                      </td>
                      <td>
                        <span 
                          :class="user.isActive ? 'badge bg-success' : 'badge bg-secondary'"
                        >
                          {{ user.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>{{ formatDate(user.createdAt) }}</td>
                      <td>
                        <button 
                          @click="viewUser(user)" 
                          class="btn btn-sm btn-outline-primary"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- User Details Modal -->
          <div v-if="selectedUser" class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">User Details</h5>
              <button 
                @click="selectedUser = null" 
                class="btn btn-sm btn-light"
              >
                Close
              </button>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">ID</label>
                  <p class="fw-bold">{{ selectedUser._id }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Username</label>
                  <p class="fw-bold">{{ selectedUser.username }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Email</label>
                  <p class="fw-bold">{{ selectedUser.email }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Role</label>
                  <p class="fw-bold">{{ selectedUser.role }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Status</label>
                  <p class="fw-bold">
                    {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Created At</label>
                  <p class="fw-bold">{{ formatDate(selectedUser.createdAt) }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label text-muted">Updated At</label>
                  <p class="fw-bold">{{ formatDate(selectedUser.updatedAt) }}</p>
                </div>
              </div>
              
              <!-- Raw JSON Response -->
              <div class="mt-4">
                <label class="form-label text-muted">Raw JSON Response</label>
                <pre class="bg-light p-3 rounded"><code>{{ JSON.stringify(selectedUser, null, 2) }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService } from '~/services/userService';
import type { UserResponse } from '~/types/User';

// Reactive state
const users = ref<UserResponse[]>([]);
const selectedUser = ref<UserResponse | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

/**
 * Fetch all users from the API
 */
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    users.value = await userService.getAllUsers();
    console.log('Users fetched successfully:', users.value);
  } catch (err: any) {
    console.error('Failed to fetch users:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
};

/**
 * View user details
 */
const viewUser = (user: UserResponse) => {
  selectedUser.value = user;
  // Scroll to the details section
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
};

/**
 * Format date to readable string
 */
const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch users on component mount
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card {
  border-radius: 8px;
  border: none;
}

.card-header {
  border-radius: 8px 8px 0 0 !important;
}

pre {
  max-height: 400px;
  overflow-y: auto;
  font-size: 0.875rem;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
