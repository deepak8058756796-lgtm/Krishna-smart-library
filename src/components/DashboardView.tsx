import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Armchair, 
  CheckCircle2, 
  IndianRupee, 
  UserPlus, 
  LayoutGrid, 
  Megaphone, 
  ReceiptText, 
  BookOpen, 
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  User,
  FileText,
  Download,
  FolderOpen
} from 'lucide-react';
import { Student, Seat, Transaction, Announcement, UserSession, StudyMaterial } from '../types';

// Beautiful generated library hero scene block
// @ts-ignore
import libraryHero from '../assets/images/library_dashboard_hero_1780405380632.png';

interface DashboardViewProps {
  students: Student[];
  seats: Seat[];
  transactions: Transaction[];
  announcements: Announcement[];
  materials: StudyMaterial[];
  setCurrentTab: (tab: 'home' | 'seats' | 'fees' | 'profile' | 'resources') => void;
  triggerAddStudent: () => void;
  triggerAnnounce: () => void;
  triggerInventory: () => void;
  onReleaseSeat: (seatId: string) => void;
  currentUser: UserSession | null;
}

export default function DashboardView({
  students,
  seats,
  transactions,
  announcements,
  materials,
  setCurrentTab,
  triggerAddStudent,
  triggerAnnounce,
  triggerInventory,
  onReleaseSeat,
  currentUser
}: DashboardViewProps) {
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const dashboardMaterials = materials;

  // Compute stats dynamically
  const totalStudentsCount = students.length;
  const totalSeatsCapacity = seats.length || 22;
  const occupiedSeatsCount = seats.filter(s => s.status === 'Occupied').length;
  const vacantSeatsCount = totalSeatsCapacity - occupiedSeatsCount;
  const totalRevenue = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0); // base + payments

  // Attendance mock parameters
  const attendanceData7Days = [
    { day: 'Mon', pct: 60, height: 'h-[60%]' },
    { day: 'Tue', pct: 45, height: 'h-[45%]' },
    { day: 'Wed', pct: 85, height: 'h-[85%]' },
    { day: 'Thu', pct: 95, height: 'h-[95%]', active: true },
    { day: 'Fri', pct: 70, height: 'h-[70%]' },
    { day: 'Sat', pct: 30, height: 'h-[30%]' },
    { day: 'Sun', pct: 20, height: 'h-[20%]' }
  ];

  const attendanceData30Days = [
    { day: 'Week 1', pct: 55, height: 'h-[55%]' },
    { day: 'Week 2', pct: 72, height: 'h-[72%]' },
    { day: 'Week 3', pct: 82, height: 'h-[82%]', active: true },
    { day: 'Week 4', pct: 64, height: 'h-[64%]' }
  ];

  const activeChartData = timeRange === '7days' ? attendanceData7Days : attendanceData30Days;

  // Active check-ins
  const activeCheckins = seats.filter(s => s.status === 'Occupied').slice(0, 3);

  return (
    <div id="dashboard-container" className="space-y-xl animate-fade-in">
      {/* Welcome & Overview Greeting */}
      <section id="welcome-banner" className="mb-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-xs font-semibold">
              Welcome, {currentUser?.name || 'Akshay Kumar'}
            </h2>
            <p className="font-body-lg text-body-lg text-secondary">Here's a summary of the library activity today.</p>
          </div>
          <div className="flex gap-sm">
            {currentUser?.role !== 'student' && (
              <button
                 onClick={triggerAddStudent}
                 id="quick-add-student"
                 className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-lg py-sm rounded-lg font-label-sm text-label-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer mb-2 sm:mb-0"
              >
                <UserPlus className="w-4 h-4" />
                Add Student
              </button>
            )}
            <button
               onClick={() => setCurrentTab('seats')}
               id="quick-seat-view"
               className="flex items-center gap-2 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container px-lg py-sm rounded-lg font-label-sm text-label-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mb-2 sm:mb-0"
            >
               <LayoutGrid className="w-4 h-4" />
               Seat View
            </button>
          </div>
        </div>
      </section>

      {/* MAGNIFICENT HERO LIBRARY SCENE CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/70 shadow-lg bg-surface-container-lowest">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main Context Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative z-10 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/95 to-transparent">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Premium Study Hub
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold leading-tight tracking-tight">
                Krishna Smart Library
              </h1>
              
              <p className="text-secondary text-sm sm:text-base max-w-xl leading-relaxed">
                Step into a premium, world-class learning sanctuary engineered for extreme concentration, smart seat administration, and peaceful academics.
              </p>

              {/* Unique Features Badge Belt */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface-variant font-medium border border-outline-variant/30 flex items-center gap-1">
                  💡 Air-Conditioned
                </span>
                <span className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface-variant font-medium border border-outline-variant/30 flex items-center gap-1">
                  ⚡ High-Speed Wi-Fi
                </span>
                <span className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface-variant font-medium border border-outline-variant/30 flex items-center gap-1">
                  🔌 Charging Outlets
                </span>
                <span className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface-variant font-medium border border-outline-variant/30 flex items-center gap-1">
                  🔒 Personal Lockers
                </span>
                <span className="text-xs bg-surface-container px-2.5 py-1 rounded-md text-on-surface-variant font-medium border border-outline-variant/30 flex items-center gap-1">
                  ☕ Ambient Lighting
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-secondary font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Prime Academic Zone, Near Hub Centre</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-tertiary font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 24/7 Hours</span>
              </div>
            </div>
          </div>

          {/* Interactive Library Scene Photo Preview Panel */}
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-[220px] relative overflow-hidden group">
            {/* Visual background image with high fidelity filters */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: `url(${libraryHero})` }}
              referrerPolicy="no-referrer"
            />
            {/* Overlay Gradient for integrated brand blending */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-primary-container/20 to-surface-container-lowest" />
            <div className="absolute bottom-4 right-4 bg-primary-container/90 backdrop-blur-md text-on-primary-container border border-primary/20 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase shadow-md pointer-events-none flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Smart Seat View
            </div>
          </div>

        </div>
      </div>

      {/* Bento Grid Quick Stats */}
      <div id="quick-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {/* Total Students */}
        <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary-fixed text-primary rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-tertiary font-label-sm text-xs font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +4% this month
            </span>
          </div>
          <div className="mt-6">
            <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">Total Students</p>
            <p className="font-display-lg text-5xl font-bold text-primary mt-1">{totalStudentsCount}</p>
          </div>
        </div>

        {/* Occupied Seats */}
        <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-secondary-fixed text-primary rounded-lg">
              <Armchair className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col items-end">
              <p className="font-label-sm text-[11px] font-semibold text-on-secondary-container tracking-wider uppercase">Capacity</p>
              <p className="text-lg font-bold text-primary">{Math.round((occupiedSeatsCount / totalSeatsCapacity) * 100)}%</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">Occupied Seats</p>
            <div className="flex items-baseline gap-xs mt-1">
              <p className="font-display-lg text-5xl font-bold text-primary">{occupiedSeatsCount}</p>
              <p className="text-xl text-secondary">/ {totalSeatsCapacity}</p>
            </div>
          </div>
        </div>

        {/* Vacant Seats */}
        <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-tertiary-fixed text-tertiary rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-tertiary" />
            </div>
            <span className="text-xs bg-tertiary-fixed text-tertiary font-bold px-2.5 py-0.5 rounded-full uppercase">
              Free
            </span>
          </div>
          <div className="mt-6">
            <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">Vacant Seats</p>
            <p className="font-display-lg text-5xl font-bold text-tertiary mt-1">{vacantSeatsCount}</p>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
            <div 
              className="bg-tertiary h-full rounded-full transition-all duration-500" 
              style={{ width: `${(vacantSeatsCount / totalSeatsCapacity) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Monthly Revenue or My Desk Assignment */}
        {currentUser?.role === 'admin' ? (
          <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant hover:shadow-md transition-shadow bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-primary-container text-white rounded-lg">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="text-primary text-xs font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
                Invoiced
              </span>
            </div>
            <div className="mt-6">
              <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">Monthly Revenue</p>
              <p className="font-display-lg text-4xl font-extrabold text-primary mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ) : (() => {
          const myAssignedSeat = seats.find(s => s.studentName === currentUser?.name);
          return (
            <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant hover:shadow-md transition-shadow bg-gradient-to-br from-indigo-500/5 to-transparent border-l-4 border-l-indigo-500">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Armchair className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  myAssignedSeat ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {myAssignedSeat ? 'Occupied' : 'Vacant'}
                </span>
              </div>
              <div className="mt-6">
                <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">My Desk Assignment</p>
                <p className="font-display-lg text-4xl font-bold text-primary mt-1">
                  {myAssignedSeat ? myAssignedSeat.id : 'Unseated'}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {myAssignedSeat ? `Checked-in: ${myAssignedSeat.timeIn}` : 'No active reservation'}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Weekly Attendance Chart */}
        <div className="lg:col-span-2 glass-card p-lg rounded-xl border border-outline-variant flex flex-col justify-between">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h3 className="font-title-md text-lg text-primary font-bold">Attendance Statistics</h3>
              <p className="text-xs text-secondary mt-0.5">Average occupancy levels over chosen timelines</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7days' | '30days')}
              className="bg-surface-container-low border-none text-xs font-semibold rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 pt-6 px-1 border-b border-outline-variant/50">
            {activeChartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group relative">
                {/* Visual Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                  {item.pct}% Occupancy
                </div>
                {/* Progress bar pillar */}
                <div 
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    item.active 
                      ? 'bg-primary' 
                      : 'bg-secondary-fixed hover:bg-primary/75'
                  } ${item.height}`}
                ></div>
                <span className={`text-xs mt-3 ${item.active ? 'text-primary font-bold' : 'text-secondary'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Announcements */}
        <div className="flex flex-col gap-lg">
          {/* Quick Actions */}
          {currentUser?.role === 'admin' ? (
            <div className="glass-card p-lg rounded-xl border border-outline-variant bg-gradient-to-tr from-primary to-primary-container text-white shadow-lg">
              <h3 className="font-semibold text-lg mb-4 text-white">Quick Management</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={triggerAnnounce}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <Megaphone className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">Announce</p>
                    <p className="text-[11px] text-white/70">Broadcast notice to student boards</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentTab('fees')}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <ReceiptText className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">Records &amp; Payments</p>
                    <p className="text-[11px] text-white/70">Check transaction history and bill student dues</p>
                  </div>
                </button>

                <button 
                  onClick={triggerInventory}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <BookOpen className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">Inventory &amp; Books</p>
                    <p className="text-[11px] text-white/70">Consult books catalogs and resource status</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-lg rounded-xl border border-outline-variant bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white shadow-lg">
              <h3 className="font-semibold text-lg mb-4 text-white">Student Shortcuts</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setCurrentTab('seats')}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <Armchair className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">Seat View Map</p>
                    <p className="text-[11px] text-white/70">Browse layout floorplan &amp; reserve a desk</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <User className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">My Profile Details</p>
                    <p className="text-[11px] text-white/70">Inspect study card profile details</p>
                  </div>
                </button>

                <button 
                  onClick={triggerInventory}
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 text-left w-full cursor-pointer group"
                >
                  <BookOpen className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-sm">Books &amp; Catalogs</p>
                    <p className="text-[11px] text-white/70">Search real-time textbook locations in library racks</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Announcements Card */}
          <div className="glass-card p-lg rounded-xl border border-outline-variant flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-on-surface text-base">Announcements Board</h3>
                <span className="text-secondary cursor-pointer hover:text-primary transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </span>
              </div>
              
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="flex gap-3 items-start border-l-2 border-primary/20 pl-3">
                    <div className="mt-1 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${ann.important ? 'bg-red-500' : 'bg-primary'}`}></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-primary tracking-wide uppercase">{ann.time}</p>
                        {ann.important && (
                          <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 rounded uppercase font-mono">Urgent</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-on-surface leading-snug mt-0.5">{ann.title}</p>
                      <p className="text-xs text-secondary leading-normal mt-0.5">{ann.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Academic Documents / Shared Files Card */}
          <div className="glass-card p-lg rounded-xl border border-outline-variant flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary animate-pulse" />
                  <h3 className="font-bold text-on-surface text-base">Shared E-Resources</h3>
                </div>
                <button 
                  onClick={() => setCurrentTab('resources')}
                  className="text-xs font-bold text-primary hover:underline hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  View All Hub
                </button>
              </div>
              
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {dashboardMaterials.length === 0 ? (
                  <p className="text-secondary text-xs text-center py-6">No study materials uploaded yet.</p>
                ) : (
                  dashboardMaterials.slice(0, 4).map((m: any) => (
                    <div key={m.id} className="flex gap-2.5 items-center p-2 rounded-lg bg-surface-container-lowest/75 hover:bg-surface-container-low transition-colors border border-outline-variant/30">
                      <div className="p-2 bg-primary/10 rounded text-primary shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate" title={m.name}>{m.name}</p>
                        <p className="text-[10px] text-secondary font-mono mt-0.5">{m.size} • By {m.uploadedBy}</p>
                      </div>
                      {/* Direct direct binary download link if base64/url exists */}
                      {m.dataUrl && (
                        <a
                          href={m.dataUrl}
                          download={m.name}
                          className="p-1.5 bg-secondary-container hover:bg-primary hover:text-white rounded text-on-secondary-container text-xs transition-all cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Floor Map Activity & Seat Allocation Console */}
      <section id="dashboard-live-seat-map" className="glass-card rounded-xl border border-outline-variant overflow-hidden shadow-sm bg-surface-container-lowest/50">
        <div className="px-lg py-4 border-b border-outline-variant bg-surface-container-low/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="font-bold text-primary text-base">Live Smart Floorplan Map Tracker</h3>
            </div>
            <p className="text-xs text-secondary">Real-time status tracking of all 22 study consoles. Amber desks are occupied; green desks are vacant.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block"></span>
              <span className="text-emerald-700">{vacantSeatsCount} Vacant Desks</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 inline-block"></span>
              <span className="text-amber-700">{occupiedSeatsCount} Occupied Desks</span>
            </span>
          </div>
        </div>

        <div className="p-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {seats.map((seat) => {
              const isOccupied = seat.status === 'Occupied';
              return (
                <div 
                  key={seat.id}
                  className={`relative p-2.5 rounded-lg border flex flex-col items-center justify-between transition-all duration-300 ${
                    isOccupied 
                      ? 'bg-amber-50/70 border-amber-200 text-amber-800 shadow-sm' 
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:scale-105'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold leading-none">{seat.id}</span>
                  <div className={`w-2 h-2 rounded-full mt-2 mb-1 ${isOccupied ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <span className="text-[9px] font-medium truncate w-full text-center block mt-1 leading-tight text-secondary" title={isOccupied ? seat.studentName : 'Vacant'}>
                    {isOccupied ? seat.studentName : 'Empty'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity Table */}
      <section id="recent-activity" className="glass-card rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="px-lg py-4 border-b border-outline-variant bg-surface-container-low/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary text-base">Recent Seating Logins</h3>
            <p className="text-xs text-secondary">Presently checked-in student details and assigned terminals</p>
          </div>
          <button 
            onClick={() => setCurrentTab('seats')}
            className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            {currentUser?.role === 'admin' ? 'Manage Seating' : 'View Seating Map'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low font-label-sm text-xs text-secondary uppercase tracking-wider">
              <tr>
                <th className="px-lg py-3">Student Name</th>
                <th className="px-lg py-3">Assigned Seat</th>
                <th className="px-lg py-3">Login Time</th>
                <th className="px-lg py-3">Seating Action</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm text-on-surface">
              {activeCheckins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-lg py-8 text-center text-secondary text-sm">
                    No active student logins registered. Click Seat View to assign seats!
                  </td>
                </tr>
              ) : (
                activeCheckins.map((seat) => {
                  const initials = seat.studentName
                    ? seat.studentName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .substring(0, 2)
                    : 'ST';

                  return (
                    <tr key={seat.id} className="border-b border-outline-variant hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-lg py-3.5 flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs shrink-0 font-mono">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{seat.studentName}</p>
                          <p className="text-[11px] text-secondary font-mono">{seat.studentId}</p>
                        </div>
                      </td>
                      <td className="px-lg py-3.5">
                        <span className="font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                          {seat.id}
                        </span>
                      </td>
                      <td className="px-lg py-3.5 text-secondary flex items-center gap-1.5 pt-5">
                        <Clock className="w-3.5 h-3.5 text-outline" />
                        <span className="font-mono">{seat.timeIn}</span>
                      </td>
                      <td className="px-lg py-3.5">
                        {currentUser?.role === 'admin' ? (
                          <button
                            onClick={() => onReleaseSeat(seat.id)}
                            className="text-xs font-semibold px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition-colors cursor-pointer"
                          >
                            Checkout Student
                          </button>
                        ) : seat.studentName === currentUser?.name ? (
                          <button
                            onClick={() => onReleaseSeat(seat.id)}
                            className="text-xs font-semibold px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition-colors cursor-pointer"
                          >
                            Release My Seat
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded font-bold border border-emerald-100">
                            Live Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
