import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">Configure your application settings, preferences, and system configurations.</p>

        {/* General Settings */}
        <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="Clothify" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input type="email" className="w-full p-2 border rounded" defaultValue="support@clothify.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select className="w-full p-2 border rounded">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <input type="checkbox" id="email-notif" className="mr-2" defaultChecked />
            <label htmlFor="email-notif">Email notifications for new orders</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="sms-notif" className="mr-2" />
            <label htmlFor="sms-notif">SMS notifications for order updates</label>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;