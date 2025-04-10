import React, { useState, useEffect } from 'react';
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
  ArrowPathIcon,
  FireIcon,
  PresentationChartLineIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';

// Navigation items
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Reports', path: '/reports' },
  { name: 'Predictions', path: '/predictions' },
  { name: 'Bookings', path: '/bookings' },
];

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
  { id: 1, tip: 'Turn off lights in unoccupied rooms', icon: <LightBulbIcon className="h-6 w-6 text-amber-500" />, impact: 'High' },
  { id: 2, tip: 'Optimize AC temperatures with booking schedule', icon: <PresentationChartLineIcon className="h-6 w-6 text-orange-500" />, impact: 'Medium' },
  { id: 3, tip: 'Implement smart lighting in hallways', icon: <LightBulbIcon className="h-6 w-6 text-amber-500" />, impact: 'High' },
  { id: 4, tip: 'Run large appliances during off-peak hours', icon: <BoltIcon className="h-6 w-6 text-orange-500" />, impact: 'Medium' },
];

// Recent activity data
const recentActivity = [
  { id: 1, action: 'HVAC system adjusted', location: 'Floor 3', time: '10 minutes ago', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  { id: 2, action: 'Lighting reduced', location: 'Conference Room B', time: '25 minutes ago', icon: <LightBulbIcon className="h-5 w-5" /> },
  { id: 3, action: 'Energy audit completed', location: 'Hotel-wide', time: '2 hours ago', icon: <DocumentArrowDownIcon className="h-5 w-5" /> },
  { id: 4, action: 'Smart thermostat installed', location: 'Room 506', time: '1 day ago', icon: <Cog6ToothIcon className="h-5 w-5" /> },
];

function Dashboard() {
  const { user } = useUser();
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const [filterFloor, setFilterFloor] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // UI handler functions
  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
  };

  const handleFloorChange = (e) => {
    setFilterFloor(e.target.value);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      {/* Add floating navbar */}
      <FloatingNav navItems={navItems} />

      <div className="pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-900 dark:text-white">Energy Dashboard</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
            <p className="text-orange-700 dark:text-gray-300">
              Smart Hotel Energy Monitoring & Prediction System
            </p>
            <p className="text-sm text-orange-600 dark:text-amber-400 mt-2 sm:mt-0">
              {currentTime.toLocaleDateString()} · {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-amber-400 font-medium">Total Consumption</p>
                <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">24,589 kWh</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="inline-block mr-1">↓</span> 3.2% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <BoltIcon className="h-8 w-8 text-orange-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-amber-400 font-medium">Occupancy Rate</p>
                <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">78.5%</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="inline-block mr-1">↑</span> 5.3% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <BuildingOffice2Icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-amber-400 font-medium">Active Bookings</p>
                <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">142</h3>
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="inline-block mr-1">↓</span> 1.7% from last week
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <CalendarIcon className="h-8 w-8 text-orange-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-amber-400 font-medium">Efficiency Score</p>
                <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">86/100</h3>
                <p className="text-sm text-green-500 flex items-center mt-1">
                  <span className="inline-block mr-1">↑</span> 2.1 points
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <ChartBarIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-Time Energy Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-bold text-orange-900 dark:text-white">Real-Time Energy Usage</h2>
                <div className="mt-2 sm:mt-0">
                  <select 
                    value={filterFloor} 
                    onChange={handleFloorChange}
                    className="px-3 py-2 border border-amber-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-orange-900 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 dark:focus:ring-amber-500 focus:border-transparent"
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
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                    <YAxis tick={{ fill: 'currentColor' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderColor: '#f97316',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="usage" name="Current Usage (kWh)" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="Predicted Usage (kWh)" fill="#fdba74" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Usage Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-bold text-orange-900 dark:text-white">Usage Trends</h2>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button 
                    onClick={() => handlePeriodChange('weekly')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      filterPeriod === 'weekly' 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300' 
                        : 'bg-white dark:bg-gray-700 text-orange-600 dark:text-amber-400 border border-amber-200 dark:border-gray-600'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => handlePeriodChange('monthly')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      filterPeriod === 'monthly' 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300' 
                        : 'bg-white dark:bg-gray-700 text-orange-600 dark:text-amber-400 border border-amber-200 dark:border-gray-600'
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
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                      <YAxis yAxisId="left" tick={{ fill: 'currentColor' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: 'currentColor' }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderColor: '#f97316',
                          borderRadius: '0.5rem',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="usage" name="Energy Usage (kWh)" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  ) : (
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                      <YAxis tick={{ fill: 'currentColor' }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderColor: '#f97316',
                          borderRadius: '0.5rem',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="usage" name="This Year (kWh)" stroke="#f97316" fill="#fdba74" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="avg" name="Average (kWh)" stroke="#eab308" fill="#fde68a" fillOpacity={0.4} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-orange-900 dark:text-white">Recent Alerts</h2>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300 text-xs font-medium rounded-full">
                  {alerts.length} New
                </span>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[360px]">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' 
                        : alert.severity === 'medium'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    }`}
                  >
                    <div className="flex justify-between">
                      <h3 className={`font-medium ${
                        alert.severity === 'high' 
                          ? 'text-orange-800 dark:text-orange-300' 
                          : alert.severity === 'medium'
                          ? 'text-amber-800 dark:text-amber-300'
                          : 'text-blue-800 dark:text-blue-300'
                      }`}>
                        {alert.message}
                      </h3>
                    </div>
                    <p className="text-sm text-orange-600/70 dark:text-amber-400/70 mt-2">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Energy Saving Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Energy Saving Tips</h2>
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-4 bg-orange-50/50 dark:bg-orange-900/5 rounded-lg flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <p className="font-medium text-orange-900 dark:text-white">{tip.tip}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-orange-600 dark:text-amber-400 mr-2">Impact:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tip.impact === 'High' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                        }`}>{tip.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                      <div className="text-orange-600 dark:text-amber-400">
                        {activity.icon}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-orange-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-orange-700 dark:text-amber-300">{activity.location}</p>
                      <p className="text-xs text-orange-600/70 dark:text-amber-400/70 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300 text-sm font-medium rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
