import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateClient } from 'aws-amplify/data';
import {
  EnvelopeIcon,
  MapPinIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const client = generateClient();

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: 'Email',
    content: 'your.email@example.com',
    link: 'mailto:your.email@example.com'
  },
  {
    icon: MapPinIcon,
    title: 'Location',
    content: 'London, United Kingdom',
    link: 'https://maps.google.com/?q=London,UK'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Phone',
    content: '+44 123 456 7890',
    link: 'tel:+441234567890'
  }
];

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    const formData = new FormData(e.target);
    
    try {
      await client.models.Contact.create({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        status: 'NEW',
        createdAt: new Date().toISOString()
      });

      setFormStatus({
        type: 'success',
        message: 'Thank you for your message! I will get back to you soon.'
      });
      e.target.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        type: 'error',
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Have a project in mind or want to discuss potential opportunities? 
          I'd love to hear from you. Let's create something amazing together.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-primary-light rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              {formStatus.message && (
                <div
                  className={`p-4 rounded-lg ${
                    formStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-primary-light rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 text-gray-300 hover:text-secondary transition-colors duration-300"
                >
                  <info.icon className="h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-white">{info.title}</h3>
                    <p>{info.content}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-primary-light rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Office Hours</h2>
            <div className="space-y-4 text-gray-300">
              <p>Monday - Friday</p>
              <p>9:00 AM - 6:00 PM (GMT)</p>
              <p className="text-gray-400">
                I'll respond to your message within 24 hours during business hours.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
