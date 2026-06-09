import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Mail, Phone, Hash, CheckSquare, MapPin, UserX, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Omit<Student, 'id' | 'joinedDate'>) => void;
}

export default function AddStudentModal({ isOpen, onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [fatherName, setFatherName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Student name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!rollNo.trim()) {
      setError('Roll number is required');
      return;
    }

    onAdd({
      name,
      email,
      phone,
      rollNo,
      status,
      fatherName: fatherName.trim(),
      class: studentClass.trim(),
      address: address.trim()
    });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setRollNo('');
    setStatus('Active');
    setFatherName('');
    setStudentClass('');
    setAddress('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="add-student-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            id="add-student-modal-container"
            className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-2xl border border-outline-variant"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-fixed text-primary rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-primary">Register New Student</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-secondary hover:bg-surface-container-high transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col max-h-[80vh]">
              {error && (
                <div className="p-3 mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Scrollable form fields wrapper */}
              <div className="space-y-4 overflow-y-auto pr-1 max-h-[48vh] snap-y">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <UserPlus className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohit Kumar"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Father's Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                    </span>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Shri Surendra Kumar"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Class / Course Prep Target
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                    </span>
                    <input
                      type="text"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      placeholder="e.g. UPSC Aspirant, NEET, CA Prep..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Roll / ID Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <Hash className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 2024-ME-045"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rohit.kumar@academy.edu"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Residential Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-secondary">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </span>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. H.No 12, Sanganer Colony, Jaipur"
                      rows={2}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Default Membership Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                  >
                    <option value="Active">Active (Permitted Seating)</option>
                    <option value="Inactive">Inactive (On Hold)</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-outline-variant/60 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-container rounded-lg transition-colors shadow-md flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  Register
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
