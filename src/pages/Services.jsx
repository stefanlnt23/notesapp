import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BeakerIcon,
  CodeBracketIcon,
  CpuChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    title: 'AI Development',
    description: 'Harness the power of artificial intelligence to automate processes, gain insights, and create intelligent solutions.',
    icon: CpuChipIcon,
    features: [
      'Machine Learning Models',
      'Natural Language Processing',
      'Computer Vision Solutions',
      'AI Integration Services'
    ]
  },
  {
    title: 'Custom Software Development',
    description: 'Tailored software solutions designed to address your specific business needs and challenges.',
    icon: CodeBracketIcon,
    features: [
      'Business Process Automation',
      'Database Design & Management',
      'API Development & Integration',
      'Legacy System Modernization'
    ]
  },
  {
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications built with cutting-edge technologies.',
    icon: CloudIcon,
    features: [
      'Full-Stack Development',
      'E-commerce Solutions',
      'Content Management Systems',
      'Progressive Web Apps'
    ]
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    icon: DevicePhoneMobileIcon,
    features: [
      'iOS & Android Development',
      'Cross-Platform Solutions',
      'App Store Optimization',
      'Mobile UI/UX Design'
    ]
  },
  {
    title: 'Technical Consulting',
    description: 'Expert guidance on technology strategy, architecture, and implementation.',
    icon: LightBulbIcon,
    features: [
      'Technology Stack Selection',
      'System Architecture Design',
      'Performance Optimization',
      'Security Assessment'
    ]
  },
  {
    title: 'R&D Solutions',
    description: 'Innovative research and development services to keep you ahead of the competition.',
    icon: BeakerIcon,
    features: [
      'Proof of Concept Development',
      'Technology Prototyping',
      'Innovation Workshops',
      'Feasibility Studies'
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-bold mb-6">My Services</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Comprehensive technology solutions tailored to your needs. From AI development 
          to custom software solutions, I deliver innovation that drives results.
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={itemVariants}
            className="card group"
          >
            <service.icon className="h-12 w-12 text-secondary mb-6" />
            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
            <p className="text-gray-400 mb-6">{service.description}</p>
            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Let's discuss how I can help bring your ideas to life with the perfect technical solution.
        </p>
        <Link to="/contact" className="btn btn-primary">
          Contact Me
        </Link>
      </motion.div>
    </div>
  );
}
