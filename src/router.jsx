import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBlog from './pages/admin/Blog';
import AdminServices from './pages/admin/Services';
import AdminProjects from './pages/admin/Projects';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'blog', element: <Blog /> },
      { path: 'contact', element: <Contact /> }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'projects', element: <AdminProjects /> }
    ]
  }
]);
