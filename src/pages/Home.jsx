import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck, ArrowRight, Phone, Video, Bot, Pill,
  FileText, Clock, Wallet, Heart, ChevronDown, Star,
  Users, Activity, Zap, Globe, CheckCircle, Menu, X
} from "lucide-react";

/* ── Animated counter hook ───────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Stats section with intersection observer ─────── */
function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const villages    = useCounter(173, 1800, visible);
  const patients    = useCounter(2400, 2000, visible);
  const doctors     = useCounter(48, 1500, visible);
  const satisfaction = useCounter(98, 1600, visible);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { value: villages,     suffix: "+", label: "Villages Served",  icon: Globe,    color: "from-teal-500 to-emerald-400" },
        { value: patients,     suffix: "+", label: "Patients Helped",  icon: Users,    color: "from-blue-500 to-cyan-400" },
        { value: doctors,      suffix: "+", label: "Doctors Online",   icon: Activity, color: "from-violet-500 to-purple-400" },
        { value: satisfaction, suffix: "%", label: "Satisfaction",     icon: Star,     color: "from-amber-500 to-orange-400" },
      ].map(({ value, suffix, label, icon: Icon, color }) => (
        <div key={label} className="rc-card text-center card-lift group cursor-default">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white mb-4 mx-auto`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {value.toLocaleString()}{suffix}
          </p>
          <p className="mt-1 text-sm text-slate-500 font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Feature card ────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, gradient, delay }) {
  return (
    <div
      className="rc-card card-lift group cursor-default animate-fade-up"
      style={{ animationDelay: delay }}
    >
      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = user
    ? user.role === "DOCTOR"   ? "/doctor"
    : user.role === "PHARMACY" ? "/pharmacy"
    : user.role === "ADMIN"    ? "/admin"
    : "/patient"
    : "/";

  const handleLogout = () => { logout(); navigate("/login"); };

  const features = [
    { icon: Video,    title: "Video Consultation",  desc: "Face-to-face with a doctor on your phone. No travel needed.",              gradient: "from-teal-500 to-emerald-400",   delay: "0.1s" },
    { icon: Bot,      title: "AI Symptom Checker",  desc: "Describe how you feel and get instant, AI-powered health guidance.",       gradient: "from-blue-500 to-cyan-400",      delay: "0.2s" },
    { icon: Pill,     title: "Medicine Finder",     desc: "Check stock at nearby pharmacies and reserve before you travel.",          gradient: "from-violet-500 to-purple-400",  delay: "0.3s" },
    { icon: FileText, title: "Health Records",       desc: "All your prescriptions and reports — online and accessible offline.",     gradient: "from-amber-500 to-orange-400",   delay: "0.4s" },
  ];

  const benefits = [
    { icon: Clock,  title: "Save Time",     desc: "Skip long journeys. Get a doctor's consultation in minutes.",     color: "#00897b" },
    { icon: Wallet, title: "Save Money",    desc: "Cut travel costs. Affordable care for every rural family.",       color: "#1565c0" },
    { icon: Heart,  title: "Better Health", desc: "Faster access to doctors, medicines, and trusted health info.",   color: "#c62828" },
  ];

  const testimonials = [
    { name: "Priya Sharma", village: "Mohanpur Village", text: "I got a prescription for my child without traveling 40 km to the city. Life changing.", stars: 5 },
    { name: "Ramesh Kumar", village: "Bhavnagar District", text: "The AI symptom checker helped me understand my condition before I even saw the doctor.", stars: 5 },
    { name: "Sunita Devi",  village: "Nagpur Rural", text: "Medicine reservation saved me an empty trip. Pharmacy had everything ready when I arrived.", stars: 5 },
  ];

  return (
    <div className="rc-page overflow-x-hidden">

      {/* ── HEADER ────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "rc-header" : "bg-transparent"}`}>
        {/* Floating pill navbar — sits 12px below the browser top */}
        <div className="rc-container pt-3">
          <div className={`flex items-center justify-between gap-4 px-4 py-3 transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80"
              : "bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-white/60"
          }`}>

          {/* Logo */}
          <Link to={dashboardPath} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-[#00897b] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Rural<span className="text-[#00897b]">Care+</span>
            </span>
          </Link>

          {/* Desktop nav — hidden below lg so it doesn't crowd at md breakpoint */}
          <nav className="hidden lg:flex items-center gap-1">
            {!user ? (
              <>
                <a href="#features" className="btn-ghost text-sm">Features</a>
                <a href="#why-us"   className="btn-ghost text-sm">Why Us</a>
                <Link to="/login"   className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link to={dashboardPath} className="btn-ghost text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary text-sm">Logout</button>
              </>
            )}
          </nav>

          {/* Hamburger — visible below lg */}
          <button
            className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>{/* end floating pill */}
        </div>{/* end rc-container */}

        {/* Mobile / tablet dropdown menu */}
        {menuOpen && (
          <div className="lg:hidden rc-container pb-3 animate-fade-up">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg px-4 py-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <a href="#features" className="btn-ghost text-sm justify-center" onClick={() => setMenuOpen(false)}>Features</a>
                  <a href="#why-us"   className="btn-ghost text-sm justify-center" onClick={() => setMenuOpen(false)}>Why Us</a>
                  <Link to="/login"   className="btn-ghost text-sm justify-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm justify-center" onClick={() => setMenuOpen(false)}>
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to={dashboardPath} className="btn-ghost text-sm justify-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-primary text-sm justify-center">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-teal-100/40 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-100/30 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="rc-container relative grid lg:grid-cols-2 gap-14 items-center">
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 badge badge-teal mb-6 animate-fade-up">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted healthcare for villages
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 animate-fade-up delay-100">
              Healthcare for{" "}
              <span className="text-gradient">every village</span>{" "}
              in India
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg animate-fade-up delay-200">
              Connect with doctors, use AI to check symptoms, find medicines nearby, 
              and keep your health records — all in one simple app built for rural families.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link to="/register" className="btn-primary text-base px-7 py-3.5">
                Start for free <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="tel:104" className="btn-secondary text-base px-7 py-3.5">
                <Phone className="h-5 w-5" /> Helpline 104
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6 animate-fade-up delay-400">
              <div className="flex -space-x-2">
                {["bg-teal-400","bg-blue-400","bg-violet-400","bg-amber-400"].map((c,i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {["P","D","R","S"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 text-amber-400 fill-current" />)}
                </div>
                <p className="text-xs text-slate-500">Trusted by 2,400+ patients</p>
              </div>
            </div>
          </div>

          {/* Right image/card */}
          <div className="relative animate-float">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img src="/imgg1.jpg" alt="RuralCare App" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 glass-card rounded-2xl shadow-lg px-4 py-3 animate-slide-in delay-200">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Appointment</p>
                  <p className="text-sm font-bold text-slate-900">Confirmed ✓</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass-card rounded-2xl shadow-lg px-4 py-3 animate-slide-in delay-300">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">AI Analysis</p>
                  <p className="text-sm font-bold text-slate-900">Ready in 2s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-x rotate-90">
          <ChevronDown className="h-6 w-6 text-[#00897b] opacity-60" />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="rc-container">
          <StatsSection />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features" className="py-24 bg-[#f0faf8]">
        <div className="rc-container">
          <div className="text-center mb-14">
            <div className="section-label mb-3">What we offer</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Everything you need for{" "}
              <span className="text-gradient">good health</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Simple, powerful tools that work even on slow internet — designed for real village life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────── */}
      <section id="why-us" className="py-24 bg-white">
        <div className="rc-container">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Why families choose us</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Built for India's villages
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="rc-card card-lift text-center group cursor-default">
                <div className="h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                     style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Feature checklist */}
          <div className="rc-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="section-label mb-4">Why we're different</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  Healthcare that works <span className="text-gradient">offline too</span>
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Poor connectivity shouldn't mean poor healthcare. RuralCare+ stores 
                  your records locally so you can access them anytime.
                </p>
                <Link to="/register" className="btn-primary">
                  Join free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  "Works offline — no internet required for records",
                  "AI symptom checker in simple language",
                  "Video calls with doctors from anywhere",
                  "Medicine reservations before you travel",
                  "Secure health records, always with you",
                  "Available in Hindi, Punjabi & English",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#e0f5f1] flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-[#00897b]" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-24 bg-[#f0faf8]">
        <div className="rc-container">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Real stories</div>
            <h2 className="text-4xl font-black text-slate-900">
              What our patients say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, village, text, stars }, i) => (
              <div key={name} className={`rc-card card-lift animate-fade-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {Array(stars).fill(0).map((_,si) => (
                    <Star key={si} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{village}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="rc-container">
          <div className="relative overflow-hidden rounded-3xl gradient-animated text-white p-10 md:p-16 text-center shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 badge bg-white/20 text-white mb-6">
                <ShieldCheck className="h-3.5 w-3.5" /> Free for all patients
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Start your digital health journey today
              </h2>
              <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join 2,400+ families across 173 villages who already use RuralCare+ for better, faster healthcare.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register" className="bg-white text-[#00897b] font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-teal-50 transition-colors shadow-lg">
                  Register Now <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="tel:104" className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-white/10 transition-colors">
                  <Phone className="h-5 w-5" /> Call 104
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="rc-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-black text-white">
                Rural<span className="text-[#4db6ac]">Care+</span>
              </span>
            </div>
            <p className="text-sm text-center">Smart Healthcare Solution for Rural Communities</p>
            <p className="text-sm">© 2026 RuralCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
