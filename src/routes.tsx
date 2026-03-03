import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/landing';
import About from './Pages/about';
import HowItWorks from './Pages/howItWorks';
import PoolsPage from './Pages/pools';
import Contact from './Pages/contact';
import FAQs from './Pages/FaQs';
import Register from './Pages/register';


export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pools" element={<PoolsPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/register" element={<Register />} />    
        {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};