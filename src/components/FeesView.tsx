import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Trash2
} from 'lucide-react';
import { Transaction, Student } from '../types';

// PhonePe QR Code image
// @ts-ignore
import phonepeQr from '../assets/images/phonepe_qr_code_1780406139241.png';

interface FeesViewProps {
  transactions: Transaction[];
  students: Student[];
  onAddTransaction: (txn: Omit<Transaction, 'id' | 'invoiceNo' | 'date'>) => void;
  onDeleteTransaction?: (id: string) => void;
  onClearAllTransactions?: () => void;
}

export default function FeesView({ 
  transactions, 
  students, 
  onAddTransaction,
  onDeleteTransaction,
  onClearAllTransactions
}: FeesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [isFullQrOpen, setIsFullQrOpen] = useState(false);
  const [paymentVerifiedAlert, setPaymentVerifiedAlert] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // New transaction form state
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState<number>(1500);
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [month, setMonth] = useState('June');
  const [error, setError] = useState('');

  // Computations
  const totalInvoiced = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  // Filters logic
  const filteredTransactions = transactions.filter(txn => {
    // Check search term
    const matchesSearch = txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          txn.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check status filter
    const matchesStatus = statusFilter === 'All' ? true : txn.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      setError('Please select a student');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be positive');
      return;
    }

    const matchedStudent = students.find(s => s.id === studentId);
    if (!matchedStudent) {
      setError('Internal profile validation error');
      return;
    }

    onAddTransaction({
      studentId: matchedStudent.id,
      studentName: matchedStudent.name,
      amount: Number(amount),
      status,
      month
    });

    // Reset
    setStudentId('');
    setAmount(1500);
    setStatus('Paid');
    setMonth('June');
    setError('');
    setIsRecordingPayment(false);
  };

  return (
    <div id="fees-view-layout" className="space-y-lg animate-fade-in">
      
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
        {/* Total Collected */}
        <div className="glass-card p-5 rounded-xl border border-outline-variant flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-secondary tracking-wider">Total Paid Revenue</p>
            <p className="text-3xl font-extrabold text-tertiary mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-tertiary-fixed text-tertiary rounded-lg shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="glass-card p-5 rounded-xl border border-outline-variant flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-secondary tracking-wider">Invoiced Dues (June)</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-lg shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Record trigger card */}
        <div className="glass-card p-5 rounded-xl border border-outline-variant bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-between shadow-md">
          <div>
            <h4 className="font-semibold text-sm">Receipt Ledger</h4>
            <p className="text-xs text-white/80 mt-1">Add collection reports directly inside admin loggers</p>
          </div>
          <button
            onClick={() => setIsRecordingPayment(true)}
            className="px-4 py-2 bg-white text-primary hover:bg-white/95 text-xs font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Fee
          </button>
        </div>
      </div>

      {/* Responsive Row Grid for split Ledger & PhonePe QR payment */}
      <div id="fees-split-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Side: Main ledger list & tools */}
        <div className="glass-card p-6 rounded-xl border border-outline-variant lg:col-span-8">
        
        {/* Actions bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-lg pb-5 border-b border-outline-variant/40">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-primary text-base">Inward Payment Receipts</h3>
            {transactions.length > 0 && onClearAllTransactions && (
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(true);
                }}
                className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all duration-200 cursor-pointer"
                title="Clear All Transactions"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Invoice # or Student..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-outline-variant text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex border border-outline-variant rounded-lg p-0.5 bg-surface-container-low shrink-0">
              {(['All', 'Paid', 'Pending'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    statusFilter === opt 
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

        {/* Ledger table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left" id="invoice-records-table">
            <thead className="bg-surface-container-low font-label-sm text-xs text-secondary uppercase tracking-wider">
              <tr>
                <th className="px-lg py-3">Receipt Code</th>
                <th className="px-lg py-3">Student Vetted</th>
                <th className="px-lg py-3">Date Record</th>
                <th className="px-lg py-3">Allocation</th>
                <th className="px-lg py-3 text-right">Amount Vested</th>
                <th className="px-lg py-3 text-center">Receipt Status</th>
                <th className="px-lg py-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm text-on-surface">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-lg py-12 text-center text-secondary text-sm">
                    No transactions matching your criteria are recorded.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-outline-variant hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-lg py-3.5 font-mono text-xs font-bold text-primary">
                      {txn.invoiceNo}
                    </td>
                    <td className="px-lg py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-secondary-container text-primary font-bold text-[10px] flex items-center justify-center font-mono">
                          {txn.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-semibold text-on-surface leading-none">{txn.studentName}</p>
                          <p className="text-[10px] text-secondary font-mono mt-1">{txn.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-3.5 text-secondary text-xs flex items-center gap-1 pt-6 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {txn.date}
                    </td>
                    <td className="px-lg py-3.5 text-xs text-on-surface-variant font-medium">
                      Monthly Pass ({txn.month})
                    </td>
                    <td className="px-lg py-3.5 text-right font-bold text-on-surface font-mono">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-lg py-3.5 text-center">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        txn.status === 'Paid' 
                          ? 'bg-tertiary-fixed text-tertiary' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-lg py-3.5 text-right">
                      <button 
                        onClick={() => onDeleteTransaction?.(txn.id)}
                        className="p-1.5 hover:bg-red-50 text-secondary hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

        {/* Right Side: Scan & Pay UPI Gateway Card */}
        <div className="lg:col-span-4 space-y-lg sticky top-6">
          <div className="glass-card overflow-hidden rounded-xl border border-outline-variant shadow-lg flex flex-col bg-surface-container-lowest animate-fade-in">
            
            {/* PhonePe Header Accent */}
            <div className="bg-[#5f259f] text-white py-4 px-5 text-center flex flex-col items-center gap-1.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6f2da8] via-[#5f259f] to-[#4a157d] opacity-50"></div>
              {/* PhonePe Inspired Circular Icon */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#5f259f] font-extrabold text-lg shadow-sm">
                पे
              </div>
              <h4 className="relative z-10 font-bold font-sans text-lg tracking-wide uppercase">PhonePe</h4>
              <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-[#3ab54a]/95 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ACCEPTED HERE
              </span>
            </div>

            {/* QR Card Wrapper */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Scan & Pay Using PhonePe App
              </p>

              {/* QR Image Frame with interactive magnifying action on hover */}
              <div 
                onClick={() => setIsFullQrOpen(true)}
                className="relative p-2.5 bg-white border border-outline-variant/60 rounded-xl shadow-inner max-w-[210px] cursor-zoom-in transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
              >
                <img 
                  src={phonepeQr} 
                  alt="PhonePe Payment UPI QR" 
                  className="w-full h-auto object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover scanner overlay layout */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-all duration-300">
                  <div className="p-2.5 rounded-full bg-[#5f259f] text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Personalization Details from QR Code */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">Registered Merchant</p>
                <h5 className="font-sans font-bold text-sm text-primary leading-tight">
                  DEEPAK KUMAR SO RAKESH KUMAR
                </h5>
              </div>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#effaf2] text-[#0d6e4e] rounded-full text-[10px] font-bold font-mono tracking-wider border border-[#bbf7d0]/50 uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trusted merchant channel
              </div>
            </div>

            {/* Footer with legal watermark */}
            <div className="bg-surface-container-low px-4 py-2.5 text-center text-[9px] text-on-surface-variant/70 border-t border-outline-variant/30 leading-tight">
              © 2026, Krishna Smart Library (Deepak Kumar). <br/>
              PhonePe Private Ltd. All Rights Reserved.
            </div>
          </div>

          {/* Quick Informational Guide & Reporting Module */}
          <div className="glass-card p-5 rounded-xl border border-outline-variant bg-surface-container-low/40 space-y-4">
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-primary">Need Offline Fee Receipt?</h5>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">
                  Pay the subscription fees directly using PhonePe. The system administrator will record the receipt immediately on your ledger profile.
                </p>
              </div>
            </div>

            {/* Quick Informational Notice to students */}
            <div className="py-2.5 px-3 rounded-lg bg-surface/50 border border-outline-variant/40 text-[10px] text-secondary font-medium">
              💡 <span className="font-bold text-primary">Support Info:</span> Take a screenshot of the completed payment receipt and share it with Akshay Kumar for quick ledger reconciliation.
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX DIALOG FOR PERFECT QR SCANNER USE */}
      <AnimatePresence>
        {isFullQrOpen && (
          <div 
            onClick={() => setIsFullQrOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-[420px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsFullQrOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-on-surface hover:text-primary rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Interactive PhonePe QR Code Frame */}
              <img 
                src={phonepeQr} 
                alt="PhonePe Payment UPI QR" 
                className="w-full h-auto object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />

              <div className="mt-4 text-center space-y-1">
                <h3 className="font-extrabold text-primary text-base">SCAN TO PAY INSTANTLY</h3>
                <p className="text-xs text-secondary uppercase font-bold tracking-widest font-mono">
                  DEEPAK KUMAR SO RAKESH KUMAR
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record payment modern custom drawer/modal dialog */}
      <AnimatePresence>
        {isRecordingPayment && (
          <div id="record-payment-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              id="record-payment-container"
              className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-outline-variant overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-fixed text-primary rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary font-bold">Write Inward Receipt</h3>
                </div>
                <button
                  onClick={() => setIsRecordingPayment(false)}
                  className="p-1 rounded-full text-secondary hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Form */}
              <form onSubmit={handleRecordSubmit} className="p-5 space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Patient / Student */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                    Select Member Account *
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                    Amount Value (INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={100}
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="e.g. 1500"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Collection State
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending')}
                      className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                    >
                      <option value="Paid">Vetted / Paid</option>
                      <option value="Pending">Dues / Pending</option>
                    </select>
                  </div>

                  {/* Period Month */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                      Fee Term Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                    >
                      <option value="June">June 2026</option>
                      <option value="May">May 2026</option>
                      <option value="April">April 2026</option>
                    </select>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsRecordingPayment(false)}
                    className="flex-1 py-2 text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-container rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    Save Receipts
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Clear All Confirmation Modal Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant overflow-hidden p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-on-surface text-lg">Are you sure?</h3>
                <p className="text-secondary text-xs leading-relaxed font-semibold">
                  क्या आप सभी simulated और recorded invoices को डिलीट करना चाहते हैं? <br />
                  <span className="text-[11px] opacity-80">(This will permanently clear all recorded invoice history. This cannot be undone.)</span>
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl hover:bg-surface-container text-xs font-bold border border-outline-variant text-secondary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllTransactions?.();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
                >
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
