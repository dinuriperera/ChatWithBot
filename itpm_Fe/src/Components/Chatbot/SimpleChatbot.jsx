import React, { useState, useEffect, useRef } from 'react';
import './SimpleChatbot.css';

const SimpleChatbot = ({ onError }) => {
  const [messages, setMessages] = useState([
    { text: 'Welcome to our laptop shop! I\'m your virtual assistant, here to help you find the perfect laptop for your needs.', type: 'bot' }
  ]);
  const [currentStep, setCurrentStep] = useState('budget');
  const [userInput, setUserInput] = useState('');
  const [budget, setBudget] = useState(null);
  const [usage, setUsage] = useState(null);
  const [travel, setTravel] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState([]);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show typing indicator before sending bot messages
  const addBotMessage = (text, additionalProps = {}) => {
    setIsTyping(true);
    scrollToBottom();
    
    // Random typing delay between 800ms and 1500ms for natural feel
    const typingDelay = Math.floor(Math.random() * 700) + 800;
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { text, type: 'bot', ...additionalProps }]);
      scrollToBottom();
    }, typingDelay);
  };

  // Add the budget question shortly after the welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage('What is your budget for a new laptop?');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: userInput, type: 'user' }]);
    scrollToBottom();

    // Process based on current step
    if (currentStep === 'budget') {
      const budgetValue = parseFloat(userInput.replace(/[^0-9.]/g, ''));
      if (isNaN(budgetValue) || budgetValue <= 0) {
        addBotMessage('Please enter a valid budget.');
        setUserInput('');
        return;
      }
      setBudget(budgetValue);
      addBotMessage(`Thank you! I've noted your budget of approximately Rs ${budgetValue.toLocaleString()}.`);
      
      setTimeout(() => {
        addBotMessage('What will you mainly use the laptop for?');
        setShowOptions(true);
        setOptions([
          { value: 'browse', label: 'Browse the web' },
          { value: 'documents', label: 'Work on documents' },
          { value: 'videos', label: 'Watch videos' },
          { value: 'gaming', label: 'Gaming' },
          { value: 'development', label: 'Software development' },
          { value: 'design', label: 'Graphic design' },
          { value: 'other', label: 'Other' }
        ]);
        setCurrentStep('usage');
      }, 1500);
    } else if (currentStep === 'usage-input') {
      setUsage(userInput);
      addBotMessage(`Thank you for sharing how you'll use your laptop. For ${userInput}, we'll find the most suitable options for you.`);
      
      setTimeout(() => {
        addBotMessage('Do you plan to travel with your laptop frequently?');
        setShowOptions(true);
        setOptions([
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]);
        setCurrentStep('travel');
      }, 1500);
    }

    setUserInput('');
  };

  // Generate recommendations based on user input
  const getLaptopRecommendations = (budget, usage, travel) => {
    const laptopData = [
      {
        id: 1,
        name: 'Lenovo IdeaPad Slim 3',
        brand: 'Lenovo',
        price: 36999,
        specs: 'Intel Core i3-1115G4, 8GB RAM, 256GB SSD, 15.6" FHD Display',
        battery: '7 hours',
        weight: '1.7 kg',
        useCases: ['browse', 'documents', 'videos'],
        portable: true,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/320px-Lenovo_logo_2015.svg.png',
        recommendation: 'Best budget option'
      },
      {
        id: 2,
        name: 'HP Pavilion 14',
        brand: 'HP',
        price: 49999,
        specs: 'Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 14" FHD Display',
        battery: '8 hours',
        weight: '1.6 kg',
        useCases: ['browse', 'documents', 'videos', 'development'],
        portable: true,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/150px-HP_logo_2012.svg.png',
        recommendation: 'Best all-around option'
      },
      {
        id: 3,
        name: 'Dell G15 Gaming',
        brand: 'Dell',
        price: 74999,
        specs: 'Intel Core i5-12500H, 16GB RAM, 512GB SSD, NVIDIA RTX 3050, 15.6" FHD Display',
        battery: '5 hours',
        weight: '2.5 kg',
        useCases: ['gaming', 'videos', 'development'],
        portable: false,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/256px-Dell_Logo.svg.png',
        recommendation: 'Best for gaming'
      },
      {
        id: 4,
        name: 'Apple MacBook Air M2',
        brand: 'Apple',
        price: 89999,
        specs: 'Apple M2 chip, 8GB RAM, 256GB SSD, 13.6" Liquid Retina Display',
        battery: '18 hours',
        weight: '1.24 kg',
        useCases: ['browse', 'documents', 'videos', 'development', 'design'],
        portable: true,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/128px-Apple_logo_black.svg.png',
        recommendation: 'Best for portability and battery life'
      },
      {
        id: 5,
        name: 'ASUS ROG Strix G15',
        brand: 'ASUS',
        price: 94999,
        specs: 'AMD Ryzen 7 6800H, 16GB RAM, 1TB SSD, NVIDIA RTX 3060, 15.6" FHD 144Hz Display',
        battery: '5 hours',
        weight: '2.3 kg',
        useCases: ['gaming', 'development', 'design', 'videos'],
        portable: false,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/128px-ASUS_Logo.svg.png',
        recommendation: 'Best for high-performance gaming'
      },
      {
        id: 6,
        name: 'Microsoft Surface Laptop 5',
        brand: 'Microsoft',
        price: 104999,
        specs: 'Intel Core i7-1255U, 16GB RAM, 512GB SSD, 13.5" PixelSense Touch Display',
        battery: '17 hours',
        weight: '1.27 kg',
        useCases: ['documents', 'development', 'design', 'videos'],
        portable: true,
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/128px-Microsoft_logo_%282012%29.svg.png',
        recommendation: 'Best for productivity and design work'
      }
    ];
    
    // Filter by budget (consider laptops up to 20% above budget)
    let filteredLaptops = laptopData.filter(laptop => laptop.price <= budget * 1.2);
    
    // If we have a usage preference, prioritize laptops for that use case
    if (usage && usage !== 'other') {
      const directMatches = filteredLaptops.filter(laptop => laptop.useCases.includes(usage));
      
      // If we have direct matches, use those, otherwise keep all options
      if (directMatches.length > 0) {
        filteredLaptops = directMatches;
      }
    }
    
    // If travel is important, prioritize portable laptops
    if (travel === 'yes') {
      const portableLaptops = filteredLaptops.filter(laptop => laptop.portable);
      
      // If we have portable options, use those, otherwise keep all options
      if (portableLaptops.length > 0) {
        filteredLaptops = portableLaptops;
      }
    }
    
    // Sort by price to budget ratio for best match
    filteredLaptops.sort((a, b) => {
      // Get price difference ratio (closer to 1.0 is better)
      const aRatio = Math.min(budget / a.price, a.price / budget);
      const bRatio = Math.min(budget / b.price, b.price / budget);
      return bRatio - aRatio;
    });
    
    // Return top 3 recommendations or all if less than 3
    return filteredLaptops.slice(0, 3);
  };

  // Generate detailed specifications for laptops
  const generateDetailedSpecs = (recommendations) => {
    return recommendations.map(laptop => ({
      id: laptop.id,
      name: laptop.name,
      brand: laptop.brand,
      brandLogo: laptop.brandLogo,
      price: laptop.price,
      detailedSpecs: {
        processor: laptop.specs.split(',')[0],
        memory: laptop.specs.includes('RAM') ? laptop.specs.split(',').find(s => s.includes('RAM')).trim() : 'N/A',
        storage: laptop.specs.includes('SSD') ? laptop.specs.split(',').find(s => s.includes('SSD')).trim() : 'N/A',
        display: laptop.specs.includes('"') ? laptop.specs.split(',').find(s => s.includes('"')).trim() : 'N/A',
        graphics: laptop.specs.includes('NVIDIA') || laptop.specs.includes('RTX') || laptop.specs.includes('GTX') 
          ? laptop.specs.split(',').find(s => s.includes('NVIDIA') || s.includes('RTX') || s.includes('GTX')).trim() 
          : 'Integrated Graphics',
        battery: laptop.battery,
        weight: laptop.weight,
        portable: laptop.portable ? 'Yes, good for travel' : 'No, better for stationary use',
        useCases: laptop.useCases.join(', '),
        ports: 'USB-C, HDMI, USB-A, Audio Jack',
        operatingSystem: laptop.brand === 'Apple' ? 'macOS' : 'Windows 11',
        warranty: '1 Year Manufacturer Warranty',
        recommendation: laptop.recommendation
      }
    }));
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { text: option.label, type: 'user' }]);
    setShowOptions(false);
    
    if (currentStep === 'usage') {
      setUsage(option.value);
      
      if (option.value === 'other') {
        addBotMessage('Please tell me more about how you plan to use your laptop:');
        setCurrentStep('usage-input');
        return;
      }

      let responseText = '';
      switch (option.value) {
        case 'browse':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For casual browsing and basic tasks, we can focus on finding a balanced, cost-effective option.';
          break;
        case 'documents':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For working on documents, we\'ll focus on options with good battery life and comfortable keyboards.';
          break;
        case 'videos':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For watching videos, we\'ll focus on options with good displays and audio quality.';
          break;
        case 'gaming':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For gaming, we\'ll focus on options with powerful processors and dedicated graphics cards.';
          break;
        case 'development':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For software development, we\'ll focus on options with good performance and multitasking capabilities.';
          break;
        case 'design':
          responseText = 'Thank you for sharing how you\'ll use your laptop. For graphic design, we\'ll focus on options with high-quality displays and strong graphics performance.';
          break;
        default:
          responseText = 'Thank you for sharing how you\'ll use your laptop. We\'ll find the most suitable options for you.';
      }
      
      addBotMessage(responseText);

      setTimeout(() => {
        addBotMessage('Do you plan to travel with your laptop frequently?');
        setShowOptions(true);
        setOptions([
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]);
        setCurrentStep('travel');
      }, 2000);
    } else if (currentStep === 'travel') {
      setTravel(option.value);
      
      const travelResponse = option.value === 'yes' 
        ? 'Since you\'ll be traveling frequently with your laptop, I\'ll recommend lightweight and durable options with good battery life.'
        : 'Since you won\'t be traveling much with your laptop, we can focus on performance without worrying too much about weight or battery life.';
      
      addBotMessage(travelResponse);

      // Show laptop recommendations after a delay
      setTimeout(() => {
        const recommendations = getLaptopRecommendations(budget, usage, option.value === 'yes');
        
        // Create a summary of requirements
        const usageText = usage === 'browse' ? 'web browsing' : 
                         usage === 'documents' ? 'document editing' :
                         usage === 'videos' ? 'video watching' :
                         usage === 'gaming' ? 'gaming' :
                         usage === 'development' ? 'software development' :
                         usage === 'design' ? 'graphic design' :
                         usage || 'general use';
                         
        const travelText = option.value === 'yes' ? 'portable' : 'stationary';
        
        addBotMessage(`Based on your budget of Rs ${budget.toLocaleString()}, preference for ${usageText}, and need for a ${travelText} laptop, here are my recommendations:`, 
          { isRecommendation: true, recommendations });

        setTimeout(() => {
          addBotMessage('These laptops are selected based on your specific needs. The "match" indicator shows how well each laptop fits your requirements.');
          
          setTimeout(() => {
            addBotMessage('Is there anything else you would like to know about these laptops?');
            setShowOptions(true);
            setOptions([
              { value: 'yes', label: 'Yes, tell me more' },
              { value: 'no', label: 'No, thank you' }
            ]);
            setCurrentStep('final');
          }, 1800);
        }, 1500);
      }, 2200);
    } else if (currentStep === 'final') {
      if (option.value === 'yes') {
        // Create more detailed specifications message
        const detailedSpecs = generateDetailedSpecs(getLaptopRecommendations(budget, usage, travel === 'yes'));
        
        addBotMessage('Here are more detailed specifications for the recommended laptops:', 
          { isDetailedSpecs: true, detailedSpecs });
        
        setTimeout(() => {
          addBotMessage('Thank you for using our laptop shop assistant! We hope to see you soon.');
          setShowOptions(false);
          setCurrentStep('end');
        }, 2500);
      } else {
        addBotMessage('Thank you for using our laptop shop assistant! We hope to see you soon.');
        setShowOptions(false);
        setCurrentStep('end');
      }
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h3>Laptop Shop Assistant</h3>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => {
          if (message.isRecommendation) {
            return (
              <div key={index} className={`message ${message.type}`}>
                <p>{message.text}</p>
                <div className="recommendations">
                  {message.recommendations.map(laptop => (
                    <div key={laptop.id} className="recommendation-card">
                      <div className="card-header">
                        <img 
                          src={laptop.brandLogo} 
                          alt={laptop.brand} 
                          className="brand-logo"
                        />
                        <h4>{laptop.name}</h4>
                      </div>
                      <p className="price">Rs {laptop.price.toLocaleString()}</p>
                      <p className="specs">{laptop.specs}</p>
                      <p className="travel-info">
                        {laptop.portable 
                          ? '✓ Good for travel | ' 
                          : '✗ Not ideal for travel | '}
                        {laptop.battery}
                      </p>
                      <p className="recommendation-tag">{laptop.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          } else if (message.isDetailedSpecs) {
            return (
              <div key={index} className={`message ${message.type}`}>
                <p>{message.text}</p>
                <div className="detailed-specs">
                  {message.detailedSpecs.map(laptop => (
                    <div key={laptop.id} className="detailed-spec-card">
                      <div className="card-header">
                        <img 
                          src={laptop.brandLogo} 
                          alt={laptop.brand} 
                          className="brand-logo"
                        />
                        <h4>{laptop.name}</h4>
                      </div>
                      <p className="price">Rs {laptop.price.toLocaleString()}</p>
                      <div className="spec-details">
                        <div className="spec-row">
                          <span className="spec-label">Processor:</span>
                          <span className="spec-value">{laptop.detailedSpecs.processor}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Memory:</span>
                          <span className="spec-value">{laptop.detailedSpecs.memory}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Storage:</span>
                          <span className="spec-value">{laptop.detailedSpecs.storage}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Display:</span>
                          <span className="spec-value">{laptop.detailedSpecs.display}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Graphics:</span>
                          <span className="spec-value">{laptop.detailedSpecs.graphics}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Battery:</span>
                          <span className="spec-value">{laptop.detailedSpecs.battery}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Weight:</span>
                          <span className="spec-value">{laptop.detailedSpecs.weight}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Portable:</span>
                          <span className="spec-value">{laptop.detailedSpecs.portable}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">OS:</span>
                          <span className="spec-value">{laptop.detailedSpecs.operatingSystem}</span>
                        </div>
                      </div>
                      <p className="recommendation-tag">{laptop.detailedSpecs.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className={`message ${message.type}`}>
                {message.text}
              </div>
            );
          }
        })}
        {isTyping && (
          <div className="message bot typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showOptions && (
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={showOptions || currentStep === 'end'}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!userInput.trim() || showOptions || currentStep === 'end'}
          aria-label="Send message"
        >
          &#10148;
        </button>
      </div>
    </div>
  );
};

export default SimpleChatbot; 