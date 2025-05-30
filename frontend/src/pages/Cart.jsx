import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaShoppingCart,
    FaMinus,
    FaPlus,
    FaTrash,
    FaArrowLeft,
    FaTag,
    FaInfoCircle
} from 'react-icons/fa';
import api from '../services/api';
import NavBar from '../components/NavBar';
const Cart = () => {
    const [hasDetails, setHasDetails] = useState(false);

    const fetchData = async () => {
        const response = await api.get('user/');
        const { address, phone_number } = response.data;
        setHasDetails(!!address && !!phone_number);
    };
    useEffect(() => {
        getCartItems();
        fetchData();

    }, [])

    const getCartItems = async () => {
        const response = await api.get('user/cart/');
        setCartItems(response.data.items);
    }
    const [cartItems, setCartItems] = useState([]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const addQuantity = async (id, quantity, stock) => {
        if (quantity >= stock) return;
        await api.patch(`user/cart/item/${id}/`, { quantity: quantity + 1 })
        getCartItems();
    };

    const removeItem = async (id) => {
        await api.delete(`user/cart/item/${id}/`)
        getCartItems();
    };

    const decreaseQuantity = async (id, quantity) => {
        if (quantity <= 1) return;
        await api.patch(`user/cart/item/${id}/`, { quantity: quantity - 1 });
        getCartItems();
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {!hasDetails &&
                <div
                    role="alert"
                    className="bg-yellow-100 mt-2 w-full dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform"
                >
                    <FaInfoCircle className="w-4 h-4 mr-2" />

                    <p className="text-xs font-semibold">
                        Please complete your details in <Link to={"/profile"} className='underline hover:cursor-pointer'>Profile</Link> before placing order!
                    </p>
                </div>
            }
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
                <p className="text-gray-600 flex items-center">
                    <FaShoppingCart className="mr-2" />
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="mx-auto h-24 w-24 text-gray-400 flex items-center justify-center">
                            <FaShoppingCart className="w-full h-full" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-gray-500">Start adding some amazing products to your cart!</p>
                        <div className="mt-6">
                            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center w-48 mx-auto">
                                <FaArrowLeft className="mr-2" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-24 h-24 rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">Stock: {item.product.stock}</p>
                                                </div>
                                                <p className="text-lg font-medium text-gray-900">${item.product.price}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.id, item.quantity)}
                                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <span className="sr-only">Decrease quantity</span>
                                                        <FaMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="mx-3 text-lg">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addQuantity(item.id, item.quantity, item.product.stock)}
                                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <span className="sr-only">Increase quantity</span>
                                                        <FaPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-800 flex items-center transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4 mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-8 lg:mt-0 lg:col-span-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-lg font-bold">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400" disabled={!hasDetails}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        or{' '}
                                        <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center">
                                            <FaArrowLeft className="mr-1" />
                                            Continue Shopping
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mt-6 bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                                    <FaTag className="mr-2 text-green-600" />
                                    Have a promo code?
                                </h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;