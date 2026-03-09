import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save,
  Bell,
  Shield,
  DollarSign,
  Users,
  Mail,
  Globe,
  Lock,
  CheckCircle,
  Settings as SettingsIcon  
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // Form states (keep all your existing state)
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'TZX Trading',
    siteUrl: 'https://tzxtrading.com',
    supportEmail: 'support@tzxtrading.com',
    adminEmail: 'admin@tzxtrading.com'
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    sessionTimeout: '30'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    investmentAlerts: true,
    ticketAlerts: true,
    marketingEmails: false,
    dailyDigest: true
  });

  const [feeSettings, setFeeSettings] = useState({
    managementFee: '2.5',
    withdrawalFee: '1.0',
    minInvestment: '5000',
    maxInvestment: '299999'
  });

  const sections: SettingsSection[] = [
    { id: 'general', title: 'General', icon: Globe, description: 'Basic site settings and information' },
    { id: 'security', title: 'Security', icon: Shield, description: 'Password and authentication settings' },
    { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Email and alert preferences' },
    { id: 'fees', title: 'Fees & Limits', icon: DollarSign, description: 'Investment fees and transaction limits' },
    { id: 'users', title: 'User Management', icon: Users, description: 'User roles and permissions' },
    { id: 'email', title: 'Email Settings', icon: Mail, description: 'SMTP and email templates' }
  ];

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeeSettings({
      ...feeSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      console.log('Settings saved:', {
        general: generalSettings,
        security: securitySettings,
        notifications: notificationSettings,
        fees: feeSettings
      });
    }, 1500);
  };

  const SectionIcon = sections.find(s => s.id === activeSection)?.icon || Globe;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            saveStatus === 'saving'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : saveStatus === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-[#ff444f] text-white hover:bg-[#d43b44]'
          }`}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle size={18} />
              Saved!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 border-r border-gray-200 bg-gray-50/50">
            <nav className="p-4 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#ff444f] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{section.title}</p>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ff444f]/10 rounded-lg flex items-center justify-center">
                <SectionIcon className="w-5 h-5 text-[#ff444f]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {sections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
            </div>

            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site URL
                    </label>
                    <input
                      type="url"
                      name="siteUrl"
                      value={generalSettings.siteUrl}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      name="supportEmail"
                      value={generalSettings.supportEmail}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={securitySettings.currentPassword}
                          onChange={handleSecurityChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff444f]"></div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Session Timeout</h3>
                      <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                    </div>
                    <select
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email updates about your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff444f]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Investment Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about new investments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="investmentAlerts"
                      checked={notificationSettings.investmentAlerts}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff444f]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Ticket Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about new support tickets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="ticketAlerts"
                      checked={notificationSettings.ticketAlerts}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff444f]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Daily Digest</h3>
                    <p className="text-sm text-gray-500">Receive a daily summary of activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="dailyDigest"
                      checked={notificationSettings.dailyDigest}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff444f]"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Fees Settings */}
            {activeSection === 'fees' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Management Fee (%)
                    </label>
                    <input
                      type="number"
                      name="managementFee"
                      value={feeSettings.managementFee}
                      onChange={handleFeeChange}
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage charged on investments</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Withdrawal Fee (%)
                    </label>
                    <input
                      type="number"
                      name="withdrawalFee"
                      value={feeSettings.withdrawalFee}
                      onChange={handleFeeChange}
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Fee charged on withdrawals</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Investment (KES)
                    </label>
                    <input
                      type="number"
                      name="minInvestment"
                      value={feeSettings.minInvestment}
                      onChange={handleFeeChange}
                      step="1000"
                      min="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Investment (KES)
                    </label>
                    <input
                      type="number"
                      name="maxInvestment"
                      value={feeSettings.maxInvestment}
                      onChange={handleFeeChange}
                      step="1000"
                      min="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff444f] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">M-Pesa limit: 299,999</p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other sections */}
            {['users', 'email'].includes(activeSection) && (
              <div className="text-center py-12">
                <SettingsIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.title} Settings
                </h3>
                <p className="text-gray-500">
                  This section is under development. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;