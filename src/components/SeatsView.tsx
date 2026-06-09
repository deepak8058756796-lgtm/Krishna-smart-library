import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Armchair, 
  Search, 
  UserCheck, 
  Clock, 
  UserMinus, 
  User, 
  Filter, 
  Info, 
  CheckSquare, 
  ChevronRight,
  AlertCircle,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Seat, Student, UserSession } from '../types';

interface SeatsViewProps {
  seats: Seat[];
  students: Student[];
  onAssignSeat: (seatId: string, studentId: string, studentName: string, timeIn: string) => void;
  onReleaseSeat: (seatId: string) => void;
  onUpdateStudentName?: (studentId: string, newName: string) => void;
  currentUser: UserSession | null;
}

export default function SeatsView({ seats, students, onAssignSeat, onReleaseSeat, onUpdateStudentName, currentUser }: SeatsViewProps) {
  const isStudent = currentUser?.role === 'student';
  const [filter, setFilter] = useState<'All' | 'Occupied' | 'Vacant'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  // Seat check-in flow states
  const [assignStudentId, setAssignStudentId] = useState('');
  const [assignTime, setAssignTime] = useState('09:45 AM');
  const [assignError, setAssignError] = useState('');

  // Editing current occupier states
  const [isEditingOccupiedName, setIsEditingOccupiedName] = useState(false);
  const [occupiedNameInput, setOccupiedNameInput] = useState('');

  // Find currently selected seat details
  const selectedSeat = seats.find(s => s.id === selectedSeatId);

  // Whenever selectedSeatId or selectedSeat changes, reset occupied name editing state
  useEffect(() => {
    setIsEditingOccupiedName(false);
    if (selectedSeat && selectedSeat.studentName) {
      setOccupiedNameInput(selectedSeat.studentName);
    }
  }, [selectedSeatId, selectedSeat?.studentName]);

  // Filter & Search logical calculation
  const filteredSeats = seats.filter(seat => {
    // Check status filter
    if (filter === 'Occupied' && seat.status !== 'Occupied') return false;
    if (filter === 'Vacant' && seat.status !== 'Vacant') return false;

    // Check search term
    if (searchTerm.trim() !== '') {
      const matchName = seat.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeatNo = seat.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = seat.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchSeatNo || matchId;
    }

    return true;
  });

  // Handle student seating assignment submission
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeatId) return;
    if (!assignStudentId) {
      setAssignError('Please select a student');
      return;
    }

    const matchedStudent = students.find(s => s.id === assignStudentId);
    if (!matchedStudent) {
      setAssignError('Selected student profile could not be verified');
      return;
    }

    // Assign seat
    onAssignSeat(selectedSeatId, matchedStudent.id, matchedStudent.name, assignTime);
    
    // Reset inputs
    setAssignStudentId('');
    setAssignError('');
    setSelectedSeatId(null);
  };

  // Get student membership info for selected checked-in student
  const checkedInStudentDetails = selectedSeat?.studentId 
    ? students.find(s => s.id === selectedSeat.studentId) 
    : null;

  return (
    <div id="seats-view-container" className="grid grid-cols-1 lg:grid-cols-3 gap-lg animate-fade-in">
      
      {/* Premium Modern Library Greeting Banner */}
      {isStudent && (
        <div className="col-span-1 lg:col-span-3">
          <div className="relative h-60 md:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-outline-variant group">
            {/* Background Image with Warm Overlay */}
            <img 
              src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1400" 
              alt="Krishna Smart Library Premium Study Space" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
            
            {/* Header Content with Floating Details */}
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-white">
              <span className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-max mb-3.5 shadow-md">
                🟢 Student Dashboard Active
              </span>
              <h1 className="text-xl md:text-3xl font-bold font-sans tracking-tight text-white mb-2">
                Welcome back, <span className="text-emerald-400 font-extrabold">{currentUser?.name || 'Deepak Kumar'}</span>👋
              </h1>
              <p className="text-xs md:text-sm text-neutral-300 font-sans max-w-2xl hidden sm:block leading-relaxed">
                Enjoy your customized study space at <strong className="text-white">Krishna Smart Library</strong>. Find your desk on the interactive floor map below, keep track of silent zone regulations, and study comfortably.
              </p>

              {/* Floating stats metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-white/10 text-xs text-neutral-200">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Assigned Shift</span>
                  <p className="font-bold text-white mt-0.5 truncate">{currentUser?.shift || 'Morning (6:00 AM - 2:00 PM)'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Wi-Fi Connection</span>
                  <p className="font-mono font-bold text-emerald-300 mt-0.5 pointer-events-none select-none">KRISHNA_5G_FAST</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Wi-Fi Passcode</span>
                  <p className="font-mono font-semibold text-white mt-0.5">krishnastudy99</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Station Code</span>
                  <p className="font-bold text-white mt-0.5">GATE-03_SECURE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Statistics Cards for Students */}
      {isStudent && (
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-md mb-2">
          {/* Total Capacity Card */}
          <div className="glass-card p-4 rounded-xl border border-outline-variant/60 flex items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-6 -mt-6"></div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Armchair className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-secondary text-[11px] uppercase tracking-wider font-bold block">Total Seats Capacity</span>
              <p className="text-2xl font-bold tracking-tight text-primary mt-0.5">{seats.length || 22} Desks</p>
            </div>
          </div>

          {/* Occupied Seats Card */}
          <div className="glass-card p-4 rounded-xl border border-outline-variant/60 flex items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border-l-4 border-l-primary relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-6 -mt-6"></div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 rounded-lg">
              <UserCheck className="w-5 h-5 text-[#0c704f]" />
            </div>
            <div>
              <span className="text-secondary text-[11px] uppercase tracking-wider font-bold block">Live Occupied Seats</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <p className="text-2xl font-extrabold tracking-tight text-primary">{seats.filter(s => s.status === 'Occupied').length}</p>
                <span className="text-xs text-secondary">/ {seats.length || 22} active</span>
              </div>
            </div>
          </div>

          {/* Vacant Seats Card */}
          <div className="glass-card p-4 rounded-xl border border-outline-variant/60 flex items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-55/10 rounded-full -mr-6 -mt-6"></div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-secondary text-[11px] uppercase tracking-wider font-bold block">Available Vacant Space</span>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-0.5">
                {seats.length - seats.filter(s => s.status === 'Occupied').length} Desks Free
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Central Interactive Grid section (Col-span 2) */}
      <div className="lg:col-span-2 space-y-md">
        
        {/* Controls, Search and Filter Headers */}
        <div className="glass-card p-5 rounded-xl border border-outline-variant space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div>
              <h3 className="font-bold text-primary text-lg">Interactive Library Floor Plan</h3>
              <p className="text-xs text-secondary mt-0.5">Click any seat terminal below to register seating modifications</p>
            </div>
            
            {/* Legend Indicators */}
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-primary"></div>
                <span className="text-secondary">Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border border-outline-variant bg-white"></div>
                <span className="text-secondary">Vacant</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search occupied student or seat code (e.g. S-12)..."
                className="w-full pl-9 pr-4 py-2 border border-outline-variant text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex border border-outline-variant rounded-lg p-0.5 bg-surface-container-low shrink-0">
              {(['All', 'Occupied', 'Vacant'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    filter === opt 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Seating Grid map */}
        <div className="glass-card p-6 rounded-xl border border-outline-variant">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3" id="seating-interactive-grid">
            {filteredSeats.map((seat) => {
              const isOccupied = seat.status === 'Occupied';
              const isSelected = seat.id === selectedSeatId;

              // Generate initials
              const initials = seat.studentName
                ? seat.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)
                : '';

              return (
                <button
                  key={seat.id}
                  onClick={() => {
                    setSelectedSeatId(seat.id);
                    setAssignError('');
                  }}
                  id={`seat-btn-${seat.id}`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-between p-2 border transition-all duration-200 cursor-pointer ${
                    isOccupied 
                      ? 'bg-primary text-white border-transparent hover:bg-primary/95 shadow-sm' 
                      : 'bg-white border-outline-variant hover:border-primary text-secondary hover:bg-primary/5'
                  } ${
                    isSelected ? 'ring-4 ring-primary-fixed ring-offset-2 scale-95 border-primary' : ''
                  }`}
                >
                  <div className="w-full flex justify-between items-center text-[9px] font-bold font-mono">
                    <span>{seat.id}</span>
                    {isOccupied && <span className="bg-white/20 px-1 rounded">Active</span>}
                  </div>

                  <div className="my-1 shrink-0">
                    {isOccupied ? (
                      <span className="text-xs font-bold font-mono uppercase bg-white/25 text-white w-7 h-7 rounded-full flex items-center justify-center">
                        {initials}
                      </span>
                    ) : (
                      <Armchair className="w-5 h-5 text-outline group-hover:text-primary" />
                    )}
                  </div>

                  <span className="text-[9px] font-medium tracking-tight text-center line-clamp-1 w-full opacity-90">
                    {isOccupied ? seat.studentName : 'Vacant'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Detail Card Drawer panel */}
      <div className="space-y-lg">
        <div className="glass-card p-5 rounded-xl border border-outline-variant h-full flex flex-col justify-between">
          
          {!selectedSeat ? (
            /* Blank state context helper */
            <div className="text-center py-16 flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-primary/5 text-primary rounded-full">
                <Info className="w-8 h-8" />
              </div>
              <p className="font-bold text-on-surface text-base">Select a Terminal</p>
              <p className="text-xs text-secondary max-w-[200px] leading-relaxed mx-auto">
                Choose any seat layout block on the floorplan to inspect live student assignments or check details.
              </p>
            </div>
          ) : (
            <div>
              {/* Seat selection heading banner */}
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60 mb-5">
                <div>
                  <span className="text-[10px] font-bold font-mono bg-primary-fixed text-primary px-2.5 py-1 rounded">
                    Terminal layout {selectedSeat.id}
                  </span>
                  <h4 className="font-semibold text-on-surface text-base mt-2">Seat Status Inspector</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${selectedSeat.status === 'Occupied' ? 'bg-primary' : 'bg-tertiary'}`}></div>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wide">{selectedSeat.status}</span>
                </div>
              </div>

              {selectedSeat.status === 'Occupied' ? (
                /* Occupied display panel */
                <div className="space-y-5">
                  <div className="space-y-4">
                    {/* Student brief profile */}
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary text-white font-bold flex items-center justify-center font-mono shrink-0">
                        {selectedSeat.studentName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {isEditingOccupiedName ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={occupiedNameInput}
                              onChange={(e) => setOccupiedNameInput(e.target.value)}
                              className="w-full text-xs font-semibold px-2 py-1 border border-primary rounded bg-white focus:outline-none"
                              placeholder="Student Name"
                            />
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (occupiedNameInput.trim() && selectedSeat.studentId && onUpdateStudentName) {
                                    onUpdateStudentName(selectedSeat.studentId, occupiedNameInput.trim());
                                    setIsEditingOccupiedName(false);
                                  }
                                }}
                                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditingOccupiedName(false);
                                  if (selectedSeat.studentName) {
                                    setOccupiedNameInput(selectedSeat.studentName);
                                  }
                                }}
                                className="text-[10px] font-semibold text-secondary bg-white hover:bg-surface-container-low px-2.5 py-1 rounded border border-outline-variant cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-on-surface truncate max-w-[130px]">{selectedSeat.studentName}</p>
                              {!isStudent && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsEditingOccupiedName(true);
                                    if (selectedSeat.studentName) {
                                      setOccupiedNameInput(selectedSeat.studentName);
                                    }
                                  }}
                                  className="p-1 text-primary hover:text-primary-container bg-primary/5 hover:bg-primary/10 rounded transition-colors"
                                  title="Edit Name"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs font-mono text-secondary mt-0.5">{selectedSeat.studentId}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                        <span className="text-secondary font-medium">Session Start Time</span>
                        <span className="font-semibold text-primary font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {selectedSeat.timeIn}
                        </span>
                      </div>
                      
                      {checkedInStudentDetails && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                            <span className="text-secondary font-medium">Email Address</span>
                            <span className="font-semibold text-on-surface truncate max-w-[160px]">
                              {checkedInStudentDetails.email}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                            <span className="text-secondary font-medium">Phone Connected</span>
                            <span className="font-semibold text-on-surface font-mono">
                              {checkedInStudentDetails.phone}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                            <span className="text-secondary font-medium">Academic Roll No</span>
                            <span className="font-semibold text-on-surface font-mono">
                              {checkedInStudentDetails.rollNo}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {!isStudent ? (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onReleaseSeat(selectedSeat.id);
                          setSelectedSeatId(null);
                        }}
                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserMinus className="w-4 h-4" />
                        Check Out Student (Release Term)
                      </button>
                      <p className="text-[10px] text-center text-secondary mt-2">
                        Releasing this seat instantly increments vacant positions on the home monitoring dash.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/50 text-[11px] text-secondary text-center leading-relaxed">
                      🔒 This terminal is currently checked-in. For seating reallocations, please speak to the senior admin desk.
                    </div>
                  )}
                </div>
              ) : isStudent ? (
                /* Student view details for Vacant seat */
                <div className="text-center py-8 px-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Armchair className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-primary text-sm font-mono">Terminal is Vacant</p>
                  <p className="text-xs text-secondary leading-relaxed">
                    This seat {selectedSeat.id} is vacant and ready for reservation. To assign a slot or request booking, please contact the library administrator.
                  </p>
                </div>
              ) : (
                /* Vacant assignment form */
                <form onSubmit={handleAssignSubmit} className="space-y-4">
                  {assignError && (
                    <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{assignError}</span>
                    </div>
                  )}

                  {/* Student Registry lookup */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Select Registered Student *
                    </label>
                    <select
                      value={assignStudentId}
                      onChange={(e) => setAssignStudentId(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                    >
                      <option value="">-- Choose Student --</option>
                      {students.map((student) => {
                        // Check if already checked in somewhere
                        const activeSeat = seats.find(s => s.studentId === student.id);
                        return (
                          <option 
                            key={student.id} 
                            value={student.id}
                          >
                            {student.name} {activeSeat ? `• Reassign from ${activeSeat.id}` : `(${student.rollNo})`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Login Time */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Login/Arrival Timestamp
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                        <Clock className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={assignTime}
                        onChange={(e) => setAssignTime(e.target.value)}
                        placeholder="e.g. 10:15 AM"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Confirmation button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      <UserCheck className="w-4 h-4" />
                      Assign Seating Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSeatId(null)}
                      className="w-full py-2 text-xs font-semibold border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors mt-2"
                    >
                      Dismiss
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-secondary leading-normal mt-2">
                    Note: Only register student profiles who are actively vetted. Set default statuses under student profile logs.
                  </p>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
