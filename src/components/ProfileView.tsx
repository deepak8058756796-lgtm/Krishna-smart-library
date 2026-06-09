import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileLock, 
  ShieldAlert, 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Terminal,
  Grid,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Edit2,
  LogOut,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { Student, UserSession } from '../types';

interface ProfileViewProps {
  students: Student[];
  onAddStudentClick: () => void;
  onRemoveStudent: (studentId: string) => void;
  onUpdateStudent: (studentId: string, updated: Partial<Student>) => void;
  currentUser: UserSession | null;
  onUpdateCurrentUser?: (updatedFields: Partial<UserSession>) => void;
  onLogOut: () => void;
}

export default function ProfileView({ 
  students, 
  onAddStudentClick, 
  onRemoveStudent, 
  onUpdateStudent,
  currentUser,
  onUpdateCurrentUser,
  onLogOut
}: ProfileViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Inline editing states
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editFatherName, setEditFatherName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Row expansion state for full details view
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const startEditing = (stu: Student) => {
    setEditingStudentId(stu.id);
    setEditName(stu.name);
    setEditEmail(stu.email);
    setEditPhone(stu.phone);
    setEditRollNo(stu.rollNo);
    setEditStatus(stu.status);
    setEditFatherName(stu.fatherName || '');
    setEditClass(stu.class || '');
    setEditAddress(stu.address || '');
    // Auto-expand editing row so user sees additional custom inputs
    setExpandedStudentId(stu.id);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateStudent(id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      rollNo: editRollNo,
      status: editStatus,
      fatherName: editFatherName.trim(),
      class: editClass.trim(),
      address: editAddress.trim()
    });
    setEditingStudentId(null);
  };

  // Local calculation of registered student profiles mapping
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isStudent = currentUser?.role === 'student';

  return (
    <div id="profile-view-layout" className="max-w-7xl mx-auto w-full animate-fade-in">
      
      {/* Student Registry Roster - Expanded Full Screen Container */}
      {!isStudent ? (
        <div className="space-y-md">
        <div className="glass-card p-6 rounded-2xl border border-outline-variant flex flex-col justify-between h-full bg-white shadow-sm">
          <div>
            
            {/* Header control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-lg pb-5 border-b border-outline-variant/40">
              <div>
                <h3 className="font-bold text-primary text-base">Registered Student Profiles</h3>
                <p className="text-xs text-secondary mt-0.5">Edit or register student access and credentials</p>
              </div>

              <button
                onClick={onAddStudentClick}
                className="px-4.5 py-2 hover:bg-primary-container bg-primary text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Add New Profile
              </button>
            </div>

            {/* Searching controls */}
            <div className="mb-5">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter student profiles by name, email, roll-no..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container/10 border border-outline-variant hover:bg-surface-container/20 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold"
                />
              </div>
            </div>

            {/* Registry table list */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-1">
              <table className="w-full text-left" id="student-roster-registry-table">
                <thead className="bg-[#f0f9f4]/60 font-label-sm text-xs text-primary uppercase tracking-wider sticky top-0 z-10 border-b border-primary/15">
                  <tr>
                    <th className="px-md py-3.5">Student / Roll No</th>
                    <th className="px-md py-3.5">Email Address</th>
                    <th className="px-md py-3.5 font-mono text-center">Status</th>
                    <th className="px-md py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-sm text-on-surface">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-md py-12 text-center text-secondary text-xs font-semibold">
                        No student directory matches. Add profiles using 'Add New Profile'.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((stu) => {
                      const isEditing = editingStudentId === stu.id;
                      const isExpanded = expandedStudentId === stu.id;
                      return (
                        <React.Fragment key={stu.id}>
                          <tr className={`border-b border-outline-variant transition-colors ${
                            isExpanded 
                              ? 'bg-primary/5 hover:bg-primary/10' 
                              : 'hover:bg-surface-container-low/20'
                          }`}>
                            <td className="px-md py-3">
                              <div className="flex items-center gap-2">
                                {!isEditing && (
                                  <span className="w-8 h-8 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center justify-center font-mono shrink-0">
                                    {stu.name.split(' ').map(n=>n[0]).join('').slice(0, 2)}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  {isEditing ? (
                                    <div className="space-y-1">
                                      <label className="text-[9px] uppercase font-bold text-outline">Full Name</label>
                                      <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full text-xs font-semibold px-2 py-1 border border-primary rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                      <label className="text-[9px] uppercase font-bold text-outline">Roll No</label>
                                      <input 
                                        type="text" 
                                        value={editRollNo}
                                        onChange={(e) => setEditRollNo(e.target.value)}
                                        className="w-full text-[10px] font-mono px-2 py-1 border border-outline rounded bg-white focus:outline-none"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <p className="font-semibold text-on-surface">{stu.name}</p>
                                        {stu.class && (
                                          <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wide">
                                            {stu.class}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-secondary font-mono leading-none mt-1">{stu.rollNo} (ID: {stu.id})</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-md py-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-outline">Email Address</label>
                                  <input 
                                    type="email" 
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full text-xs px-2 py-1 border border-outline rounded bg-white focus:outline-none"
                                  />
                                  <label className="text-[9px] uppercase font-bold text-outline">Phone Number</label>
                                  <input 
                                    type="text" 
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full text-[10px] font-mono px-2 py-1 border border-outline rounded bg-white focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs text-on-surface font-medium">{stu.email}</p>
                                  <p className="text-[10px] text-secondary font-mono mt-0.5">{stu.phone}</p>
                                </>
                              )}
                            </td>

                            <td className="px-md py-3 text-center">
                              {isEditing ? (
                                <div className="inline-block text-left">
                                  <label className="block text-[9px] uppercase font-bold text-outline text-left mb-1">Status</label>
                                  <select 
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Inactive')}
                                    className="text-xs border border-outline rounded px-1.5 py-1 bg-white focus:outline-none"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                </div>
                              ) : (
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                  stu.status === 'Active' 
                                    ? 'bg-tertiary-fixed text-tertiary' 
                                    : 'bg-outline-variant text-secondary'
                                }`}>
                                  {stu.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-tertiary" /> : <XCircle className="w-3 h-3 text-secondary" />}
                                  {stu.status}
                                </span>
                              )}
                            </td>

                            <td className="px-md py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* Toggle Expansion Button */}
                                <button
                                  onClick={() => setExpandedStudentId(isExpanded ? null : stu.id)}
                                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                                    isExpanded 
                                      ? 'bg-primary text-white' 
                                      : 'bg-surface-container-low text-secondary hover:text-on-surface border border-outline-variant/30'
                                  }`}
                                  title={isExpanded ? "Hide Details" : "Show Full Details"}
                                >
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>

                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveEdit(stu.id)}
                                      className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                      title="Save changes"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingStudentId(null);
                                        setExpandedStudentId(null);
                                      }}
                                      className="p-1.5 text-secondary hover:text-on-surface rounded bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
                                      title="Cancel editing"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEditing(stu)}
                                      className="p-1.5 text-primary hover:text-primary-container rounded bg-surface-container-low hover:bg-primary/5 border border-outline-variant/30 hover:border-primary/20 transition-colors cursor-pointer"
                                      title="Edit Student Profile"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => onRemoveStudent(stu.id)}
                                      className="p-1.5 text-secondary hover:text-red-600 rounded bg-surface-container-low hover:bg-red-50 border border-outline-variant/30 hover:border-red-100 transition-colors cursor-pointer"
                                      title="Delete Registry Profile"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expansion details / custom fields sub-row */}
                          {isExpanded && (
                            <tr className="bg-surface-container-lowest/80 border-b border-outline-variant/60">
                              <td colSpan={4} className="px-lg py-4">
                                {isEditing ? (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md bg-white p-4 rounded-xl border border-primary/20 shadow-inner space-y-2 md:space-y-0">
                                    {/* Edit Father's Name */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] uppercase font-bold text-secondary flex items-center gap-1">
                                        <User className="w-3 h-3 text-primary" /> Father's Name
                                      </label>
                                      <input 
                                        type="text" 
                                        value={editFatherName}
                                        onChange={(e) => setEditFatherName(e.target.value)}
                                        placeholder="e.g. Shri Surendra Kumar"
                                        className="w-full text-xs px-2.5 py-1.5 border border-outline rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                      />
                                    </div>
                                    {/* Edit Class/Course */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] uppercase font-bold text-secondary flex items-center gap-1">
                                        <GraduationCap className="w-3 h-3 text-primary" /> Class / Course Prep
                                      </label>
                                      <input 
                                        type="text" 
                                        value={editClass}
                                        onChange={(e) => setEditClass(e.target.value)}
                                        placeholder="e.g. UPSC Aspirant"
                                        className="w-full text-xs px-2.5 py-1.5 border border-outline rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                      />
                                    </div>
                                    {/* Edit Address */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] uppercase font-bold text-secondary flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-primary" /> Residential Address
                                      </label>
                                      <input 
                                        type="text" 
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        placeholder="e.g. Plot 45, Jaipur"
                                        className="w-full text-xs px-2.5 py-1.5 border border-outline rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-x-6 bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/40 hover:border-primary/20 transition-all text-left">
                                    <div className="space-y-1 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-2 md:pb-0 pr-2">
                                      <p className="text-[10px] uppercase font-semibold text-secondary font-sans leading-none tracking-wider">Father's Name</p>
                                      <p className="font-semibold text-on-surface text-xs mt-1.5">
                                        {stu.fatherName || <span className="text-secondary/70 italic font-normal text-[11px]">Not Provided</span>}
                                      </p>
                                    </div>
                                    <div className="space-y-1 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-2 md:pb-0 pr-2">
                                      <p className="text-[10px] uppercase font-semibold text-secondary font-sans leading-none tracking-wider">Class / Target Exam</p>
                                      <p className="font-semibold text-on-surface text-xs mt-1.5 flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>{stu.class || <span className="text-secondary/70 italic font-normal text-[11px]">Not Specified</span>}</span>
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] uppercase font-semibold text-secondary font-sans leading-none tracking-wider">Residential Address</p>
                                      <p className="font-medium text-xs text-on-surface mt-1.5 flex items-start gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                        <span className="leading-tight break-words">{stu.address || <span className="text-secondary/70 italic font-normal text-[11px]">No Residential Address</span>}</span>
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      ) : (
        <div className="glass-card p-8 rounded-2xl border border-outline-variant bg-white text-center shadow-md max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-on-surface text-lg">Your Profile Details</h3>
          <p className="text-secondary text-xs leading-relaxed font-semibold">
            To view or edit lock keys, scheduler, mobile records, and personal profiles, please use the <strong>Account Options</strong> dropdown next to your avatar in the top-right corner.
          </p>
        </div>
      )}

    </div>
  );
}
