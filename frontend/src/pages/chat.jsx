// src/pages/chat.jsx

import { useRef, useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MessageSquare,
  Send,
  Paperclip,
  X,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  User,
} from "lucide-react";
import "./chat.css";

export default function Chat() {
  const {
    conversations,
    activeConversation,
    activeMessages,
    loadingConversations,
    loadingMessages,
    conversationsError,
    messagesError,
    refreshConversations,
    selectConversation,
    sendMessage,
  } = useChat();

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Hidden file input reference
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // ======================================================
  // SEND MESSAGE
  // ======================================================
  function handleSend() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !selectedFile) {
      return;
    }

    sendMessage(trimmedMessage, selectedFile);
    setMessage("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleAttachmentClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    });
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber-dark text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              MakerMatch Studio Communication
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-semibold text-ink">
              Direct Maker & Client Messaging
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl">
              Collaborate directly with artisans, discuss bespoke requirements, clarify quotation details, and track project milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshConversations}
              disabled={loadingConversations}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-border text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream transition-all shadow-2xs"
            >
              <RefreshCw size={13} className={loadingConversations ? "animate-spin" : ""} />
              Sync Messages
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest/10 border border-forest/20 text-forest text-xs font-semibold">
              <ShieldCheck size={14} />
              Verified & Safe
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {conversationsError && (
          <div className="mb-4 p-3 bg-amber/10 border border-amber/30 rounded-xl flex items-center justify-between text-xs text-amber-dark">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{conversationsError}</span>
            </div>
            <button
              type="button"
              onClick={refreshConversations}
              className="underline font-semibold hover:text-ink"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==================================================
            CHAT CONTAINER
        ================================================== */}
        <div className="chat-container shadow-sm border border-border rounded-2xl overflow-hidden bg-white min-h-[640px]">
          {/* ==================================================
              CONVERSATION LIST PANEL
          ================================================== */}
          <aside className="conversation-panel border-r border-border bg-white flex flex-col">
            <div className="conversation-header p-4 border-b border-border bg-cream/30 flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-base text-ink m-0">
                  Conversations
                </h2>
                <span className="text-xs text-ink-muted">
                  {conversations.length} active channel{conversations.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Conversation List / Loading / Empty */}
            <div className="conversation-list flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-6 text-center text-xs text-ink-muted space-y-3">
                  <div className="animate-pulse space-y-3">
                    <div className="h-12 bg-cream rounded-xl"></div>
                    <div className="h-12 bg-cream rounded-xl"></div>
                    <div className="h-12 bg-cream rounded-xl"></div>
                  </div>
                  <p className="mt-2 text-ink-soft">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-ink-muted">
                  <MessageSquare size={32} className="text-ink-muted/40 mx-auto mb-3" />
                  <p className="font-semibold text-ink">No conversations yet</p>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Start a conversation from your Requirements or Quotations screen.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  const initials = conv.name
                    ? conv.name
                        .split(" ")
                        .filter(Boolean)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "MM";

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      className={`conversation-item flex items-center gap-3 w-full p-4 border-b border-border/60 text-left transition-colors ${
                        isActive ? "bg-amber/10 border-l-4 border-l-amber-dark" : "hover:bg-cream/50"
                      }`}
                      onClick={() => selectConversation(conv.id)}
                    >
                      <div className="conversation-avatar shrink-0 w-11 h-11 rounded-full bg-cream-dark/60 text-ink font-bold flex items-center justify-center text-xs border border-border">
                        {initials}
                      </div>

                      <div className="conversation-info min-w-0 flex-1">
                        <div className="conversation-top flex items-center justify-between gap-2">
                          <strong className="text-xs font-semibold text-ink truncate block">
                            {conv.name}
                          </strong>
                          <span className="text-[10px] text-ink-muted shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <div className="conversation-bottom flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs text-ink-soft truncate m-0">
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <span className="unread-count shrink-0 bg-amber-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ==================================================
              CHAT WINDOW
          ================================================== */}
          <section className="chat-window flex-1 flex flex-col bg-white">
            {activeConversation ? (
              <>
                {/* Chat Window Header */}
                <header className="chat-window-header p-4 border-b border-border bg-cream/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="creator-avatar w-11 h-11 rounded-full bg-amber/20 text-amber-dark font-bold flex items-center justify-center text-xs border border-amber/30 relative">
                      {activeConversation.name
                        ? activeConversation.name
                            .split(" ")
                            .filter(Boolean)
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "MM"}
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-forest border-2 border-white" />
                    </div>

                    <div>
                      <h2 className="font-display font-semibold text-base text-ink m-0">
                        {activeConversation.name}
                      </h2>
                      <p className="text-[11px] text-forest font-medium m-0 flex items-center gap-1">
                        ● Online • Direct Escrow Protected Chat
                      </p>
                    </div>
                  </div>

                  {activeConversation.requirement && (
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                        Linked Order
                      </span>
                      <span className="text-xs font-bold text-amber-dark">
                        #{activeConversation.requirement}
                      </span>
                    </div>
                  )}
                </header>

                {/* Messages Error notification */}
                {messagesError && (
                  <div className="p-2.5 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                    <span>{messagesError}</span>
                    <button
                      type="button"
                      onClick={() => selectConversation(activeConversation.id)}
                      className="underline font-semibold"
                    >
                      Reload
                    </button>
                  </div>
                )}

                {/* Messages Display Area */}
                <div className="messages-area flex-1 p-5 overflow-y-auto space-y-3 bg-[#faf9f6]">
                  <div className="chat-date text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-cream border border-border text-[11px] font-medium text-ink-muted">
                      Custom Order Channel
                    </span>
                  </div>

                  {loadingMessages ? (
                    <div className="py-12 text-center text-xs text-ink-muted space-y-2">
                      <RefreshCw size={20} className="animate-spin mx-auto text-amber-dark" />
                      <p>Loading messages...</p>
                    </div>
                  ) : activeMessages.length === 0 ? (
                    <div className="py-16 text-center text-xs text-ink-muted">
                      <MessageSquare size={36} className="text-amber-dark/40 mx-auto mb-2" />
                      <p className="font-semibold text-ink">No messages yet in this channel</p>
                      <p className="text-ink-soft text-[11px] mt-0.5">
                        Send a message below to coordinate specifications, materials, or delivery dates!
                      </p>
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe = msg.sender === "customer";
                      return (
                        <div
                          key={msg.id}
                          className={`message-row flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`message-bubble max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                              isMe
                                ? "bg-ink text-cream rounded-br-xs"
                                : "bg-white border border-border text-ink rounded-bl-xs"
                            }`}
                          >
                            {msg.text && <p className="m-0 whitespace-pre-wrap">{msg.text}</p>}

                            {msg.attachment && (
                              <div
                                className={`mt-2 p-2 rounded-xl flex items-center gap-2 text-[11px] ${
                                  isMe ? "bg-white/10 text-cream" : "bg-cream text-ink border border-border"
                                }`}
                              >
                                <Paperclip size={12} />
                                <span className="truncate">{msg.attachment.name}</span>
                              </div>
                            )}

                            <div
                              className={`mt-1.5 text-[10px] flex items-center justify-end gap-1 ${
                                isMe ? "text-cream/60" : "text-ink-muted"
                              }`}
                            >
                              <span>{msg.time}</span>
                              {isMe && <CheckCheck size={12} className="text-amber-light" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                  <div className="selected-file px-4 py-2 bg-cream border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip size={14} className="text-amber-dark shrink-0" />
                      <span className="font-medium truncate text-ink">{selectedFile.name}</span>
                      <span className="text-[11px] text-ink-muted">({formatFileSize(selectedFile.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-ink-muted hover:text-rose-600 transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Message Input Area */}
                <div className="message-input-area p-3.5 sm:p-4 border-t border-border bg-white flex items-end gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    hidden
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    onClick={handleAttachmentClick}
                    className="attachment-button p-2.5 rounded-xl border border-border bg-cream/40 hover:bg-cream text-ink-soft hover:text-ink transition-colors shrink-0"
                    title="Attach design photo or file"
                  >
                    <Paperclip size={16} />
                  </button>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    rows={1}
                    className="flex-1 p-2.5 rounded-xl border border-border bg-cream/30 text-xs text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/15 resize-none max-h-32 min-h-[42px]"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!message.trim() && !selectedFile}
                    className="p-2.5 px-4 rounded-xl bg-ink hover:bg-amber-dark disabled:opacity-40 disabled:hover:bg-ink text-cream text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send size={14} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </>
            ) : (
              /* No Active Conversation Selected */
              <div className="empty-chat flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber/10 flex items-center justify-center text-amber-dark mb-4 border border-amber/20">
                  <MessageSquare size={28} />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Select a Conversation
                </h2>
                <p className="text-xs text-ink-soft mt-1.5 max-w-sm">
                  Choose a chat channel from the left panel, or navigate to any open requirement to connect directly with the maker.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}