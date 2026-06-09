import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Paperclip, 
  Sparkles, 
  BookOpen, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  FileCode,
  Edit3
} from 'lucide-react';
import { UserSession, StudyMaterial } from '../types';

interface ResourcesViewProps {
  currentUser: UserSession | null;
  materials: StudyMaterial[];
  onSaveMaterials: (updated: StudyMaterial[]) => void;
}

export default function ResourcesView({ currentUser, materials, onSaveMaterials }: ResourcesViewProps) {
  const saveMaterials = onSaveMaterials;
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'txt'>('all');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // File preview states
  const [previewFile, setPreviewFile] = useState<StudyMaterial | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const [newResourceName, setNewResourceName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File size to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Main file processing logic - supports base64 encoding
  const processUploadedFile = (file: File) => {
    setError('');
    setSuccess('');

    // Strictly enforce admin only uploading
    if (currentUser?.role !== 'admin') {
      setError('Access Denied: Only administrators have upload clearance for study assets.');
      return;
    }

    // Filter file types explicitly
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isPDF = file.type === 'application/pdf' || fileExtension === 'pdf';
    const isTXT = file.type === 'text/plain' || fileExtension === 'txt';

    if (!isPDF && !isTXT) {
      setError('Invalid file type! Please upload only standard PDF (.pdf) or Text (.txt) study files.');
      return;
    }

    if (file.size > 1024 * 1024 * 5) {
      setError('File size exceeds the 5MB limit. Please upload smaller documents.');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrlResult = e.target?.result as string;
      if (!dataUrlResult) {
        setError('Error reading file data. Please try again.');
        return;
      }

      const newMaterial: StudyMaterial = {
        id: `MAT-${Date.now().toString().slice(-4)}`,
        name: file.name,
        size: formatBytes(file.size),
        type: isPDF ? 'pdf' : 'txt',
        uploadedBy: currentUser?.name || 'Anonymous User',
        role: currentUser?.role || 'student',
        date: new Date().toISOString().split('T')[0],
        dataUrl: dataUrlResult
      };

      try {
        const updatedList = [newMaterial, ...materials];
        saveMaterials(updatedList);
        setSuccess(`Successfully verified and uploaded "${file.name}"!`);
      } catch (limitErr) {
        // Handle localStorage quota limits dynamically
        setError('Storage limit reached! Base64 index cannot fit inside offline storage. Try uploading smaller text or PDF files.');
      }
    };

    reader.onerror = () => {
      setError('An error occurred while reading the file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Download Trigger
  const handleDownloadFile = (material: StudyMaterial) => {
    try {
      const link = document.createElement('a');
      link.href = material.dataUrl;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Download failed dynamically.');
    }
  };

  // Delete Trigger
  const handleDeleteFile = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const executeDeleteFile = () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    const filtered = materials.filter(m => m.id !== id);
    saveMaterials(filtered);
    setSuccess(`Successfully deleted document "${name}"`);
    if (previewFile?.id === id) {
      setPreviewFile(null);
    }
    setDeleteTarget(null);
  };

  // Rename/Update Document metadata
  const handleRenameFile = (id: string, currentName: string) => {
    setRenameTarget({ id, name: currentName });
    setNewResourceName(currentName);
  };

  const executeRenameFile = () => {
    if (!renameTarget) return;
    const { id } = renameTarget;
    const trimmed = newResourceName.trim();
    if (!trimmed) {
      setError("Document name cannot be empty.");
      return;
    }
    const updated = materials.map(m => {
      if (m.id === id) {
        return { ...m, name: trimmed };
      }
      return m;
    });
    saveMaterials(updated);
    setSuccess(`Successfully updated resource name to "${trimmed}"`);
    if (previewFile?.id === id) {
      setPreviewFile({ ...previewFile, name: trimmed });
    }
    setRenameTarget(null);
  };

  // Preview Logic
  const handlePreviewFile = (material: StudyMaterial) => {
    setPreviewFile(material);
    if (material.type === 'txt') {
      try {
        // Extract raw text from the base64 data-url
        const base64Content = material.dataUrl.split(',')[1];
        const textDecoded = atob(base64Content);
        setPreviewContent(textDecoded);
      } catch {
        setPreviewContent('Unable to decode preview file contents.');
      }
    } else {
      setPreviewContent('');
    }
  };

  // Filtered lists
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || material.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div id="study-resources-view" className="space-y-lg animate-fade-in text-on-surface">
      
      {/* View Header Info Banner */}
      <section id="resources-banner" className="mb-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-xs font-semibold">Shared E-Resources Hub</h2>
            <p className="font-body-lg text-body-lg text-secondary">
              Upload, preview, and download secure academic PDF guidebooks and TXT study notes materials.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] uppercase bg-primary-fixed text-primary px-3 py-1 rounded-md font-bold font-mono tracking-wider">
              {currentUser?.name || 'User'} Console ({currentUser?.role === 'admin' ? 'Admin Access' : 'Student Access'})
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Side Column: Drag/Drop Upload Form and Filter Controllers */}
        <div className="lg:col-span-5 space-y-lg">
          
          {currentUser?.role === 'admin' ? (
            /* Real Unified Drag & Drop Upload Zone */
            <div className="glass-card p-6 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Upload New Study Material</h3>
              </div>

              <form 
                id="file-upload-form"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-primary bg-primary/5 scale-[1.01]' 
                    : 'border-outline-variant/80 hover:border-primary hover:bg-surface-container-low/40'
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  id="resource-input-box"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden" 
                />
                
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20 shadow-sm">
                  <UploadCloud className="w-8 h-8 text-primary animate-pulse" />
                </div>

                <h4 className="font-bold text-on-surface text-sm mb-1">
                  Drag &amp; Drop study file here
                </h4>
                <p className="text-xs text-secondary mb-3">
                  or click here to browse locally
                </p>

                <div className="flex justify-center flex-wrap gap-2 pt-2">
                  <span className="text-[10px] bg-red-50 text-red-800 border-red-200/50 border px-2 py-0.5 rounded font-bold font-mono">
                    PDF (Max 5MB)
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200/50 border px-2 py-0.5 rounded font-bold font-mono">
                    TXT (Max 5MB)
                  </span>
                </div>
              </form>

              {/* Error notifications */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-200"
                  >
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                    <p className="font-semibold">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-start gap-2 border border-emerald-200"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
                    <p className="font-semibold">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload guidelines statement */}
              <div className="mt-4 text-[11px] text-secondary/90 leading-tight bg-surface-container-low p-3 rounded-lg flex items-start gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>
                  <strong>Academic Integrity</strong>: Study guidebooks uploaded directly stream dynamic preview and download frames immediately on both Admin &amp; Student UI modules automatically.
                </span>
              </div>
            </div>
          ) : (
            /* Student Lock Message */
            <div className="glass-card p-6 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3.5 border border-amber-200 shadow-sm animate-fade-in">
                <ShieldAlert className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>
              <h3 className="font-bold text-on-surface text-sm leading-snug">Upload Restricted</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed max-w-sm mx-auto">
                Only library administrators or instructors are permitted to add study documents to the E-Resources repository. Students have <strong className="text-primary font-bold">view-only privileges</strong>.
              </p>
              
              {/* Error notifications */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-200 text-left"
                  >
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                    <p className="font-semibold text-xs">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Side Search & Filter Card */}
          <div className="glass-card p-6 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              <Filter className="w-4 w-4 text-primary" />
              <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider">Search &amp; Filters</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-sans">Search by Material Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. UPSC Syllabus, Code of conduct..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary/80 transition-all font-medium"
                />
              </div>
            </div>

            {/* Format category selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">File Format Filter</label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'pdf', 'txt'] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    type="button"
                    onClick={() => setTypeFilter(filterOpt)}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-all border cursor-pointer ${
                      typeFilter === filterOpt
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface border-outline-variant/40'
                    }`}
                  >
                    {filterOpt === 'all' ? 'All Files' : filterOpt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Column: Shared Resources Files Directory list */}
        <div className="lg:col-span-7 space-y-md">
          
          {/* Resources directory grid container */}
          <div className="glass-card p-6 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col h-full min-h-[450px]">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">Materials Repository</h3>
                <p className="text-xs text-secondary mt-0.5">Showing {filteredMaterials.length} file records</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono font-bold tracking-wider text-secondary uppercase">Library Cloud Synchronized</span>
              </div>
            </div>

            {/* List with staggered display */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              <AnimatePresence mode="popLayout">
                {filteredMaterials.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-16 text-secondary space-y-3 bg-surface-container-low/20 rounded-xl border border-dashed border-outline-variant"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">No documents match the filters</p>
                      <p className="text-xs text-secondary/80 mt-1 max-w-xs mx-auto">
                        Configure search keywords or drag &amp; drop a PDF/txt file on the left to start streaming real textbooks.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  filteredMaterials.map((material, idx) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="p-3.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/40 hover:bg-surface-container hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3 relative group"
                    >
                      {/* Left icon and Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                          material.type === 'pdf' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {material.type === 'pdf' ? (
                            <FileCode className="w-5 h-5 font-bold" />
                          ) : (
                            <FileText className="w-5 h-5 font-bold" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors pr-2">
                            {material.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-secondary mt-1 font-mono flex-wrap">
                            <span className="font-bold">{material.size}</span>
                            <span className="text-outline-variant">•</span>
                            <span className="bg-surface-container px-1.5 py-0.2 rounded capitalize">{material.type}</span>
                            <span className="text-outline-variant">•</span>
                            <span className="truncate">By: {material.uploadedBy} ({material.role === 'admin' ? 'Admin' : 'Student'})</span>
                            <span className="text-outline-variant">•</span>
                            <span className="shrink-0 flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-outline" /> {material.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Side Action Group Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Preview button (fully working for text) */}
                        <button
                          onClick={() => handlePreviewFile(material)}
                          title="Preview Document Inline"
                          className="p-2 rounded-lg bg-white/80 hover:bg-white text-secondary hover:text-primary transition-all border border-outline-variant/40 hover:scale-[1.05] cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit / Rename option */}
                        {(currentUser?.role === 'admin' || currentUser?.name === material.uploadedBy) && (
                          <button
                            onClick={() => handleRenameFile(material.id, material.name)}
                            title="Rename or Update Document Properties"
                            className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-all border border-amber-200/50 hover:scale-[1.05] cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Download core button */}
                        <button
                          onClick={() => handleDownloadFile(material)}
                          title="Download Original File"
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/20 hover:scale-[1.05] cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete code trigger - Admin can delete any file, Student can delete their own */}
                        {(currentUser?.role === 'admin' || currentUser?.name === material.uploadedBy) && (
                          <button
                            onClick={() => handleDeleteFile(material.id, material.name)}
                            title="Delete Study Document"
                            className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-all border border-red-200/50 hover:scale-[1.05] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Inline Preview Modal Dialog Overlay Container */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[85vh]"
            >
              
              {/* Preview dialog Title Header */}
              <div className="bg-primary px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-white/10 shrink-0">
                    <FileText className="w-5 h-5 text-emerald-300" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{previewFile.name}</h3>
                    <p className="text-[10px] text-white/70 font-mono mt-0.5">
                      Viewer Clearance: {previewFile.uploadedBy} • {previewFile.size} • {previewFile.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Document Main viewport */}
              <div className="p-6 overflow-y-auto flex-1 bg-surface-container-lowest text-on-surface">
                {previewFile.type === 'txt' ? (
                  <div className="bg-surface-container-low/40 border border-outline-variant/60 rounded-xl p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text max-h-[50vh] overflow-y-auto shadow-inner text-left">
                    {previewContent}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm">
                      <FileCode className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-on-surface">Academic PDF Document Preview</h4>
                      <p className="text-xs text-secondary max-w-md mx-auto">
                        This PDF resource is fully available for studying, offline reading, and viewing reference notes.
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        handleDownloadFile(previewFile);
                        setPreviewFile(null);
                      }}
                      className="bg-primary text-white hover:bg-primary/95 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download &amp; Open Document PDF</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer controls */}
              <div className="bg-surface-container-low px-6 py-4 boundary-t border-outline-variant flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] uppercase font-mono font-bold text-secondary">
                  🔒 Krishna Virtual Study System Secure Frame
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 px-4 rounded-xl hover:bg-surface-container text-xs font-bold border border-outline-variant text-secondary transition-colors cursor-pointer"
                  >
                    Close Preview Frame
                  </button>
                  
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="p-2 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  You are about to permanently delete <strong>{deleteTarget.name}</strong>. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl hover:bg-surface-container text-xs font-bold border border-outline-variant text-secondary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDeleteFile}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
                >
                  Yes, Delete File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Rename Confirmation Modal Dialog */}
      <AnimatePresence>
        {renameTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant overflow-hidden p-6 text-left space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-on-surface text-lg">Rename E-Resource File</h3>
                  <p className="text-secondary text-xs">Update your shared study material's name properties</p>
                </div>
              </div>
              <div className="space-y-1.5 pb-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Document Name</label>
                <input
                  type="text"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                  placeholder="Enter file name"
                  className="w-full text-xs font-semibold text-on-surface px-3 py-2 bg-surface-container/30 hover:bg-surface-container/50 focus:bg-white border border-outline-variant/50 focus:border-primary focus:outline-none rounded-xl transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRenameTarget(null)}
                  className="flex-1 py-2.5 rounded-xl hover:bg-surface-container text-xs font-bold border border-outline-variant text-secondary transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={executeRenameFile}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.01] cursor-pointer text-center"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
