import React, { useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
} from '@/features/auth/store/authSlice';
import toast from 'react-hot-toast';

const Privacy = lazy(() => import('@/app/pages/Privacy'));
const Terms = lazy(() => import('@/app/pages/Terms'));

const AuthForm = ({ isLogin, toggleMode }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const accentColor = useSelector(state => state.settings.accentColor);
  const isLoading = status === 'loading';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [activePage, setActivePage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginRequest({ email: email.trim(), password }));
    } else {
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error('Password must contain at least one uppercase letter');
        return;
      }
      if (!/[0-9]/.test(password)) {
        toast.error('Password must contain at least one number');
        return;
      }
      dispatch(registerRequest({ username: username.trim(), email: email.trim(), password }));
    }
  };

  const handleForgotPassword = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Enter your email first');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error('Enter a valid email');
      return;
    }

    dispatch(forgotPasswordRequest({ email: cleanEmail }));
  };

  if (activePage) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <button
          onClick={() => setActivePage(null)}
          className="flex items-center gap-2 mb-6 text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs uppercase tracking-widest">Back to form</span>
        </button>
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] border border-white/10 p-6">
          <Suspense fallback={<Loader2 className="animate-spin text-white/40" size={24} />}>
            {activePage === 'privacy' ? <Privacy isInline /> : <Terms isInline />}
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-10 text-center">
        <h2 className="font-black text-white text-3xl italic tracking-tighter">
          {isLogin ? 'WELCOME BACK' : 'CREATE ESSENCE'}
        </h2>
        <p className="mt-2 text-white/40 text-xs uppercase tracking-[0.3em]">
          {isLogin ? 'Access your private sanctuary' : 'Start your journey into focus'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group relative"
            >
              <UserIcon className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="group relative">
          <Mail className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
            required
          />
        </div>

        <div className="space-y-3">
          <div className="group relative">
            <Lock className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="flex items-center gap-1.5 disabled:opacity-40 font-bold text-[10px] text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors"
              >
                <KeyRound size={12} /> Forgot Password?
              </button>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: accentColor }}
          className="group relative flex justify-center items-center gap-3 disabled:opacity-50 shadow-2xl py-5 rounded-2xl overflow-hidden font-black text-white text-xs uppercase tracking-[0.25em]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <>
              {isLogin ? 'Enter Sanctuary' : 'Initialize Journey'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        {!isLogin && (
          <div className="text-center mt-2">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
              By registering, you agree to our{' '}
              <button
                type="button"
                onClick={() => setActivePage('terms')}
                className="underline hover:text-white/60 transition-colors"
              >
                Terms
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setActivePage('privacy')}
                className="underline hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        )}
      </form>

      <div className="mt-10 pt-8 border-white/5 border-t text-center">
        <p className="text-white/30 text-xs">
          {isLogin ? "Don't have an account yet?" : "Already part of the sanctuary?"}
        </p>
        <button
          onClick={toggleMode}
          style={{ color: accentColor }}
          className="hover:brightness-125 mt-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all"
        >
          {isLogin ? 'Create new account' : 'Log into your profile'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;