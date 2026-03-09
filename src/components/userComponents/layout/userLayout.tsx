import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserTopbar from './usertopbar';
import UserSidebar from './userSidebar';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter,_sans-serif']">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <UserTopbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;