import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";


const Home = ({ open, setOpen }) => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                
                const { data } = await axios.get(
                    "http://localhost:8080/verify",
                    { withCredentials: true }
                );

                const { status, user } = data;
                if (status)
                    setUsername(user);
                else {
                    navigate("/login");
                }
            } catch (err) {
                console.log(err);
                navigate('/login');
             } 
        };
        verifyCookie();

    }, [navigate]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-black">
            <Sidebar open={open} setOpen={setOpen} username={username} setUsername={setUsername} />
            <ChatWindow setOpen={setOpen} />
        </div>
    );
}

export default Home;