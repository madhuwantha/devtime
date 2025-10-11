import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  icon?: string;
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  icon,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal Header */}
        {(title || icon || description) && (
          <div className="mb-6">
            {icon && (
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                {icon}
              </div>
            )}
            {title && (
              <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-slate-400 text-center">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
