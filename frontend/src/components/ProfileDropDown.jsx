import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
const ProfileDropdown = ({ isOpen, onClose, isStaff }) => {
  const { logout } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
      <Link to={"/profile"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        Profile
      </Link>
      <Link to={"/cart"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        Cart
      </Link>
      {isStaff && <Link to={"/admin"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        Admin
      </Link>}
      <button onClick={() => logout()} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;