import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Armchair, 
  IndianRupee, 
  User, 
  Bell, 
  Menu,
  BookOpen,
  LogOut,
  FolderOpen,
  MoreVertical
} from 'lucide-react';

// Subcomponents
import DashboardView from './components/DashboardView';
import SeatsView from './components/SeatsView';
import FeesView from './components/FeesView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';
import ResourcesView from './components/ResourcesView';

import AddStudentModal from './components/AddStudentModal';
import AnnounceModal from './components/AnnounceModal';
import InventoryModal from './components/InventoryModal';
import ProfileModal from './components/ProfileModal';

// Beautiful background asset
// @ts-ignore
import libraryBg from './assets/images/library_classic_bg_1780405078834.png';

// Static Data and Generator Types
import { 
  initialStudents, 
  initialTransactions, 
  initialAnnouncements, 
  initialBooks, 
  generateSeats,
  initialStudyMaterials
} from './data';
import { Student, Seat, Transaction, Announcement, InventoryBook, UserSession, StudyMaterial } from './types';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'seats' | 'fees' | 'profile' | 'resources'>('home');

  // User Session State
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('kl_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Role restriction redirection
  useEffect(() => {
    if (session?.role === 'student' && (currentTab === 'fees' || currentTab === 'profile')) {
      setCurrentTab('seats');
    }
  }, [session, currentTab]);

  // Modals States
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // App Master Datasets States
  const [students, setStudents] = useState<Student[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [books, setBooks] = useState<InventoryBook[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  // Persistent storage hydration
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('ul_students');
      const storedSeats = localStorage.getItem('ul_seats');
      const storedTransactions = localStorage.getItem('ul_transactions');
      const storedAnnouncements = localStorage.getItem('ul_announcements');
      const storedBooks = localStorage.getItem('ul_books');

      // Hydrate seats
      let activeSeats: Seat[] = [];
      if (storedSeats) {
        const parsed = JSON.parse(storedSeats);
        if (parsed.length === 22) {
          activeSeats = parsed;
        }
      }
      
      if (activeSeats.length !== 22) {
        activeSeats = generateSeats(); // Returns 22 vacant seats
        localStorage.setItem('ul_seats', JSON.stringify(activeSeats));
      }
      setSeats(activeSeats);

      // Hydrate students
      let activeStudents: Student[] = [];
      if (storedStudents) {
        activeStudents = JSON.parse(storedStudents);
      } else {
        activeStudents = initialStudents;
        localStorage.setItem('ul_students', JSON.stringify(initialStudents));
      }

      // If we loaded newly generated vacant seats, make sure no student has a preselected seatId
      if (activeSeats.every(s => s.status === 'Vacant')) {
        activeStudents = activeStudents.map(s => ({ ...s, seatId: undefined }));
        localStorage.setItem('ul_students', JSON.stringify(activeStudents));
      }
      setStudents(activeStudents);

      // Clear old browser cached transactions so revenue starting state is 0 as requested by the user
      const revenueResetKey = 'kl_revenue_reset_v4';
      const resetDone = localStorage.getItem(revenueResetKey);
      let activeTransactions: Transaction[] = [];

      if (!resetDone) {
        activeTransactions = [];
        localStorage.setItem('ul_transactions', JSON.stringify([]));
        localStorage.setItem(revenueResetKey, 'yes');
      } else if (storedTransactions) {
        activeTransactions = JSON.parse(storedTransactions);
      } else {
        activeTransactions = [];
        localStorage.setItem('ul_transactions', JSON.stringify([]));
      }
      setTransactions(activeTransactions);

      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
      else {
        setAnnouncements(initialAnnouncements);
        localStorage.setItem('ul_announcements', JSON.stringify(initialAnnouncements));
      }

      if (storedBooks) setBooks(JSON.parse(storedBooks));
      else {
        setBooks(initialBooks);
        localStorage.setItem('ul_books', JSON.stringify(initialBooks));
      }

      const storedMaterials = localStorage.getItem('ul_study_materials');
      if (storedMaterials) setMaterials(JSON.parse(storedMaterials));
      else {
        setMaterials(initialStudyMaterials);
        localStorage.setItem('ul_study_materials', JSON.stringify(initialStudyMaterials));
      }
    } catch (e) {
      console.warn('LocalStorage hydration failed, falling back to static constants.', e);
      setStudents(initialStudents);
      setSeats(generateSeats());
      setTransactions(initialTransactions);
      setAnnouncements(initialAnnouncements);
      setBooks(initialBooks);
      setMaterials(initialStudyMaterials);
    }
  }, []);

  // Real-time synchronization engine (cross-tab and iframe communication)
  const lastStudentsStr = useRef<string | null>(null);
  const lastSeatsStr = useRef<string | null>(null);
  const lastTransactionsStr = useRef<string | null>(null);
  const lastAnnouncementsStr = useRef<string | null>(null);
  const lastBooksStr = useRef<string | null>(null);
  const lastMaterialsStr = useRef<string | null>(null);

  useEffect(() => {
    const syncFromLocalStorage = () => {
      try {
        const sStudents = localStorage.getItem('ul_students');
        const sSeats = localStorage.getItem('ul_seats');
        const sTransactions = localStorage.getItem('ul_transactions');
        const sAnnouncements = localStorage.getItem('ul_announcements');
        const sBooks = localStorage.getItem('ul_books');
        const sMaterials = localStorage.getItem('ul_study_materials');

        if (sStudents && sStudents !== lastStudentsStr.current) {
          lastStudentsStr.current = sStudents;
          setStudents(JSON.parse(sStudents));
        }
        if (sSeats && sSeats !== lastSeatsStr.current) {
          lastSeatsStr.current = sSeats;
          setSeats(JSON.parse(sSeats));
        }
        if (sTransactions && sTransactions !== lastTransactionsStr.current) {
          lastTransactionsStr.current = sTransactions;
          setTransactions(JSON.parse(sTransactions));
        }
        if (sAnnouncements && sAnnouncements !== lastAnnouncementsStr.current) {
          lastAnnouncementsStr.current = sAnnouncements;
          setAnnouncements(JSON.parse(sAnnouncements));
        }
        if (sBooks && sBooks !== lastBooksStr.current) {
          lastBooksStr.current = sBooks;
          setBooks(JSON.parse(sBooks));
        }
        if (sMaterials && sMaterials !== lastMaterialsStr.current) {
          lastMaterialsStr.current = sMaterials;
          setMaterials(JSON.parse(sMaterials));
        }
      } catch (err) {
        console.warn('Real-time synchronization interval failed', err);
      }
    };

    // Listen to standard storage events (cross-tab updates)
    window.addEventListener('storage', syncFromLocalStorage);

    // Short polling interval (iframe / local container sandbox updates)
    const intervalId = setInterval(syncFromLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', syncFromLocalStorage);
      clearInterval(intervalId);
    };
  }, []);

  // Save changes wrapper helpers
  const saveStudents = (updated: Student[]) => {
    setStudents(updated);
    localStorage.setItem('ul_students', JSON.stringify(updated));
  };

  const saveSeats = (updated: Seat[]) => {
    setSeats(updated);
    localStorage.setItem('ul_seats', JSON.stringify(updated));
  };

  const saveTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('ul_transactions', JSON.stringify(updated));
  };

  const saveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem('ul_announcements', JSON.stringify(updated));
  };

  const saveBooks = (updated: InventoryBook[]) => {
    setBooks(updated);
    localStorage.setItem('ul_books', JSON.stringify(updated));
  };

  const saveMaterials = (updated: StudyMaterial[]) => {
    setMaterials(updated);
    localStorage.setItem('ul_study_materials', JSON.stringify(updated));
  };

  // REGISTER NEW STUDENT
  const handleAddStudent = (newStuData: Omit<Student, 'id' | 'joinedDate'>) => {
    const nextIdNumber = students.length + 8; // Offset to separate simulation ids
    const newStudent: Student = {
      ...newStuData,
      id: `STU-0${nextIdNumber}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newStudent, ...students];
    saveStudents(updated);
  };

  // DETACH/REMOVE STUDENT STUDENT DIRECTORY
  const handleRemoveStudent = (studentId: string) => {
    // Remove from student roster list
    const updatedStus = students.filter(s => s.id !== studentId);
    saveStudents(updatedStus);

    // Also auto-release their assigned seat, if they currently occupied one!
    const updatedSeats = seats.map(seat => {
      if (seat.studentId === studentId) {
        return { id: seat.id, number: seat.number, status: 'Vacant' as const };
      }
      return seat;
    });
    saveSeats(updatedSeats);
  };

  // UPDATE REGISTERED STUDENT DETAILS
  const handleUpdateStudent = (studentId: string, updatedFields: Partial<Student>) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          ...updatedFields
        };
      }
      return student;
    });
    saveStudents(updatedStudents);

    // If student name is updated, also update any occupied terminal displays
    if (updatedFields.name) {
      const updatedSeats = seats.map(seat => {
        if (seat.studentId === studentId) {
          return {
            ...seat,
            studentName: updatedFields.name
          };
        }
        return seat;
      });
      saveSeats(updatedSeats);
    }
  };

  // UPDATE CURRENT LOGGED IN USER PROFILE
  const handleUpdateCurrentUser = (updatedFields: Partial<UserSession>) => {
    if (!session) return;
    const updated = { ...session, ...updatedFields };
    setSession(updated);
    localStorage.setItem('kl_user_session', JSON.stringify(updated));

    // Also sync back to students roster if email or name matches, to maintain database integrity
    const matchingStu = students.find(s => s.email.toLowerCase() === session.email.toLowerCase());
    if (matchingStu) {
      handleUpdateStudent(matchingStu.id, {
        name: updatedFields.name !== undefined ? updatedFields.name : matchingStu.name,
        email: updatedFields.email !== undefined ? updatedFields.email : matchingStu.email,
        phone: updatedFields.phone !== undefined ? updatedFields.phone : matchingStu.phone,
        fatherName: updatedFields.fatherName !== undefined ? updatedFields.fatherName : matchingStu.fatherName,
        class: updatedFields.class !== undefined ? updatedFields.class : matchingStu.class,
        address: updatedFields.address !== undefined ? updatedFields.address : matchingStu.address
      });
    }
  };

  // MANUALLY CLAIM & ASSIGN SEATS
  const handleAssignSeat = (seatId: string, studentId: string, studentName: string, timeIn: string) => {
    const updated = seats.map(seat => {
      // If student is already checked in somewhere else, release that seat first!
      if (seat.studentId === studentId && seat.id !== seatId) {
        return {
          id: seat.id,
          number: seat.number,
          status: 'Vacant' as const
        };
      }
      if (seat.id === seatId) {
        return {
          ...seat,
          status: 'Occupied' as const,
          studentId,
          studentName,
          timeIn
        };
      }
      return seat;
    });
    saveSeats(updated);
  };

  // CHECK OUT / RELEASE SEATS
  const handleReleaseSeat = (seatId: string) => {
    const updated = seats.map(seat => {
      if (seat.id === seatId) {
        return {
          id: seat.id,
          number: seat.number,
          status: 'Vacant' as const
        };
      }
      return seat;
    });
    saveSeats(updated);
  };

  // BILL NEW TRANSACTION DUES
  const handleAddTransaction = (newTxnData: Omit<Transaction, 'id' | 'invoiceNo' | 'date'>) => {
    const ticketNo = transactions.length + 48;
    const newTxn: Transaction = {
      ...newTxnData,
      id: `TXN-0${ticketNo}`,
      invoiceNo: `INV-2026-0${ticketNo}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newTxn, ...transactions];
    saveTransactions(updated);
  };

  // DELETE SINGLE TRANSACTION
  const handleDeleteTransaction = (txnId: string) => {
    const updated = transactions.filter(t => t.id !== txnId);
    saveTransactions(updated);
  };

  // CLEAR ALL TRANSACTIONS
  const handleClearAllTransactions = () => {
    saveTransactions([]);
  };

  // BROADCAST ANNOUNCEMENT
  const handleAddAnnouncement = (newAnnData: Omit<Announcement, 'id' | 'time'>) => {
    const randId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newAnn: Announcement = {
      ...newAnnData,
      id: `ANN-${randId}`,
      time: 'Just now'
    };
    const updated = [newAnn, ...announcements];
    saveAnnouncements(updated);
  };

  // REGISTER BOOKS
  const handleAddBook = (newBookData: Omit<InventoryBook, 'id'>) => {
    const nextBookNo = books.length + 1;
    const newBook: InventoryBook = {
      ...newBookData,
      id: `BK-00${nextBookNo}`
    };
    const updated = [newBook, ...books];
    saveBooks(updated);
  };

  if (!session) {
    return (
      <div 
        className="text-on-surface min-h-screen font-sans relative overflow-x-hidden flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(230, 240, 234, 0.85) 0%, rgba(246, 241, 198, 0.75) 100%), url(${libraryBg})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <AuthView 
          onLoginSuccess={(newSession) => {
            setSession(newSession);
            localStorage.setItem('kl_user_session', JSON.stringify(newSession));
          }} 
        />
      </div>
    );
  }

  return (
    <div 
      className="text-on-surface min-h-screen flex flex-col md:flex-row pb-24 md:pb-0 font-sans relative overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(251, 249, 246, 0.78) 0%, rgba(240, 231, 222, 0.70) 100%), url(${libraryBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low/60 backdrop-blur-md border-r border-outline-variant/60 h-screen sticky top-0 px-4 py-6 justify-between select-none">
        <div className="space-y-8">
          {/* Header Title */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-primary text-base tracking-tight leading-none">Krishna Smart Library</h1>
              <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest font-semibold font-mono">Consoles Panel</p>
            </div>
          </div>

          {/* Nav Items Link list */}
          <nav className="space-y-1.5 flex flex-col">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'home' 
                  ? 'bg-primary text-white shadow-sm font-bold' 
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('seats')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'seats' 
                  ? 'bg-primary text-white shadow-sm font-bold' 
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>Seat View Map</span>
            </button>

            {session?.role !== 'student' && (
              <button
                onClick={() => setCurrentTab('fees')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'fees' 
                    ? 'bg-primary text-white shadow-sm font-bold' 
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                <span>Fees &amp; Billings</span>
              </button>
            )}

            {session?.role !== 'student' && (
              <button
                onClick={() => setCurrentTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'profile' 
                    ? 'bg-primary text-white shadow-sm font-bold' 
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Students Registry</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('resources')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'resources' 
                  ? 'bg-primary text-white shadow-sm font-bold' 
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>E-Resources Hub</span>
            </button>
          </nav>
        </div>

        {/* User context brief card */}
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold overflow-hidden border border-primary shrink-0">
              <img 
                alt={session?.name || "User"} 
                src={session?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_b_APspeJm8P5tlxqfJUcmf8p5daVfPOpOUsvuCAyu3MUeEEMdWKPyExobGoDcks4aEKs2mOwlIMzljnVkUp3oI3IkZhsJAxJIqLggSFPtauYOuWqwzWV2QX-BPVcr6dRs0Oc2f0iBslJcWVycoLaChyvZekjq3tjyerkGlr-H40UgNDuNvwCJ4HY3Z5owUUKaVb0ioDz0ERxTaelnEBLuRIjNk0dz1c4X1nx4-tFaHVPW4pBuKOTtk8wtMWBg_eLikoopqyJKg-"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-on-surface leading-tight truncate">{session?.name || 'Akshay Kumar'}</p>
              <p className="text-[10px] text-secondary mt-0.5 font-mono capitalize">{session?.role === 'admin' ? 'Senior Admin' : 'Student Member'}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSession(null);
                localStorage.removeItem('kl_user_session');
              }}
              title="Log Out Session"
              className="p-1 rounded-md text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main viewport Container wrappers */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Unified Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-outline-variant/60 shadow-sm flex items-center justify-between px-6 py-4 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <h2 className="text-sm font-bold text-primary font-mono uppercase tracking-wider">
              {currentTab === 'home' && 'Home Dashboard'}
              {currentTab === 'seats' && 'Seat View Map'}
              {currentTab === 'fees' && 'Fees & Billings'}
              {currentTab === 'profile' && 'Students Registry'}
              {currentTab === 'resources' && 'E-Resources Hub'}
            </h2>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <h1 className="font-bold text-primary text-lg">Krishna Smart Library</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                // Resolved gracefully or can integrate dynamic toast later
              }}
              className="p-1.5 rounded-full text-primary hover:bg-surface-container transition-colors animate-pulse"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            
            {/* Elegant User Context Widget with Integrated 3-Dot More options */}
            <div className="relative">
              <div 
                className="flex items-center gap-2.5 bg-surface-container/30 px-3.5 py-1.5 rounded-xl border border-outline-variant/40 hover:border-outline-variant/80 transition-all shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-primary shrink-0 relative shadow-inner">
                  <img 
                    alt={session?.name || "User"} 
                    src={session?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_b_APspeJm8P5tlxqfJUcmf8p5daVfPOpOUsvuCAyu3MUeEEMdWKPyExobGoDcks4aEKs2mOwlIMzljnVkUp3oI3IkZhsJAxJIqLggSFPtauYOuWqwzWV2QX-BPVcr6dRs0Oc2f0iBslJcWVycoLaChyvZekjq3tjyerkGlr-H40UgNDuNvwCJ4HY3Z5owUUKaVb0ioDz0ERxTaelnEBLuRIjNk0dz1c4X1nx4-tFaHVPW4pBuKOTtk8wtMWBg_eLikoopqyJKg-"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left select-none">
                  <p className="text-xs font-bold text-on-surface leading-tight">{session?.name || 'Akshay Kumar'}</p>
                  <p className="text-[9px] text-secondary font-mono uppercase mt-0.5 tracking-wider font-semibold">{session?.role === 'admin' ? 'Senior Admin' : 'Student Member'}</p>
                </div>
                
                {/* Visual elegant separator line */}
                <div className="h-5 w-[1px] bg-outline-variant/60 mx-1 hidden sm:block" />

                {/* THE THREE DOT TRIGGER */}
                <button
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-all cursor-pointer relative"
                  title="More Profile Settings"
                >
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* DROPDOWN POPUP */}
              <AnimatePresence>
                {isHeaderMenuOpen && (
                  <>
                    {/* Click backdrop to auto close */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsHeaderMenuOpen(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-52 bg-white border border-outline-variant/80 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden font-sans"
                    >
                      <div className="px-4 py-2 border-b border-outline-variant/40 bg-surface-container-lowest">
                        <p className="text-[9px] uppercase font-bold text-secondary font-mono tracking-wider">Account Operations</p>
                        <p className="text-[11px] text-on-surface font-semibold truncate mt-0.5">{session?.email || 'akshay@smartlibrary.com'}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsHeaderMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium text-on-surface">View Profile Details</span>
                      </button>
                      
                      <div className="border-t border-outline-variant/40" />

                      <button
                        onClick={() => {
                          setSession(null);
                          localStorage.removeItem('kl_user_session');
                          setIsHeaderMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Log Out / Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              id="active-tab-container"
            >
              {currentTab === 'home' && (
                <DashboardView
                  students={students}
                  seats={seats}
                  transactions={transactions}
                  announcements={announcements}
                  materials={materials}
                  setCurrentTab={setCurrentTab}
                  triggerAddStudent={() => setIsAddStudentOpen(true)}
                  triggerAnnounce={() => setIsAnnounceOpen(true)}
                  triggerInventory={() => setIsInventoryOpen(true)}
                  onReleaseSeat={handleReleaseSeat}
                  currentUser={session}
                />
              )}

              {currentTab === 'seats' && (
                <SeatsView
                  seats={seats}
                  students={students}
                  onAssignSeat={handleAssignSeat}
                  onReleaseSeat={handleReleaseSeat}
                  onUpdateStudentName={(studentId, newName) => handleUpdateStudent(studentId, { name: newName })}
                  currentUser={session}
                />
              )}

              {currentTab === 'fees' && (
                <FeesView
                  transactions={transactions}
                  students={students}
                  onAddTransaction={handleAddTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onClearAllTransactions={handleClearAllTransactions}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileView
                  students={students}
                  onAddStudentClick={() => setIsAddStudentOpen(true)}
                  onRemoveStudent={handleRemoveStudent}
                  onUpdateStudent={handleUpdateStudent}
                  currentUser={session}
                  onUpdateCurrentUser={handleUpdateCurrentUser}
                  onLogOut={() => {
                    setSession(null);
                    localStorage.removeItem('kl_user_session');
                  }}
                />
              )}

              {currentTab === 'resources' && (
                <ResourcesView 
                  currentUser={session} 
                  materials={materials}
                  onSaveMaterials={saveMaterials}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Mobile Tab Navigation bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-surface/85 backdrop-blur-md border-t border-outline-variant/60 z-40 shadow-lg select-none">
        <button 
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            currentTab === 'home' 
              ? 'bg-secondary-container text-primary font-bold scale-105' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        <button 
          onClick={() => setCurrentTab('seats')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            currentTab === 'seats' 
              ? 'bg-secondary-container text-primary font-bold scale-105' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Armchair className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Seats</span>
        </button>

        {session?.role !== 'student' && (
          <button 
            onClick={() => setCurrentTab('fees')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
              currentTab === 'fees' 
                ? 'bg-secondary-container text-primary font-bold scale-105' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <IndianRupee className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Fees</span>
          </button>
        )}

        <button 
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            currentTab === 'profile' 
              ? 'bg-secondary-container text-primary font-bold scale-105' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>

        <button 
          onClick={() => setCurrentTab('resources')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            currentTab === 'resources' 
              ? 'bg-secondary-container text-primary font-bold scale-105' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">E-Files</span>
        </button>
      </nav>

      {/* Utility System Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAdd={handleAddStudent}
      />

      <AnnounceModal
        isOpen={isAnnounceOpen}
        onClose={() => setIsAnnounceOpen(false)}
        onAnnounce={handleAddAnnouncement}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        books={books}
        onAddBook={handleAddBook}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={session}
        onUpdateCurrentUser={handleUpdateCurrentUser}
        onLogOut={() => {
          setSession(null);
          localStorage.removeItem('kl_user_session');
        }}
      />

    </div>
  );
}
