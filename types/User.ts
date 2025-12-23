export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Optional since it won't be returned in responses
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
