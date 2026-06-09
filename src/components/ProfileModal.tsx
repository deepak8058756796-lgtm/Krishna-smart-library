import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileLock, 
  GraduationCap, 
  MapPin, 
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { UserSession } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpdateCurrentUser: (updatedFields: Partial<UserSession>) => void;
  onLogOut: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  onLogOut
}: ProfileModalProps) {
  if (!isOpen || !currentUser) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-over panel container */}
        <motion.div
          initial={{ x: '100%', opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-primary text-base">User Profile Details</h3>
                <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider font-mono">Control &amp; Personal Settings</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable editable fields */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Visual Headshot Card Block */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-4 -mt-4" />
              
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-primary-fixed shrink-0 shadow-md">
                <img 
                  alt={currentUser.name} 
                  src={currentUser.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_b_APspeJm8P5tlxqfJUcmf8p5daVfPOpOUsvuCAyu3MUeEEMdWKPyExobGoDcks4aEKs2mOwlIMzljnVkUp3oI3IkZhsJAxJIqLggSFPtauYOuWqwzWV2QX-BPVcr6dRs0Oc2f0iBslJcWVycoLaChyvZekjq3tjyerkGlr-H40UgNDuNvwCJ4HY3Z5owUUKaVb0ioDz0ERxTaelnEBLuRIjNk0dz1c4X1nx4-tFaHVPW4pBuKOTtk8wtMWBg_eLikoopqyJKg-"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[9px] uppercase font-bold text-primary tracking-wider font-mono">Personal Name</p>
                <input
                  type="text"
                  value={currentUser.name || ''}
                  onChange={(e) => onUpdateCurrentUser({ name: e.target.value })}
                  className="w-full text-lg font-extrabold text-on-surface bg-surface-container/30 hover:bg-surface-container/60 focus:bg-white focus:ring-1 focus:ring-primary border border-outline-variant/60 focus:border-primary focus:outline-none px-2.5 py-1 rounded-xl transition-all"
                  placeholder="e.g. Akshay Kumar"
                />
                <div className="inline-flex items-center gap-1 text-[10px] text-primary/80 font-bold bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span className="capitalize">{currentUser.role === 'admin' ? 'Senior Administrator' : 'Student Member'}</span>
                </div>
              </div>
            </div>

            {/* Input list matching screenshot fields */}
            <div className="space-y-4">
              
              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                  <input
                    type="email"
                    value={currentUser.email || ''}
                    onChange={(e) => onUpdateCurrentUser({ email: e.target.value })}
                    className="w-full text-sm font-semibold text-on-surface pl-11 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all"
                    placeholder="example@library.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                  <input
                    type="text"
                    value={currentUser.phone || ''}
                    onChange={(e) => onUpdateCurrentUser({ phone: e.target.value })}
                    className="w-full text-sm font-semibold text-on-surface pl-11 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all"
                    placeholder="91XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5">Study Shift Schedule</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary pointer-events-none" />
                  <select
                    value={currentUser.shift || 'General Hours (09:00 AM - 06:00 PM)'}
                    onChange={(e) => onUpdateCurrentUser({ shift: e.target.value })}
                    className="w-full text-sm font-semibold text-on-surface pl-11 pr-8 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all cursor-pointer bg-white"
                  >
                    <option value="Full Day (24/7 Access)">Full Day (24/7 Access)</option>
                    <option value="General Hours (09:00 AM - 06:00 PM)">General Hours (09:00 AM - 06:00 PM)</option>
                    <option value="First Shift (06:00 AM - 02:00 PM)">First Shift (06:00 AM - 02:00 PM)</option>
                    <option value="Second Shift (02:00 PM - 10:00 PM)">Second Shift (02:00 PM - 10:00 PM)</option>
                    <option value="Night Shift (10:00 PM - 06:00 AM)">Night Shift (10:00 PM - 06:00 AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5">Access Role Clearance</label>
                <div className="relative">
                  <FileLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary pointer-events-none" />
                  <select
                    value={currentUser.role || 'admin'}
                    onChange={(e) => onUpdateCurrentUser({ role: e.target.value as 'admin' | 'student' })}
                    className="w-full text-sm font-semibold text-on-surface pl-11 pr-8 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all cursor-pointer bg-white"
                  >
                    <option value="admin">Senior Administrator</option>
                    <option value="student">Student Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Father's Name
                </label>
                <input
                  type="text"
                  value={currentUser.fatherName || ''}
                  onChange={(e) => onUpdateCurrentUser({ fatherName: e.target.value })}
                  className="w-full text-sm font-semibold text-on-surface px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all"
                  placeholder="e.g. Shri Surendra Kumar"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Class / Target Exam
                </label>
                <input
                  type="text"
                  value={currentUser.class || ''}
                  onChange={(e) => onUpdateCurrentUser({ class: e.target.value })}
                  className="w-full text-sm font-semibold text-on-surface px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all"
                  placeholder="e.g. UPSC Aspirant"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Residential Address
                </label>
                <textarea
                  value={currentUser.address || ''}
                  onChange={(e) => onUpdateCurrentUser({ address: e.target.value })}
                  className="w-full text-sm font-semibold text-on-surface px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border-b-2 focus:border-b-primary focus:outline-none rounded-xl transition-all resize-none"
                  placeholder="e.g. Plot 45, Sector 4, Mansarovar, Jaipur"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-secondary tracking-wider block mb-1.5">Profile Avatar Image Link</label>
                <input
                  type="text"
                  value={currentUser.avatar || ''}
                  onChange={(e) => onUpdateCurrentUser({ avatar: e.target.value })}
                  className="w-full text-xs font-mono text-on-surface px-4 py-2 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container/30 focus:bg-white border focus:border-primary focus:outline-none rounded-xl transition-all"
                  placeholder="Avatar image URL path..."
                />
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-outline-variant/60 bg-surface-container-lowest flex flex-col gap-3 shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl text-center text-sm transition-all shadow-md active:scale-[0.99]"
            >
              Done &amp; Close Drawer
            </button>
            <button
              onClick={() => {
                onLogOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl text-sm transition-all border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out current User</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
