import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const client = generateClient();

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    technologies: '',
    orderIndex: 0,
    isActive: true
  });
  const [selectedIcon, setSelectedIcon] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: servicesList } = await client.models.Service.list();
      setServices(servicesList.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        features: Array.isArray(service.features) ? service.features.join('\n') : service.features,
        technologies: Array.isArray(service.technologies) ? service.technologies.join('\n') : service.technologies,
        orderIndex: service.orderIndex,
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        features: '',
        technologies: '',
        orderIndex: services.length,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      features: '',
      technologies: '',
      orderIndex: 0,
      isActive: true
    });
    setSelectedIcon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let iconKey = null;
      if (selectedIcon) {
        const fileName = `${Date.now()}-${selectedIcon.name}`;
        await uploadData({
          path: `services/${fileName}`,
          data: selectedIcon
        }).result;
        iconKey = fileName;
      }

      const serviceData = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim()),
        technologies: formData.technologies.split('\n').filter(t => t.trim()),
        icon: iconKey || (editingService?.icon || null)
      };

      if (editingService) {
        await client.models.Service.update({
          id: editingService.id,
          ...serviceData
        });
      } else {
        await client.models.Service.create(serviceData);
      }

      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await client.models.Service.delete({ id: serviceId });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleReorder = async (serviceId, direction) => {
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (
      (direction === 'up' && serviceIndex === 0) ||
      (direction === 'down' && serviceIndex === services.length - 1)
    ) {
      return;
    }

    const newServices = [...services];
    const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;
    const temp = newServices[serviceIndex];
    newServices[serviceIndex] = newServices[targetIndex];
    newServices[targetIndex] = temp;

    // Update order indices
    const updates = newServices.map((service, index) => 
      client.models.Service.update({
        id: service.id,
        orderIndex: index
      })
    );

    try {
      await Promise.all(updates);
      fetchServices();
    } catch (error) {
      console.error('Error reordering services:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-primary-light rounded w-1/4"></div>
        <div className="h-96 bg-primary-light rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-primary-light rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} className="border-b border-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(service.id, 'up')}
                      disabled={index === 0}
                      className={`text-gray-400 hover:text-secondary ${
                        index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(service.id, 'down')}
                      disabled={index === services.length - 1}
                      className={`text-gray-400 hover:text-secondary ${
                        index === services.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.isActive
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-red-900/50 text-red-300'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="text-gray-400 hover:text-secondary mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-light rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies (one per line)
                </label>
                <textarea
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-secondary transition-colors duration-300">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setSelectedIcon(e.target.files[0])}
                    />
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </label>
                  {selectedIcon && (
                    <div>
                      <p className="text-sm text-gray-400">{selectedIcon.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-700 text-secondary focus:ring-secondary bg-primary"
                  />
                  <span className="text-sm font-medium text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
