import "./ChatWindow.css";
import Chat from './Chat';
import { MyContext } from "../context/MyContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function ChatWindow({ setOpen }) {
  const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChat, setPrevChat, setNewChat, globalLoading, setGlobalLoading, allThreads, setAllThreads } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const getReply = async () => {

    if (!prompt.trim()) return;

    const userMessage = prompt;

    setPrevChat(prev => [
      ...prev,
      {
        role: "user",
        content: userMessage
      }
    ]);

    setPrompt("");
    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        threadID: currThreadId
      })
    };

    try {
      const res = await fetch("https://sigmagpt-backened.onrender.com/api/chat", options);
      const rep = await res.json();

      setReply(rep.reply);
      setAllThreads(prev => {
        const exists = prev.find(
          thread => thread.threadID === currThreadId
        );

        if (exists) return prev;

        return [
          {
            threadID: currThreadId,
            title: userMessage.slice(0, 30)
          },
          ...prev
        ];
      });

    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  const handleLogout = async () => {
    try {
      setGlobalLoading(true);
      await axios.get(
        "https://sigmagpt-backened.onrender.com/logout",
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setGlobalLoading(false);
      }, 500);
    }
  };

  return (
    <div className={`flex-1 h-screen flex flex-col overflow-hidden relative ${theme === "dark" ? "bg-black" : "bg-white"}`} >
      <div className={`h-16 min-h-[56px] border-b shadow-md rounded-b-2xl flex items-center justify-between px-4 md:px-6 relative z-40 ${theme === "dark" ? "bg-black border-gray-700 shadow-gray-700" : "bg-white border-gray-400 shadow-gray-400"}`}>
        <button className="md:hidden text-xl" onClick={() => setOpen(true)}>
          <i className={`fa-solid fa-bars ${theme === "dark" ? "" : "text-black"}`}></i>
        </button>
        <span className={`text-lg font-semibold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-black"}`}>SigmaGPT&nbsp;<i className={`fa-solid fa-angle-down text-sm ${theme === "dark" ? "" : "text-black"}`}></i></span>

        <div className="hidden md:flex text-2xl cursor-pointer transition" onClick={handleProfileClick}>
          <i className={`fa-solid fa-user-circle ${theme === "dark" ? "" : "text-black"}`}></i>
        </div>
      </div>
      {
        isOpen &&
        <div className={`absolute top-20 right-4 w-52 border rounded-xl shadow-2xl overflow-hidden z-50 ${theme === "dark" ? "bg-[#202123] border-gray-700" : "bg-white border-gray-400"}`}>
          <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${theme === "dark" ? "text-white hover:bg-gray-600" : "text-black hover:bg-gray-100"}`}><i className={`fa-solid fa-cloud-arrow-up ${theme === "dark" ? "" : "text-black"}`}></i>Upgrade</div>
          <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${theme === "dark" ? "text-white hover:bg-gray-600" : "text-black hover:bg-gray-100"}`} onClick={() => {
            setShowSettings(true);
            setIsOpen(false);
          }}><i className={`fa-solid fa-gear ${theme === "dark" ? "" : "text-black"}`}></i>Settings</div>
          <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${theme === "dark" ? "text-white hover:bg-red-500" : "text-black hover:bg-red-500"}`} onClick={handleLogout}><i class={`fa-solid fa-arrow-right-from-bracket ${theme === "dark" ? "" : "text-black"}`}></i>Log Out</div>
        </div>
      }

      {
        showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]" onClick={() => setShowSettings(false)}>
            <div className={`w-[300px] rounded-2xl p-4 ${theme === "dark" ? "bg-[#202123] border-gray-700" : "bg-white border-gray-500"}`} onClick={(e) => e.stopPropagation()}>
              <h2 className={`text-xl mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Settings
              </h2>

              <div className="flex items-center justify-between">
                <span className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Theme
                </span>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setTheme("dark");
                    setShowSettings(false);
                  }}
                    className={`flex px-2 py-1 rounded-xl cursor-pointer items-center justify-center gap-2 transition ${theme === "dark" ? "bg-white text-black hover:bg-gray-500" : "bg-[#2b2c2f] text-white border-gray-600 hover:bg-[#343541]"}`}>
                    <i className={`fa-solid fa-moon ${theme === "dark" ? "text-black" : ""}`} ></i>Dark
                  </button>
                  <button onClick={() => {
                    setTheme("light");
                    setShowSettings(false);
                  }}
                    className={`flex px-2 py-1 rounded-xl cursor-pointer items-center justify-center gap-2 transition ${theme === "light" ? "bg-black text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-400"}`}>
                    <i className={`fa-solid fa-sun ${theme === "dark" ? "text-black" : ""}`}></i>Light
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-transparent">
        <div className="min-h-full flex flex-col px-4 md:px-10">

          <Chat loading={loading} />
        </div>
      </div>

      <div className={`border-t rounded-t-3xl px-3 shadow-lg md:px-6 py-4 ${theme === "dark" ? "bg-black border-gray-700 shadow-[0_-3px_6px_-1px_rgba(59,130,246,0.18)]" : "bg-white border-gray-500 shadow-[0_-4px_6px_-1px_rgba(55,65,81,1)]"}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center rounded-3xl px-4 py-3 ${theme === "dark" ? "bg-[#212121]" : "bg-gray-300"}`}>
            <input placeholder="Ask Anything"
              value={prompt}
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
              className={`flex-1 bg-transparent outline-none text-sm md:text-base disabled:opacity-70 ${theme === "dark" ? "text-white placeholder-white" : "text-black placeholder-gray-700"}`}
            />

            <button onClick={loading ? null : getReply} disabled={loading} className={`ml-3 w-10 h-10 rounded-full transition flex items-center justify-center transition-all duration-200 ${loading ? "bg-white text-black" : "bg-sky-600 hover:bg-sky-700 text-white"}`}>
              {
                loading ? (
                  <div className="w-3 h-3 bg-black rounded-sm"></div>
                ) : (
                  <i className="fa-solid fa-angles-up"></i>
                )

              }

            </button>
          </div>

          <p className={`text-center text-xs mt-3 px-2 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
            SigmaGPT can make mistakes.Check important info.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow;