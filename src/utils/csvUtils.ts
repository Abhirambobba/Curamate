
/**
 * CSV utility functions for handling local storage of user data
 * Since we're using browser storage, we'll simulate "files" using localStorage
 */

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'patient';
  specialization?: string; // For doctors
  contactNumber?: string;
  address?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  qualifications?: string[];
  experience?: number;
  availability?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
}

export interface EHR {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  followUp?: string;
}

// CSV Keys in localStorage
const USERS_KEY = 'healthcare_users';
const APPOINTMENTS_KEY = 'healthcare_appointments';
const EHR_KEY = 'healthcare_ehr';

// Convert array to CSV string
const arrayToCSV = (arr: any[]): string => {
  if (arr.length === 0) return '';
  
  const headers = Object.keys(arr[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  arr.forEach(item => {
    const values = headers.map(header => {
      const value = item[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

// Parse CSV string to array
const CSVToArray = (csv: string): any[] => {
  if (!csv) return [];
  
  const rows = csv.split('\n');
  if (rows.length <= 1) return [];
  
  const headers = rows[0].split(',');
  const result = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const values = rows[i].split(',');
    const item: any = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Try to parse JSON objects
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      
      item[header] = value;
    });
    
    result.push(item);
  }
  
  return result;
};

// Save data to localStorage
export const saveToCSV = (key: string, data: any[]): void => {
  const csv = arrayToCSV(data);
  localStorage.setItem(key, csv);
};

// Load data from localStorage
export const loadFromCSV = (key: string): any[] => {
  const csv = localStorage.getItem(key);
  if (!csv) return [];
  return CSVToArray(csv);
};

// User-specific functions
export const saveUsers = (users: User[]): void => {
  saveToCSV(USERS_KEY, users);
};

export const loadUsers = (): User[] => {
  return loadFromCSV(USERS_KEY);
};

export const saveAppointments = (appointments: Appointment[]): void => {
  saveToCSV(APPOINTMENTS_KEY, appointments);
};

export const loadAppointments = (): Appointment[] => {
  return loadFromCSV(APPOINTMENTS_KEY);
};

export const saveEHRs = (ehrs: EHR[]): void => {
  saveToCSV(EHR_KEY, ehrs);
};

export const loadEHRs = (): EHR[] => {
  return loadFromCSV(EHR_KEY);
};

// Add getPatients function to csvUtils
export const getPatients = (): Patient[] => {
  const users = loadUsers();
  return users.filter(u => u.role === 'patient') as Patient[];
};

// Add getDoctors function to csvUtils if not already present
export const getDoctors = (): Doctor[] => {
  const users = loadUsers();
  return users.filter(u => u.role === 'doctor') as Doctor[];
};
