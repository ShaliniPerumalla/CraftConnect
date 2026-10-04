import { useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import "./chat.css";

function Chat() {
  const {
    conversations,
    activeConversation,
    activeMessages,
    selectConversation,
    sendMessage,
  } = useChat();

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Hidden file input reference
  const fileInputRef = useRef(null);

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  function handleSend() {
    const trimmedMessage = message.trim();

    // Don't send if there is nothing
    if (!trimmedMessage && !selectedFile) {
      return;
    }

    // Send text + attachment
    sendMessage(trimmedMessage, selectedFile);

    // Clear input after sending
    setMessage("");
    setSelectedFile(null);

    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ======================================================
  // HANDLE ENTER KEY
  // ======================================================

  function handleKeyDown(event) {
    // Enter = send
    // Shift + Enter = new line
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  // ======================================================
  // OPEN FILE PICKER
  // ======================================================

  function handleAttachmentClick() {
    fileInputRef.current?.click();
  }

  // ======================================================
  // FILE SELECTED
  // ======================================================

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Store only serializable information about the file.
    // We don't store the actual File object because
    // localStorage cannot store File objects directly.
    const attachment = {
      name: file.name,
      type: file.type,
      size: file.size,
    };

    setSelectedFile(attachment);
  }

  // ======================================================
  // REMOVE SELECTED FILE
  // ======================================================

  function handleRemoveFile() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ======================================================
  // FORMAT FILE SIZE
  // ======================================================

  function formatFileSize(bytes) {
    if (!bytes) {
      return "";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="chat-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="chat-heading">
        <div>

          <p className="chat-eyebrow">
            CRAFTCONNECT · MESSAGES
          </p>

          <h1>
            Stay connected with your maker.
          </h1>

          <p className="chat-description">
            Talk directly with creators about your custom
            orders, designs and ideas.
          </p>

        </div>
      </div>


      {/* ==================================================
          CHAT CONTAINER
      ================================================== */}

      <div className="chat-container">

        {/* ==================================================
            CONVERSATION LIST
        ================================================== */}

        <aside className="conversation-panel">

          <div className="conversation-header">

            <div>

              <h2>
                Messages
              </h2>

              <span>
                {conversations.length} conversations
              </span>

            </div>

          </div>


          <div className="conversation-list">

            {conversations.map((conversation) => (

              <button
                key={conversation.id}
                className={`conversation-item ${
                  activeConversation?.id === conversation.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectConversation(conversation.id)
                }
              >

                {/* AVATAR */}

                <div className="conversation-avatar">
                  {conversation.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>


                {/* CONVERSATION INFO */}

                <div className="conversation-info">

                  <div className="conversation-top">

                    <strong>
                      {conversation.name}
                    </strong>

                    <span>
                      {conversation.lastMessageTime}
                    </span>

                  </div>


                  <div className="conversation-bottom">

                    <p>
                      {conversation.lastMessage}
                    </p>

                    {conversation.unread > 0 && (
                      <span className="unread-count">
                        {conversation.unread}
                      </span>
                    )}

                  </div>

                </div>

              </button>

            ))}

          </div>

        </aside>


        {/* ==================================================
            CHAT WINDOW
        ================================================== */}

        <section className="chat-window">

          {activeConversation ? (
            <>

              {/* ==================================================
                  CHAT HEADER
              ================================================== */}

              <header className="chat-window-header">

                <div className="creator-avatar">

                  {activeConversation.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}

                  <span
                    className={
                      activeConversation.online
                        ? "online-dot"
                        : "offline-dot"
                    }
                  />

                </div>


                <div>

                  <h2>
                    {activeConversation.name}
                  </h2>

                  <p>
                    {activeConversation.online
                      ? "Online now"
                      : "Offline"}
                  </p>

                </div>

              </header>


              {/* ==================================================
                  MESSAGES AREA
              ================================================== */}

              <div className="messages-area">

                <div className="chat-date">
                  Today
                </div>


                {activeMessages.map((msg) => (

                  <div
                    key={msg.id}
                    className={`message-row ${
                      msg.sender === "customer"
                        ? "customer-message"
                        : "creator-message"
                    }`}
                  >

                    <div className="message-bubble">

                      {/* MESSAGE TEXT */}

                      {msg.text && (
                        <p>
                          {msg.text}
                        </p>
                      )}


                      {/* ATTACHMENT */}

                      {msg.attachment && (
                        <div className="message-attachment">

                          📎 {msg.attachment.name}

                        </div>
                      )}


                      {/* TIME */}

                      <span className="message-time">
                        {msg.time}
                      </span>

                    </div>

                  </div>

                ))}

              </div>


              {/* ==================================================
                  MESSAGE INPUT
              ================================================== */}

              <div className="message-input-area">

                {/* ================================================
                    HIDDEN FILE INPUT
                ================================================= */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={handleFileChange}
                />


                {/* ================================================
                    ATTACHMENT BUTTON
                ================================================= */}

                <button
                  type="button"
                  className="attachment-button"
                  title="Attach image or PDF"
                  onClick={handleAttachmentClick}
                >
                  📎
                </button>


                {/* ================================================
                    MESSAGE TEXTAREA
                ================================================= */}

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  rows="1"
                />


                {/* ================================================
                    SEND BUTTON
                ================================================= */}

                <button
                  type="button"
                  className="send-button"
                  onClick={handleSend}
                >
                  Send
                </button>

              </div>


              {/* ==================================================
                  SELECTED FILE PREVIEW
              ================================================== */}

              {selectedFile && (
                <div className="selected-file">

                  <div className="selected-file-info">

                    <span className="selected-file-icon">
                      📎
                    </span>

                    <div>

                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        {formatFileSize(selectedFile.size)}
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={handleRemoveFile}
                    title="Remove attachment"
                  >
                    ×
                  </button>

                </div>
              )}

            </>
          ) : (

            /* ==================================================
               EMPTY CHAT
            ================================================== */

            <div className="empty-chat">

              <h2>
                Select a conversation
              </h2>

              <p>
                Choose a creator to start chatting.
              </p>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default Chat;