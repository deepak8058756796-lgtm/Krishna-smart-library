/**
 * Krishna Smart Library TypeScript Types Definitions
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  status: 'Active' | 'Inactive';
  seatId?: string; // currently assigned seat, if any
  joinedDate: string;
  address?: string;
  fatherName?: string;
  class?: string;
}

export interface Seat {
  id: string; // e.g. "S-12"
  number: number;
  status: 'Occupied' | 'Vacant' | 'Reserved';
  studentId?: string;
  studentName?: string;
  timeIn?: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  month: string;
}

export interface Announcement {
  id: string;
  time: string; // e.g. "10:00 AM" or "Yesterday"
  title: string;
  content: string;
  important: boolean;
}

export interface InventoryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string;
}

export interface UserSession {
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
  phone?: string;
  shift?: string;
  fatherName?: string;
  class?: string;
  address?: string;
}

export interface StudyMaterial {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'txt' | 'other';
  uploadedBy: string;
  role: 'admin' | 'student';
  date: string;
  dataUrl: string; // Base64 content for actual real file downloads!
}


