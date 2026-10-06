import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ChatContext = createContext(null);

const initialConversations = [
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

const initialMessages = {
  1: [
    {
      id: 1,
      sender: "creator",
      text: "Hi! How can I help you with your custom order?",
      time: "10:25 AM",
    },
    {
      id: 2,
      sender: "customer",
      text: "I would like a customized handmade gift.",
      time: "10:27 AM",
    },
    {
      id: 3,
      sender: "creator",
      text: "Sure, I can customize the design.",
      time: "10:30 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "creator",
      text: "Hello! Feel free to share your requirements.",
      time: "Yesterday",
    },
    {
      id: 2,
      sender: "customer",
      text: "I wanted to check the quotation.",
      time: "Yesterday",
    },
    {
      id: 3,
      sender: "creator",
      text: "The quotation has been updated.",
      time: "Yesterday",
    },
  ],
};

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("craftconnect_conversations");
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("craftconnect_messages");
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0]?.id ?? null
  );

  useEffect(() => {
    localStorage.setItem(
      "craftconnect_conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("craftconnect_messages", JSON.stringify(messages));
  }, [messages]);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId
      ) || null,
    [conversations, activeConversationId]
  );

  const activeMessages = useMemo(
    () => messages[activeConversationId] || [],
    [messages, activeConversationId]
  );

  function selectConversation(id) {
    setActiveConversationId(id);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  }

  function sendMessage(text, attachment = null) {
    if (!activeConversationId) return;

    const newMessage = {
      id: Date.now(),
      sender: "customer",
      text,
      attachment,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
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
              lastMessage: text || attachment?.name || "Attachment",
              lastMessageTime: newMessage.time,
            }
          : conversation
      )
    );
  }

  const value = {
    conversations,
    activeConversation,
    activeMessages,
    selectConversation,
    sendMessage,
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