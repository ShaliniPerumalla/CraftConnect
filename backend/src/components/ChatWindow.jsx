import React, { useState, useEffect, useRef } from 'react';
import { communicationService } from '../api/member3Services';

export default function ChatWindow({ conversationId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial message load and mark as read
  useEffect(() => {
    if (!conversationId) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const res = await communicationService.getMessages(conversationId);
        setMessages(res.data);
        await communicationService.markAsRead(conversationId);
      } catch (err) {
        console.error('Failed to load conversation messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [conversationId]);

  // 2. Polling for new messages every 3 seconds
  useEffect(() => {
    if (!conversationId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await communicationService.getMessages(conversationId);
        setMessages(res.data);
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  // Scroll whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Handle message submit
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);
      const res = await communicationService.sendMessage(conversationId, trimmed);
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Could not deliver message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div style={styles.centerContainer}>Loading conversation...</div>;
  }

  return (
    <div style={styles.chatContainer}>
      {/* Chat Header */}
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Order Discussion</h3>
        <span style={styles.badge}>Live</span>
      </div>

      {/* Messages Scroll Area */}
      <div style={styles.messageList}>
        {messages.length === 0 ? (
          <p style={styles.emptyPrompt}>No messages yet. Start the conversation below!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  ...styles.messageRow,
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor: isMe ? '#2563eb' : '#f3f4f6',
                    color: isMe ? '#ffffff' : '#1f2937',
                    borderBottomRightRadius: isMe ? '2px' : '16px',
                    borderBottomLeftRadius: isMe ? '16px' : '2px',
                  }}
                >
                  <div style={styles.bubbleText}>{msg.content}</div>
                  <div
                    style={{
                      ...styles.timestamp,
                      color: isMe ? '#bfdbfe' : '#9ca3af',
                      textAlign: isMe ? 'right' : 'left',
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          style={styles.inputField}
        />
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          style={{
            ...styles.sendButton,
            opacity: sending || !inputText.trim() ? 0.6 : 1,
          }}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '520px',
    height: '620px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  header: {
    padding: '14px 18px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    fontSize: '0.75rem',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '3px 8px',
    borderRadius: '999px',
    fontWeight: 600,
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  bubbleText: {
    fontSize: '0.92rem',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '0.7rem',
    marginTop: '4px',
  },
  inputContainer: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    gap: '8px',
  },
  inputField: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '0.92rem',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    color: '#6b7280',
  },
  emptyPrompt: {
    textAlign: 'center',
    color: '#9ca3af',
    margin: 'auto',
    fontSize: '0.9rem',
  },
};