import { Route } from 'react-router-dom';
import AdminLayout from '../../components/adminComponents/layout/AdminLayout';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import SupportTickets from './SupportTickets';
import Settings from './Settings';
import ContactMessages from './ContactMessages';
import Users from './Users';

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="transactions" element={<Transactions />} />
    <Route path="tickets" element={<SupportTickets />} />
    <Route path="settings" element={<Settings />} />
    <Route path="users" element={<Users />} />
    <Route path="contact" element={<ContactMessages />} />

  </Route>
);