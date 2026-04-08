import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../store/eventSlice.js';
import { motion } from 'framer-motion';
import { EventCard } from '../components/EventCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import {
  ArrowRight, Sparkles, Building2, Music, Users, Briefcase,
  CheckCircle2, Search, ArrowUpRight, ShieldCheck, CreditCard, Cloud, BadgeCheck, MapPin
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, isLoading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getAllEvents({ status: 'published', limit: 6 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* ======================== HERO SECTION ======================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        {/* Abstract Background Elements instead of plain gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px]" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now live in Ahmedabad
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
            >
              Accelerate your career through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                real-world events
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
            >
              The premier platform connecting ambitious students with top-tier event organizers. Gain practical experience, build your network, and earn competitively.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate('/events')}
                className="group w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Opportunities
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="group w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowUpRight className="w-5 h-5 opacity-70" />
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10"
            >
              {[
                { number: '500+', label: 'Students Placed' },
                { number: '50+', label: 'Active Organizers' },
                { number: '₹1.5k', label: 'Avg. Daily Pay' },
                { number: '4.9/5', label: 'Platform Rating' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-white tracking-tight">{stat.number}</p>
                  <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================== WHAT IS EVENTMATES ======================== */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Image Composition */}
            <motion.div {...stagger(0)} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"
                  alt="Professional event setting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay Card */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Verified Experience</h4>
                    <p className="text-sm text-slate-500">Industry recognized</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </motion.div>

            {/* Right — Content */}
            <motion.div {...stagger(0.2)} className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                  Bridging the gap between theory and practice
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed font-light">
                  EventMates provides a secure infrastructure for students to find short-term engagements at high-profile events. We eliminate intermediaries, ensuring transparent compensation and direct communication with organizers.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: <Search className="w-6 h-6" />, title: 'Curated Opportunities', desc: 'Access exclusive roles in tech conferences, summits, and large-scale productions.' },
                  { icon: <CreditCard className="w-6 h-6" />, title: 'Transparent Compensation', desc: 'Clear payment terms upfront. Secure payouts processed directly through our integrated system.' },
                  { icon: <Briefcase className="w-6 h-6" />, title: 'Professional Growth', desc: 'Build a verifiable portfolio of hands-on experience before graduation.' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-1">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Learn more about our mission
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================== FEATURED EVENTS ======================== */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Current Opportunities
              </h2>
              <p className="text-slate-600 text-lg font-light">
                Discover active assignments across various industries. Apply directly to verified organizers.
              </p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Directory
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-900 font-medium text-lg">No active listings</p>
              <p className="text-slate-500 mt-2">New opportunities are posted regularly. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, i) => (
                <motion.div key={event._id} {...stagger(i * 0.1)}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================== CATEGORIES ======================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Sectors We Serve
            </h2>
            <p className="text-slate-600 font-light">
              We organize opportunities into focused domains, allowing you to develop specialized expertise aligned with your career goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Building2 className="w-8 h-8" />, title: 'Corporate & Business', desc: 'Conferences, symposiums, and networking.' },
              { icon: <Sparkles className="w-8 h-8" />, title: 'Technology', desc: 'Hackathons, tech fests, and product launches.' },
              { icon: <Music className="w-8 h-8" />, title: 'Entertainment', desc: 'Concerts, festivals, and large productions.' },
              { icon: <Users className="w-8 h-8" />, title: 'Social Impact', desc: 'Charity galas, community drives, and summits.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.1)}
                className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-indigo-600 mb-6">{item.icon}</div>
                <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== TRUST & SECURITY ======================== */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div {...stagger(0)} className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Enterprise-grade security and reliability
              </h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed">
                Trust is the foundation of our marketplace. We implement rigorous verification and standardized protocols to protect both organizers and volunteers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Verified Profiles' },
                  { icon: <CreditCard className="w-5 h-5" />, title: 'Secure Payouts' },
                  { icon: <BadgeCheck className="w-5 h-5" />, title: 'Quality Assurance' },
                  { icon: <Cloud className="w-5 h-5" />, title: 'Data Privacy' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-indigo-400">
                      {feature.icon}
                    </div>
                    <span className="font-medium text-slate-200">{feature.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...stagger(0.2)} className="relative">
              {/* Abstract visual representation of security/data */}
              <div className="aspect-square w-full max-w-md mx-auto grid grid-cols-2 gap-4">
                <div className="bg-indigo-600/20 rounded-2xl border border-indigo-500/30 backdrop-blur-md p-6 flex flex-col justify-end">
                  <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4" />
                  <div className="h-2 w-1/2 bg-indigo-500/50 rounded-full mb-2"></div>
                  <div className="h-2 w-3/4 bg-indigo-500/30 rounded-full"></div>
                </div>
                <div className="bg-purple-600/20 rounded-2xl border border-purple-500/30 backdrop-blur-md p-6 flex flex-col justify-end mt-12">
                  <BadgeCheck className="w-8 h-8 text-purple-400 mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-purple-500/50 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-purple-500/30 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-purple-500/20 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-blue-600/20 rounded-2xl border border-blue-500/30 backdrop-blur-md p-6 col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold mb-1">System Status</div>
                    <div className="text-blue-200 text-sm">All operational</div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1.5 h-6 bg-blue-400/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
