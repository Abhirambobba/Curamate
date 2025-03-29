
import { loadUsers, saveUsers, User, Doctor, Patient } from './csvUtils';
import { v4 as uuidv4 } from 'uuid';

// Create a new user
export const registerUser = (userData: Omit<User, 'id'>): User => {
  const users = loadUsers();
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user with ID
  const newUser: User = {
    ...userData,
    id: uuidv4(),
  };
  
  // Save to users
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
};

// Login function
export const loginUser = (email: string, password: string): User | null => {
  const users = loadUsers();
  
  // Find user with matching email and password
  const user = users.find(u => u.email === email && u.password === password);
  
  return user || null;
};

// Get user by ID
export const getUserById = (id: string): User | null => {
  const users = loadUsers();
  return users.find(u => u.id === id) || null;
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  const users = loadUsers();
  return users.find(u => u.email === email) || null;
};

// Get doctors
export const getDoctors = (): Doctor[] => {
  const users = loadUsers();
  return users.filter(u => u.role === 'doctor') as Doctor[];
};

// Get patients
export const getPatients = (): Patient[] => {
  const users = loadUsers();
  return users.filter(u => u.role === 'patient') as Patient[];
};

// Get patients by doctor
export const getPatientsByDoctorId = (doctorId: string): Patient[] => {
  // In a real app, we'd have a proper relation. For this demo, we'll assume all patients
  const patients = getPatients();
  return patients;
};

// Update user
export const updateUser = (updatedUser: User): User => {
  const users = loadUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  
  if (index === -1) {
    throw new Error('User not found');
  }
  
  users[index] = updatedUser;
  saveUsers(users);
  
  return updatedUser;
};

// Store auth user in localStorage
export const setAuthUser = (user: User): void => {
  localStorage.setItem('authUser', JSON.stringify(user));
};

// Get auth user from localStorage
export const getAuthUser = (): User | null => {
  const userJson = localStorage.getItem('authUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Clear auth user
export const clearAuthUser = (): void => {
  localStorage.removeItem('authUser');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthUser() !== null;
};
