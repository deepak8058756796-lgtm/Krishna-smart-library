import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, PlusCircle, Book, Archive, MapPin } from 'lucide-react';
import { InventoryBook } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: InventoryBook[];
  onAddBook: (book: Omit<InventoryBook, 'id'>) => void;
}

export default function InventoryModal({ isOpen, onClose, books, onAddBook }: InventoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for new book
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [rackLocation, setRackLocation] = useState('');
  const [error, setError] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !isbn.trim() || !rackLocation.trim()) {
      setError('Please fill in all the asterisked (*) fields');
      return;
    }

    onAddBook({
      title,
      author,
      isbn,
      category,
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
      rackLocation
    });

    // Reset
    setTitle('');
    setAuthor('');
    setIsbn('');
    setCategory('Computer Science');
    setTotalCopies(3);
    setRackLocation('');
    setError('');
    setIsAddingNew(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="inventory-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            id="inventory-modal-container"
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-fixed text-primary rounded-lg">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-primary">Library Book Catalog & Inventory</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-secondary hover:bg-surface-container-high transition-colors"
                id="close-inventory-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle state display */}
            <div className="border-b border-outline-variant bg-surface-container-lowest px-5 py-3 flex justify-between items-center">
              <p className="text-sm text-secondary font-medium">
                {isAddingNew ? 'Register a New Resource Title' : 'Browse & Search Assets Catalog'}
              </p>
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
              >
                {isAddingNew ? 'View Catalog Books' : 'Add New Book Title'}
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {!isAddingNew ? (
              /* Catalog browser Tab */
              <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Title, Author, ISBN, Category..."
                    className="w-full pl-9 pr-4 py-2 border border-outline-variant text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="text-center py-12 text-secondary">
                    <p className="text-sm">No books matching your query found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBooks.map((book) => (
                      <div key={book.id} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-primary uppercase tracking-wide">
                              {book.category}
                            </span>
                            <span className="text-[11px] font-mono text-secondary">
                              Code: {book.id}
                            </span>
                          </div>
                          <h4 className="font-semibold text-on-surface text-sm line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-secondary mb-3">by {book.author}</p>
                        </div>

                        <div className="pt-2 border-t border-outline-variant/50 flex items-center justify-between text-xs text-secondary">
                          <div className="flex items-center gap-1 font-mono">
                            <Archive className="w-3.5 h-3.5 text-secondary" />
                            <span>Available: {book.availableCopies} / {book.totalCopies}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{book.rackLocation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Add New Book Form Tab */
              <form onSubmit={handleSubmitNew} className="flex-1 overflow-y-auto p-5 space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Introduction to Electrodynamics"
                      className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. David J. Griffiths"
                      className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      ISBN Code *
                    </label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="e.g. 978-0138053260"
                      className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Subject Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full py-2 px-3 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Academic Journals">Academic Journals / Research</option>
                    </select>
                  </div>

                  {/* Total Copies */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Total Stock Copies *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={totalCopies || ''}
                      onChange={(e) => setTotalCopies(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Rack Location */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                      Physical Rack Location *
                    </label>
                    <input
                      type="text"
                      value={rackLocation}
                      onChange={(e) => setRackLocation(e.target.value)}
                      placeholder="e.g. Rack B-3 or Column C-A"
                      className="w-full px-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-2 text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-container rounded-lg transition-colors shadow-md"
                  >
                    Register New Resource
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
