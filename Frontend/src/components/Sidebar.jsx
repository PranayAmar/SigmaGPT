import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../context/MyContext.jsx";
import { v1 as uuidv1 } from 'uuid';
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";



function Sidebar({ open, setOpen, username, setUsername }) {
   const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrompt, setReply, setPrevChat, globalLoading, setGlobalLoading } = useContext(MyContext);
   const [showDelMod, setShowDelMod] = useState(false);
   const [threadToDelete, setThreadToDelete] = useState(null);
   const [isOpen, setIsOpen] = useState(false);
   const [showProMod, setShowProMod] = useState(false);
   const [displayName, setDisplayName] = useState(username);
   const { theme, setTheme } = useContext(ThemeContext);
   const [showSettings, setShowSettings] = useState(false);
   const navigate = useNavigate();


   const getAllThreads = async () => {
      try {
         const response = await fetch("https://sigmagpt-backened.onrender.com/api/thread",{
            credentials:"include",
         });
         const res = await response.json();
         const filteredData = res.map(thread => ({ threadID: thread.threadID, title: thread.title }))
         setAllThreads(filteredData);
         //threadId,title
      }
      catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      getAllThreads();
   }, [currThreadId]);

   const createNewChat = () => {
      setNewChat(true);
      setPrompt("");
      setReply(null);
      setCurrThreadId(uuidv1());
      setPrevChat([]);
   };

   const changeThread = async (newThreadID) => {
      setCurrThreadId(newThreadID);

      try {
         setGlobalLoading(true);
         const response = await fetch(`https://sigmagpt-backened.onrender.com/api/thread/${newThreadID}`,{credentials: "include",});
         const res = await response.json();

         setPrevChat(res);
         setNewChat(false);
         setReply(null);
      } catch (err) {
         console.log(err);
      } finally {
         setTimeout(() => {
            setGlobalLoading(false);
         }, 500);
      }
   };

   const deleteThread = async (id) => {

      try {
         setGlobalLoading(true);
         const response = await fetch(`https://sigmagpt-backened.onrender.com/api/thread/${id}`, { method: "DELETE",credentials:"include", });
         const res = await response.json();
         console.log(res);

         //re-render the updated chats
         setAllThreads(prev => prev.filter(thread => thread.threadID !== id));

         if (id === currThreadId) {
            createNewChat();
         }
      } catch (err) {
         console.log(err);
      } finally {
         setTimeout(() => {
            setGlobalLoading(false);
         }, 500);
      }
   }

   const handleInitClick = () => {
      setIsOpen(!isOpen);
   }

   const initials = displayName ? displayName.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2) : "U";


   useEffect(() => {
      setDisplayName(username);

   }, [username, showProMod]);

   const handleSaveProfile = async () => {
      try {
         const { data } = await axios.put(
            "https://sigmagpt-backened.onrender.com/profile",
            {
               username: displayName
            },
            {
               withCredentials: true
            }
         );

         if (data.success) {
            setUsername(displayName);
            setShowProMod(false);
         }
      } catch (err) {
         console.log(err);
      }
   };

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
      <>

         {
            open && (
               <div className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setOpen(false)}
               ></div>
            )
         }


         <section className={`
         fixed md:relative
         top-0 left-0 h-screen w-[260px] ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} flex flex-col border-r-2 border-gray-700 md:overflow-visible overflow-hidden z-50 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
            {/*New Chat Button*/}
            <div className="flex flex-col flex-1 overflow-hidden">
               <div className={`p-3 border-b-2 ${theme === "dark" ? "border-gray-700" : "border-gray-500"}`}>
                  <div className="relative group w-full">

                     <button onClick={createNewChat} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-600 transition">
                        <i className={`${theme === "dark" ? "" : "text-black"} fa-solid fa-circle-nodes`}></i>
                        <i className={`${theme === "dark" ? "" : "text-black"} fa-solid fa-pen-to-square`}></i>
                     </button>

                     <div className="absolute left-24 top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100  pointer-events-none transition-all duration-200 bg-[#2b2c2f] text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-[999] translate-x-2 group-hover:translate-x-0">
                        New Chat
                     </div>
                  </div>

               </div>

               <div className={`md:hidden border-b border-t ${theme === "dark" ? "border-gray-700" : "border-gray-500"} p-2`}>
                  <div className="mt-1 flex flex-col gap-2">
                     <button className={`flex items-center gap-3 px-3 py-3 rounded-lg ${theme === "dark" ? "hover:bg-[#2b2c2f]" : "hover:bg-gray-100"} transition`}>
                        <i className={`fa-solid fa-cloud-arrow-up ${theme === "dark" ? "" : "text-black"}`}></i>
                        <span className={`${theme === "dark" ? "" : "text-black"} text-sm`}>Upgrade</span>
                     </button>

                     <button className={`flex items-center gap-3 px-3 py-3 rounded-lg ${theme === "dark" ? "hover:bg-[#2b2c2f]" : "hover:bg-gray-100"} transition`} onClick={() => {
                        setShowSettings(true);
                        setIsOpen(false);
                     }}>
                        <i className={`fa-solid fa-gear ${theme === "dark" ? "" : "text-black"}`}></i>
                        <span className={`${theme === "dark" ? "" : "text-black"} text-sm`}>Settings</span>
                     </button>

                     <button className={`flex items-center gap-3 px-3 py-3 rounded-lg ${theme === "dark" ? "hover:bg-red-500" : "hover:bg-red-600"} transition`} onClick={handleLogout}>
                        <i className={`fa-solid fa-arrow-right-from-bracket ${theme === "dark" ? "" : "text-black"}`}></i>
                        <span className={`${theme === "dark" ? "" : "text-black hover:text-white"} text-sm`}>Log Out</span>
                     </button>
                  </div>
               </div>

               {/*Histroy */}

               <ul className="p-2 space-y-2 overflow-y-auto flex-1">
                  <p className={`text-xl underline mt-2 text-center font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>All Chats</p>
                  {
                     allThreads?.map((thread, idx) => (
                        <li key={idx}
                           onClick={(e) => {
                              changeThread(thread.threadID);
                              setOpen(false);
                           }}
                           className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition ${theme === "dark" ? "hover:bg-[#2b2c2f]" : "hover:bg-gray-100"} ${thread.threadID === currThreadId ? "bg-[#343541]" : " "}`}
                        ><span className={`${theme === "dark" ? "" : "text-black"} truncate text-sm max-w-[170px]`}>{thread.title}</span>
                           <i className={`${theme === "dark" ? "" : "text-black"} fa-solid fa-trash opacity-0 group-hover:opacity-100 transition hover:text-red-600`}
                              onClick={(e) => {
                                 e.stopPropagation(); //stop event bubbling

                                 setThreadToDelete(thread.threadID);
                                 setShowDelMod(true);
                              }}></i>
                        </li>
                     ))
                  }
               </ul>
            </div>

            <div className={` ${theme === "dark" ? "border-gray-700" : "border-gray-500"} border-t-2 p-2`}>
               <div className={`flex w-full items-center group justify-between gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${theme === "dark" ? "hover:bg-[#2b2c2f]" : "hover:bg-gray-200"}`} onClick={handleInitClick}>
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center font-semibold">{initials}</div>
                     <p className={`${theme === "dark" ? "text-white" : "text-black"} text-sm truncate`}>{username || "User"}</p>
                  </div>
                  <i className={`${theme === "dark" ? "" : "text-black"} fa-solid fa-angle-right mr-3  transition`}></i>
               </div>
            </div>
         </section>

         {
            isOpen &&
            <div className={`absolute bottom-20 left-2 w-[245px] border ${theme === "dark" ? "bg-[#202123] border-gray-700" : "bg-white boder-gray-500"} rounded-xl shadow-xl overflow-hidden z-50`}>
               <div className={`flex items-center gap-3 p-3 ${theme === "dark" ? "hover:bg-[#202123] text-white" : "hover:bg-gray-200 text-black"} cursor-pointer transition`} onClick={() => {
                  setShowProMod(true);
                  handleInitClick();
               }
               }>
                  <i className={`fa-regular fa-circle-user text-xl ${theme === "dark" ? "" : "text-black"}`}></i>Profile
               </div>
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
                        <select value={theme} onChange={(e) => {
                           setTheme(e.target.value);
                           setShowSettings(false);
                        }
                        } className="bg-[#2b2c2f] outline-none text-white px-3 py-2 rounded-lg">
                           <option value="dark">Dark</option>
                           <option value="light">Light</option>
                        </select>
                     </div>
                  </div>
               </div>
            )
         }

         {
            showDelMod && (
               <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
                  <div className={`w-full max-w-md ${theme === "dark" ? "bg-[#202123] border border-gray-700" : "bg-white border border-gray-500"} rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200`}>
                     <h2 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-2`}>
                        Delete chat?
                     </h2>

                     <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-800"} text-sm mb-6`}>
                        This action cannot be undone.
                     </p>

                     <div className="flex justify-end gap-3">

                        <button onClick={() => {
                           setShowDelMod(false);
                           setThreadToDelete(null);
                        }}
                           className="px-4 py-2 rounded-lg bg-[#2b2c2f] hover:bg-[#3a3b3f] transition text-white">
                           Cancel
                        </button>

                        <button onClick={() => {
                           deleteThread(threadToDelete);
                           setShowDelMod(false);
                           setThreadToDelete(null);
                        }}
                           className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white">
                           Delete
                        </button>

                     </div>
                  </div>
               </div>
            )
         }

         {
            showProMod && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-4 backdrop-blur-sm" onClick={() => setShowProMod(false)}>
                  <div className={`w-[90%] max-w-[450px] ${theme === "dark" ? "bg-[#202123] border border-gray-[#3e3f4b]" : "bg-white border border-gray-500"} rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200`} onClick={(e) => e.stopPropagation()}>
                     <h2 className={`${theme === "dark" ? "text-white" : "text-black"} text-xl font-light mb-8`}>Edit Profile</h2>
                     <div className="flex justify-center mb-8">
                        <div className="relative">
                           <div className="w-28 h-28 rounded-full bg-[#355070] flex items-center justify-center text-5xl font-bold text-white">
                              {initials}
                           </div>
                           <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#2b2c2f] border border-gray-600 flex items-center justify-center text-white hover:bg-[#3a3b40]">
                              <i className="fa-solid fa-camera"></i>
                           </button>
                        </div>
                     </div>

                     <div className="mb-4">
                        <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-800"} text-sm mb-2`}>
                           Username
                        </label>
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={`w-full border ${theme === "dark" ? "bg-[#202123] border-[#3e3f4b] text-white focus:border-white" : "bg-white border-black text-black focus:border-black"} rounded-xl p-4 outline-none`}>
                        </input>
                     </div>

                     <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-800"} text-sm mt-2 text-center`}>
                        Your profile helps people recognize you in conversations.
                     </p>

                     <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setShowProMod(false)} className="px-4 py-2 rounded-full bg-black text-white hover:bg-[#343541]">Cancel</button>
                        <button onClick={handleSaveProfile} className={`px-4 py-2 rounded-full ${theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-400 text-black hover:bg-gray-500"}`}>Save</button>

                     </div>
                  </div>
               </div>
            )
         }
      </>
   )
}

export default Sidebar;