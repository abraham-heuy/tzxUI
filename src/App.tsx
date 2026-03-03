import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;