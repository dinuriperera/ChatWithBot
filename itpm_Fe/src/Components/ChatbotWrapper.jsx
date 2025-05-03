import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

// Custom theme for the chatbot
const theme = {
  background: '#f5f5f5',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#0f4c81',
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#0f4c81',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

// Create a simpler recommendation component
const SimpleRecommendation = () => (
  <div>
    <p>Based on your preferences, here are my recommendations:</p>
    <ul>
      <li><strong>Budget Performer</strong> - Rs 35,000 - Core i3, 8GB RAM, 256GB SSD</li>
      <li><strong>Work Machine Pro</strong> - Rs 55,000 - Core i5, 16GB RAM, 512GB SSD</li>
      <li><strong>Ultraportable Plus</strong> - Rs 75,000 - Core i5, 16GB RAM, 512GB SSD, Lightweight</li>
    </ul>
    <p>These options are selected based on your budget, usage needs, and travel preferences.</p>
  </div>
);

const ChatbotWrapper = () => {
  // Steps for the chatbot conversation flow
  const steps = [
    {
      id: '1',
      message: 'Welcome to our laptop shop! I\'m your virtual assistant, here to help you find the perfect laptop for your needs.',
      trigger: '2',
    },
    {
      id: '2',
      message: 'What is your budget for a new laptop?',
      trigger: 'budget',
    },
    {
      id: 'budget',
      user: true,
      validator: (value) => {
        // Basic validation for budget input
        const budget = parseFloat(value.replace(/[^0-9.]/g, ''));
        if (isNaN(budget) || budget <= 0) {
          return 'Please enter a valid budget.';
        }
        return true;
      },
      trigger: 'budget-response',
    },
    {
      id: 'budget-response',
      message: ({ previousValue }) => {
        const budget = parseFloat(previousValue.replace(/[^0-9.]/g, ''));
        return `Thank you! I've noted your budget of approximately Rs ${budget.toLocaleString()}.`;
      },
      trigger: '5',
    },
    {
      id: '5',
      message: 'What will you mainly use the laptop for?',
      trigger: 'usage-options',
    },
    {
      id: 'usage-options',
      options: [
        { value: 'browse', label: 'Browse the web', trigger: 'browse-response' },
        { value: 'documents', label: 'Work on documents', trigger: 'documents-response' },
        { value: 'videos', label: 'Watch videos', trigger: 'videos-response' },
        { value: 'gaming', label: 'Gaming', trigger: 'gaming-response' },
        { value: 'development', label: 'Software development', trigger: 'development-response' },
        { value: 'design', label: 'Graphic design', trigger: 'design-response' },
        { value: 'other', label: 'Other', trigger: 'other-usage' },
      ],
    },
    {
      id: 'other-usage',
      user: true,
      trigger: 'other-response',
    },
    {
      id: 'other-response',
      message: ({ previousValue }) => {
        return `Thank you for sharing how you'll use your laptop. For ${previousValue}, we'll find the most suitable options for you.`;
      },
      trigger: 'travel-question',
    },
    {
      id: 'browse-response',
      message: 'Thank you for sharing how you\'ll use your laptop. For casual browsing and basic tasks, we can focus on finding a balanced, cost-effective option.',
      trigger: 'travel-question',
    },
    {
      id: 'documents-response',
      message: 'Thank you for sharing how you\'ll use your laptop. For working on documents, we\'ll focus on options with good battery life and comfortable keyboards.',
      trigger: 'travel-question',
    },
    {
      id: 'videos-response',
      message: 'Thank you for sharing how you\'ll use your laptop. For watching videos, we\'ll focus on options with good displays and audio quality.',
      trigger: 'travel-question',
    },
    {
      id: 'gaming-response',
      message: 'Thank you for sharing how you\'ll use your laptop. For gaming, we\'ll focus on options with powerful processors and dedicated graphics cards.',
      trigger: 'travel-question',
    },
    {
      id: 'development-response',
      message: 'Thank you for sharing how you\'ll use your laptop. For software development, we\'ll focus on options with good performance and multitasking capabilities.',
      trigger: 'travel-question',
    },
    {
      id: 'design-response',
      message: 'Thank you for how you\'ll use your laptop. For graphic design, we\'ll focus on options with high-quality displays and strong graphics performance.',
      trigger: 'travel-question',
    },
    {
      id: 'travel-question',
      message: 'Do you plan to travel with your laptop frequently?',
      trigger: 'travel-options',
    },
    {
      id: 'travel-options',
      options: [
        { value: 'yes', label: 'Yes', trigger: 'travel-yes-response' },
        { value: 'no', label: 'No', trigger: 'travel-no-response' },
      ],
    },
    {
      id: 'travel-yes-response',
      message: 'Since you\'ll be traveling frequently with your laptop, I\'ll recommend lightweight and durable options with good battery life.',
      trigger: 'recommendation',
    },
    {
      id: 'travel-no-response',
      message: 'Since you won\'t be traveling much with your laptop, we can focus on performance without worrying too much about weight or battery life.',
      trigger: 'recommendation',
    },
    {
      id: 'recommendation',
      component: <SimpleRecommendation />,
      asMessage: true,
      trigger: 'final-message',
    },
    {
      id: 'final-message',
      message: 'Is there anything else you would like to know about these laptops?',
      trigger: 'final-options',
    },
    {
      id: 'final-options',
      options: [
        { value: 'yes', label: 'Yes, tell me more', trigger: 'more-info' },
        { value: 'no', label: 'No, thank you', trigger: 'end-message' },
      ],
    },
    {
      id: 'more-info',
      message: 'Please feel free to visit our store or call our customer service at 1-800-LAPTOPS for more detailed information about our products.',
      trigger: 'end-message',
    },
    {
      id: 'end-message',
      message: 'Thank you for using our laptop shop assistant! We hope to see you soon.',
      end: true,
    },
  ];

  return (
    <div className="chatbot-wrapper flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">AI Laptop Assistant</h1>
      <div className="w-full max-w-4xl mx-auto bg-gray-800/50 rounded-xl p-8 border border-purple-500/30 shadow-lg">
        <ThemeProvider theme={theme}>
          <ChatBot
            steps={steps}
            headerTitle="Laptop Shop Assistant"
            floating={false}
            botDelay={500}
            userDelay={500}
            customDelay={500}
            width="100%"
            height="500px"
            enableSmoothScroll={true}
            cache={false}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ChatbotWrapper; 