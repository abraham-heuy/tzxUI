import { Route } from 'react-router-dom';
import UserLayout from './layout/userLayout';
import UserDashboard from './Dashboard';
import UserTransactions from './Transactions';
import UserTickets from './Tickets';
import UserSettings from './Settings';
import TradingMonitor from './MonitorComponent';


export const userRoutes = (
  <Route path="/user" element={<UserLayout />}>
    <Route index element={<UserDashboard />} />
    <Route path='dashboard'element={<UserDashboard />}/>
    <Route path="transactions" element={<UserTransactions />} />
    <Route path="tickets" element={<UserTickets />} />
    <Route path="monitor" element={<TradingMonitor />} />

    <Route path="settings" element={<UserSettings />} />
  </Route>
);