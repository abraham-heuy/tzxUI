import { Route } from 'react-router-dom';
import UserLayout from './layout/userLayout';
import UserDashboard from './Dashboard';
import UserTransactions from './Transactions';
import UserTickets from './Tickets';
import UserSettings from './Settings';
import TradingMonitor from './MonitorComponent';
import { TradingProvider } from '../../context/tradingContext';
import DerivViewer from './derivViewer';


// Wrap UserLayout so both TradingMonitor and ViewTradingAccount share the same context
const UserLayoutWithTrading = () => (
  <TradingProvider>
    <UserLayout />
  </TradingProvider>
);



export const userRoutes = (
  <Route path="/user" element={<UserLayoutWithTrading />}>
    <Route index element={<UserDashboard />} />
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="transactions" element={<UserTransactions />} />
    <Route path="tickets" element={<UserTickets />} />
    <Route path="monitor" element={<TradingMonitor />} />
    <Route path="view-trading" element={<DerivViewer />} />  
    <Route path="settings" element={<UserSettings />} />
  </Route>
);