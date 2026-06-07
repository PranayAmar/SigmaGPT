import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MyContext } from "../context/MyContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setGlobalLoading } = useContext(MyContext);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);
      const { data } = await axios.post(
        "https://sigmagpt-backened.onrender.com/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/chat");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Something went wrong";

      handleError(message);
    } finally {
      setTimeout(() => {
        setGlobalLoading(false);
      }, 500);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };

  const handleGoogleLogin = () => {
    window.open("https://sigmagpt-backened.onrender.com/auth/google", "_self");
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-sky-500/20 blur-3xl rounded-full"></div>
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold text-white">Create Account</h2>

          <p className="text-gray-400 mt-2 text-sm">
            Join SigmaGPT and continue your conversations
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <button type="button" onClick={handleGoogleLogin} className="w-full h-12 flex items-center justify-center gap-3 bg-black font-medium py-1 rounded-xl transition-all duration-200 hover:bg-slate-800 border border-gray-700 hover:ring-2 hover:ring-sky-500/30"><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />  <span className="text-white font-medium text-base">Continue with google</span></button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-700"></div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transtion focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transtion focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transtion focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-sky-500/20"><i className="fa-brands fa-openid"></i>   SignUp</button>
          <p className="text-center text-sm text-gray-400 pt-2">
            Already have an account? <Link to={"/login"} className="hover:text-sky-300 transition hover:underline font-bold">Login</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};


export default Signup;