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
  StarIcon as StarIconOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const client = generateClient();

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    isFeatured: false
  });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: projectsList } = await client.models.Project.list();
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: Array.isArray(project.technologies) ? project.technologies.join('\n') : project.technologies,
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        isFeatured: project.isFeatured
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      isFeatured: false
    });
    setSelectedImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageKeys = [];
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (image) => {
          const fileName = `${Date.now()}-${image.name}`;
          await uploadData({
            path: `projects/${fileName}`,
            data: image
          }).result;
          return fileName;
        });
        imageKeys = await Promise.all(uploadPromises);
      }

      const projectData = {
        ...formData,
        technologies: formData.technologies.split('\n').filter(t => t.trim()),
        images: imageKeys.length > 0 ? imageKeys : (editingProject?.images || [])
      };

      if (editingProject) {
        await client.models.Project.update({
          id: editingProject.id,
          ...projectData
        });
      } else {
        await client.models.Project.create(projectData);
      }

      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await client.models.Project.delete({ id: projectId });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await client.models.Project.update({
        id: project.id,
        isFeatured: !project.isFeatured
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating project featured status:', error);
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
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-primary-light rounded-xl overflow-hidden"
          >
            {project.images && project.images[0] && (
              <div className="relative h-48">
                <img
                  src={`${project.images[0]}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`text-gray-400 hover:text-yellow-500 ${
                    project.isFeatured ? 'text-yellow-500' : ''
                  }`}
                >
                  {project.isFeatured ? (
                    <StarIconSolid className="h-6 w-6" />
                  ) : (
                    <StarIconOutline className="h-6 w-6" />
                  )}
                </button>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleOpenModal(project)}
                  className="text-gray-400 hover:text-secondary"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
                {editingProject ? 'Edit Project' : 'New Project'}
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
                  Live URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Images
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-secondary transition-colors duration-300">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedImages(Array.from(e.target.files))}
                    />
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </label>
                  {selectedImages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400">
                        {selectedImages.length} image(s) selected
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-700 text-secondary focus:ring-secondary bg-primary"
                  />
                  <span className="text-sm font-medium text-gray-300">Featured Project</span>
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
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
