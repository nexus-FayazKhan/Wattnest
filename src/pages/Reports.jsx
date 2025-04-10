import React, { useState } from 'react';
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
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';

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
const ReportDocument = ({ reportType }) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
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
              <Text style={styles.tableCell}>24,560</Text>
              <Text style={styles.tableCell}>26,780</Text>
              <Text style={styles.tableCell}>-8.3%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Peak Demand (kW)</Text>
              <Text style={styles.tableCell}>345</Text>
              <Text style={styles.tableCell}>378</Text>
              <Text style={styles.tableCell}>-8.7%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Cost ($)</Text>
              <Text style={styles.tableCell}>3,684</Text>
              <Text style={styles.tableCell}>4,017</Text>
              <Text style={styles.tableCell}>-8.3%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Carbon (kg CO2)</Text>
              <Text style={styles.tableCell}>12,280</Text>
              <Text style={styles.tableCell}>13,390</Text>
              <Text style={styles.tableCell}>-8.3%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.title}>Key Findings</Text>
          <Text style={styles.text}>• Energy consumption has decreased by 8.3% compared to the previous period</Text>
          <Text style={styles.text}>• Peak demand reduction of 8.7% has been achieved</Text>
          <Text style={styles.text}>• Cost savings of $333 have been realized</Text>
          <Text style={styles.text}>• Carbon emissions have been reduced by 1,110 kg CO2</Text>
        </View>
        
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
  
  // Function to download the visible report as PDF using html2canvas and jsPDF
  const downloadVisibleReport = () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    const reportElement = document.getElementById('report-preview');
    
    html2canvas(reportElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${selectedReport.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      setIsGenerating(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FloatingNav />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => (
            <motion.div
              key={report.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer border-2 transition-all duration-200 ${
                selectedReport?.id === report.id 
                  ? 'border-blue-500 ring-2 ring-blue-300' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <report.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {report.pages} pages
                </span>
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                {report.title}
              </h3>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {report.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {report.period}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Last updated: {report.lastGenerated}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Report Preview and Download Section */}
        {selectedReport ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedReport.title}
              </h2>
              
              <div className="flex space-x-3">
                <PDFDownloadLink
                  document={<ReportDocument reportType={selectedReport} />}
                  fileName={`${selectedReport.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-colors"
                >
                  {({ loading }) => (
                    <>
                      {loading ? (
                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                      )}
                      Download PDF
                    </>
                  )}
                </PDFDownloadLink>
                
                <button
                  onClick={downloadVisibleReport}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium rounded-md shadow transition-colors"
                >
                  {isGenerating ? (
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  )}
                  Export Current View
                </button>
              </div>
            </div>
            
            {/* Report Preview */}
            <div 
              id="report-preview"
              className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-blue-800">WattNest Energy Management</h1>
                <p className="text-gray-600 mt-2">{selectedReport.title} • {selectedReport.period}</p>
                <p className="text-gray-500 text-sm mt-1">Generated on: {format(new Date(), 'MMMM dd, yyyy')}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary</h2>
                <p className="text-gray-600 mb-4">{selectedReport.description}</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Metric</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Current</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Previous</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">Total Energy (kWh)</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">24,560</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">26,780</td>
                        <td className="py-2 px-4 border-b text-sm text-green-600">-8.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">Peak Demand (kW)</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">345</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">378</td>
                        <td className="py-2 px-4 border-b text-sm text-green-600">-8.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">Cost ($)</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">3,684</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">4,017</td>
                        <td className="py-2 px-4 border-b text-sm text-green-600">-8.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">Carbon (kg CO2)</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">12,280</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">13,390</td>
                        <td className="py-2 px-4 border-b text-sm text-green-600">-8.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Findings</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Energy consumption has decreased by 8.3% compared to the previous period</li>
                  <li>Peak demand reduction of 8.7% has been achieved</li>
                  <li>Cost savings of $333 have been realized</li>
                  <li>Carbon emissions have been reduced by 1,110 kg CO2</li>
                </ul>
              </div>
              
              <div className="text-center text-gray-500 text-sm mt-8">
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
    </div>
  );
};

export default Reports;
