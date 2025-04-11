import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Sample data for reports
const reportTypes = [
  { 
    id: 'energy-consumption', 
    title: 'Energy Consumption Report', 
    description: 'Detailed breakdown of energy usage across all floors and zones',
    icon: BoltIcon,
    period: 'Last 30 days',
    lastGenerated: '2025-04-08',
    pages: 12
  },
  { 
    id: 'cost-analysis', 
    title: 'Cost Analysis Report', 
    description: 'Financial analysis of energy expenditure with cost-saving recommendations',
    icon: ChartBarIcon,
    period: 'Last quarter',
    lastGenerated: '2025-04-05',
    pages: 24
  },
  { 
    id: 'sustainability', 
    title: 'Sustainability Metrics', 
    description: 'Environmental impact assessment and carbon footprint analysis',
    icon: CalendarIcon,
    period: 'Year to date',
    lastGenerated: '2025-04-01',
    pages: 18
  },
  { 
    id: 'efficiency', 
    title: 'Efficiency Optimization', 
    description: 'Recommendations for improving energy efficiency across facilities',
    icon: DocumentTextIcon,
    period: 'Last 60 days',
    lastGenerated: '2025-03-28',
    pages: 15
  }
];

// PDF Document styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e40af'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginVertical: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    width: '25%'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

// PDF Document component
const ReportDocument = ({ reportType, monthlyData, hourlyData }) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  // Define calculation functions within the component to ensure they have access to the data
  const getTotalConsumption = () => {
    if (!monthlyData || !monthlyData.length) return 0;
    return monthlyData.reduce((total, item) => total + parseFloat(item.Total || 0), 0);
  };
  
  const calculateMonthlyChange = () => {
    // For demo purposes, calculate a random change between -10% and +5%
    return -5.3; // Fixed value for consistency in the PDF
  };
  
  const calculateEnergyCost = (consumption) => {
    // Assume $0.15 per kWh
    return consumption * 0.15;
  };
  
  const calculateCarbonEmissions = (consumption) => {
    // Assume 0.5 kg CO2 per kWh
    return consumption * 0.5;
  };
  
  const getApplianceData = () => {
    if (!monthlyData || !monthlyData.length) return [];
    
    // Calculate total usage for each appliance type
    let lightTotal = 0;
    let fanTotal = 0;
    let acTotal = 0;
    let tvTotal = 0;
    
    monthlyData.forEach(item => {
      lightTotal += parseFloat(item.Light || 0);
      fanTotal += parseFloat(item.Fan || 0);
      acTotal += parseFloat(item.AC || 0);
      tvTotal += parseFloat(item.TV || 0);
    });
    
    return [
      { name: 'Lighting', value: lightTotal },
      { name: 'Fans', value: fanTotal },
      { name: 'AC', value: acTotal },
      { name: 'TV/Electronics', value: tvTotal }
    ];
  };
  
  const totalConsumption = getTotalConsumption();
  const monthlyChange = calculateMonthlyChange();
  const energyCost = calculateEnergyCost(totalConsumption);
  const carbonEmissions = calculateCarbonEmissions(totalConsumption);
  const previousConsumption = totalConsumption / (1 + monthlyChange / 100);
  const previousCost = calculateEnergyCost(previousConsumption);
  const previousCarbon = calculateCarbonEmissions(previousConsumption);
  const costDifference = Math.abs(energyCost - previousCost);
  const carbonDifference = Math.abs(carbonEmissions - previousCarbon);
  const applianceData = getApplianceData();
  const largestConsumer = applianceData.sort((a, b) => b.value - a.value)[0]?.name || 'AC';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>WattNest Energy Management</Text>
        
        <View style={styles.section}>
          <Text style={styles.title}>{reportType.title}</Text>
          <Text style={styles.text}>Period: {reportType.period}</Text>
          <Text style={styles.text}>Generated on: {currentDate}</Text>
          <Text style={styles.text}>Report ID: {reportType.id}-{currentDate}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.text}>{reportType.description}</Text>
          
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Metric</Text>
              <Text style={styles.tableCell}>Current</Text>
              <Text style={styles.tableCell}>Previous</Text>
              <Text style={styles.tableCell}>Change</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Total Energy (kWh)</Text>
              <Text style={styles.tableCell}>{totalConsumption.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{previousConsumption.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{monthlyChange.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Cost ($)</Text>
              <Text style={styles.tableCell}>{energyCost.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{previousCost.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{monthlyChange.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Carbon (kg CO2)</Text>
              <Text style={styles.tableCell}>{carbonEmissions.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{previousCarbon.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{monthlyChange.toFixed(1)}%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Energy Consumption by Type</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Appliance Type</Text>
              <Text style={styles.tableCell}>Energy (kWh)</Text>
              <Text style={styles.tableCell}>Cost ($)</Text>
              <Text style={styles.tableCell}>% of Total</Text>
            </View>
            
            {applianceData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.value.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{calculateEnergyCost(item.value).toFixed(2)}</Text>
                <Text style={styles.tableCell}>{((item.value / totalConsumption) * 100).toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Key Findings</Text>
          <Text style={styles.text}>• Energy consumption has {monthlyChange <= 0 ? 'decreased' : 'increased'} by {Math.abs(monthlyChange).toFixed(1)}% compared to the previous period</Text>
          <Text style={styles.text}>• Cost {monthlyChange <= 0 ? 'savings' : 'increase'} of ${costDifference.toFixed(2)} have been {monthlyChange <= 0 ? 'realized' : 'incurred'}</Text>
          <Text style={styles.text}>• Carbon emissions have been {monthlyChange <= 0 ? 'reduced' : 'increased'} by {carbonDifference.toFixed(2)} kg CO2</Text>
          <Text style={styles.text}>• {largestConsumer} usage is the largest contributor to energy consumption</Text>
        </View>
        
        {reportType.id === 'cost-analysis' && (
          <View style={styles.section}>
            <Text style={styles.title}>Cost-Saving Recommendations</Text>
            <Text style={styles.text}>• Optimize AC Usage: Raising the temperature setpoint by 1°C could save approximately 6% in cooling costs.</Text>
            <Text style={styles.text}>  Potential Savings: ${(calculateEnergyCost(applianceData.find(item => item.name === 'AC')?.value || 0) * 0.06).toFixed(2)} per month</Text>
            <Text style={styles.text}>• LED Lighting Upgrade: Replacing conventional lighting with LED could reduce lighting energy consumption by up to 75%.</Text>
            <Text style={styles.text}>  Potential Savings: ${(calculateEnergyCost(applianceData.find(item => item.name === 'Lighting')?.value || 0) * 0.75).toFixed(2)} per month</Text>
            <Text style={styles.text}>• Smart Scheduling: Implementing occupancy-based scheduling could reduce overall energy consumption by 15-20%.</Text>
            <Text style={styles.text}>  Potential Savings: ${(calculateEnergyCost(totalConsumption) * 0.15).toFixed(2)} per month</Text>
          </View>
        )}
        
        <Text style={styles.footer}>
          WattNest Energy Management System • Generated on {currentDate} • Page 1 of {reportType.pages}
        </Text>
      </Page>
    </Document>
  );
};

// Main Reports component
const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  }, []);
  
  // Data processing functions
  const processMonthlyConsumption = () => {
    if (!monthlyData.length) return [];
    
    // Group by month and sum values for each appliance type
    const monthlyConsumption = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    monthlyData.forEach(item => {
      if (!item.month_year || typeof item.month_year !== 'string') return;
      
      const [year, month] = item.month_year.split('-');
      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex];
      
      if (!monthlyConsumption[monthName]) {
        monthlyConsumption[monthName] = {
          name: monthName,
          Light: 0,
          Fan: 0,
          AC: 0,
          TV: 0,
          Total: 0
        };
      }
      
      // Add values directly from the CSV columns
      monthlyConsumption[monthName].Light += parseFloat(item.Light || 0);
      monthlyConsumption[monthName].Fan += parseFloat(item.Fan || 0);
      monthlyConsumption[monthName].AC += parseFloat(item.AC || 0);
      monthlyConsumption[monthName].TV += parseFloat(item.TV || 0);
      monthlyConsumption[monthName].Total += parseFloat(item.Total || 0);
    });
    
    return Object.values(monthlyConsumption);
  };
  
  const processRoomData = () => {
    if (!monthlyData.length) return [];
    
    // Group by room and sum values
    const roomData = {};
    
    monthlyData.forEach(item => {
      const roomId = item.roomId;
      if (!roomId) return;
      
      const roomName = `Room ${roomId}`;
      
      if (!roomData[roomName]) {
        roomData[roomName] = {
          name: roomName,
          total: 0
        };
      }
      
      roomData[roomName].total += parseFloat(item.Total || 0);
    });
    
    // Sort by consumption (descending)
    return Object.values(roomData).sort((a, b) => b.total - a.total);
  };
  
  const processApplianceData = () => {
    if (!monthlyData.length) return [];
    
    // Calculate total usage for each appliance type
    const applianceData = {
      Light: { name: 'Lighting', value: 0, fill: '#fbbf24' },
      Fan: { name: 'Fans', value: 0, fill: '#f59e0b' },
      AC: { name: 'AC', value: 0, fill: '#d97706' },
      TV: { name: 'TV/Electronics', value: 0, fill: '#b45309' }
    };
    
    monthlyData.forEach(item => {
      applianceData.Light.value += parseFloat(item.Light || 0);
      applianceData.Fan.value += parseFloat(item.Fan || 0);
      applianceData.AC.value += parseFloat(item.AC || 0);
      applianceData.TV.value += parseFloat(item.TV || 0);
    });
    
    // Return only appliances with non-zero values, sorted by value
    return Object.values(applianceData)
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };
  
  const getTotalConsumption = () => {
    if (!monthlyData.length) return 0;
    return monthlyData.reduce((total, item) => total + parseFloat(item.Total || 0), 0);
  };
  
  const calculateMonthlyChange = () => {
    // For demo purposes, calculate a random change between -10% and +5%
    return Math.random() * 15 - 10;
  };
  
  const calculateEnergyCost = (consumption) => {
    // Assume $0.15 per kWh
    return consumption * 0.15;
  };
  
  const calculateCarbonEmissions = (consumption) => {
    // Assume 0.5 kg CO2 per kWh
    return consumption * 0.5;
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Reports', path: '/reports' },
    { name: 'Tips', path: '/tips' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 pt-16">
      <FloatingNav navItems={navItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className='h-10 w-full rounded-xl shadow-lg'></div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-orange-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Loading report data...</h2>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-red-500 mb-4">
                  <DocumentTextIcon className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Report Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((report) => (
                  <motion.div
                    key={report.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer border-2 ${
                      selectedReport?.id === report.id 
                        ? 'border-orange-500 dark:border-orange-400' 
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <report.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {report.period}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                      {report.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {report.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Last generated: {report.lastGenerated}</span>
                      <span>{report.pages} pages</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Report Preview and Download */}
              <div className="mt-8 flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedReport ? `${selectedReport.title} Preview` : 'Report Preview'}
                  </h2>
                  
                  {selectedReport && (
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <button 
                        onClick={() => {
                          const reportElement = document.getElementById('report-preview');
                          if (!reportElement) return;
                          
                          setIsGenerating(true);
                          html2canvas(reportElement).then(canvas => {
                            const imgData = canvas.toDataURL('image/png');
                            const pdf = new jsPDF('p', 'mm', 'a4');
                            const imgWidth = 210;
                            const imgHeight = canvas.height * imgWidth / canvas.width;
                            
                            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                            pdf.save(`${selectedReport.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
                            setIsGenerating(false);
                          }).catch(err => {
                            console.error("Error generating PDF:", err);
                            setIsGenerating(false);
                          });
                        }}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                      >
                        {isGenerating ? (
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                        )}
                        Download Preview
                      </button>
                      
                      <PDFDownloadLink
                        document={<ReportDocument reportType={selectedReport} monthlyData={monthlyData} hourlyData={hourlyData} />}
                        fileName={`${selectedReport.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                      >
                        {({ blob, url, loading, error }) => 
                          loading ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                              Generating PDF...
                            </>
                          ) : error ? (
                            <>
                              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                              Error: Try Again
                            </>
                          ) : (
                            <>
                              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                              Download Full Report
                            </>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  )}
                </div>
                
                {selectedReport ? (
                  <div id="report-preview" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WattNest Energy Management</h1>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{selectedReport.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Period: {selectedReport.period} • Generated on {format(new Date(), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      
                      {selectedReport.id === 'energy-consumption' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Energy by Room</h2>
                              <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={processRoomData()} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                                    <XAxis type="number" stroke="#f59e0b" />
                                    <YAxis dataKey="name" type="category" stroke="#f59e0b" />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#fef3c7', 
                                        borderColor: '#f59e0b',
                                        color: '#92400e',
                                        borderRadius: '0.5rem'
                                      }}
                                      formatter={(value) => [`${value.toFixed(2)} kWh`, 'Energy Usage']}
                                    />
                                    <Bar dataKey="total" name="Energy Usage (kWh)" fill="#f59e0b" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Energy by Appliance Type</h2>
                              <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={processApplianceData()}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="value"
                                      nameKey="name"
                                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                      {processApplianceData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                    </Pie>
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#fef3c7', 
                                        borderColor: '#f59e0b',
                                        color: '#92400e',
                                        borderRadius: '0.5rem'
                                      }}
                                      formatter={(value) => [`${value.toFixed(2)} kWh`, 'Energy Usage']}
                                    />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Summary Metrics</h2>
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Metric</th>
                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Current</th>
                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Previous</th>
                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Change</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Use real data */}
                                  {(() => {
                                    const totalConsumption = getTotalConsumption();
                                    const monthlyChange = calculateMonthlyChange();
                                    const energyCost = calculateEnergyCost(totalConsumption);
                                    const carbonEmissions = calculateCarbonEmissions(totalConsumption);
                                    
                                    // Assume 5% reduction from previous period for demo
                                    const previousConsumption = totalConsumption / (1 + monthlyChange / 100);
                                    const previousCost = calculateEnergyCost(previousConsumption);
                                    const previousCarbon = calculateCarbonEmissions(previousConsumption);
                                    
                                    return (
                                      <>
                                        <tr>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Total Energy (kWh)</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{totalConsumption.toFixed(2)}</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{previousConsumption.toFixed(2)}</td>
                                          <td className={`py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm ${monthlyChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {monthlyChange.toFixed(1)}%
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Cost ($)</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{energyCost.toFixed(2)}</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{previousCost.toFixed(2)}</td>
                                          <td className={`py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm ${monthlyChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {monthlyChange.toFixed(1)}%
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Carbon (kg CO2)</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{carbonEmissions.toFixed(2)}</td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">{previousCarbon.toFixed(2)}</td>
                                          <td className={`py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-sm ${monthlyChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {monthlyChange.toFixed(1)}%
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Key Findings</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                              {(() => {
                                const monthlyChange = calculateMonthlyChange();
                                const totalConsumption = getTotalConsumption();
                                const energyCost = calculateEnergyCost(totalConsumption);
                                const previousConsumption = totalConsumption / (1 + monthlyChange / 100);
                                const previousCost = calculateEnergyCost(previousConsumption);
                                const costDifference = Math.abs(energyCost - previousCost).toFixed(2);
                                const carbonDifference = Math.abs(calculateCarbonEmissions(totalConsumption) - calculateCarbonEmissions(previousConsumption)).toFixed(2);
                                
                                return (
                                  <>
                                    <li>Energy consumption has {monthlyChange <= 0 ? 'decreased' : 'increased'} by {Math.abs(monthlyChange).toFixed(1)}% compared to the previous period</li>
                                    <li>Cost {monthlyChange <= 0 ? 'savings' : 'increase'} of ${costDifference} have been {monthlyChange <= 0 ? 'realized' : 'incurred'}</li>
                                    <li>Carbon emissions have been {monthlyChange <= 0 ? 'reduced' : 'increased'} by {carbonDifference} kg CO2</li>
                                    <li>AC usage continues to be the largest contributor to energy consumption</li>
                                  </>
                                );
                              })()}
                            </ul>
                          </div>
                        </>
                      )}
                      
                      {selectedReport.id === 'cost-analysis' && (
                        <>
                          <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cost by Room</h2>
                            <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={processRoomData().map(room => ({
                                  ...room,
                                  totalCost: room.total * 0.15
                                }))} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b33" />
                                  <XAxis type="number" stroke="#f59e0b" />
                                  <YAxis dataKey="name" type="category" stroke="#f59e0b" />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#fef3c7', 
                                      borderColor: '#f59e0b',
                                      color: '#92400e',
                                      borderRadius: '0.5rem'
                                    }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
                                  />
                                  <Bar dataKey="totalCost" name="Cost ($)" fill="#f59e0b" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cost-Saving Recommendations</h2>
                            <div className="space-y-4">
                              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                                <h3 className="font-medium text-gray-800 dark:text-white">Optimize AC Usage</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">Raising the temperature setpoint by 1°C could save approximately 6% in cooling costs.</p>
                                <div className="mt-2 flex items-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Potential Savings:</span>
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    ${(calculateEnergyCost(getTotalConsumption()) * 0.06).toFixed(2)} per month
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                                <h3 className="font-medium text-gray-800 dark:text-white">LED Lighting Upgrade</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">Replacing conventional lighting with LED could reduce lighting energy consumption by up to 75%.</p>
                                <div className="mt-2 flex items-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Potential Savings:</span>
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    ${(calculateEnergyCost(processApplianceData().find(item => item.name === 'Lighting')?.value || 0) * 0.75).toFixed(2)} per month
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                                <h3 className="font-medium text-gray-800 dark:text-white">Smart Scheduling</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">Implementing occupancy-based scheduling could reduce overall energy consumption by 15-20%.</p>
                                <div className="mt-2 flex items-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Potential Savings:</span>
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    ${(calculateEnergyCost(getTotalConsumption()) * 0.15).toFixed(2)} per month
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                        WattNest Energy Management System • Generated on {format(new Date(), 'MMMM dd, yyyy')} • Page 1 of {selectedReport.pages}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-white">
                      Select a report to preview
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      Choose one of the report types above to view and download
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
