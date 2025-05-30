import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const PublicRoute = ({children}) =>{
    const {authenticated, loading} = useAuth();

    if(loading) return <p>Loading...</p>

    return authenticated?<Navigate to="/" />:children;

}

export default PublicRoute;