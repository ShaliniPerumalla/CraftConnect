import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ChatContext = createContext(null);

const STORAGE_KEY = "craftconnect_chat";

// ======================================================
// INITIAL CONVERSATIONS
// ======================================================

const initialConversations = [
  {
    id: "chat-1",
    creatorId: "creator-1",
    name: "Anu Crafts",
    category: "Jewelry",
    online: true,
    lastMessage: "Sure! I'll update the design.",
    lastMessageTime: "10:35 AM",
    unread: 2,
  },
  {
    id: "chat-2",
    creatorId: "creator-2",
    name: "XYZ Art",
    category: "Resin Art",
    online: true,
    lastMessage: "Your design is ready.",
    lastMessageTime: "9:20 AM",
    unread: 1,
  },
  {
    id: "chat-3",
    creatorId: "creator-3",
    name: "Priya Creations",
    category: "Handmade Gifts",
    online: false,
    lastMessage: "Thank you!",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
];

// ======================================================
// INITIAL MESSAGES
// ======================================================

const initialMessages = {
  "chat-1": [
    {
      id: "message-1",
      sender: "creator",
      text: "Hello! I have uploaded the design.",
      time: "10:32 AM",
      attachment: null,
    },
    {
      id: "message-2",
      sender: "customer",
      text: "Can you change the color?",
      time: "10:34 AM",
      attachment: null,
    },
    {
      id: "message-3",
      sender: "creator",
      text: "Sure! I'll update the design.",
      time: "10:35 AM",
      attachment: null,
    },
  ],

  "chat-2": [
    {
      id: "message-4",
      sender: "creator",
      text: "I've finished the resin design.",
      time: "9:15 AM",
      attachment: null,
    },
    {
      id: "message-5",
      sender: "creator",
      text: "Your design is ready.",
      time: "9:20 AM",
      attachment: null,
    },
  ],

  "chat-3": [
    {
      id: "message-6",
      sender: "customer",
      text: "Thank you for the beautiful work!",
      time: "Yesterday",
      attachment: null,
    },
    {
      id: "message-7",
      sender: "creator",
      text: "Thank you!",
      time: "Yesterday",
      attachment: null,
    },
  ],
};

// ======================================================
// PROVIDER
// ======================================================

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `${STORAGE_KEY}_conversations`
      );

      if (!saved) {
        return initialConversations;
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : initialConversations;
    } catch (error) {
      console.error(
        "Could not load conversations:",
        error
      );

      return initialConversations;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `${STORAGE_KEY}_messages`
      );

      if (!saved) {
        return initialMessages;
      }

      const parsed = JSON.parse(saved);

      return parsed || initialMessages;
    } catch (error) {
      console.error(
        "Could not load messages:",
        error
      );

      return initialMessages;
    }
  });

  const [activeConversationId, setActiveConversationId] =
    useState("chat-1");

  // ======================================================
  // SAVE CONVERSATIONS
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}_conversations`,
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error(
        "Could not save conversations:",
        error
      );
    }
  }, [conversations]);

  // ======================================================
  // SAVE MESSAGES
  // ======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}_messages`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "Could not save messages:",
        error
      );
    }
  }, [messages]);

  // ======================================================
  // ACTIVE CONVERSATION
  // ======================================================

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) =>
        conversation.id === activeConversationId
    );
  }, [
    conversations,
    activeConversationId,
  ]);

  // ======================================================
  // ACTIVE MESSAGES
  // ======================================================

  const activeMessages = useMemo(() => {
    return messages[activeConversationId] || [];
  }, [
    messages,
    activeConversationId,
  ]);

  // ======================================================
  // SELECT CONVERSATION
  // ======================================================

  function selectConversation(conversationId) {
    setActiveConversationId(conversationId);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation
      )
    );
  }

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  function sendMessage(text, attachment = null) {
    const trimmedText = text.trim();

    if (!trimmedText && !attachment) {
      return;
    }

    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: `message-${Date.now()}`,
      sender: "customer",
      text: trimmedText,
      time,
      attachment,
    };

    setMessages((current) => ({
      ...current,
      [activeConversationId]: [
        ...(current[activeConversationId] || []),
        newMessage,
      ],
    }));

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              lastMessage:
                trimmedText || "Attachment sent",
              lastMessageTime: time,
            }
          : conversation
      )
    );
  }

  // ======================================================
  // RESET CHAT
  // ======================================================

  function resetChats() {
    setConversations(
      initialConversations.map((conversation) => ({
        ...conversation,
      }))
    );

    setMessages(
      JSON.parse(JSON.stringify(initialMessages))
    );

    setActiveConversationId("chat-1");
  }

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    activeMessages,
    selectConversation,
    sendMessage,
    resetChats,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
}