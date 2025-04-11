import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  BoltIcon, 
  LightBulbIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';

// Sample energy-saving tips
const energySavingTips = [
  {
    id: 1,
    tip: "Turn off lights in unoccupied rooms to save up to 15% on lighting costs.",
    category: "lighting"
  },
  {
    id: 2,
    tip: "Set your thermostat to 78°F (26°C) in summer and 68°F (20°C) in winter for optimal energy efficiency.",
    category: "hvac"
  },
  {
    id: 3,
    tip: "Use LED bulbs which consume up to 90% less energy than incandescent bulbs and last 15 times longer.",
    category: "lighting"
  },
  {
    id: 4,
    tip: "Clean or replace HVAC filters every 1-3 months to improve efficiency by 5-15%.",
    category: "hvac"
  },
  {
    id: 5,
    tip: "Install occupancy sensors in common areas to automatically turn lights off when rooms are vacant.",
    category: "lighting"
  },
  {
    id: 6,
    tip: "Use natural ventilation when outdoor temperatures are moderate to reduce AC usage.",
    category: "hvac"
  },
  {
    id: 7,
    tip: "Implement a regular maintenance schedule for all appliances to ensure optimal performance.",
    category: "appliances"
  },
  {
    id: 8,
    tip: "Use smart power strips to eliminate phantom energy use from devices in standby mode.",
    category: "appliances"
  },
  {
    id: 9,
    tip: "Install window films or shades to reduce solar heat gain in summer by up to 70%.",
    category: "building"
  },
  {
    id: 10,
    tip: "Educate staff and guests about energy conservation practices to create a culture of sustainability.",
    category: "management"
  },
  {
    id: 11,
    tip: "Implement an auto power-off system that turns off all appliances when a room becomes vacant.",
    category: "automation"
  },
  {
    id: 12,
    tip: "Use door lock sensors to detect room occupancy and automatically adjust energy usage.",
    category: "automation"
  },
  {
    id: 13,
    tip: "Install a centralized dashboard to monitor energy usage across all hotel rooms in real-time.",
    category: "management"
  },
  {
    id: 14,
    tip: "Train housekeeping staff to turn off TVs, lights, and adjust thermostats during room cleaning.",
    category: "management"
  },
  {
    id: 15,
    tip: "Use motion sensors in hallways to reduce lighting usage during low-traffic periods.",
    category: "lighting"
  }
];

// Hotel-specific features
const hotelFeatures = [
  {
    id: 1,
    name: "Auto Power-Off",
    description: "Automatically turns off all appliances when a room becomes vacant (door locked).",
    benefit: "Reduces energy waste by up to 30% in unoccupied rooms."
  },
  {
    id: 2,
    name: "Room Occupancy Detection",
    description: "Uses door lock status to determine if a room is occupied or vacant.",
    benefit: "Enables targeted energy-saving measures based on real-time occupancy."
  },
  {
    id: 3,
    name: "Appliance Status Monitoring",
    description: "Displays ON/OFF status for all appliances in each room with visual indicators.",
    benefit: "Helps identify energy waste from appliances left on unnecessarily."
  },
  {
    id: 4,
    name: "Real-time Energy Usage",
    description: "Monitors current energy consumption for each room in the hotel.",
    benefit: "Identifies high-consumption rooms for targeted efficiency improvements."
  },
  {
    id: 5,
    name: "Centralized Dashboard",
    description: "Provides a grid view of all hotel rooms with their current status and energy usage.",
    benefit: "Enables management to quickly identify and address energy inefficiencies."
  }
];

function Tips() {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      type: 'bot', 
      content: "Hello! I'm your Hotel Energy Efficiency Assistant. Ask me any questions about saving energy in your hotel or about our energy management features."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Reports', path: '/reports' },
    { name: 'Tips', path: '/tips' },
    { name: 'Settings', path: '/settings' },
  ];

  // Function to generate response based on user question
  const generateResponse = async (userQuestion) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert question to lowercase for easier matching
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Check for different types of questions and provide appropriate responses
    let response = "";
    
    // Check for greetings
    if (lowerQuestion.match(/^(hello|hi|hey|greetings).*/)) {
      response = `Hello ${user?.firstName || 'there'}! How can I help you with hotel energy efficiency today?`;
    }
    // Check for questions about the hotel dashboard
    else if (lowerQuestion.includes('dashboard') || lowerQuestion.includes('room view') || lowerQuestion.includes('monitoring')) {
      response = "Our Hotel Room Dashboard provides:\n\n" + 
        "• Real-time monitoring of all hotel rooms in a grid layout\n" +
        "• Visual indicators for appliance status (ON/OFF) in each room\n" +
        "• User presence detection (Occupied/Vacant) based on room key status\n" +
        "• Door status monitoring (Locked/Unlocked) with toggle functionality\n" +
        "• Current energy usage metrics for each room\n\n" +
        "You can toggle between single room view and the complete dashboard view for comprehensive monitoring.";
    }
    // Check for questions about auto power-off
    else if (lowerQuestion.includes('auto') || lowerQuestion.includes('power off') || lowerQuestion.includes('automatic') || 
             lowerQuestion.includes('turn off') || lowerQuestion.includes('shut down')) {
      response = "Our Auto Power-Off Feature:\n\n" + 
        "• Automatically turns off all appliances when a room becomes vacant\n" +
        "• Uses door lock status to determine room occupancy\n" +
        "• Reduces energy waste by up to 30% in unoccupied rooms\n" +
        "• Works instantly when guests check out or leave their room\n" +
        "• Can be monitored and overridden from the central dashboard if needed\n\n" +
        "This feature alone has helped hotels save thousands in energy costs annually.";
    }
    // Check for questions about lighting
    else if (lowerQuestion.includes('light') || lowerQuestion.includes('lighting') || lowerQuestion.includes('bulb')) {
      response = "Here are some hotel lighting efficiency tips:\n\n" + 
        "• Replace all incandescent bulbs with LED lighting to save up to 90% energy\n" +
        "• Install occupancy sensors in common areas, corridors, and guest rooms\n" +
        "• Use task lighting in hotel rooms instead of lighting entire spaces\n" +
        "• Consider daylight harvesting systems in lobbies and restaurants\n" +
        "• Implement scheduled lighting controls in public areas based on usage patterns\n" +
        "• Our dashboard shows which rooms have lights on while unoccupied";
    }
    // Check for questions about HVAC
    else if (lowerQuestion.includes('hvac') || lowerQuestion.includes('air conditioning') || lowerQuestion.includes('heating') || 
             lowerQuestion.includes('ac') || lowerQuestion.includes('temperature')) {
      response = "Here are some hotel HVAC efficiency tips:\n\n" +
        "• Implement room-specific temperature controls that reset when rooms are vacant\n" +
        "• Install programmable thermostats and set them to 78°F (26°C) in summer and 68°F (20°C) in winter\n" +
        "• Use ceiling fans to improve air circulation and reduce AC load\n" +
        "• Clean or replace air filters every 1-3 months\n" +
        "• Consider installing energy recovery ventilators to recapture energy\n" +
        "• Our system can automatically adjust HVAC based on room occupancy status";
    }
    // Check for questions about water
    else if (lowerQuestion.includes('water') || lowerQuestion.includes('shower') || lowerQuestion.includes('faucet')) {
      response = "Here are some hotel water efficiency tips:\n\n" +
        "• Install low-flow showerheads and faucet aerators in all guest rooms\n" +
        "• Use WaterSense labeled toilets which use 20% less water\n" +
        "• Implement a towel and linen reuse program for guests\n" +
        "• Install a water monitoring system to detect leaks\n" +
        "• Consider gray water recycling systems for irrigation\n" +
        "• Train housekeeping staff on water conservation practices";
    }
    // Check for questions about appliances
    else if (lowerQuestion.includes('appliance') || lowerQuestion.includes('refrigerator') || 
             lowerQuestion.includes('tv') || lowerQuestion.includes('television') || lowerQuestion.includes('minibar')) {
      response = "Here are some hotel appliance efficiency tips:\n\n" +
        "• Replace old appliances with ENERGY STAR certified models\n" +
        "• Use smart power strips in guest rooms to eliminate phantom energy use\n" +
        "• Consider in-room occupancy sensors that control TV and other appliances\n" +
        "• Set minibars and refrigerators to optimal temperatures\n" +
        "• Our dashboard shows which appliances are currently active in each room\n" +
        "• The auto power-off feature turns off appliances when rooms are vacant";
    }
    // Check for questions about ROI or savings
    else if (lowerQuestion.includes('roi') || lowerQuestion.includes('return on investment') || 
             lowerQuestion.includes('save money') || lowerQuestion.includes('savings') || lowerQuestion.includes('cost')) {
      response = "Here are energy efficiency investments with strong ROI for hotels:\n\n" +
        "• LED lighting: 1-3 year payback period with 50-90% energy savings\n" +
        "• Occupancy-based controls: 1-2 year payback with 10-15% HVAC savings\n" +
        "• Auto power-off systems: 1-2 year payback with up to 30% energy savings\n" +
        "• Building automation systems: 3-5 year payback with 10-30% total energy savings\n" +
        "• Low-flow water fixtures: 1 year payback with 25-60% water savings\n" +
        "• Our dashboard provides detailed analytics to track your actual savings";
    }
    // Check for questions about building envelope
    else if (lowerQuestion.includes('building') || lowerQuestion.includes('insulation') || 
             lowerQuestion.includes('window') || lowerQuestion.includes('door')) {
      response = "Here are some building envelope efficiency tips for hotels:\n\n" +
        "• Improve insulation in walls, ceilings, and floors\n" +
        "• Install double or triple-pane windows with low-e coatings\n" +
        "• Use window films to reduce solar heat gain\n" +
        "• Seal air leaks around doors, windows, and penetrations\n" +
        "• Consider cool roofing materials to reduce heat absorption\n" +
        "• Our door sensors help monitor when doors are left open, affecting energy use";
    }
    // Check for questions about renewable energy
    else if (lowerQuestion.includes('renewable') || lowerQuestion.includes('solar') || 
             lowerQuestion.includes('wind') || lowerQuestion.includes('green energy')) {
      response = "Here are some renewable energy options for hotels:\n\n" +
        "• Solar PV systems: Can offset 20-100% of electricity use with 5-10 year payback\n" +
        "• Solar thermal for hot water: Can reduce water heating costs by 50-80%\n" +
        "• Green power purchasing: Buy renewable energy credits to offset carbon footprint\n" +
        "• Battery storage systems: Pair with renewables to optimize energy use\n" +
        "• Geothermal heat pumps: Can reduce heating and cooling costs by 25-50%\n" +
        "• Our energy dashboard can help track the performance of your renewable systems";
    }
    // Check for questions about hotel features
    else if (lowerQuestion.includes('feature') || lowerQuestion.includes('system') || 
             lowerQuestion.includes('technology') || lowerQuestion.includes('smart')) {
      response = "Our Hotel Energy Management System includes these key features:\n\n" + 
        hotelFeatures.map(feature => `• ${feature.name}: ${feature.description}`).join('\n') +
        "\n\nAll these features are accessible through our centralized dashboard, allowing you to monitor and control energy usage across your entire property.";
    }
    // Check for questions about best practices
    else if (lowerQuestion.includes('best practice') || lowerQuestion.includes('tip') || 
             lowerQuestion.includes('advice') || lowerQuestion.includes('suggestion')) {
      // Get random tips from our collection
      const randomTips = [...energySavingTips]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      response = "Here are some hotel energy-saving best practices:\n\n" + 
        randomTips.map(tip => `• ${tip.tip}`).join('\n');
    }
    // Default response for other questions
    else {
      response = "I'd be happy to help with your hotel energy efficiency questions. You might want to ask about:\n\n" +
        "• Our hotel room dashboard features\n" +
        "• The auto power-off system\n" +
        "• Lighting efficiency tips\n" +
        "• HVAC optimization strategies\n" +
        "• Water conservation methods\n" +
        "• Appliance energy-saving techniques\n" +
        "• ROI on energy efficiency investments";
    }
    
    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', content: question }]);
    
    // Clear input field
    const userQuestion = question;
    setQuestion('');
    
    // Add typing indicator
    setChatHistory(prev => [...prev, { type: 'typing' }]);
    
    // Generate response
    const response = await generateResponse(userQuestion);
    
    // Remove typing indicator and add bot response
    setChatHistory(prev => {
      const newHistory = prev.filter(msg => msg.type !== 'typing');
      return [...newHistory, { type: 'bot', content: response }];
    });
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    // Add a message to chat about the selected feature
    setChatHistory(prev => [
      ...prev, 
      { 
        type: 'user', 
        content: `Tell me about the ${feature.name} feature` 
      }
    ]);
    
    // Add typing indicator
    setChatHistory(prev => [...prev, { type: 'typing' }]);
    
    // Generate response about the feature
    setTimeout(() => {
      setChatHistory(prev => {
        const newHistory = prev.filter(msg => msg.type !== 'typing');
        return [
          ...newHistory, 
          { 
            type: 'bot', 
            content: `**${feature.name}**\n\n${feature.description}\n\n**Benefit:** ${feature.benefit}` 
          }
        ];
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900">
      <FloatingNav navItems={navItems} />
      
      <div className="container mx-auto px-4 py-8 pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header spacing - keeping margin top */}
          <div className="mb-6"></div>
          
          {/* Chat Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700 overflow-hidden flex flex-col h-[60vh]">
            {/* Chat Header */}
            <div className="bg-orange-100 dark:bg-gray-700 p-4 border-b border-amber-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-200 dark:bg-orange-900/30 rounded-full">
                  <LightBulbIcon className="h-6 w-6 text-orange-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-orange-900 dark:text-white">Hotel Energy Efficiency Assistant</h2>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Ask me about saving energy in your hotel</p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'typing' ? (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`rounded-lg p-4 max-w-[80%] ${
                        message.type === 'user' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-amber-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask about hotel energy-saving features..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-amber-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || !question.trim()}
                  className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center ${
                    (isTyping || !question.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isTyping ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Hotel Features Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-400 mb-4">Smart Hotel Energy Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotelFeatures.map(feature => (
                <div 
                  key={feature.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-amber-100 dark:border-gray-700 cursor-pointer hover:border-orange-400 transition-colors"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                      {feature.id === 1 ? (
                        <BoltIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                      ) : feature.id === 2 ? (
                        <HomeIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                      ) : feature.id === 5 ? (
                        <BuildingOfficeIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                      ) : (
                        <LightBulbIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-white">{feature.name}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tip Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-amber-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <BoltIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-white">Quick Energy Tips</h3>
              </div>
              <ul className="space-y-2">
                {energySavingTips.slice(0, 3).map(tip => (
                  <li key={tip.id} className="flex items-start space-x-2">
                    <span className="text-orange-500 dark:text-orange-400 mt-1">•</span>
                    <p className="text-gray-700 dark:text-gray-300">{tip.tip}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-amber-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <LightBulbIcon className="h-5 w-5 text-orange-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-white">Did You Know?</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Hotels typically consume 50% more energy per square foot than residential buildings. 
                Our auto power-off system can reduce energy waste by up to 30% in unoccupied rooms,
                while the centralized dashboard allows you to monitor and control energy usage across your entire property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tips;
