import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Megaphone, CheckSquare, AlertCircle } from 'lucide-react';
import { Announcement } from '../types';

interface AnnounceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnnounce: (announcement: Omit<Announcement, 'id' | 'time'>) => void;
}

export default function AnnounceModal({ isOpen, onClose, onAnnounce }: AnnounceModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Announcement title/context is required');
      return;
    }
    if (!content.trim()) {
      setError('Announcement description is required');
      return;
    }

    onAnnounce({
      title,
      content,
      important
    });

    setTitle('');
    setContent('');
    setImportant(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="announce-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            id="announce-modal-container"
            className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-2xl border border-outline-variant"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-fixed text-primary rounded-lg">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-primary">Broadcast Announcement</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-secondary hover:bg-surface-container-high transition-colors"
                id="close-announce-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                  Topic / Summary
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Server Maintenance or Exam Hours"
                  className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                  Message Details
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type the announcement announcement text details..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Important Checkbox */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="important-toggle"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline"
                />
                <label htmlFor="important-toggle" className="text-sm text-on-surface font-medium cursor-pointer">
                  Mark as High Priority (Highlight in dashboard)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-container rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  Broadcast Live
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
