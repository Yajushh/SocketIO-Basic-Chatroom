import { useEffect, useRef, useState } from "react";
import { IMessage } from "../types";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Chatroom() {
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRoomName = localStorage.getItem("roomName");

    if (!storedUsername || !storedRoomName) {
      navigate("/");
      return;
    }

    setUsername(storedUsername);
    setRoomName(storedRoomName);

    socket.emit("joinRoom", {
      username: storedUsername,
      roomName: storedRoomName,
    });

    // Handle userJoined event
    socket.on("userJoined", (joinedUsername) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: "System",
          message: `${joinedUsername} has joined the room.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    // Handle userLeft event
    socket.on("userLeft", (leftUsername) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: "System",
          message: `${leftUsername} has left the room.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    // Handle chat history event
    socket.on("chatHistory", (history: IMessage[]) => {
      setMessages(history);
    });

    // Handle new message event
    socket.on("message", (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up all listeners to avoid duplication
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("chatHistory");
      socket.off("message");
    };
  }, [navigate]);

  const handleMessage = () => {
    if (inputMessage.trim()) {
      socket.emit("chatMessage", {
        username,
        roomName,
        message: inputMessage,
      });
      setInputMessage("");
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { username, roomName });
    localStorage.removeItem("username");
    localStorage.removeItem("roomName");
    navigate("/");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="h-16 w-full bg-zinc-950 flex justify-between items-center px-4 border-b border-green-500">
        <span
          onClick={leaveRoom}
          className="text-white font-semibold cursor-pointer hover:text-green-500 hover:underline"
        >
          Socket Chat
        </span>
        <span className="text-white font-semibold">Room : {roomName}</span>
      </nav>

      {/* Main chat area */}
      <main className="flex flex-col flex-grow w-full overflow-y-auto px-4 py-6 bg-zinc-950 space-y-4">
        {messages.map((message, index) => (
          <div className="w-full" key={index}>
            {/* Normal messages */}
            {message.username !== "System" && (
              <div className="flex justify-between items-start w-full">
                <div className="flex gap-2">
                  {/* Username and Message */}
                  <span className="text-green-700 font-semibold">
                    {message.username}
                  </span>
                  <span className="text-white">: {message.message}</span>
                </div>
                {/* Timestamp aligned to the right */}
                <span className="text-gray-500 text-xs">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            )}
            {/* System messages */}
            {message.username === "System" && (
              <div className="flex justify-center">
                <span className="text-gray-400 italic">{message.message}</span>
              </div>
            )}
            {/* Self Messages */}
            {}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <div className="mb-0 flex items-center justify-between p-4 border-t border-green-500 bg-zinc-900 gap-3">
        <input
          type="text"
          placeholder="Enter your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleMessage()}
          className="w-full flex flex-grow border border-green-500 rounded-md px-4 py-2 bg-zinc-900 text-white"
        />
        <button
          className="border rounded-lg border-green-500 text-green-600 hover:bg-green-500 hover:text-black transition-all duration-200 px-2 py-2"
          onClick={handleMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
