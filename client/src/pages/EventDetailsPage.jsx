import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from '../store/eventSlice.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getDefaultImage, optimizeImageUrl } from '../utils/imageUtils.js';
import { applicationAPI } from '../api/endpoints.js';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Users, Building, 
  IndianRupee, CheckCircle, Share2, AlertCircle, Bookmark, Star
} from 'lucide-react';

export const EventDetailsPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedEvent, isLoading } = useSelector((state) => state.event);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    dispatch(getEventById(eventId));
  }, [dispatch, eventId]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Authentication required to submit applications.');
      navigate('/login');
      return;
    }
    if (user?.role !== 'student') {
      toast.error('Only candidate accounts are authorized to apply.');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySubmit = async () => {
    setApplying(true);
    try {
      const response = await applicationAPI.applyToEvent(eventId, { applicationMessage });
      if (response.data?.success) {
        toast.success('Application successfully transmitted.');
        setHasApplied(true);
        setShowApplyModal(false);
        setApplicationMessage('');
      } else {
        toast.error(response.data?.message || 'Application transmission failed.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to process application.';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Listing Unavailable</h2>
        <p className="text-slate-500 font-light text-center max-w-md">This opportunity may have been retracted, successfully filled, or does not exist.</p>
        <button onClick={() => navigate('/events')} className="mt-4 flex items-center gap-2 bg-white border border-slate-200 px-6 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Return to Directory
        </button>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const imageSrc = selectedEvent.eventImage
    ? optimizeImageUrl(selectedEvent.eventImage, 1200, 85)
    : getDefaultImage(selectedEvent.category || 'event');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Banner Component */}
      <div className="relative w-full h-[50vh] min-h-[350px] bg-slate-900 overflow-hidden">
        <img
          src={imageSrc}
          alt={selectedEvent.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-50' : 'opacity-0'}`}
        />
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* Global Toolbar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex gap-2">
            {selectedEvent.isFeatured && (
              <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                <Star className="w-3.5 h-3.5" /> Featured
              </span>
            )}
            {selectedEvent.category && (
              <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                <Bookmark className="w-3.5 h-3.5" /> {selectedEvent.category}
              </span>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              {selectedEvent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300 font-light text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {selectedEvent.location}
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                {selectedEvent.organizerId?.companyName || `${selectedEvent.organizerId?.firstName} ${selectedEvent.organizerId?.lastName}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission / About */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Scope of Engagement</h2>
              <div className="prose prose-slate max-w-none text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                {selectedEvent.description}
              </div>
            </motion.div>

            {/* Operational Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Operational Schedule</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Commencement', value: formatDate(selectedEvent.eventDate), icon: Calendar },
                  { label: 'Conclusion', value: formatDate(selectedEvent.eventEndDate || selectedEvent.eventDate), icon: Calendar },
                  { label: 'Start Time', value: selectedEvent.startTime || 'TBA', icon: Clock },
                  { label: 'End Time', value: selectedEvent.endTime || 'TBA', icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <item.icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="font-medium text-slate-900 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Roles Matrix */}
            {selectedEvent.roles && selectedEvent.roles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Available Positions</h2>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {selectedEvent.roles.reduce((acc, r) => acc + (r.count || 0), 0)} Total Openings
                    </span>
                </div>
                
                <div className="space-y-4">
                  {selectedEvent.roles.map((role, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="md:w-1/4">
                        <h4 className="font-bold text-slate-900">{role.title}</h4>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-2">Vacancy: {role.count}</p>
                      </div>
                      <div className="md:w-3/4">
                         {role.description ? (
                           <p className="text-slate-600 text-sm font-light leading-relaxed">{role.description}</p>
                         ) : (
                           <p className="text-slate-400 text-sm font-light italic">No detailed description provided by organizer.</p>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Qualifications */}
            {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Requirements & Qualifications</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvent.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-light leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50 sticky top-28"
            >
              {/* Compensation */}
              <div className="text-center mb-6 pb-6 border-b border-slate-100">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Authorized Compensation</p>
                <div className="flex items-center justify-center gap-1">
                   <IndianRupee className="w-6 h-6 text-indigo-600 stroke-[3]" />
                   <p className="text-4xl font-bold text-slate-900 tracking-tight">
                     {selectedEvent.pay?.amount?.toLocaleString('en-IN') || 0}
                   </p>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  {selectedEvent.pay?.paymentType === 'hourly' ? 'Rate per hour' : 'Fixed project rate'}
                </p>
              </div>

              {/* Status Metrics */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                     <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-light">Capacity</span>
                    <span className="font-semibold text-slate-900">
                      {selectedEvent.applicants?.length || 0} / {selectedEvent.maxApplicants}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div 
                     className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(100, ((selectedEvent.applicants?.length || 0) / (selectedEvent.maxApplicants || 1)) * 100)}%`}}
                   />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                   <span className={`px-2 py-1 rounded font-bold uppercase tracking-wider ${
                    selectedEvent.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>

              {/* CTA */}
              {hasApplied ? (
                <div className="w-full p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                  <div className="flex justify-center mb-2"><CheckCircle className="w-6 h-6 text-indigo-600" /></div>
                  <p className="text-indigo-900 font-bold text-sm">Application Sent</p>
                  <p className="text-indigo-600/80 text-xs mt-1 font-light">Subject to organizer review</p>
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  disabled={
                    selectedEvent.status !== 'published' ||
                    (selectedEvent.applicants?.length >= selectedEvent.maxApplicants)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-lg font-medium text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {selectedEvent.status !== 'published'
                    ? 'Submission Closed'
                    : selectedEvent.applicants?.length >= selectedEvent.maxApplicants
                      ? 'Requisition Filled'
                      : 'Submit Application'}
                </button>
              )}

              {!isAuthenticated && (
                <p className="text-center text-xs text-slate-500 mt-4 font-light">
                  Require an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Authenticate here</Link>
                </p>
              )}
            </motion.div>

            {/* Organizer Profile Summary */}
            {selectedEvent.organizerId && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Contracting Party</p>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {selectedEvent.organizerId.companyName || `${selectedEvent.organizerId.firstName} ${selectedEvent.organizerId.lastName}`}
                    </h4>
                    <p className="text-slate-500 text-xs font-light mt-1">Verified Organizer</p>
                    {/* Placeholder for standard corporate details */}
                    <a href={`mailto:${selectedEvent.organizerId.email}`} className="text-indigo-600 text-xs mt-2 inline-block font-medium hover:underline">Contact Department</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Application Protocol</h2>
                <p className="text-slate-500 text-sm font-light mt-1 max-w-[250px] truncate">{selectedEvent.title}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Close dialog"
              >
                <AlertCircle className="w-5 h-5 text-slate-400 transform rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-600">Authorized Pay</span>
                 <span className="font-bold text-slate-900 flex items-center">
                   <IndianRupee className="w-3.5 h-3.5 stroke-[3] mr-0.5" />
                   {selectedEvent.pay?.amount?.toLocaleString('en-IN')}
                 </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Candidate Statement (Optional)</label>
                <textarea
                  rows="4"
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Detail your professional qualifications for this specific engagement..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySubmit}
                  disabled={applying}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                  {applying ? 'Processing...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
