import './Chat.css';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../context/MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { RingLoader } from 'react-spinners';
import { ThemeContext } from '../context/ThemeContext.jsx';



function Chat({loading}) {
    const { newChat, prevChat, reply,setPrevChat } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const {theme,setTheme} = useContext(ThemeContext);

    useEffect(() => {

    if (reply === null) {
        setLatestReply(null);
        return;
    }

    const words = reply.split(" ");

    let idx = 0;

    setLatestReply("");

    const animate = () => {

        // show multiple words every frame
        idx += 8;

        setLatestReply(
            words.slice(0, idx).join(" ")
        );

        if (idx < words.length) {

            requestAnimationFrame(animate);

        } else {

            setPrevChat(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: reply
                }
            ]);

            setLatestReply(null);
        }
    };

    requestAnimationFrame(animate);

}, [reply]);

    return (
        <div className='w-full flex flex-col items-center'>
            {newChat && (
                <div className='flex items-center justify-center w-full min-h-[calc(100vh-180px)]'>
                    <h1 className={`text-center text-3xl md:text-3xl font-bold ${theme === "dark" ? "text-white":"text-black"} mb-5`}>What's on your mind today.</h1>
                </div>
            )}

            <div className={`w-full max-w-5xl flex flex-col gap-6 ${prevChat.length > 0 ? "py-6 pb-28": ""}`}>
                {
                    prevChat?.map((chat, idx) =>
                        <div className={`w-full flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`} key={idx}>
                            {
                                chat.role === 'user' ?
                                    <p className='bg-sky-600 text-white px-5 py-3 rounded-2xl max-w-[80%] md:max-w-[65%] break-words text-sm md:text-base shadow-md'>{chat.content}</p> : (
                                        <div className={`${theme === "dark" ? "bg-[#1f1f1f]" : "bg-gray-900"} text-white px-5 py-3 rounded-2xl max-w-[85%] md:max-w-[70%] overflow-x-auto whitespace-pre-wrap text-sm md:text-base shadow-md`}>
                                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                                        </div>
                                    )}
                        </div>
                    )
                }

                {
                    latestReply && (
                        <div className='flex justify-start w-full' key={"typing"}>
                            <div className='bg-[#1e1e1e] text-white px-4 py-3 rounded-2xl max-w-[90%] md:max-w-[75%] overflow-x-auto whitespace-pre-wrap text-sm md:text-base shadow-md'>

                                <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                            </div>
                        </div>
                    )}


                {
                    loading && (
                        <div className="w-full flex justify-center py-8">
                            <RingLoader
                                color="rgb(2 132 199)"
                                loading={loading}
                                size={45}
                            />
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Chat;