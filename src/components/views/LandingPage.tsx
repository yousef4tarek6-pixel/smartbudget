import React from 'react';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  PieChart,
  Target,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Award,
} from 'lucide-react';
import { Button } from '../common/Button';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-gray-950 light:bg-slate-50 text-gray-100 light:text-gray-900 selection:bg-indigo-500 selection:text-white">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 glass-nav px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Smart<span className="text-indigo-400 light:text-indigo-600">Budget</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onExploreDemo} className="hidden sm:inline-flex">
            Explore Demo
          </Button>
          <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-28 max-w-7xl mx-auto text-center bg-grid-pattern">
        {/* Glowing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Personal Wealth Platform</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          Take Control of <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Your Money.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 light:text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          SmartBudget makes tracking, planning, and understanding your personal finances beautifully simple with intuitive analytics, automated insights, and custom goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={onGetStarted} className="w-full sm:w-auto shadow-xl shadow-indigo-600/30">
            Start Free Trial
          </Button>
          <Button variant="secondary" size="lg" icon={<Zap className="w-5 h-5 text-amber-400" />} onClick={onExploreDemo} className="w-full sm:w-auto">
            Launch Interactive Demo
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/80 shadow-2xl overflow-hidden group">
          <div className="relative rounded-2xl overflow-hidden bg-gray-950 p-6 sm:p-8 text-left">
            {/* Header Mockup */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
              <div>
                <span className="text-xs text-gray-500 font-semibold">GOOD EVENING 👋</span>
                <h3 className="text-2xl font-bold text-white">Alex Morgan</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  +14.2% Growth
                </span>
              </div>
            </div>

            {/* Mock Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-xs text-gray-400">Total Balance</span>
                <p className="text-xl font-bold text-white mt-1">AED 12,450</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-xs text-gray-400">Monthly Income</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">AED 18,000</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-xs text-gray-400">Monthly Expenses</span>
                <p className="text-xl font-bold text-rose-400 mt-1">AED 5,550</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-xs text-gray-400">Total Savings</span>
                <p className="text-xl font-bold text-indigo-400 mt-1">AED 34,750</p>
              </div>
            </div>

            {/* Fake Chart bars */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4">
              {[45, 65, 30, 85, 40, 95, 60, 75, 50, 90, 70, 80].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-300 group-hover/bar:bg-emerald-400"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] text-gray-600">M{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Engineered for Effortless Wealth Management
          </h2>
          <p className="text-gray-400 light:text-gray-600 max-w-2xl mx-auto">
            Everything you need to master your money in one unified, startup-grade dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
              title: 'Expense & Income Tracking',
              desc: 'Seamlessly categorize every dollar, search history, and track payment channels.',
            },
            {
              icon: <PieChart className="w-6 h-6 text-indigo-400" />,
              title: 'Smart Category Budgets',
              desc: 'Set custom spending caps with real-time warning threshold notifications.',
            },
            {
              icon: <Target className="w-6 h-6 text-amber-400" />,
              title: 'Interactive Savings Goals',
              desc: 'Visualize progress towards big milestones with goal calculators and celebration triggers.',
            },
            {
              icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
              title: 'Recurring Subscriptions',
              desc: 'Track upcoming bills, monthly subscriptions, and never miss due dates.',
            },
            {
              icon: <Zap className="w-6 h-6 text-blue-400" />,
              title: 'Data-Driven Insights',
              desc: 'Automated AI financial advice calculated from your spending behaviors.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
              title: 'Privacy & Data Ownership',
              desc: 'Full local data persistence, export to CSV/JSON, and total control.',
            },
          ].map((feat, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl glass-card-hover flex flex-col gap-4">
              <div className="p-3 bg-gray-800/80 light:bg-gray-100 rounded-2xl w-fit">{feat.icon}</div>
              <h3 className="text-xl font-bold">{feat.title}</h3>
              <p className="text-sm text-gray-400 light:text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-gray-900/40 light:bg-white border-y border-gray-800 light:border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">3 Simple Steps</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">How SmartBudget Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { num: '01', title: 'Add Your Income', desc: 'Input your monthly salary or freelance earnings in your preferred currency.' },
              { num: '02', title: 'Track Spending', desc: 'Log expenses in seconds with smart auto-categorization and payment tags.' },
              { num: '03', title: 'Reach Your Goals', desc: 'Watch your savings compound and receive alerts before exceeding budget limits.' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-2xl mb-2">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-gray-400 light:text-gray-600 max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 glass-card rounded-3xl">
            <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AED 45M+
            </p>
            <p className="text-sm text-gray-400 mt-2 font-medium">Money Tracked & Managed</p>
          </div>
          <div className="p-8 glass-card rounded-3xl">
            <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              120,000+
            </p>
            <p className="text-sm text-gray-400 mt-2 font-medium">Expenses Categorized</p>
          </div>
          <div className="p-8 glass-card rounded-3xl">
            <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              99.8%
            </p>
            <p className="text-sm text-gray-400 mt-2 font-medium">User Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-gray-900/30 light:bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Testimonials (Demo Preview)</span>
            <h2 className="text-3xl font-extrabold mt-2">Loved by Financial Enthusiasts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "SmartBudget transformed how I view my monthly income. The budget alerts saved me over AED 2,000 last month alone!",
                author: "Sarah Al-Maktoum",
                role: "Product Manager, Dubai",
              },
              {
                quote: "The cleanest financial interface I've used. Having dark mode, multi-currency support, and offline privacy is unbeatable.",
                author: "David Chen",
                role: "Senior Software Engineer",
              },
              {
                quote: "The savings goal progress tracker made saving for my Japan trip fun and addictive. Highly recommended!",
                author: "Elena Rostova",
                role: "Design Lead",
              },
            ].map((t, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <p className="text-sm text-gray-300 light:text-gray-700 italic">"{t.quote}"</p>
                <div className="mt-6 pt-4 border-t border-gray-800 light:border-gray-200">
                  <p className="font-bold text-xs text-white light:text-gray-900">{t.author}</p>
                  <p className="text-[10px] text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="px-6 py-24 max-w-5xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-emerald-900/40 border border-indigo-500/30 glass-card">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">Start Building Better Money Habits Today.</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            No complex setup required. Create your account in 30 seconds or jump straight into the full demo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={onGetStarted}>
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" onClick={onExploreDemo}>
              Explore Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800 light:border-gray-200 max-w-7xl mx-auto text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-gray-300 light:text-gray-700">SmartBudget</span>
          <span>© 2026 SmartBudget Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};
