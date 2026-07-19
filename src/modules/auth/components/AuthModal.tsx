'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuthModalStore } from '@/app/api/hooks';

export default function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModalStore();

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={closeModal}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative flex z-10 w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='hidden md:block md:w-1/2'>
          <img className='w-full h-full object-cover rounded-l-2xl' src="/assets/images/authImage.jpg" alt="" />
        </div>
        <div className='w-full md:w-1/2 p-8 flex flex-col justify-between min-h-[450px]'>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-brand-gray hover:text-brand-primary-brown hover:bg-brand-primary-brown/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className='flex flex-col justify-center flex-1'>
            {view === 'login' ? <LoginModal /> : <RegisterModal />}
          </div>
          <p className="text-center text-xs text-brand-gray font-sans mt-4">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-brand-primary-brown cursor-pointer underline font-medium hover:text-brand-light-brown transition-colors"
            >
              {view === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
