import React from 'react';
import ReactDOM from 'react-dom';

export function Modal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-lg transform border-gray-100 rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
                 <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="px-6 py-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
