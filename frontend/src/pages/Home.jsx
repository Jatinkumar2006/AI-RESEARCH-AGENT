import { useState } from "react";
import { fetchResearch } from "../services/api";
import ReactMarkdown from "react-markdown";

function Home() {
  // Store all conversations
  const [conversations, setConversations] = useState([]);

  // Currently active chat ID
  const [activeId, setActiveId] = useState(null);

  // Input field state
  const [input, setInput] = useState("");

  // Loading indicator
  const [loading, setLoading] = useState(false);

  // Find the currently selected conversation
  const activeConversation = conversations.find((c) => c.id === activeId);

  // Create a new empty chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setConversations((prev) => [...prev, newChat]);
    setActiveId(newChat.id);
  };

  // Handle sending message
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    let currentId = activeId;

    // If no chat exists yet, create one
    if (!currentId) {
      const newChat = {
        id: Date.now(),
        title: trimmedInput,
        messages: [],
      };

      setConversations((prev) => [...prev, newChat]);
      setActiveId(newChat.id);
      currentId = newChat.id;
    }

    const userMessage = {
      role: "user",
      content: trimmedInput,
    };

    // Add user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              title: c.messages.length === 0 ? trimmedInput : c.title,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    );

    setInput("");
    setLoading(true);

    try {
      const data = await fetchResearch(trimmedInput);

      const aiMessage = {
        role: "assistant",
        content: data.aiResponse,
        sources: data.sources || [],
      };

      // Add AI response
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    } catch (error) {
      console.error("Frontend error:", error);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant", content: "Something went wrong." },
                ],
              }
            : c
        )
      );
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo">AI Research Agent</div>
        <div className="header-actions">
          <button onClick={handleNewChat}>New Chat</button>
        </div>
      </div>

      <div className="body-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Conversations</h3>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`topic ${
                chat.id === activeId ? "active-topic" : ""
              }`}
              onClick={() => setActiveId(chat.id)}
            >
              {chat.title}
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="hero">
              <h1>Stay Updated</h1>
              <p>
                Get real-time research, news and AI-powered insights on any
                topic.
              </p>
            </div>
          ) : (
            <div className="chat-messages">
              {activeConversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${
                    msg.role === "user" ? "user" : "assistant"
                  }`}
                >
                  {/* Structured AI JSON response */}
                  {msg.role === "assistant" &&
                  typeof msg.content === "object" ? (
                    <div className="structured-response">
                      {msg.content.sections?.map((section, i) => (
                        <div key={i} className="analysis-block">
                          <h2>{section.title}</h2>
                          <p>{section.content}</p>
                        </div>
                      ))}

                      {msg.content.keyTakeaways?.length > 0 && (
                        <>
                          <h3>Key Takeaways</h3>
                          <ul>
                            {msg.content.keyTakeaways.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {msg.content.recommendations?.length > 0 && (
                        <>
                          <h3>Recommendations</h3>
                          <ul>
                            {msg.content.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {msg.sources?.length > 0 && (
                        <div className="sources">
                          <h4>Sources</h4>
                          {msg.sources.map((s, i) => (
                            <div key={i}>
                              🔗{" "}
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {s.source} - {s.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <ReactMarkdown>
                      {typeof msg.content === "string"
                        ? msg.content
                        : ""}
                    </ReactMarkdown>
                  )}
                </div>
              ))}

              {loading && (
                <div className="chat-bubble assistant">
                  Thinking...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            value={input}
            placeholder="Ask anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Home;