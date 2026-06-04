import { Navigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

function ProtectedRoutes({children}) {
    const [loading,setLoading] = useState(true);
    const [auth,setAuth] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const {data} = await axios.get("https://sigmagpt-backened.onrender.com/verify",
                    {withCredentials:true}
                );

                setAuth(data.status);
            } catch(err) {
                console.log(err);
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    },[]);

    if(loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                Loading
            </div>
        );
    }
    return auth ? children : <Navigate to='/login'/>
}

export default ProtectedRoutes;