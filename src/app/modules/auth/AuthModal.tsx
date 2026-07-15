'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

type AuthView = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);

  // Reset to default view whenever the modal opens
  useEffect(() => {
    if (isOpen) setView(defaultView);
  }, [isOpen, defaultView]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative flex z-10 w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl  animate-in fade-in zoom-in-95 duration-200 flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=' w-1/2'>
          <img className='w-full h-full object-cover rounded-l-2xl' src="/assets/images/authImage.jpg" alt="" />
        </div>
        <div className='w-1/2  p-8 flex flex-col justify-between'>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-brand-gray hover:text-brand-primary-brown hover:bg-brand-primary-brown/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className='flex flex-col justify-center flex-1'>
            {/* Form switcher */}
            {view === 'login' ? (
              <LoginForm
                onSwitch={() => setView('signup')}
                onSuccess={onClose}
              />
            ) : (
              <SignupForm
                onSwitch={() => setView('login')}
                onSuccess={onClose}
              />
            )}
          </div>
          <p className="text-center text-xs text-brand-gray font-sans">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-brand-primary-brown cursor-pointer underline font-medium hover:text-brand-light-brown transition-colors"
            >
              Sign up
            </button>
          </p>


        </div>
      </div>
    </div>
  );
}
