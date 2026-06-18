import React from "react";


function ChatBubble({ side, content, label, isLoading = false }) {
  return (
    <div className={`chat ${side === "left" ? "chat-start" : "chat-end"}`}>
      <div className="chat-header text-sm text-base-content/50 mb-1">
        {label}
      </div>
      <div
        className={`chat-bubble ${
          side === "left"
            ?"chat-bubble-primary text-amber-50"
            : label=='You'?"chat-bubble-error text-amber-50":""
        } max-w-lg text-sm leading-relaxed`}
      >
        {isLoading ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}


export default ChatBubble;