import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/chatApi';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSessions, setChatSessions] = useState([]);

  // Load chat history from API when component mounts
  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await chatApi.getChatHistory();
      if (response.status === 'success' && response.data.message) {
        // Transform API data to chat sessions format
        const sessions = response.data.message.map((item, index) => ({
          id: index + 1,
          title: item.message.length > 30 ? item.message.substring(0, 30) + '...' : item.message,
          lastMessage: item.response,
          timestamp: new Date(),
          unread: 0,
          messages: [
            {
              id: 1,
              text: item.message,
              sender: "user",
              timestamp: new Date()
            },
            {
              id: 2,
              text: item.response,
              sender: "bot",
              timestamp: new Date()
            }
          ]
        }));
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Original dummy data for fallback
  const [dummySessions] = useState([
    {
      id: 1,
      title: "Machine M001 Issue",
      lastMessage: "Temperature exceeded threshold",
      timestamp: new Date(2025, 11, 4, 14, 30),
      unread: 2,
      messages: [
        {
          id: 1,
          text: "I noticed Machine M001 showing high temperature",
          sender: "user",
          timestamp: new Date(2025, 11, 4, 14, 25)
        },
        {
          id: 2,
          text: "Thank you for reporting. I've checked the logs. The air temperature is at 315K, which is above the normal range.",
          sender: "bot",
          timestamp: new Date(2025, 11, 4, 14, 26)
        },
        {
          id: 3,
          text: "What should I do?",
          sender: "user",
          timestamp: new Date(2025, 11, 4, 14, 27)
        },
        {
          id: 4,
          text: "I recommend immediate inspection and possible coolant system check. Temperature exceeded threshold.",
          sender: "bot",
          timestamp: new Date(2025, 11, 4, 14, 30)
        }
      ]
    },
    {
      id: 2,
      title: "Maintenance Schedule",
      lastMessage: "When is the next scheduled maintenance?",
      timestamp: new Date(2025, 11, 3, 10, 15),
      unread: 0,
      messages: [
        {
          id: 1,
          text: "When is the next scheduled maintenance?",
          sender: "user",
          timestamp: new Date(2025, 11, 3, 10, 10)
        },
        {
          id: 2,
          text: "Based on your maintenance records, the next scheduled maintenance is on December 8, 2025.",
          sender: "bot",
          timestamp: new Date(2025, 11, 3, 10, 12)
        },
        {
          id: 3,
          text: "Which machines need maintenance?",
          sender: "user",
          timestamp: new Date(2025, 11, 3, 10, 13)
        },
        {
          id: 4,
          text: "Machines M012, M045, and M078 are due for routine maintenance checks.",
          sender: "bot",
          timestamp: new Date(2025, 11, 3, 10, 15)
        }
      ]
    },
    {
      id: 3,
      title: "Tool Wear Alert",
      lastMessage: "Tool wear approaching limit on M045",
      timestamp: new Date(2025, 11, 2, 16, 45),
      unread: 1,
      messages: [
        {
          id: 1,
          text: "Alert for Machine M045",
          sender: "user",
          timestamp: new Date(2025, 11, 2, 16, 40)
        },
        {
          id: 2,
          text: "Machine M045 has tool wear at 220 minutes, approaching the replacement threshold of 240 minutes.",
          sender: "bot",
          timestamp: new Date(2025, 11, 2, 16, 42)
        },
        {
          id: 3,
          text: "Should we replace it now?",
          sender: "user",
          timestamp: new Date(2025, 11, 2, 16, 43)
        },
        {
          id: 4,
          text: "Tool wear approaching limit on M045. I recommend scheduling replacement within the next 2 operating days.",
          sender: "bot",
          timestamp: new Date(2025, 11, 2, 16, 45)
        }
      ]
    },
    {
      id: 4,
      title: "System Performance",
      lastMessage: "Overall system health check",
      timestamp: new Date(2025, 11, 1, 9, 20),
      unread: 0,
      messages: [
        {
          id: 1,
          text: "Can you give me a system overview?",
          sender: "user",
          timestamp: new Date(2025, 11, 1, 9, 15)
        },
        {
          id: 2,
          text: "Overall system health check: 85% of machines are operating normally. 3 machines require attention.",
          sender: "bot",
          timestamp: new Date(2025, 11, 1, 9, 17)
        },
        {
          id: 3,
          text: "Which machines need attention?",
          sender: "user",
          timestamp: new Date(2025, 11, 1, 9, 18)
        },
        {
          id: 4,
          text: "Machines M001, M034, and M045 show anomalies and should be inspected.",
          sender: "bot",
          timestamp: new Date(2025, 11, 1, 9, 20)
        }
      ]
    }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowHistory(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const selectSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setShowHistory(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! How can I help you today?",
        sender: "bot",
        timestamp: new Date()
      }
    ]);
    setCurrentSessionId(null);
    setShowHistory(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call API to generate response
      const response = await chatApi.generateResponse(messageToSend);
      
      if (response.status === 'success' && response.data.message) {
        const botResponse = {
          id: messages.length + 2,
          text: response.data.message,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Refresh history after new message
        loadChatHistory();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1F3A5F] to-[#4D648D] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showHistory ? (
                <button
                  onClick={toggleHistory}
                  className="p-2 text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                  <svg className="w-6 h-6 text-[#1F3A5F]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {showHistory ? 'Chat History' : (currentSessionId ? chatSessions.find(s => s.id === currentSessionId)?.title : 'Support Chat')}
                </h3>
                <p className="text-xs text-white/70">
                  {showHistory ? 'Your previous conversations' : "We're here to help"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showHistory && (
                <>
                  <button
                    onClick={startNewChat}
                    className="p-2 text-white transition-colors rounded-full hover:bg-white/10"
                    title="New Chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={toggleHistory}
                    className="p-2 text-white transition-colors rounded-full hover:bg-white/10"
                    title="Chat History"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </>
              )}
              <button
                onClick={toggleChat}
                className="p-2 text-white transition-colors rounded-full hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Area */}
          {showHistory ? (
            /* History List */
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3A5F]"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                  </div>
                </div>
              ) : chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => selectSession(session.id)}
                    className="p-4 transition-colors border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-800">{session.title}</h4>
                      {session.unread > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                          {session.unread}
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-xs text-gray-600 line-clamp-1">{session.lastMessage}</p>
                    <p className="text-xs text-gray-400">
                      {session.timestamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">No chat history yet</p>
                </div>
              )}
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#1F3A5F] text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="px-4 py-3 text-gray-800 bg-white shadow-sm rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input - Only show when not in history view */}
          {!showHistory && (
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#1F3A5F] text-white rounded-full p-4 hover:bg-[#2A4A6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rotate-90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed z-40 p-4 transition-all bg-white rounded-full shadow-2xl bottom-6 right-6 hover:bg-gray-100 hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}
      </button>
    </>
  );
};

export default FloatingChat;
