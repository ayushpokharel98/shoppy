import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { BiSolidLeftArrow } from 'react-icons/bi';
const Profile = () => {
    useEffect(() => {
        fetchData();
    }, [])

    const navigate = useNavigate();

    const fetchData = async () => {
        const { data } = await api.get("user/");
        setUserDetails({
            username: data.username,
            email: data.email,
        });
        setProfileDetails({
            phone: data.phone_number,
            address: data.address,
        });
        setInitialProfileDetails({
            phone: data.phone_number,
            address: data.address,
        });
        setProfileImage(data.profile_picture);
        setInitialProfileImage(data.profile_picture);
    }
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: ''
    });

    const [initialprofileDetails, setInitialProfileDetails] = useState({
        phone: '',
        address: '',
    });
    const [initialProfileImage, setInitialProfileImage] = useState(null);

    const [profileDetails, setProfileDetails] = useState({
        phone: '',
        address: '',
    });

    const [profileImage, setProfileImage] = useState(null);



    const [profileImageFile, setProfileImageFile] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("phone_number", profileDetails.phone);
            formData.append("address", profileDetails.address);

            if (profileImage !== initialProfileImage && profileImageFile) {
                formData.append("profile_picture", profileImageFile);
            }

            await api.patch("user/profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("Profile updated successfully!");
            setInitialProfileDetails(profileDetails);
            setInitialProfileImage(profileImage);
        } catch (err) {
            setError("We are unable to update profile, please try again later!");
        }
    };



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };



    const handleChange = (e) => {
        setProfileDetails({
            ...profileDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleDisabled = () => {
        const detailsUnchanged = JSON.stringify(profileDetails) === JSON.stringify(initialprofileDetails);
        const imageUnchanged = profileImage === initialProfileImage;
        return detailsUnchanged && imageUnchanged;
    };
    




    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <BiSolidLeftArrow onClick={()=>navigate('/')} className='hover:cursor-pointer'></BiSolidLeftArrow>
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">SN</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Edit Profile</h1>
                </div>

                <div className="mb-8 flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={profileImage || '/placeholder-user.jpg'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">User Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={userDetails.username}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={userDetails.email}
                                        disabled
                                        className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Details</h2>
                            {error && <p className='text-red-500 text-center'>{error}</p>}
                            {success && <p className='text-green-500 text-center'>{success}</p>}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={profileDetails.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={profileDetails.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg disabled:bg-slate-200 disabled:hover:cursor-not-allowed hover:cursor-pointer"

                                disabled={handleDisabled()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    &copy; 2023 Shoppy Nepal. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Profile;