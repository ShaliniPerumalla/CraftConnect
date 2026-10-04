import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChatProvider } from "./context/ChatContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>
);
