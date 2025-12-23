import httpClient from './http';
import type { User, CreateUserDto, UpdateUserDto, UserResponse } from '~/types/User';

/**
 * User Service
 * Handles all user-related API calls to the NestJS backend
 */
class UserService {
  private readonly endpoint = '/users';

  /**
   * Get all users
   * GET /users
   */
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const response = await httpClient.get<UserResponse[]>(this.endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await httpClient.get<UserResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * POST /users
   */
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    try {
      const response = await httpClient.post<UserResponse>(this.endpoint, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user by ID
   * PATCH /users/:id
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
    try {
      const response = await httpClient.patch<UserResponse>(
        `${this.endpoint}/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user by ID
   * DELETE /users/:id
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await httpClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get total user count
   * GET /users/count
   */
  async getUserCount(): Promise<number> {
    try {
      const response = await httpClient.get<{ count: number }>(`${this.endpoint}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching user count:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
export default userService;
