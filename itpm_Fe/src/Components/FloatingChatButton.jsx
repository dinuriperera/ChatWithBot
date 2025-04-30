import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chatbot');
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center"
      aria-label="Chat with AI Assistant"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};

export default FloatingChatButton; 