import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter,_sans-serif']">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminTopbar setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;