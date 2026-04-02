// src/pages/FacultyMainPage.jsx (for Leave Management Repo)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PortalCard from '../components/PortalCard';

const FacultyMainPage = () => {
  const navigate = useNavigate();

  const facultyPortals = [
    {
      id: 'leave-management',
      title: 'Leave Management',
      description: 'Apply for leaves, view leave history, and manage leave approvals',
      icon: '📝',
      route: '/login',
      isComingSoon: false,
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'attendance-management',
      title: 'Attendance Management',
      description: 'Track student attendance and generate attendance reports',
      icon: '📊',
      route: '/login',
      isComingSoon: true,
      gradient: 'from-red-400 to-red-500'
    },
    
  ];

  const handlePortalClick = (portal) => {
    if (!portal.isComingSoon) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
      <Header title="Faculty Services Portal" />
      
      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgb(239 68 68) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-r from-red-700 to-red-800 rounded-full mb-6 shadow-lg">
              <div className="text-white text-4xl">👩‍🏫</div>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent mb-6 leading-tight">
              Faculty Services Portal
            </h1>
            <p className="text-gray-700 text-l max-w-3xl mx-auto leading-relaxed">
              Access all faculty services and tools from one centralized platform. 
              Streamline your academic and administrative tasks with efficiency and ease.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-red-700 to-red-800 rounded-full"></div>
            </div>
          </div>

          {/* Portal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {facultyPortals.map((portal) => (
              <PortalCard
                key={portal.id}
                title={portal.title}
                description={portal.description}
                icon={portal.icon}
                onClick={() => handlePortalClick(portal)}
                isComingSoon={portal.isComingSoon}
                gradient={portal.gradient}
              />
            ))}
          </div>

          {/* Support Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-50 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-100 to-red-200 rounded-full opacity-50 transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-block p-3 bg-gradient-to-r from-red-700 to-red-800 rounded-full mb-4">
                  <div className="text-white text-2xl">🛠️</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Need Technical Support?
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                  For technical support or assistance with any portal, our dedicated IT support team 
                  is available to help you resolve any issues quickly and efficiently.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                    <span className="flex items-center justify-center gap-2">
                      Contact Support
                      <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                  <button className="group border-2 bg-gradient-to-r from-red-700 to-red-800 bg-white px-8 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    <span className="flex items-center justify-center gap-2">
                      User Guide
                      <span className="text-lg group-hover:rotate-12 transition-transform">📖</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyMainPage;