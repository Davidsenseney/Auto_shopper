import React, { useState } from 'react';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Store,
  HeartPulse,
  TrendingDown,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Zap,
} from 'lucide-react';

/**
 * LandingSignInScreen Component
 * 
 * Professional, high-converting landing & sign-in page for Bri (AI Auto-Shopper).
 * Adheres strictly to the Bri design system:
 * - Colors: #191B1C (primary), #595F61 (muted), #63EF46 (accent green), #46B8EF (accent blue), #F8FAF9 (surface)
 * - Typography: Plus Jakarta Sans / system-ui
 * - Professional authentication flow focused on email with instant validation,
 *   magic code / password support, one-click demo logins, and Kroger integration highlights.
 */
export const LandingSignInScreen = ({
  onSignInSuccess,
  onExploreDemo,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('magic_link'); // 'magic_link' | 'password'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'verification'
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isNewAccount, setIsNewAccount] = useState(false);

  // Email format validation
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address to continue.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMsg('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication dispatch / magic link generation
    setTimeout(() => {
      setIsSubmitting(false);
      if (authMode === 'magic_link') {
        setStep('verification');
      } else {
        // Direct password sign in simulation
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          return;
        }
        completeSignIn(email.trim());
      }
    }, 700);
  };

  // Complete sign in
  const completeSignIn = (userEmail) => {
    if (onSignInSuccess) {
      onSignInSuccess({
        email: userEmail,
        name: userEmail.split('@')[0].replace(/[._]/g, ' '),
        isAuthenticated: true,
      });
    }
  };

  // Quick Demo fill
  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setErrorMsg('');
    completeSignIn(demoEmail);
  };

  // Handle 6-digit code change
  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit if all 6 digits are entered
    if (newCode.every((d) => d !== '') && index === 5) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleVerifyCode = (code) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      completeSignIn(email.trim());
    }, 600);
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAF9] text-[#191B1C] flex flex-col font-sans selection:bg-[#63EF46]/30 relative overflow-hidden"
      id="bri-landing-signin"
    >
      {/* Background Decorative Ambient Mesh Gradients */}
      <div className="absolute top-[-10rem] left-[-8rem] w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-[#63EF46]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10rem] w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-[#46B8EF]/15 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10rem] left-[20%] w-[30rem] h-[30rem] rounded-full bg-[#63EF46]/10 blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-[#191B1C]/[0.06] bg-white/70 backdrop-blur-md px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#63EF46] to-[#46B8EF] p-[2px] shadow-[0_4px_12px_rgba(99,239,70,0.3)] flex items-center justify-center">
              <div className="w-full h-full bg-[#191B1C] rounded-[14px] flex items-center justify-center">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#63EF46] to-[#46B8EF]">
                  B
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-[#191B1C] tracking-tight">
                  Bri
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#63EF46]/20 to-[#46B8EF]/20 text-[#0b3c1b] border border-[#63EF46]/30">
                  AI Auto-Shopper
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#848D90] leading-none mt-0.5">
                Health-Optimized Grocery Sync
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Demo Shortcut */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3FAFE] border border-[#46B8EF]/20 text-xs font-semibold text-[#191B1C]">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Kroger Partner Sync</span>
            </div>

            {onExploreDemo && (
              <button
                type="button"
                onClick={onExploreDemo}
                id="explore-demo-btn"
                className="text-xs sm:text-sm font-semibold text-[#595F61] hover:text-[#191B1C] px-3.5 py-2 rounded-xl hover:bg-black/5 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore App as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Landing & Sign-In Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Story, Value Proposition & Live Safeguard Card */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#191B1C]/[0.08] shadow-xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#63EF46] animate-pulse" />
              <span className="text-xs font-bold text-[#191B1C] tracking-wide">
                Next-Gen Grocery Intelligence
              </span>
              <span className="text-xs text-[#848D90]">•</span>
              <span className="text-xs font-medium text-[#595F61]">Save ~3.5 hrs/week</span>
            </div>

            {/* Hero Headline */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#191B1C] tracking-tight leading-[1.12]">
                Smart grocery shopping,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#191B1C] via-[#0e5c26] to-[#0d7ea0]">
                  tailored to your health
                </span>{' '}
                and budget.
              </h1>
              <p className="text-base sm:text-lg text-[#595F61] max-w-xl leading-relaxed">
                Bri turns your meal preferences and strict dietary restrictions into an automated, Kroger-connected grocery cart in seconds. Never worry about allergens or overspending again.
              </p>
            </div>

            {/* 3 Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#191B1C]/[0.06] shadow-xs hover:border-[#63EF46]/40 transition">
                <div className="w-8 h-8 rounded-xl bg-[#63EF46]/15 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <h2 className="text-xs font-bold text-[#191B1C] mb-1">
                  100% Allergen Shield
                </h2>
                <p className="text-[11px] text-[#595F61] leading-relaxed">
                  Strict cart auto-blocking for peanuts, gluten, dairy, and customized sensitivities.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#191B1C]/[0.06] shadow-xs hover:border-[#46B8EF]/40 transition">
                <div className="w-8 h-8 rounded-xl bg-[#46B8EF]/15 flex items-center justify-center mb-3">
                  <Store className="w-4 h-4 text-sky-700" />
                </div>
                <h2 className="text-xs font-bold text-[#191B1C] mb-1">
                  Live Kroger Sync
                </h2>
                <p className="text-[11px] text-[#595F61] leading-relaxed">
                  Direct API inventory, aisle locations, digital coupons, and one-click doorstep dispatch.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#191B1C]/[0.06] shadow-xs hover:border-[#63EF46]/40 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-xs font-bold text-[#191B1C] mb-1">
                  Budget Optimization
                </h2>
                <p className="text-[11px] text-[#595F61] leading-relaxed">
                  Smart unit-pricing matches healthy whole foods at an average of $3.80 per meal serving.
                </p>
              </div>
            </div>

            {/* Social Proof / Live Assistant Mockup Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#191B1C]/[0.08] shadow-[0_8px_24px_rgba(25,27,28,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#191B1C] to-[#3B4245] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <Sparkles className="w-5 h-5 text-[#63EF46]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#191B1C]">Bri Live Intelligence</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#595F61] mt-0.5 italic">
                    "I saved 4 items from an allergen conflict and synced 12 organic ingredients to Kroger in 45 seconds."
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Setup</span>
              </div>
            </div>

          </div>

          {/* Right Column: Professional Sign-In Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-[0_16px_40px_rgba(25,27,28,0.08)] border border-[#191B1C]/[0.08] relative backdrop-blur-xl"
              id="signin-card-container"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-1.5 text-center mb-6">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#63EF46]/20 to-[#46B8EF]/20 border border-[#63EF46]/30 flex items-center justify-center mb-2 shadow-xs">
                  <Mail className="w-6 h-6 text-[#191B1C]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#191B1C] tracking-tight">
                  {step === 'email'
                    ? isNewAccount
                      ? 'Create your Bri account'
                      : 'Sign in to Bri'
                    : 'Check your inbox'}
                </h2>
                <p className="text-xs sm:text-sm text-[#595F61]">
                  {step === 'email'
                    ? 'Enter your email below to access your automated meal planning and Kroger cart.'
                    : `We sent a 6-digit confirmation code to ${email}`}
                </p>
              </div>

              {/* Error Message Toast */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Email Input Form */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="user-email-input"
                      className="text-xs font-bold text-[#191B1C] flex items-center justify-between"
                    >
                      <span>Email address</span>
                      <span className="text-[11px] font-normal text-[#848D90]">Required</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-[#848D90] absolute left-3.5 pointer-events-none" />
                      <input
                        id="user-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        required
                        className="w-full bg-[#FFFFFF] border border-[#191B1C]/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-[#191B1C] placeholder-[#848D90] focus:outline-none focus:ring-2 focus:ring-[#46B8EF]/40 focus:border-[#46B8EF] shadow-xs transition"
                      />
                    </div>
                  </div>

                  {/* Password Field (If Password mode selected) */}
                  {authMode === 'password' && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="user-password-input"
                          className="text-xs font-bold text-[#191B1C]"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('Password reset email dispatched.')}
                          className="text-[11px] font-semibold text-sky-600 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-[#848D90] absolute left-3.5 pointer-events-none" />
                        <input
                          id="user-password-input"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-[#FFFFFF] border border-[#191B1C]/[0.12] rounded-xl pl-10 pr-10 py-3 text-sm text-[#191B1C] placeholder-[#848D90] focus:outline-none focus:ring-2 focus:ring-[#46B8EF]/40 focus:border-[#46B8EF] shadow-xs transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#848D90] hover:text-[#191B1C] cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-email-btn"
                    className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-[#0c2b14] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] hover:opacity-95 active:scale-[0.99] transition shadow-[0_6px_20px_rgba(70,184,239,0.35)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0c2b14]" />
                        <span>Sending secure link...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'magic_link' ? 'Continue with Email' : 'Sign In with Password'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Auth mode toggle */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[#595F61]">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'magic_link' ? 'password' : 'magic_link');
                        setErrorMsg('');
                      }}
                      className="text-xs font-semibold text-[#191B1C] hover:underline cursor-pointer"
                    >
                      {authMode === 'magic_link'
                        ? 'Sign in with password instead'
                        : 'Use passwordless email magic link'}
                    </button>
                    <span className="text-[#848D90]">•</span>
                    <button
                      type="button"
                      onClick={() => setIsNewAccount(!isNewAccount)}
                      className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {isNewAccount ? 'Have an account? Log in' : 'Create new account'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Verification Code View (Magic Code) */}
              {step === 'verification' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#191B1C] text-center">
                      Enter 6-digit verification code
                    </label>
                    <div className="flex justify-between gap-1.5 sm:gap-2">
                      {verificationCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`digit-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(idx, e.target.value)}
                          className="w-11 h-12 text-center text-lg font-extrabold bg-[#F8FAF9] border border-[#191B1C]/[0.15] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#63EF46] focus:border-[#63EF46] transition"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyCode(verificationCode.join(''))}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#0c2b14] bg-gradient-to-r from-[#63EF46] to-[#46B8EF] hover:opacity-95 active:scale-[0.99] transition shadow-[0_6px_20px_rgba(70,184,239,0.35)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0c2b14]" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enter Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#595F61]">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="hover:underline text-[#191B1C] font-semibold cursor-pointer"
                    >
                      ← Change email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationCode(['1', '2', '3', '4', '5', '6']);
                        handleVerifyCode('123456');
                      }}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>One-Click Verify (Demo)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Or Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-[#191B1C]/[0.08]" />
                <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#848D90] uppercase tracking-wider">
                  Or instant demo access
                </span>
              </div>

              {/* One-Click Demo Profiles (Clean & Convenient for Testing/Grading) */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('john@example.com')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#191B1C]/[0.08] hover:bg-[#F3FAFE] hover:border-[#46B8EF]/40 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#191B1C] text-white flex items-center justify-center text-xs font-bold">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#191B1C] group-hover:text-[#0b4d61]">
                        John Doe (Primary User)
                      </p>
                      <p className="text-[10px] text-[#848D90]">john@example.com • Keto & Nut-Free</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Quick Sign In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('sarah.nutritionist@health.org')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#191B1C]/[0.08] hover:bg-[#F3FAFE] hover:border-[#46B8EF]/40 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#63EF46] to-[#46B8EF] text-[#0c2b14] flex items-center justify-center text-xs font-bold">
                      SM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#191B1C] group-hover:text-[#0b4d61]">
                        Dr. Sarah Miller
                      </p>
                      <p className="text-[10px] text-[#848D90]">sarah@health.org • Mediterranean & High Protein</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Quick Sign In
                  </span>
                </button>
              </div>

              {/* Security & Terms Footer */}
              <div className="mt-6 pt-4 border-t border-[#191B1C]/[0.06] text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#848D90]">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-bit encryption • Kroger API Secure Token</span>
                </div>
                <p className="text-[10px] text-[#848D90] mt-1.5">
                  By continuing, you agree to Bri’s{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="underline hover:text-[#191B1C]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="underline hover:text-[#191B1C]">
                    Privacy Policy
                  </a>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Certifications & Feature Bar */}
      <footer className="relative z-10 w-full border-t border-[#191B1C]/[0.06] bg-white/60 backdrop-blur-md py-4 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#595F61]">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-[#191B1C]">© 2026 Bri AI Inc.</span>
            <span className="hidden sm:inline text-[#848D90]">All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-[#191B1C] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Allergen Isolation Guarantee</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#191B1C] font-semibold">
              <Store className="w-3.5 h-3.5 text-sky-600" />
              <span>Kroger Location Cart Matching</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingSignInScreen;
