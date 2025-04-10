import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BellIcon, 
  ArrowDownTrayIcon, 
  DocumentArrowDownIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CalendarIcon,
  BoltIcon,
  Cog6ToothIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Sample data for charts
const energyData = [
  { name: 'Floor 1', usage: 4000, predicted: 4200 },
  { name: 'Floor 2', usage: 3000, predicted: 3500 },
  { name: 'Floor 3', usage: 2000, predicted: 2400 },
  { name: 'Floor 4', usage: 2780, predicted: 2900 },
  { name: 'Floor 5', usage: 1890, predicted: 2100 },
  { name: 'Floor 6', usage: 2390, predicted: 2700 },
  { name: 'Floor 7', usage: 3490, predicted: 3200 },
];

const weeklyData = [
  { name: 'Mon', usage: 4000, bookings: 24 },
  { name: 'Tue', usage: 3000, bookings: 13 },
  { name: 'Wed', usage: 2000, bookings: 18 },
  { name: 'Thu', usage: 2780, bookings: 22 },
  { name: 'Fri', usage: 1890, bookings: 31 },
  { name: 'Sat', usage: 2390, bookings: 38 },
  { name: 'Sun', usage: 3490, bookings: 43 },
];

const monthlyData = [
  { name: 'Jan', usage: 65, avg: 55 },
  { name: 'Feb', usage: 59, avg: 57 },
  { name: 'Mar', usage: 80, avg: 62 },
  { name: 'Apr', usage: 81, avg: 65 },
  { name: 'May', usage: 56, avg: 58 },
  { name: 'Jun', usage: 55, avg: 54 },
  { name: 'Jul', usage: 40, avg: 45 },
  { name: 'Aug', usage: 45, avg: 46 },
  { name: 'Sep', usage: 60, avg: 59 },
  { name: 'Oct', usage: 70, avg: 65 },
  { name: 'Nov', usage: 80, avg: 76 },
  { name: 'Dec', usage: 90, avg: 85 },
];

const alerts = [
  { id: 1, severity: 'high', message: 'Room 405 showing 45% above average consumption', time: '15 min ago' },
  { id: 2, severity: 'medium', message: 'Floor 3 trending upward for the last 3 hours', time: '1 hour ago' },
  { id: 3, severity: 'low', message: 'Room 201 showing normal levels after maintenance', time: '3 hours ago' },
  { id: 4, severity: 'high', message: 'Conference Room A showing unusual activity', time: '6 hours ago' },
];

const tips = [
  { id: 1, tip: 'Turn off lights in unoccupied rooms', icon: '💡', impact: 'High' },
  { id: 2, tip: 'Optimize AC temperatures with booking schedule', icon: '❄️', impact: 'Medium' },
  { id: 3, tip: 'Implement smart lighting in hallways', icon: '🔆', impact: 'High' },
  { id: 4, tip: 'Run large appliances during off-peak hours', icon: '⚡', impact: 'Medium' },
];

function Dashboard() {
  const { user } = useUser();
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const [filterFloor, setFilterFloor] = useState('all');

  // UI handler functions
  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
  };

  const handleFloorChange = (e) => {
    setFilterFloor(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-dark-content shadow-sm rounded-lg m-4 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-300">Smart Hotel Energy Monitoring & Prediction System</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-dark-content-light text-gray-600 dark:text-gray-300 hover:bg-gray-200">
            <ArrowPathIcon className="h-5 w-5" />
          </button>
          <div className="relative">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-dark-content-light text-gray-600 dark:text-gray-300 hover:bg-gray-200 relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
            </button>
          </div>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-dark-content-light text-gray-600 dark:text-gray-300 hover:bg-gray-200">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Consumption</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24,589 kWh</h3>
            <p className="text-sm text-green-500">-3.2% from last month</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <BoltIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">78.5%</h3>
            <p className="text-sm text-green-500">+5.3% from last month</p>
          </div>
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <BuildingOffice2Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Bookings</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">142</h3>
            <p className="text-sm text-red-500">-1.7% from last week</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <CalendarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Efficiency Score</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">86/100</h3>
            <p className="text-sm text-green-500">+2.1 points</p>
          </div>
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <ChartBarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Real-Time Energy Usage */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 col-span-1 md:col-span-3 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Real-Time Energy Usage</h2>
            <div className="flex space-x-2">
              <select 
                value={filterFloor} 
                onChange={handleFloorChange}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-dark-content-light text-gray-800 dark:text-gray-200"
              >
                <option value="all">All Floors</option>
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
                <option value="3">Floor 3</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={energyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" name="Current Usage (kWh)" fill="#3b82f6" />
                <Bar dataKey="predicted" name="Predicted Usage (kWh)" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 col-span-1 md:col-span-1 lg:col-span-2 row-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Alerts</h2>
          <div className="space-y-3 overflow-y-auto max-h-[400px]">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                    : alert.severity === 'medium'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className={`font-medium ${
                    alert.severity === 'high' 
                      ? 'text-red-800 dark:text-red-300' 
                      : alert.severity === 'medium'
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {alert.message}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Trends */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 col-span-1 md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Trends</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePeriodChange('weekly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterPeriod === 'weekly' 
                    ? 'bg-primary-100 dark:bg-dark-accent/20 text-primary-700 dark:text-dark-accent' 
                    : 'bg-gray-100 dark:bg-dark-content-light text-gray-600 dark:text-gray-300'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => handlePeriodChange('monthly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterPeriod === 'monthly' 
                    ? 'bg-primary-100 dark:bg-dark-accent/20 text-primary-700 dark:text-dark-accent' 
                    : 'bg-gray-100 dark:bg-dark-content-light text-gray-600 dark:text-gray-300'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {filterPeriod === 'weekly' ? (
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="usage" name="Energy Usage (kWh)" stroke="#3b82f6" />
                  <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#8b5cf6" />
                </LineChart>
              ) : (
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="usage" name="This Year (kWh)" stroke="#3b82f6" fill="#93c5fd" />
                  <Area type="monotone" dataKey="avg" name="Average (kWh)" stroke="#8b5cf6" fill="#c4b5fd" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Saving Tips */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 col-span-1 md:col-span-2 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Energy Saving Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip) => (
              <div key={tip.id} className="p-3 bg-gray-50 dark:bg-dark-content-light rounded-lg flex items-start space-x-3">
                <div className="text-2xl">{tip.icon}</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{tip.tip}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Impact:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tip.impact === 'High' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>{tip.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white dark:bg-dark-content rounded-lg shadow p-4 col-span-1 md:col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export & Reports</h2>
          <div className="grid grid-cols-1 gap-2">
            <button className="flex items-center justify-center space-x-2 w-full p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download CSV</span>
            </button>
            <button className="flex items-center justify-center space-x-2 w-full p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40">
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Generate PDF Report</span>
            </button>
            <button className="flex items-center justify-center space-x-2 w-full p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40">
              <CalendarIcon className="h-5 w-5" />
              <span>Schedule Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-dark-content shadow-sm rounded-lg m-4 p-4 mt-2">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div>
            <p>© 2025 Smart Hotel Energy System. All rights reserved.</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p>Version 1.2.5 | <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
