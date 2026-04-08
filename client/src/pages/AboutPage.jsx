import React from 'react';
import { motion } from 'framer-motion';
import { ImageSection } from '../components/ImageSection.jsx';

export const AboutPage = () => {
  const features = [
    {
      icon: '✓',
      color: 'primary',
      title: 'Easy Matching',
      description: 'Find the perfect volunteers for your events',
    },
    {
      icon: '🔒',
      color: 'secondary',
      title: 'Secure & Verified',
      description: 'All users are verified for your safety',
    },
    {
      icon: '💰',
      color: 'green',
      title: 'Fair Pricing',
      description: 'Transparent and competitive compensation',
    },
    {
      icon: '📱',
      color: 'blue',
      title: 'Easy to Use',
      description: 'Simple and intuitive platform',
    },
  ];

  const stats = [
    { number: '5000+', label: 'Students' },
    { number: '500+', label: 'Organizations' },
    { number: '1000+', label: 'Events' },
    { number: '₹50L+', label: 'Earned' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-r from-primary to-secondary">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80)',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto text-center flex flex-col items-center justify-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            About EventMates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mt-4"
          >
            Bridging the gap between opportunities and talent
          </motion.p>
        </div>
      </section>

      {/* Mission Section with Image */}
      <ImageSection
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
        imageAlt="Our mission - connecting students with opportunities"
        title="Our Mission"
        description="At EventMates, we believe every student deserves access to real-world experience and fair compensation. We're on a mission to eliminate middlemen, create direct connections between organizers and talented students, and build a marketplace where everyone wins."
        features={[
          {
            title: 'Direct Connection',
            description: 'Students and organizers connect directly without intermediaries'
          },
          {
            title: 'Fair Compensation',
            description: 'Transparent pricing ensures students earn what they deserve'
          },
          {
            title: 'Real Experience',
            description: 'Every volunteer gain genuine work experience and credentials'
          }
        ]}
      />

      {/* Vision Section */}
      <ImageSection
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
        imageAlt="Our vision for the future"
        title="Our Vision"
        description="We envision a world where every student can easily find meaningful work that aligns with their skills and interests, while earning competitive pay and building a portfolio of real-world experience. A platform that empowers both students and event organizers to succeed together."
        reverse={true}
        features={[
          {
            title: 'Empowerment',
            description: 'Students and organizers are empowered to reach their goals'
          },
          {
            title: 'Transparency',
            description: 'Clear communication and transparent processes at every step'
          },
          {
            title: 'Growth',
            description: 'Everyone grows professionally through meaningful connections'
          }
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            By The Numbers
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5000+', label: 'Active Students' },
              { number: '500+', label: 'Organizations' },
              { number: '1000+', label: 'Events Hosted' },
              { number: '₹50L+', label: 'Payments Made' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EventMates Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why EventMates?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Fast & Easy',
                description: 'Quick signup and seamless application process'
              },
              {
                icon: '💎',
                title: 'Quality Opportunities',
                description: 'Carefully curated events from trusted organizers'
              },
              {
                icon: '🔒',
                title: 'Safe & Secure',
                description: 'Verified users and secure payment processing'
              },
              {
                icon: '📈',
                title: 'Career Growth',
                description: 'Build real experience for your professional portfolio'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            Our Team
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12"
          >
            Built by a passionate team of students, developers, and entrepreneurs who believe in creating fair opportunities for everyone. We're committed to building the best volunteer marketplace in India.
          </motion.p>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 opacity-90"
          >
            Have questions or feedback? We'd love to hear from you!
          </motion.p>
          <div className="space-y-2 text-lg">
            <p>📧 kathansolanki970@gmail.com</p>
            <p>📱 +91 98245 92525</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
