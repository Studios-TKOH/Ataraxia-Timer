import React, { useState, lazy, Suspense, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

  const idPrefix = useId();

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
      <motion.div 
        key="inline-page"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col mx-auto w-full max-w-lg h-full max-h-[75vh]"
      >
        <button
          type="button"
          onClick={() => setActivePage(null)}
          className="group flex items-center gap-2 mb-6 text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          aria-label="Back to form"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex-1 overflow-y-auto rounded-3xl bg-white/[0.03] border border-white/5 p-6 sm:p-8 custom-scrollbar relative shadow-inner">
          <Suspense fallback={
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader2 className="animate-spin text-white/20" size={32} />
            </div>
          }>
            {activePage === 'privacy' ? <Privacy isInline /> : <Terms isInline />}
          </Suspense>
        </div>
      </motion.div>
    );
  }

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 }
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      key={isLogin ? 'login' : 'register'}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mx-auto w-full max-w-lg flex flex-col"
    >
      <motion.div variants={fieldVariants} className="mb-8 sm:mb-10 text-center">
        <h2 className="font-display font-black text-white text-2xl sm:text-3xl italic tracking-tighter">
          {isLogin ? 'WELCOME BACK' : 'CREATE ESSENCE'}
        </h2>
        <p className="mt-2 text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.25em]">
          {isLogin ? 'Access your private sanctuary' : 'Start your journey into focus'}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AnimatePresence mode="popLayout">
          {!isLogin && (
            <motion.div
              key="username-field"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <label htmlFor={`${idPrefix}-username`} className="sr-only">Username</label>
              <UserIcon className="top-1/2 left-5 sm:left-6 absolute text-white/20 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={20} />
              <input
                id={`${idPrefix}-username`}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 focus:bg-white/[0.08] p-4 sm:p-5 pl-14 sm:pl-[4.5rem] border border-white/10 focus:border-[var(--color-accent)] rounded-2xl outline-none w-full text-white text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-focus"
                required
                autoComplete="username"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fieldVariants} className="group relative">
          <label htmlFor={`${idPrefix}-email`} className="sr-only">Email Address</label>
          <Mail className="top-1/2 left-5 sm:left-6 absolute text-white/20 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={20} />
          <input
            id={`${idPrefix}-email`}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="bg-white/5 focus:bg-white/[0.08] p-4 sm:p-5 pl-14 sm:pl-[4.5rem] border border-white/10 focus:border-[var(--color-accent)] rounded-2xl outline-none w-full text-white text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-focus"
            required
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-3">
          <div className="group relative">
            <label htmlFor={`${idPrefix}-password`} className="sr-only">Password</label>
            <Lock className="top-1/2 left-5 sm:left-6 absolute text-white/20 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={20} />
            <input
              id={`${idPrefix}-password`}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-white/5 focus:bg-white/[0.08] p-4 sm:p-5 pl-14 sm:pl-[4.5rem] pr-12 sm:pr-14 border border-white/10 focus:border-[var(--color-accent)] rounded-2xl outline-none w-full text-white text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-focus"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 focus:outline-none focus-visible:text-[var(--color-accent)] transition-colors disabled:opacity-50 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-end overflow-hidden"
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 py-1 disabled:opacity-40 font-bold text-[10px] sm:text-xs text-white/40 hover:text-white/80 uppercase tracking-widest transition-colors focus:outline-none focus-visible:text-[var(--color-accent)] rounded"
                  aria-label="Forgot your password?"
                >
                  <KeyRound size={12} /> Forgot Password?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          variants={fieldVariants}
          whileHover={isLoading ? {} : { scale: 1.02, filter: "brightness(1.1)" }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: accentColor }}
          className="group relative flex justify-center items-center gap-3 mt-2 shadow-[0_8px_24px_-10px_rgba(20,184,166,0.4)] py-4 sm:py-5 rounded-2xl overflow-hidden font-black text-white text-[11px] sm:text-xs uppercase tracking-[0.25em] transition-all disabled:opacity-50 disabled:cursor-wait focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
        >
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex items-center gap-2"
            >
              <Loader2 className="animate-spin" size={18} />
              <span>Processing...</span>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              {isLogin ? 'Enter Sanctuary' : 'Initialize Journey'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.div>
          )}
        </motion.button>
        
        <motion.div variants={fieldVariants} className="text-center mt-2 px-4">
          <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.1em] sm:tracking-[0.15em] leading-relaxed">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => setActivePage('terms')}
              className="underline underline-offset-4 font-bold text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:text-accent rounded-sm"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => setActivePage('privacy')}
              className="underline underline-offset-4 font-bold text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:text-accent rounded-sm"
            >
              Privacy Policy
            </button>
          </p>
        </motion.div>
      </form>

      <motion.div variants={fieldVariants} className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-white/10 border-t text-center">
        <p className="text-white/40 text-[11px] sm:text-xs">
          {isLogin ? "Don't have an account yet?" : "Already part of the sanctuary?"}
        </p>
        <button
          onClick={toggleMode}
          disabled={isLoading}
          style={{ color: accentColor }}
          className="mt-3 px-4 py-2 font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95 rounded-xl disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {isLogin ? 'Create new account' : 'Log into your profile'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthForm;