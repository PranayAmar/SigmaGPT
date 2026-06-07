import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          "https://sigmagpt-backened.onrender.com/verify",
          { withCredentials: true },
        );

        setIsLoggedIn(data.status);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    verifyUser();
  }, []);

  const handleChat = () => {
    navigate("/chat");
  };
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <nav
        className={`fixed top-0 left-0 z-50 w-full flex px-8 py-4 items-center justify-between transition-all duration-300 ${scrolled ? "bg-black/10 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-transparent"}`}
      >
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-circle-nodes text-sky-600"></i>SigmaGPT
        </h3>

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={handleChat}
              className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Go to Chat
            </button>
          ) : (
            <>
              <button
                className="text-gray-400 hover:text-white transition"
                onClick={handleLogin}
              >
                Log In
              </button>

              <button
                className="bg-sky-600 hover:bg-sky-700 px-2 py-1 rounded-lg font-medium transition"
                onClick={handleSignup}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 mt-6">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Sigma<span className="text-sky-600">GPT</span>
        </h1>

        <h2 className="mt-6 text-2xl md:text-4xl font-semibold max-w-3xl leading-tight">
          Your AI Assistant for <span className="text-sky-600">learning</span>,
          <br />
          <span className="text-sky-400">Coding</span> and{" "}
          <span className="text-sky-400">Research</span>
        </h2>

        <p className="mt-6 text-gray-400 text-lg max-w-2xl leading-relaxed">
          Ask questions,solve problems,write content and continue conservations
          anytime.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-24">
        <h3 className="text-center text-3xl font-bold mb-8">
          See SigmaGPT in Action
        </h3>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
          <div className="mb-6 justify-start">
            <span className="font-medium">You</span>
            <div className="mt-2 bg-sky-600 text-white rounded-2xl p-4 w-[250px]">
              Explain normalization in DBMS
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium">SigmaGPT</span>
            <div className="mt-2 bg-black/40 border-zinc-800 rounded-2xl p-4 text-gray-300 leading-relaxed max-w-lg">
              Normalization is the process of organizing data in a database to
              reduce redundancy and improve data integrity. It involves dividing
              tables into smaller related tables and defining relationships
              between them.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-24 pb-20">
        <h3 className="text-center text-3xl font-bold mb-12">
          What SigmaGPT Can Help With
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-sky-500/50 transition-all duration-300">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-sky-500/20 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                <i className="fa-solid fa-code text-2xl text-sky-500"></i>
              </div>
              <h4 className="text-xl font-semibold mb-3">Coding</h4>
              <p className="text-gray-400 leading-relaxed">
                Debug code, learn new technologies, understand algorithms and
                get programming help instantly.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-sky-500/50 transition-all duration-300">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-sky-500/20 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                <i className="fa-solid fa-book text-2xl text-sky-500"></i>
              </div>
              <h4 className="text-xl font-semibold mb-3">Learning</h4>
              <p className="text-gray-400 leading-relaxed">
                Understand concepts, prepare for exams, solve problems and learn
                topics step by step.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-sky-500/50 transition-all duration-300">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-40 h-40 bg-sky-500/20 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                <i className="fa-solid fa-spell-check text-2xl text-sky-500"></i>
              </div>

              <h4 className="text-xl font-semibold mb-3">Writing</h4>

              <p className="text-gray-400 leading-relaxed">
                Draft emails, generate content, summarize information and
                improve your writing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
