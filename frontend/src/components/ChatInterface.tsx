/**
 * Chat interface for asking questions about the uploaded PDF
 */
import { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../services/api';
import type { Message } from '../types';

interface ChatInterfaceProps {
  documentId: string | null;
  documentName: string | null;
}

export default function ChatInterface({ documentId, documentName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !documentId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await askQuestion(documentId, inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to get answer'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!documentId) {
    return (
      <div className="chat-interface disabled">
        <h2>Ask Questions</h2>
        <p className="placeholder-text">Please upload a PDF document first to start asking questions.</p>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <h2>Ask Questions</h2>
      {documentName && (
        <p className="document-info">Document: {documentName}</p>
      )}
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="placeholder-text">Start a conversation about your document...</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-header">
                <span className="message-sender">
                  {message.type === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about your document..."
          disabled={loading}
          className="question-input"
          rows={3}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || loading}
          className="send-button"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
