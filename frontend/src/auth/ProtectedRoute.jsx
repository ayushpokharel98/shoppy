import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({children}) =>{
    const {authenticated, loading} = useAuth();
    if (loading) return <div>Loading...</div>
    return authenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;