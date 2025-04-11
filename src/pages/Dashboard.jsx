import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
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

// CSV parsing function
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(',');
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] ? parseFloat(values[index]) || values[index] : '';
    });
    
    return obj;
  });
};

// Navigation items
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Reports', path: '/reports' },
  { name: 'Tips', path: '/tips' },
  { name: 'Settings', path: '/settings' },
];

function Dashboard() {
  const { user } = useUser();
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const [filterFloor, setFilterFloor] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyData, setHourlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI handler functions
  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
  };

  const handleFloorChange = (e) => {
    setFilterFloor(e.target.value);
  };

  useEffect(() => {
    // Load CSV data
    const loadCSVData = async () => {
      try {
        setLoading(true);
        
        // Fetch hourly predictions CSV
        const hourlyResponse = await fetch('/hourly_predictions.csv');
        const hourlyText = await hourlyResponse.text();
        const parsedHourlyData = parseCSV(hourlyText);
        
        // Fetch monthly consumption CSV
        const monthlyResponse = await fetch('/monthly_consumption_prediction.csv');
        const monthlyText = await monthlyResponse.text();
        const parsedMonthlyData = parseCSV(monthlyText);
        
        setHourlyData(parsedHourlyData);
        setMonthlyData(parsedMonthlyData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading CSV data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    
    loadCSVData();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Process hourly data for charts
  const processHourlyData = () => {
    if (!hourlyData.length) return [];
    
    // Group by hour and sum values
    const hourlyChartData = hourlyData
      .slice(0, 24) // Use the first 24 hours for demonstration
      .map(item => ({
        name: `${item.hour}:00`,
        Light: parseFloat(item.Light || 0) * 1000, // Convert to watts for better visualization
        Fan: parseFloat(item.Fan || 0) * 1000,
        AC: parseFloat(item.AC || 0) * 1000,
        TV: parseFloat(item.TV || 0) * 1000,
        hour: parseInt(item.hour || 0)
      }))
      .sort((a, b) => a.hour - b.hour);
    
    return hourlyChartData;
  };

  // Process weekly data for charts
  const processWeeklyData = () => {
    if (!hourlyData.length) return [];
    
    // Days of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize data structure for each day of the week
    const weeklyData = days.map(day => ({
      name: day,
      Light: 0,
      Fan: 0,
      AC: 0,
      TV: 0
    }));
    
    // Use the first 168 hours (7 days * 24 hours) for demonstration
    const weekHourlyData = hourlyData.slice(0, 168);
    
    // Aggregate by day of week
    weekHourlyData.forEach((item, index) => {
      // Calculate day index (0-6) based on the item index
      const dayIndex = Math.floor(index / 24) % 7;
      
      // Add values to the corresponding day
      weeklyData[dayIndex].Light += parseFloat(item.Light || 0) * 1000;
      weeklyData[dayIndex].Fan += parseFloat(item.Fan || 0) * 1000;
      weeklyData[dayIndex].AC += parseFloat(item.AC || 0) * 1000;
      weeklyData[dayIndex].TV += parseFloat(item.TV || 0) * 1000;
    });
    
    return weeklyData;
  };

  // Process monthly data for charts
  const processMonthlyData = () => {
    if (!monthlyData.length) return [];
    
    // Map month numbers to names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get unique month-years
    const uniqueMonthYears = [...new Set(monthlyData.map(item => item.month_year))].filter(Boolean);
    
    // Create aggregated data by month
    const monthlyChartData = uniqueMonthYears.map(monthYear => {
      const [year, month] = (monthYear || "2025-01").split('-');
      const monthIndex = parseInt(month) - 1;
      
      // Get all items for this month across all rooms
      const monthItems = monthlyData.filter(item => item.month_year === monthYear);
      
      // Sum up values across all rooms for this month
      const totalLight = monthItems.reduce((sum, item) => sum + parseFloat(item.Light || 0), 0);
      const totalFan = monthItems.reduce((sum, item) => sum + parseFloat(item.Fan || 0), 0);
      const totalAC = monthItems.reduce((sum, item) => sum + parseFloat(item.AC || 0), 0);
      const totalTV = monthItems.reduce((sum, item) => sum + parseFloat(item.TV || 0), 0);
      
      return {
        name: monthNames[monthIndex],
        month_year: monthYear,
        Light: totalLight,
        Fan: totalFan,
        AC: totalAC,
        TV: totalTV,
        Total: totalLight + totalFan + totalAC + totalTV
      };
    }).sort((a, b) => {
      // Sort by month-year
      return a.month_year.localeCompare(b.month_year);
    });
    
    return monthlyChartData;
  };

  // Process room-specific data
  const processRoomData = () => {
    if (!monthlyData.length) return [];
    
    // Group by room and calculate total energy usage
    const roomData = [];
    const roomIds = [...new Set(monthlyData.map(item => item.roomId))].filter(Boolean);
    
    roomIds.forEach(roomId => {
      const roomItems = monthlyData.filter(item => item.roomId === roomId);
      const totalUsage = roomItems.reduce((sum, item) => sum + parseFloat(item.Total || 0), 0);
      
      roomData.push({
        name: `Room ${roomId}`,
        total: totalUsage * 100 // Scale for better visualization
      });
    });
    
    // Sort rooms by total energy usage (highest first)
    return roomData.sort((a, b) => b.total - a.total);
  };

  // Process appliance-specific data
  const processApplianceData = () => {
    if (!monthlyData.length) return [];
    
    // Calculate total usage for each appliance type
    const applianceUsage = {
      Light: 0,
      Fan: 0,
      AC: 0,
      TV: 0
    };
    
    monthlyData.forEach(item => {
      applianceUsage.Light += parseFloat(item.Light || 0);
      applianceUsage.Fan += parseFloat(item.Fan || 0);
      applianceUsage.AC += parseFloat(item.AC || 0);
      applianceUsage.TV += parseFloat(item.TV || 0);
    });
    
    // Convert to array format for chart
    return [
      { name: 'Lighting', value: applianceUsage.Light * 100, fill: '#fbbf24' },
      { name: 'Fans', value: applianceUsage.Fan * 100, fill: '#f59e0b' },
      { name: 'AC', value: applianceUsage.AC * 100, fill: '#d97706' },
      { name: 'TV/Electronics', value: applianceUsage.TV * 100, fill: '#b45309' }
    ].sort((a, b) => b.value - a.value); // Sort by highest usage first
  };

  // Process room-wise appliance data
  const processRoomApplianceData = () => {
    if (!monthlyData.length) return [];
    
    // Group by room and calculate appliance usage for each room
    const roomApplianceData = [];
    const roomIds = [...new Set(monthlyData.map(item => item.roomId))].filter(Boolean);
    
    roomIds.forEach(roomId => {
      const roomItems = monthlyData.filter(item => item.roomId === roomId);
      
      // Sum up appliance usage for this room
      const roomAppliances = {
        name: `Room ${roomId}`,
        Light: roomItems.reduce((sum, item) => sum + parseFloat(item.Light || 0), 0),
        Fan: roomItems.reduce((sum, item) => sum + parseFloat(item.Fan || 0), 0),
        AC: roomItems.reduce((sum, item) => sum + parseFloat(item.AC || 0), 0),
        TV: roomItems.reduce((sum, item) => sum + parseFloat(item.TV || 0), 0),
        total: roomItems.reduce((sum, item) => sum + parseFloat(item.Total || 0), 0)
      };
      
      roomApplianceData.push(roomAppliances);
    });
    
    // Sort by total energy usage (highest first)
    return roomApplianceData.sort((a, b) => b.total - a.total);
  };

  // Get data based on selected period
  const getChartData = () => {
    switch (filterPeriod) {
      case 'hourly':
        return processHourlyData();
      case 'weekly':
        return processWeeklyData();
      case 'monthly':
        return processMonthlyData();
      default:
        return processWeeklyData();
    }
  };

  // Get energy data by room/floor
  const getEnergyData = () => {
    return processRoomData();
  };

  const chartData = getChartData();
  const energyData = getEnergyData();
  const applianceData = processApplianceData();
  const roomApplianceData = processRoomApplianceData();

  // Sample data that doesn't change
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

  return (

    <div className="min-h-screen bg-orange-50 dark:bg-gray-900">
      <FloatingNav navItems={navItems} />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-orange-50 dark:bg-gray-900">
          <div className="text-center">
            <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-orange-500" />
            <h2 className="mt-4 text-xl font-semibold text-orange-800 dark:text-orange-200">Loading dashboard data...</h2>

          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen bg-orange-50 dark:bg-gray-900">
          <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-red-500 mb-4">
              <FireIcon className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-2">Error Loading Data</h2>
            <p className="text-orange-700 dark:text-orange-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 pt-16">
          <div className="flex flex-col space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  Last updated: {currentTime.toLocaleString()}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <select 
                  value={filterPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 rounded-lg text-orange-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Charts Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Energy Usage Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-900 dark:text-white">Energy Usage</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-700 dark:text-orange-300">
                        {filterPeriod === 'hourly' ? 'Today' : 
                         filterPeriod === 'weekly' ? 'This Week' : 'This Month'}
                      </span>
                      <button className="p-1 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700">
                        <ArrowPathIcon className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {filterPeriod === 'monthly' ? (
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                          <XAxis dataKey="name" stroke="#f59e0b" />
                          <YAxis stroke="#f59e0b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fef3c7', 
                              borderColor: '#f59e0b',
                              color: '#92400e',
                              borderRadius: '0.5rem'
                            }}
                            formatter={(value, name) => [`${value.toFixed(2)} kWh`, name]}
                          />
                          <Legend />
                          <Bar dataKey="Light" name="Lighting" fill="#fbbf24" />
                          <Bar dataKey="Fan" name="Fans" fill="#f59e0b" />
                          <Bar dataKey="AC" name="AC" fill="#d97706" />
                          <Bar dataKey="TV" name="TV/Electronics" fill="#b45309" />
                        </BarChart>
                      ) : filterPeriod === 'hourly' ? (
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                          <XAxis dataKey="name" stroke="#f59e0b" />
                          <YAxis stroke="#f59e0b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fef3c7', 
                              borderColor: '#f59e0b',
                              color: '#92400e',
                              borderRadius: '0.5rem'
                            }}
                            formatter={(value, name) => [`${value.toFixed(2)} W`, name]}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="Light" name="Lighting" stroke="#fbbf24" strokeWidth={2} />
                          <Line type="monotone" dataKey="Fan" name="Fans" stroke="#f59e0b" strokeWidth={2} />
                          <Line type="monotone" dataKey="AC" name="AC" stroke="#d97706" strokeWidth={2} />
                          <Line type="monotone" dataKey="TV" name="TV/Electronics" stroke="#b45309" strokeWidth={2} />
                        </LineChart>
                      ) : (
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                          <XAxis dataKey="name" stroke="#f59e0b" />
                          <YAxis stroke="#f59e0b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fef3c7', 
                              borderColor: '#f59e0b',
                              color: '#92400e',
                              borderRadius: '0.5rem'
                            }}
                            formatter={(value, name) => [`${value.toFixed(2)} W`, name]}
                          />
                          <Legend />
                          <Bar dataKey="Light" name="Lighting" fill="#fbbf24" />
                          <Bar dataKey="Fan" name="Fans" fill="#f59e0b" />
                          <Bar dataKey="AC" name="AC" fill="#d97706" />
                          <Bar dataKey="TV" name="TV/Electronics" fill="#b45309" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Room Energy Usage */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-900 dark:text-white">Room Energy Usage</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-700 dark:text-orange-300">Total energy consumption by room</span>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={energyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                        <XAxis dataKey="name" stroke="#f59e0b" />
                        <YAxis stroke="#f59e0b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fef3c7', 
                            borderColor: '#f59e0b',
                            color: '#92400e',
                            borderRadius: '0.5rem'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="total" name="Total Energy Usage" fill="#fbbf24" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Appliance Energy Usage */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-900 dark:text-white">Appliance Energy Usage</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-700 dark:text-orange-300">Total energy consumption by appliance</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={applianceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                          <XAxis dataKey="name" stroke="#f59e0b" />
                          <YAxis stroke="#f59e0b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fef3c7', 
                              borderColor: '#f59e0b',
                              color: '#92400e',
                              borderRadius: '0.5rem'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="value" name="Energy Usage (kWh)" fill="#fbbf24" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Pie Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={applianceData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {applianceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} kWh`, 'Energy Usage']}
                            contentStyle={{ 
                              backgroundColor: '#fef3c7', 
                              borderColor: '#f59e0b',
                              color: '#92400e',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Room Appliance Energy Usage */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-900 dark:text-white">Room Appliance Energy Usage</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-700 dark:text-orange-300">Energy consumption by appliance in each room</span>
                    </div>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={roomApplianceData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barSize={15}
                        barGap={0}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                        <XAxis dataKey="name" stroke="#f59e0b" />
                        <YAxis stroke="#f59e0b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fef3c7', 
                            borderColor: '#f59e0b',
                            color: '#92400e',
                            borderRadius: '0.5rem'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="Light" name="Lighting" fill="#fbbf24" />
                        <Bar dataKey="Fan" name="Fans" fill="#f59e0b" />
                        <Bar dataKey="AC" name="AC" fill="#d97706" />
                        <Bar dataKey="TV" name="TV/Electronics" fill="#b45309" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Side Column */}
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Total Energy Usage</p>
                        <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">
                          {monthlyData.length > 0 
                            ? `${Math.round(monthlyData.reduce((sum, item) => sum + parseFloat(item.Total), 0))} kWh` 
                            : 'N/A'}
                        </h3>
                        <p className="text-xs text-orange-600/70 dark:text-amber-400/70 mt-1">
                          {filterPeriod === 'monthly' ? 'Year to date' : filterPeriod === 'weekly' ? 'This week' : 'Today'}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <BoltIcon className="h-6 w-6 text-orange-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-orange-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          -5.2%
                        </span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 ml-2">
                          vs. previous period
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Peak Consumption</p>
                        <h3 className="text-2xl font-bold text-orange-900 dark:text-white mt-1">
                          {hourlyData.length > 0 
                            ? `${Math.max(...hourlyData.map(item => 
                                (parseFloat(item.Light) + parseFloat(item.Fan) + 
                                 parseFloat(item.AC) + parseFloat(item.TV)) * 1000
                              )).toFixed(0)} W` 
                            : 'N/A'}
                        </h3>
                        <p className="text-xs text-orange-600/70 dark:text-amber-400/70 mt-1">
                          Highest point today
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-orange-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                          +2.1%
                        </span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 ml-2">
                          vs. yesterday
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Alerts</h2>
                  <div className="space-y-4">
                    {alerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-4 rounded-lg border ${
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
      )}
    </div>
  );
}

export default Dashboard;
