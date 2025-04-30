import React, { useState, useEffect } from 'react';
import SimpleChatbot from '../Components/Chatbot/SimpleChatbot.jsx';
import '../Components/Chatbot/SimpleChatbot.css';
import { FaSpinner } from 'react-icons/fa';

const ChatBot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate loading for better user experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleChatbotError = (error) => {
    console.error("Error rendering Chatbot:", error);
    setHasError(true);
  };

  return (
    <div className="chatbot-page-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-start', 
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '10px 20px 30px',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(rgba(79, 70, 229, 0.05) 2px, transparent 2px)',
      backgroundSize: '30px 30px',
      overflow: 'auto'
    }}>
      <div className="chatbot-page-header" style={{
        textAlign: 'center',
        marginBottom: '20px',
        maxWidth: '780px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Laptop Shop Assistant
        </h1>
      </div>

      {isLoading ? (
        <div className="loading-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '60px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <div className="spinner-container" style={{
            width: '60px',
            height: '60px',
            position: 'relative'
          }}>
            <FaSpinner className="spinner" style={{
              fontSize: '60px',
              color: '#4F46E5',
              animation: 'spin 1.5s linear infinite',
              position: 'absolute',
              top: '0',
              left: '0'
            }} />
          </div>
          <p style={{ 
            color: '#4b5563', 
            fontSize: '18px',
            fontFamily: 'Poppins, sans-serif',
            marginTop: '10px'
          }}>
            Initializing Laptop Shop Assistant...
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <React.Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <FaSpinner style={{ fontSize: '40px', color: '#4F46E5', animation: 'spin 1s linear infinite' }} />
          </div>
        }>
          {!hasError ? (
            <div style={{ width: '100%' }}>
              <SimpleChatbot onError={handleChatbotError} />
            </div>
          ) : (
            <div className="error-container" style={{
              textAlign: 'center',
              padding: '40px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              backgroundColor: 'white',
              maxWidth: '500px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
              fontFamily: 'Poppins, sans-serif'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 20px',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ 
                  fontSize: '40px', 
                  color: '#ef4444'
                }}>
                  &#9888;
                </span>
              </div>
              <h3 style={{ 
                color: '#111827', 
                marginBottom: '15px',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Oops! Something went wrong
              </h3>
              <p style={{ 
                marginBottom: '25px', 
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                We encountered an issue loading the chatbot assistant. Please try again later or contact our support team if the problem persists.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px',
                  boxShadow: '0 4px 8px rgba(79, 70, 229, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Try Again
              </button>
            </div>
          )}
        </React.Suspense>
      )}
    </div>
  );
};

export default ChatBot; 