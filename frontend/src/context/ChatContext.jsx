import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as member3Service from "../services/member3Service";
import useAuth from "../hooks/useAuth";

const ChatContext = createContext(null);

const STORAGE_CONVERSATIONS_KEY = "craftconnect_conversations";
const STORAGE_MESSAGES_KEY = "craftconnect_messages";

const fallbackConversations = [
  {
    id: 1,
    name: "Priya Handmade Crafts",
    lastMessage: "Sure, I can customize the design.",
    lastMessageTime: "10:30 AM",
    unread: 1,
    online: true,
  },
  {
    id: 2,
    name: "Creative Resin Studio",
    lastMessage: "The quotation has been updated.",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: false,
  },
];

const fallbackMessages = {
  1: [
    {
      id: 101,
      sender: "creator",
      text: "Hi! How can I help you with your custom order?",
      time: "10:25 AM",
    },
    {
      id: 102,
      sender: "customer",
      text: "I would like a customized handmade gift.",
      time: "10:27 AM",
    },
    {
      id: 103,
      sender: "creator",
      text: "Sure, I can customize the design.",
      time: "10:30 AM",
    },
  ],
  2: [
    {
      id: 201,
      sender: "creator",
      text: "Hello! Feel free to share your requirements.",
      time: "Yesterday",
    },
    {
      id: 202,
      sender: "customer",
      text: "I wanted to check the quotation.",
      time: "Yesterday",
    },
    {
      id: 203,
      sender: "creator",
      text: "The quotation has been updated.",
      time: "Yesterday",
    },
  ],
};

function formatMessageTime(isoString) {
  if (!isoString) return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  try {
    const d = new Date(isoString);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return isoString;
  }
}

export function ChatProvider({ children }) {
  const { user } = useAuth() || {};

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load local conversations:", e);
    }
    return fallbackConversations;
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load local messages:", e);
    }
    return fallbackMessages;
  });

  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0]?.id ?? null
  );

  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [conversationsError, setConversationsError] = useState(null);
  const [messagesError, setMessagesError] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Transform backend conversation into clean UI item
  const mapBackendConversation = useCallback(
    (conv) => {
      const isUserCreator = user?.role === "creator";
      // Determine counterpart name
      let displayName = "Artisan / Client";
      if (isUserCreator) {
        displayName = conv.customer_username || conv.customer_email || "Valued Client";
      } else {
        displayName = conv.creator_username || conv.creator_email || "Master Artisan";
      }
      if (conv.requirement_title) {
        displayName += ` (${conv.requirement_title})`;
      }

      const lastMsgText = conv.last_message?.body || "Conversation started";
      const lastMsgTime = conv.last_message?.timestamp
        ? formatMessageTime(conv.last_message.timestamp)
        : formatMessageTime(conv.updated_at);

      return {
        id: conv.id,
        backendId: conv.id,
        name: displayName,
        customer: conv.customer,
        creator: conv.creator,
        requirement: conv.requirement,
        lastMessage: lastMsgText,
        lastMessageTime: lastMsgTime,
        unread: conv.unread_count || 0,
        online: true,
      };
    },
    [user]
  );

  // Load conversations from backend
  const loadConversations = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return; // If unauthenticated, use cached/fallback data

    setLoadingConversations(true);
    setConversationsError(null);

    try {
      const data = await member3Service.fetchConversations();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapBackendConversation);
        setConversations(mapped);
        if (!activeConversationId && mapped.length > 0) {
          setActiveConversationId(mapped[0].id);
        }
      }
    } catch (err) {
      console.warn("Backend conversations fetch failed, using local/cached state:", err);
      // Keep existing conversations
      setConversationsError(err?.response?.data?.detail || "Could not refresh conversations from server.");
    } finally {
      setLoadingConversations(false);
    }
  }, [activeConversationId, mapBackendConversation]);

  // Load conversations on mount or when token changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Active conversation object
  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId
      ) || null,
    [conversations, activeConversationId]
  );

  // Active messages list
  const activeMessages = useMemo(
    () => messages[activeConversationId] || [],
    [messages, activeConversationId]
  );

  // Load messages for a conversation
  const loadMessagesForConversation = useCallback(
    async (convId) => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      setLoadingMessages(true);
      setMessagesError(null);

      try {
        const backendMessages = await member3Service.fetchMessages(convId);
        if (Array.isArray(backendMessages)) {
          const mapped = backendMessages.map((msg) => ({
            id: msg.id,
            sender:
              user?.id && msg.sender === user.id
                ? user.role === "creator"
                  ? "creator"
                  : "customer"
                : user?.role === "creator"
                ? "customer"
                : "creator",
            text: msg.body,
            attachment: msg.attachment_url
              ? { name: msg.attachment_url.split("/").pop() || "Attachment", url: msg.attachment_url }
              : null,
            time: formatMessageTime(msg.timestamp),
          }));

          setMessages((current) => ({
            ...current,
            [convId]: mapped,
          }));

          // Mark as read in backend
          member3Service.markMessagesAsRead(convId).catch(() => {});
        }
      } catch (err) {
        console.warn(`Backend fetch messages for conv ${convId} failed, using local data:`, err);
        setMessagesError("Could not sync latest messages with server.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [user]
  );

  // Select a conversation
  const selectConversation = useCallback(
    (id) => {
      setActiveConversationId(id);

      // Reset unread count locally
      setConversations((current) =>
        current.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );

      // Load backend messages
      loadMessagesForConversation(id);
    },
    [loadMessagesForConversation]
  );

  // Send a message
  const sendMessage = useCallback(
    async (text, attachment = null) => {
      if (!activeConversationId) return;

      const timeString = formatMessageTime(new Date().toISOString());
      const tempId = Date.now();

      const newMsg = {
        id: tempId,
        sender: user?.role === "creator" ? "creator" : "customer",
        text,
        attachment,
        time: timeString,
      };

      // Optimistic update
      setMessages((current) => ({
        ...current,
        [activeConversationId]: [
          ...(current[activeConversationId] || []),
          newMsg,
        ],
      }));

      // Update conversation list preview
      setConversations((current) =>
        current.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessage: text || attachment?.name || "Attachment",
                lastMessageTime: timeString,
              }
            : c
        )
      );

      // Try sending to backend if authenticated
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const payload = {
            body: text,
            attachment_url: attachment?.url || (attachment?.name ? `https://attachments.makermatch.internal/${attachment.name}` : null),
          };
          const savedMsg = await member3Service.sendMessage(activeConversationId, payload);
          if (savedMsg?.id) {
            // Update temporary id with server id
            setMessages((current) => ({
              ...current,
              [activeConversationId]: (current[activeConversationId] || []).map((m) =>
                m.id === tempId ? { ...m, id: savedMsg.id } : m
              ),
            }));
          }
        } catch (err) {
          console.warn("Message sent locally; backend sync failed:", err);
        }
      }
    },
    [activeConversationId, user]
  );

  // Start or open a conversation with a participant / requirement
  const startOrOpenConversation = useCallback(
    async ({ customerId, creatorId, requirementId, requirementTitle, participantName }) => {
      // 1. Check if conversation already exists in state
      const existing = conversations.find(
        (c) =>
          (requirementId && c.requirement === requirementId) ||
          (customerId && c.customer === customerId) ||
          (creatorId && c.creator === creatorId)
      );

      if (existing) {
        selectConversation(existing.id);
        return existing.id;
      }

      // 2. Try starting in backend
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const res = await member3Service.startConversation({
            customer: customerId,
            creator: creatorId,
            requirement: requirementId,
          });
          if (res?.id) {
            const mapped = mapBackendConversation(res);
            setConversations((prev) => [mapped, ...prev.filter((c) => c.id !== mapped.id)]);
            selectConversation(res.id);
            return res.id;
          }
        } catch (err) {
          console.warn("Could not start conversation in backend, creating locally:", err);
        }
      }

      // 3. Fallback: Create locally
      const localId = Date.now();
      const localConv = {
        id: localId,
        name: participantName || (requirementTitle ? `Order #${requirementId}: ${requirementTitle}` : "MakerMatch Chat"),
        lastMessage: "Conversation created",
        lastMessageTime: formatMessageTime(new Date().toISOString()),
        unread: 0,
        online: true,
        requirement: requirementId,
      };

      setConversations((prev) => [localConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [localId]: [
          {
            id: Date.now() + 1,
            sender: user?.role === "creator" ? "customer" : "creator",
            text: `Hi! Thank you for connecting regarding "${requirementTitle || 'your custom craft'}". How can I help?`,
            time: formatMessageTime(new Date().toISOString()),
          },
        ],
      }));
      selectConversation(localId);
      return localId;
    },
    [conversations, mapBackendConversation, selectConversation, user]
  );

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    activeMessages,
    loadingConversations,
    loadingMessages,
    conversationsError,
    messagesError,
    refreshConversations: loadConversations,
    selectConversation,
    sendMessage,
    startOrOpenConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used inside ChatProvider");
  }
  return context;
}