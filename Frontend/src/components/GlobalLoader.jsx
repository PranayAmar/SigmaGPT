import { HashLoader } from "react-spinners";

function GlobalLoader() {
    return (
        <div className = "fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <HashLoader color="#8e8ea0" size={50}/>
        </div>
    );
}

export default GlobalLoader;