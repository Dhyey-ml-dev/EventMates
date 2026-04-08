import Event from '../models/Event.js';
import mongoose from 'mongoose';

const sampleEvents = [
  {
    title: 'College Tech Fest Volunteer',
    description: 'Help organize and manage the annual tech fest at Ahmedabad University. Responsibilities include registration, crowd management, and event coordination. Great opportunity to network with tech enthusiasts and gain event management experience.',
    location: 'Ahmedabad University, Ahmedabad',
    eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    eventEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    roles: [
      {
        title: 'Registration Desk',
        count: 5,
        description: 'Manage event registration and check-in',
      },
      {
        title: 'Crowd Management',
        count: 8,
        description: 'Guide visitors and manage crowd flow',
      },
      {
        title: 'Technical Support',
        count: 3,
        description: 'Provide technical assistance at demo stalls',
      },
    ],
    pay: {
      amount: 800,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 50,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    category: 'Technology',
    requirements: ['Good communication skills', 'Punctuality', 'Professionalism'],
    isVerified: true,
    isFeatured: true,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Wedding Event Assistant',
    description: 'Assist in organizing a grand wedding celebration on SG Highway. Help with setup, guest management, coordination between vendors, and ensuring smooth execution. Perfect for those interested in event coordination.',
    location: 'SG Highway, Ahmedabad',
    eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    startTime: '02:00 PM',
    endTime: '11:00 PM',
    roles: [
      {
        title: 'Guest Coordinator',
        count: 6,
        description: 'Greet guests and manage seating',
      },
      {
        title: 'Setup Crew',
        count: 4,
        description: 'Handle decoration and setup',
      },
      {
        title: 'Vendor Coordinator',
        count: 2,
        description: 'Manage vendor logistics',
      },
    ],
    pay: {
      amount: 1200,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 40,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
    category: 'Events',
    requirements: ['Professional attire', 'Excellent interpersonal skills', 'Attention to detail'],
    isVerified: true,
    isFeatured: true,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Music Concert Crew',
    description: 'Join the crew for an exciting music concert at GMDC Ground featuring renowned artists. Work with sound crew, ushers, and stage management. High-energy event with amazing experience!',
    location: 'GMDC Ground, Ahmedabad',
    eventDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    startTime: '04:00 PM',
    endTime: '11:00 PM',
    roles: [
      {
        title: 'Usher',
        count: 10,
        description: 'Guide audience to their seats',
      },
      {
        title: 'Sound Technician',
        count: 3,
        description: 'Assist with sound and audio equipment',
      },
      {
        title: 'Stage Crew',
        count: 5,
        description: 'Help with stage setup and props',
      },
    ],
    pay: {
      amount: 1500,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 60,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&q=80',
    category: 'Entertainment',
    requirements: ['Physical fitness', 'Enthusiasm', 'Team player mindset'],
    isVerified: true,
    isFeatured: false,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Startup Expo Helper',
    description: 'Support the startup ecosystem at IIM Ahmedabad Expo. Help connect startups with investors, manage booth operations, and facilitate networking. Perfect for entrepreneurship enthusiasts!',
    location: 'IIM Ahmedabad, Ahmedabad',
    eventDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    roles: [
      {
        title: 'Booth Assistant',
        count: 8,
        description: 'Manage startup booths and demo areas',
      },
      {
        title: 'Registration Officer',
        count: 4,
        description: 'Handle visitor registration',
      },
      {
        title: 'Networking Facilitator',
        count: 3,
        description: 'Help connect startups and investors',
      },
    ],
    pay: {
      amount: 1000,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 45,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    category: 'Business',
    requirements: ['Business awareness', 'Communication skills', 'Professional demeanor'],
    isVerified: true,
    isFeatured: true,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Sports Event Volunteer',
    description: 'Be part of a major sports event at Narendra Modi Stadium. Help with crowd management, scoring operations, and spectator services. Exciting opportunity for sports enthusiasts!',
    location: 'Narendra Modi Stadium, Ahmedabad',
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    roles: [
      {
        title: 'Crowd Manager',
        count: 12,
        description: 'Manage crowd and ensure safety',
      },
      {
        title: 'Scorer',
        count: 4,
        description: 'Assist with scoring operations',
      },
      {
        title: 'First Aid Assistant',
        count: 2,
        description: 'Provide basic first aid support',
      },
    ],
    pay: {
      amount: 900,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 55,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    category: 'Sports',
    requirements: ['Physical fitness', 'Sports knowledge', 'Leadership qualities'],
    isVerified: true,
    isFeatured: false,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'NGO Fundraising Event',
    description: 'Support an NGO fundraising event at the Riverfront to help underprivileged communities. Help with donations, booth management, and event coordination. Make a difference while earning!',
    location: 'Riverfront, Ahmedabad',
    eventDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    startTime: '11:00 AM',
    endTime: '07:00 PM',
    roles: [
      {
        title: 'Donation Counter',
        count: 5,
        description: 'Handle donations and collections',
      },
      {
        title: 'Event Coordinator',
        count: 4,
        description: 'Coordinate various event activities',
      },
      {
        title: 'Volunteer Guide',
        count: 3,
        description: 'Guide visitors through the event',
      },
    ],
    pay: {
      amount: 700,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 35,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    category: 'Social Service',
    requirements: ['Compassion', 'Reliability', 'Honest character'],
    isVerified: true,
    isFeatured: false,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Food Festival Staff',
    description: 'Work at a premium food festival at Karnavati Club with renowned chefs and restaurants. Help manage food stalls, serve guests, and coordinate culinary events. Food lovers welcome!',
    location: 'Karnavati Club, Ahmedabad',
    eventDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    startTime: '03:00 PM',
    endTime: '10:00 PM',
    roles: [
      {
        title: 'Food Stall Manager',
        count: 6,
        description: 'Manage food stalls and inventory',
      },
      {
        title: 'Server',
        count: 8,
        description: 'Serve food and beverages',
      },
      {
        title: 'Event Coordinator',
        count: 2,
        description: 'Coordinate food events and tastings',
      },
    ],
    pay: {
      amount: 1100,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 48,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=800&q=80',
    category: 'Food & Beverage',
    requirements: ['Food safety knowledge', 'Friendly demeanor', 'Stamina'],
    isVerified: true,
    isFeatured: true,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
  {
    title: 'Corporate Seminar Assistant',
    description: 'Support a large corporate seminar at Prahladnagar with industry leaders and professionals. Help with registration, logistics, and participant coordination. Build valuable corporate connections!',
    location: 'Prahladnagar, Ahmedabad',
    eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    startTime: '08:30 AM',
    endTime: '05:30 PM',
    roles: [
      {
        title: 'Registration Desk',
        count: 4,
        description: 'Handle participant registration',
      },
      {
        title: 'Logistics Support',
        count: 5,
        description: 'Assist with event logistics',
      },
      {
        title: 'Tech Support',
        count: 2,
        description: 'Provide AV and tech support',
      },
    ],
    pay: {
      amount: 1000,
      currency: 'INR',
      paymentType: 'fixed',
    },
    maxApplicants: 42,
    status: 'published',
    eventImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    category: 'Corporate',
    requirements: ['Professional attitude', 'Technical aptitude', 'Discretion'],
    isVerified: true,
    isFeatured: false,
    isSample: true,
    createdByRole: 'admin',
    paymentStatus: 'free',
  },
];

// Function to seed events
export const seedSampleEvents = async () => {
  try {
    // Check if sample events already exist
    const existingCount = await Event.countDocuments({ isSample: true });
    
    if (existingCount > 0) {
      console.log(`✅ Sample events already exist (${existingCount} found). Skipping seed.`);
      return;
    }

    // Create admin user ID (placeholder - in real app, fetch actual admin user)
    const adminUserId = new mongoose.Types.ObjectId();

    // Update all sample events with admin user ID
    const eventsWithAdmin = sampleEvents.map((event) => ({
      ...event,
      organizerId: adminUserId,
    }));

    // Insert sample events
    await Event.insertMany(eventsWithAdmin);
    console.log(`✅ Successfully seeded ${sampleEvents.length} sample events!`);
  } catch (error) {
    console.error('❌ Error seeding sample events:', error.message);
  }
};

export default sampleEvents;
