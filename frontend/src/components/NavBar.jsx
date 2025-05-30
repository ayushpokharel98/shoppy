import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropDown';
import api from '../services/api';
const NavBar = ({ search_needed, searchQuery, setSearchQuery }) => {
    const { authenticated } = useAuth();
    const [userData, setUserData] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    useEffect(() => {
        getUserData();
    }, [])
    const getUserData = async () => {
        const response = await api.get("user/")
        setUserData(response.data);        
    }
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className={`flex flex-row items-center justify-between gap-4`}>
                    <Link to={"/"} className="text-2xl font-bold text-blue-600 hover:cursor-pointer">Shoppy Nepal</Link>

                    {search_needed && <div className="relative flex-grow max-w-xl">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>}

                    {authenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:cursor-pointer"
                            >
                                <img
                                    src={userData.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                            <ProfileDropdown
                                isOpen={isDropdownOpen}
                                onClose={() => setIsDropdownOpen(false)}
                                isStaff={userData.is_staff}
                            />
                        </div>
                    ) : (
                        <div className='relative flex justify-center items-center'>
                            <Link to={"/login"} className='p-2 bg-blue-400 text-white rounded-xl hover:cursor-pointer hover:bg-blue-500'>Login</Link>
                        </div>
                    )}


                </div>
            </div>
        </header>
    )
}

export default NavBar;