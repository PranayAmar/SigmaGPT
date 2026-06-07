import { useState } from 'react';
import SideBar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { MyContext } from './context/MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import GlobalLoader from './components/GlobalLoader.jsx';
import LandingPage from './LandingPage.jsx';


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChat, setPrevChat] = useState([]); //store previous chats of current threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [open, setOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);


  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChat, setPrevChat,
    allThreads, setAllThreads,
    globalLoading, setGlobalLoading
  };

  return (

    <MyContext.Provider value={providerValues}>
      {globalLoading && <GlobalLoader />}
      
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/chat' element = {
            <ProtectedRoutes>
              <Home open={open} setOpen={setOpen}/>
            </ProtectedRoutes>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      

    </MyContext.Provider>

  )
}

export default App;
