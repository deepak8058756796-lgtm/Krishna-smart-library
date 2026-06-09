import { Student, Seat, Transaction, Announcement, InventoryBook, StudyMaterial } from './types';

export const initialStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'Rohit Kumar',
    email: 'rohit.kumar@academy.edu',
    phone: '+91 98765 43210',
    rollNo: '2024-ME-045',
    status: 'Active',
    joinedDate: '2024-01-15',
    fatherName: 'Shri Surendra Kumar',
    class: 'UPSC Aspirant',
    address: 'Plot 45, Sector 4, Mansarovar, Jaipur, Rajasthan'
  },
  {
    id: 'STU-002',
    name: 'Ananya Mishra',
    email: 'ananya.mishra@academy.edu',
    phone: '+91 87654 32109',
    rollNo: '2024-CS-108',
    status: 'Active',
    joinedDate: '2024-02-10',
    fatherName: 'Shri Rakesh Mishra',
    class: 'IIT-JEE Prep',
    address: 'H.No 120, Gopalpura Bypass, Jaipur, Rajasthan'
  },
  {
    id: 'STU-003',
    name: 'Vikram Singh',
    email: 'vikram.singh@academy.edu',
    phone: '+91 76543 21098',
    rollNo: '2024-EE-220',
    status: 'Active',
    joinedDate: '2024-01-20',
    fatherName: 'Shri Baldev Singh',
    class: 'NEET Foundation',
    address: 'Street 2, Pratap Nagar, Sanganer, Jaipur, Rajasthan'
  },
  {
    id: 'STU-004',
    name: 'Priya Sharma',
    email: 'priya.sharma@academy.edu',
    phone: '+91 91234 56789',
    rollNo: '2024-CS-041',
    status: 'Active',
    joinedDate: '2024-03-05',
    fatherName: 'Shri Pawan Sharma',
    class: 'CA Finalist',
    address: 'C-9, Vaishali Nagar, Jaipur, Rajasthan'
  },
  {
    id: 'STU-005',
    name: 'Amit Patel',
    email: 'amit.patel@academy.edu',
    phone: '+91 92345 67890',
    rollNo: '2024-EC-115',
    status: 'Active',
    joinedDate: '2024-01-10',
    fatherName: 'Shri Dinesh Patel',
    class: 'SSC CGL',
    address: 'D-44, Lal Kothi, Jaipur, Rajasthan'
  },
  {
    id: 'STU-006',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@academy.edu',
    phone: '+91 93456 78901',
    rollNo: '2024-CE-032',
    status: 'Active',
    joinedDate: '2024-02-18',
    fatherName: 'Shri M. Venkat Reddy',
    class: 'Civil Services Prep',
    address: 'Flat 302, Malviya Nagar, Jaipur, Rajasthan'
  },
  {
    id: 'STU-007',
    name: 'Deepak Yadav',
    email: 'deepak.yadav@academy.edu',
    phone: '+91 94567 89012',
    rollNo: '2024-IT-089',
    status: 'Active',
    joinedDate: '2024-03-12',
    fatherName: 'Shri Mahesh Yadav',
    class: 'GATE Exam',
    address: 'Barkat Nagar, Tonk Road, Jaipur, Rajasthan'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ANN-001',
    time: '10:00 AM',
    title: 'Library Maintenance',
    content: 'Library closed this Sunday for maintenance.',
    important: true,
  },
  {
    id: 'ANN-002',
    time: 'Yesterday',
    title: 'Research Journals Added',
    content: 'New academic journals added to section B.',
    important: false,
  },
  {
    id: 'ANN-003',
    time: '2 days ago',
    title: 'Extended Study Hours',
    content: 'Library study hours extended until midnight for the upcoming mid-semester examinations.',
    important: false,
  }
];

export const initialTransactions: Transaction[] = [];

export const initialBooks: InventoryBook[] = [
  {
    id: 'BK-001',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    totalCopies: 8,
    availableCopies: 5,
    rackLocation: 'Rack A-3'
  },
  {
    id: 'BK-002',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Software Engineering',
    totalCopies: 5,
    availableCopies: 2,
    rackLocation: 'Rack A-4'
  },
  {
    id: 'BK-003',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1285741550',
    category: 'Mathematics',
    totalCopies: 12,
    availableCopies: 10,
    rackLocation: 'Rack B-1'
  },
  {
    id: 'BK-004',
    title: 'The Art of Computer Programming',
    author: 'Donald E. Knuth',
    isbn: '978-0201485417',
    category: 'Computer Science',
    totalCopies: 3,
    availableCopies: 3,
    rackLocation: 'Rack A-1'
  },
  {
    id: 'BK-005',
    title: 'Principles of Electrodynamics',
    author: 'Melvin Schwartz',
    isbn: '978-0486654934',
    category: 'Physics',
    totalCopies: 6,
    availableCopies: 4,
    rackLocation: 'Rack C-2'
  }
];

export function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  
  // Generate exactly 22 vacant seats
  for (let i = 1; i <= 22; i++) {
    const paddedId = i < 10 ? `S-0${i}` : `S-${i}`;
    seats.push({
      id: paddedId,
      number: i,
      status: 'Vacant'
    });
  }
  return seats;
}

export const initialStudyMaterials: StudyMaterial[] = [
  {
    id: 'MAT-101',
    name: 'Smart_Library_Code_of_Conduct_2026.txt',
    size: '2.4 KB',
    type: 'txt',
    uploadedBy: 'Akshay Kumar',
    role: 'admin',
    date: '2026-05-15',
    dataUrl: 'data:text/plain;base64,S3Jpc2huYSBTbWFydCBMaWJyYXJ5IENvZGUgb2YgQ29uZHVjdDoKMS4gTWFpbnRhaW4gcGluLWRyb3Agc2lsZW5jZSBpbiB0aGUgc3R1ZHkgZGVza3MuCjIuIERvIG5vdCBvY2N1cHkgc2VhdHMgd2l0aG91dCBjaGVja2luZy1pbiBvbiB0aGUgY29uc29sZS4KMy4gUERGIGFuZCB0ZXh0IGZpbGVzIHVwbG9hZGVkIGhlcmUgYXJlIHNoYXJlZCB3aXRoIGFsbCBzdHVkZW50cy4KNC4gS2VlcCB0aGUgY2hhcmdpbmcgcG9pbnRzIGNsZWFuLg=='
  },
  {
    id: 'MAT-102',
    name: 'UPSC_Syllabus_Guide_And_Prep_Blueprint.txt',
    size: '1.8 KB',
    type: 'txt',
    uploadedBy: 'Deepak Kumar',
    role: 'student',
    date: '2026-06-01',
    dataUrl: 'data:text/plain;base64,VVBTQyBDU0UgU3lsbGFidXMgJiBQcmVwYXJhdGlvbiBCbHVlcHJpbnQgMjAyNjoyMDI3OgoxLiBHZW5lcmFsIFN0dWRpZXMgSSAoSGlzdG9yeSwgR2VvZ3JhcGh5LCBQb2xpdHkpCjIuIEdlbmVyYWwgU3R1ZGllcyBJSSAoR292ZXJuYW5jZSwgQ29uc3RpdHV0aW9uKQozLiBHZW5lcmFsIFN0dWRpZXMgSUlJIChTY2llbmNlICYgVGVjaG5vbG9neSwgRWNvbm9meSkKNC4gR2VuZXJhbCBTdHVkaWVzIElWIChFdGhpY3MgJiBBcHRpdHVkZSk='
  }
];

