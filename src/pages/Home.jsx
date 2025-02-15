import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="gradient-text">Stefan Lenta</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            A passionate software engineer specializing in AI development, custom business solutions, 
            and web development. Recent BSc Computing graduate with a drive for creating innovative 
            digital solutions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn btn-primary">
              Get in Touch
              <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
            </Link>
            <Link to="/services" className="btn btn-outline">
              View My Services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">What I Do</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leveraging cutting-edge technology to build solutions that make a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Development',
              description: 'Creating intelligent solutions using machine learning and AI technologies.',
              icon: '🤖'
            },
            {
              title: 'Custom Software',
              description: 'Building tailored applications to solve unique business challenges.',
              icon: '💻'
            },
            {
              title: 'Web Development',
              description: 'Crafting modern, responsive websites with cutting-edge technologies.',
              icon: '🌐'
            }
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card group hover:scale-105"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-primary-light rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life. Whether it's AI integration, 
            custom software, or web development, I'm here to help.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Let's Talk
            <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
