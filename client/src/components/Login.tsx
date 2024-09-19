import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() && roomName.trim()) {
      localStorage.setItem("username", username);
      localStorage.setItem("roomName", roomName);
      navigate("/chat");
    }
  };
  return (
    <div className="h-screen w-full bg-zinc-950 ">
      <div className="max-w-md w-full flex flex-col flex-grow justify-center h-full mx-auto">
        <h1 className="text-white font-bold text-center text-lg uppercase">
          Socket Chat
        </h1>
        <div className="mb-4">
          <label id="username" className="text-green-500">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            id="username"
            className="w-full px-4 py-2 bg-black border border-green-700 text-green-500 rounded-lg focus:outline-none focus:right-2"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label id="room" className="text-green-500">
            Room
          </label>
          <input
            type="text"
            placeholder="Enter the room you want to join"
            id="room"
            className="w-full px-4 py-2 bg-black border border-green-700 text-green-500 rounded-lg focus:outline-none focus:right-2"
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-black border border-green-700 text-green-500 hover:bg-green-500 hover:text-black transition duration-200 p-3 rounded-lg"
        >
          Join room
        </button>
      </div>
    </div>
  );
}
