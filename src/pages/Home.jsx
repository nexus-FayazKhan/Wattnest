import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { 
  ArrowRightIcon, 
  BoltIcon,
  ChartBarIcon,
  CpuChipIcon,
  CloudIcon,
  BuildingOffice2Icon,
  LightBulbIcon,
  WifiIcon,
  BeakerIcon,
  HomeIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';
import { AnimatedCards } from '../components/ui/animated-cards';
import { AnimatedTooltip } from '../components/ui/animated-tooltip';
import { MovingBorder } from '../components/ui/moving-border';
import { Sparkles } from '../components/ui/sparkles';
import ParticleRing from '../components/ui/particle-ring';
import LightBulb3D from '../components/ui/LightBulb3D';

// Navigation items

// Features data
const features = [
  {
    id: 1,
    title: 'Real-Time Energy Monitoring',
    description: 'Track energy consumption across your hotel in real-time with detailed analytics and insights.',
    icon: <BoltIcon className="h-6 w-6" />,
    color: 'bg-amber-100 text-orange-700 dark:bg-orange-900/30 dark:text-amber-300'
  },
  {
    id: 2,
    title: 'Smart AI Predictions',
    description: 'Utilize advanced AI algorithms to predict future usage patterns and optimize energy consumption.',
    icon: <CpuChipIcon className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-800 dark:bg-amber-900/30 dark:text-orange-300'
  },
  {
    id: 3,
    title: 'Booking Integration',
    description: 'Seamlessly integrate with your booking system to adjust energy usage based on occupancy.',
    icon: <BuildingOffice2Icon className="h-6 w-6" />,
    color: 'bg-amber-100/70 text-orange-700 dark:bg-orange-900/30 dark:text-amber-300'
  },
  {
    id: 4,
    title: 'Cloud Dashboard',
    description: 'Access your energy data from anywhere with our secure, cloud-based dashboard solution.',
    icon: <CloudIcon className="h-6 w-6" />,
    color: 'bg-orange-100/70 text-orange-800 dark:bg-amber-900/30 dark:text-orange-300'
  },
  {
    id: 5,
    title: 'Energy Insights',
    description: 'Gain valuable insights into energy usage patterns and discover optimization opportunities.',
    icon: <ChartBarIcon className="h-6 w-6" />,
    color: 'bg-gray-200 text-orange-700 dark:bg-gray-700/30 dark:text-orange-300'
  },
  {
    id: 6,
    title: 'Smart Room Controls',
    description: 'Control lighting, temperature, and appliances remotely to maximize energy efficiency.',
    icon: <HomeIcon className="h-6 w-6" />,
    color: 'bg-amber-100/50 text-orange-700 dark:bg-orange-800/30 dark:text-amber-300'
  }
];

// Team members data
const people = [
  {
    id: 1,
    name: "John Smith",
    designation: "CEO",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    designation: "CTO",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    designation: "Lead Engineer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 5,
    name: "David Wilson",
    designation: "Data Scientist",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

function Home() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Hero Section with Particle Ring Background */}
      <ParticleRing className="max-w-7xl mx-auto">
        <section className="pt-24 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left z-10"
              >
                <div className="inline-block px-3 py-1 mb-6 rounded-full bg-amber-100 dark:bg-orange-900/30 text-orange-700 dark:text-amber-300 text-sm font-medium">
                  Smart Hotel Energy Management
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-900 dark:text-gray-50 mb-6 leading-tight">
                  <Sparkles>
                    Intelligent Energy <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
                      Monitoring & Control
                    </span>
                  </Sparkles>
                </h1>
                <p className="text-lg md:text-xl text-orange-800 dark:text-gray-300 mb-8 max-w-xl">
                  Transform your hotel's energy management with our AI-powered solution. 
                  Reduce costs, improve efficiency, and contribute to a sustainable future.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <MovingBorder className="p-0.5">
                    <motion.a
                      href="/dashboard"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-orange-800 dark:bg-gray-800 text-amber-50 font-semibold rounded-[1.65rem] block"
                    >
                      <span className="flex items-center justify-center">
                        Get Started
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </span>
                    </motion.a>
                  </MovingBorder>
                  <motion.a
                    href="#features"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-orange-800 dark:text-amber-100 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-amber-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300"
                  >
                    Learn More
                  </motion.a>
                </div>
              </motion.div>

              {/* Energy Visualization */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative h-[500px] lg:h-[700px] w-full"
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600 dark:border-amber-400"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[90%] h-[90%] relative rounded-2xl overflow-hidden">
                      <LightBulb3D className="w-full h-full" />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </ParticleRing>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-orange-900 dark:text-gray-50"
            >
              Powerful Features for <span className="text-orange-600 dark:text-amber-400">Smart Energy Management</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-orange-800 dark:text-gray-300"
            >
              Our comprehensive platform provides all the tools you need to efficiently manage and optimize your hotel's energy consumption
            </motion.p>
          </div>

          <AnimatedCards items={features} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500/5 to-amber-500/5 dark:from-orange-900/10 dark:to-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <p className="text-4xl font-bold text-orange-600 dark:text-amber-400 mb-2">30%</p>
              <p className="text-orange-800 dark:text-gray-300">Average Energy Savings</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <p className="text-4xl font-bold text-amber-600 dark:text-orange-400 mb-2">100+</p>
              <p className="text-orange-800 dark:text-gray-300">Hotels Worldwide</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <p className="text-4xl font-bold text-orange-500 dark:text-amber-300 mb-2">24/7</p>
              <p className="text-orange-800 dark:text-gray-300">Monitoring & Support</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <p className="text-4xl font-bold text-amber-500 dark:text-orange-300 mb-2">5min</p>
              <p className="text-orange-800 dark:text-gray-300">Setup Time</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <ParticleRing className="p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to transform your hotel's energy management?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join the growing network of smart hotels that are saving energy, reducing costs, and contributing to a sustainable future.
              </p>
              <MovingBorder className="p-0.5 mx-auto w-fit">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-orange-900 dark:bg-gray-800 text-white font-semibold rounded-[1.65rem] block"
                >
                  Get Started Today
                </motion.a>
              </MovingBorder>
            </ParticleRing>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
