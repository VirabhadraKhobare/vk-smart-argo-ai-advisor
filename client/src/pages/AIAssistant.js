/**
 * AI Assistant Page
 * Chat interface for farming queries with OpenAI integration
 */
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Container } from "react-bootstrap";
import {
  RiSendPlaneLine,
  RiRobot2Line,
  RiUserLine,
  RiSparklingLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { toast } from "react-toastify";
import chatService from "../services/chatService";
import "./AIAssistant.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `🌾 Hello! I'm your Smart Agro AI Assistant powered by OpenAI. I can help you with:

• Crop management advice
• Soil health recommendations
• Pest and disease control
• Weather-based farming tips
• Government scheme information
• Market price insights

What would you like to know about today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatService.sendMessage(input);
      const aiResponse =
        response.data?.response ||
        response.data?.message?.content ||
        "No response";

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Response received!");
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to get response. Please check your connection and try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ Sorry, I encountered an error: ${errorMsg}. Please try again or contact support.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `🌾 Hello! I'm your Smart Agro AI Assistant. What would you like to know about today?`,
        },
      ]);
      setError(null);
      toast.info("Chat cleared");
    }
  };

  const suggestedQuestions = [
    "How to improve soil health?",
    "Best irrigation practices for rice?",
    "What is PM-KISAN scheme?",
    "How to control aphids organically?",
    "When to harvest wheat?",
  ];

  return (
    <DashboardLayout title="AI Assistant">
      <Container fluid className="ai-assistant-container">
        <div className="chat-wrapper">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="d-flex align-items-center gap-2">
              <RiRobot2Line className="text-success fs-5" />
              <div>
                <h5 className="mb-0">Smart Agro AI Assistant</h5>
                <small className="text-muted">
                  Powered by OpenAI • Always here to help
                </small>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={clearChat}
              title="Clear chat"
            >
              <RiDeleteBin6Line />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages" ref={messagesContainerRef}>
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`chat-message ${message.role === "user" ? "chat-message-user" : "chat-message-assistant"}`}
                >
                  <div
                    className={`chat-avatar ${message.role === "user" ? "avatar-user" : "avatar-assistant"}`}
                  >
                    {message.role === "user" ? (
                      <RiUserLine />
                    ) : (
                      <RiRobot2Line />
                    )}
                  </div>
                  <div
                    className={`chat-bubble ${message.role === "user" ? "bubble-user" : "bubble-assistant"}`}
                  >
                    {message.content.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-1">
                        {line}
                      </p>
                    ))}
                    {message.timestamp && (
                      <small className="text-muted d-block mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Suggested Questions - Show only on initial state */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="suggested-section"
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <RiSparklingLine className="text-warning" />
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    <strong>Suggested questions:</strong>
                  </p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-sm btn-outline-success rounded-pill suggested-btn"
                      onClick={() => handleSuggestedQuestion(q)}
                      disabled={loading}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="chat-message chat-message-assistant"
              >
                <div className="chat-avatar avatar-assistant">
                  <RiRobot2Line />
                </div>
                <div className="chat-bubble bubble-assistant">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert alert-danger mx-2 mt-2 mb-0"
              role="alert"
            >
              <small>{error}</small>
            </motion.div>
          )}

          {/* Input Form */}
          <Form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-group">
              <input
                type="text"
                className="form-control chat-input"
                placeholder="Ask me anything about farming, crops, soil, weather..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button
                className="btn btn-success chat-send-btn"
                type="submit"
                disabled={!input.trim() || loading}
                title="Send message"
              >
                <RiSendPlaneLine size={20} />
              </button>
            </div>
            <small className="text-muted d-block mt-2">
              💡 Tip: Ask specific questions about your crops, soil, weather,
              government schemes, or market prices
            </small>
          </Form>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default AIAssistant;
