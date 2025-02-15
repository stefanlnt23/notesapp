import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateClient } from 'aws-amplify/data';
import {
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const client = generateClient();

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalServices: 0,
    totalProjects: 0,
    newMessages: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [posts, services, projects, messages] = await Promise.all([
        client.models.BlogPost.list(),
        client.models.Service.list(),
        client.models.Project.list(),
        client.models.Contact.list({
          filter: {
            status: { eq: 'NEW' }
          }
        })
      ]);

      setStats({
        totalPosts: posts.data.length,
        totalServices: services.data.length,
        totalProjects: projects.data.length,
        newMessages: messages.data.length
      });

      // Combine and sort recent activity
      const activity = [
        ...posts.data.map(post => ({
          type: 'post',
          title: post.title,
          date: new Date(post.createdAt),
          icon: DocumentTextIcon
        })),
        ...messages.data.map(message => ({
          type: 'message',
          title: `Message from ${message.name}`,
          date: new Date(message.createdAt),
          icon: EnvelopeIcon
        }))
      ].sort((a, b) => b.date - a.date).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-primary-light rounded-lg"></div>
        <div className="h-64 bg-primary-light rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Blog Posts', value: stats.totalPosts, icon: DocumentTextIcon },
            { title: 'Services', value: stats.totalServices, icon: WrenchScrewdriverIcon },
            { title: 'Projects', value: stats.totalProjects, icon: FolderIcon },
            { title: 'New Messages', value: stats.newMessages, icon: EnvelopeIcon }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-light rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-secondary" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-primary-light rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <activity.icon className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <p className="text-gray-300">{activity.title}</p>
                    <p className="text-sm text-gray-400">
                      {activity.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-primary-light rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Quick Stats</h2>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Published Posts</span>
                <span className="text-secondary font-medium">{stats.totalPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Services</span>
                <span className="text-secondary font-medium">{stats.totalServices}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Featured Projects</span>
                <span className="text-secondary font-medium">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Unread Messages</span>
                <span className="text-secondary font-medium">{stats.newMessages}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
