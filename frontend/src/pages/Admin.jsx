import React, { useEffect, useState, useRef } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaBoxOpen,
    FaTags,
    FaChartBar,
    FaSignOutAlt,
    FaSearch,
    FaCog,
    FaCloudUploadAlt,
    FaInfoCircle,
} from 'react-icons/fa';
import NavBar from '../components/NavBar';
import api from '../services/api';

const Admin = () => {
    useEffect(() => {
        getProducts();
        getCategories();
    }, [])

    const getProducts = async () => {
        const response = await api.get('product/');
        setProducts(response.data)
    }

    const getCategories = async () => {
        const response = await api.get('product/categories/');
        setCategories(response.data)
    }

    // State management
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [productForm, setProductForm] = useState({
        id: null,
        name: '',
        desc: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        is_active: true
    });
    const [categoryForm, setCategoryForm] = useState({ id: null, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle product form changes
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file for upload
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image from form
    const removeImage = () => {
        setPreviewImage(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    // Handle category form changes
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({ ...prev, [name]: value }));
    };

    // Submit product form
    const submitProductForm = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        try {
            const formData = new FormData();
            formData.append("name", productForm.name);
            formData.append("desc", productForm.desc);
            formData.append("price", productForm.price);
            formData.append("category", productForm.category);
            formData.append("stock", productForm.stock);
            formData.append("is_active", productForm.is_active);

            if (imageFile) {
                formData.append("image", imageFile);
            } else if (productForm.image && !previewImage) {
                // If editing and no new image selected, keep existing image
                formData.append("image", productForm.image);
            }

            if (isEditing) {
                await api.patch(`product/${productForm.id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                await api.post("product/create/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            setSuccess("Producted added/updated successfully!");
            // Refresh data
            getProducts();
            resetForms();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    // Submit category form
    const submitCategoryForm = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        try {
            if (isEditing) {
                await api.patch(`product/category/${categoryForm.id}/`, categoryForm);
            } else {
                await api.post("product/category/create/", categoryForm);
            }
            setSuccess("Category added/updated successfully!")
            // Refresh data
            getCategories();
            resetForms();
        } catch (error) {
            setError("Error saving category!")            
        }
    };

    // Edit product
    const editProduct = (product) => {
        setProductForm(product);
        setPreviewImage(product.image);
        setImageFile(null);
        setIsEditing(true);
        setShowProductForm(true);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Edit category
    const editCategory = (category) => {
        setCategoryForm(category);
        setIsEditing(true);
        setShowCategoryForm(true);
    };

    // Delete product
    const deleteProduct = async (id) => {
        setSuccess("");
        setError("");
        try {
            await api.delete(`product/${id}/`);
            setSuccess("Deleted Product Successfully!");
            getProducts();
        } catch (error) {
            setError("Error deleting product:");
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        setSuccess("");
        setError("");
        try {
            await api.delete(`product/category/${id}/`);
            setSuccess("Category Added Successfully!")
            getCategories();
        } catch (error) {
            setError("Error deleting category!");
        }
    };

    // Reset forms
    const resetForms = () => {
        setProductForm({
            id: null,
            name: '',
            price: '',
            category: '',
            stock: '',
            image: '',
            is_active: true
        });
        setCategoryForm({ id: null, name: '' });
        setIsEditing(false);
        setShowProductForm(false);
        setShowCategoryForm(false);
        setPreviewImage(null);
        setImageFile(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Stats for dashboard
    const stats = {
        totalProducts: products.length,
        outOfStock: products.filter(p => p.stock <= 0).length,
        totalCategories: categories.length,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-4">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-gray-400 text-sm">Shoppy Nepal</p>
                </div>

                <nav className="mt-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center w-full px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                        <FaChartBar className="mr-3" />
                        Dashboard
                    </button>

                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center w-full px-4 py-3 ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                        <FaBoxOpen className="mr-3" />
                        Products
                    </button>

                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center w-full px-4 py-3 ${activeTab === 'categories' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                        <FaTags className="mr-3" />
                        Categories
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <NavBar />

                {success &&
                    <div
                        role="alert"
                        className="justify-between bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform mb-2"
                    >
                        <div className='flex'>
                            <FaInfoCircle className="w-4 h-4 mr-2" />
                            <p className="text-xs font-semibold">Success - {success}</p>
                        </div>

                        <FaTimes onClick={() => setSuccess("")} />
                    </div>
                }

                {error &&
                    <div
                        role="alert"
                        className="justify-between bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-red-200 dark:hover:bg-red-800 transform mb-2"
                    >
                        <div className='flex'>
                            <FaInfoCircle className="w-4 h-4 mr-2" />
                            <p className="text-xs font-semibold">Error - {error}</p>
                        </div>
                        <FaTimes onClick={()=>setError("")} />
                    </div>
                }
                {/* Main Content Area */}
                <main className="p-6">
                    {activeTab === 'dashboard' && (
                        <DashboardTab stats={stats} products={products} categories={categories} />
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Product List</h3>
                                <button
                                    onClick={() => {
                                        resetForms();
                                        setShowProductForm(true);
                                    }}
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Product
                                </button>
                            </div>

                            {showProductForm && (
                                <div className="bg-white rounded-lg shadow p-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            {isEditing ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <button
                                            onClick={resetForms}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <form onSubmit={submitProductForm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={productForm.name}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                            <textarea
                                                type="text"
                                                name="desc"
                                                value={productForm.desc}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={productForm.price}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                name="category"
                                                value={productForm.category}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={productForm.stock}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                                min="0"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Image
                                            </label>

                                            {previewImage ? (
                                                <div className="relative">
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="max-h-60 rounded-md object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="mt-3 flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                        >
                                                            <FaTrash className="mr-2" />
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all border-gray-300 hover:border-blue-400`}
                                                    onClick={() => fileInputRef.current.click()}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />

                                                    <div className="flex flex-col items-center justify-center">
                                                        <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mb-3" />
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium text-blue-600">Click to upload</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            PNG, JPG, GIF up to 5MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                                <span>Image preview</span>
                                                <span>Recommended: 600x600 pixels</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Is Active</label>
                                            <select
                                                name="is_active"
                                                value={productForm.is_active}
                                                onChange={handleProductChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                            >
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>


                                        <div className="md:col-span-2 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={resetForms}
                                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            >
                                                <FaSave className="mr-2" />
                                                {isEditing ? 'Update Product' : 'Add Product'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProducts.map(product => (
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-md" src={product.image} alt={product.name} />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                            {product.stock} in stock
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${product.is_active ? "text-green-400" : "text-red-400"}`}>
                                                        {product.is_active ? "Yes" : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => editProduct(product)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(product.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Category List</h3>
                                <button
                                    onClick={() => {
                                        resetForms();
                                        setShowCategoryForm(true);
                                    }}
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Category
                                </button>
                            </div>

                            {showCategoryForm && (
                                <div className="bg-white rounded-lg shadow p-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            {isEditing ? 'Edit Category' : 'Add New Category'}
                                        </h3>
                                        <button
                                            onClick={resetForms}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <form onSubmit={submitCategoryForm} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={categoryForm.name}
                                                onChange={handleCategoryChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={resetForms}
                                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            >
                                                <FaSave className="mr-2" />
                                                {isEditing ? 'Update Category' : 'Add Category'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categories.map(category => (
                                                <tr key={category.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 capitalize">{category.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {category.productCount} products
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => editCategory(category)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCategory(category.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, products, categories }) => {
    return (
        <div>
            <h3 className="text-lg font-medium mb-6">Dashboard Overview</h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                            <FaBoxOpen className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full mr-4">
                            <FaBoxOpen className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Low Stock</p>
                            <p className="text-2xl font-bold">{stats.lowStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full mr-4">
                            <FaBoxOpen className="text-red-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Out of Stock</p>
                            <p className="text-2xl font-bold">{stats.outOfStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full mr-4">
                            <FaTags className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Categories</p>
                            <p className="text-2xl font-bold">{stats.totalCategories}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium">Recent Products</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.slice(0, 5).map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md" src={product.image} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${product.is_active ? "text-green-400" : "text-red-400"}`}>
                                        {product.is_active ? "Yes" : "No"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-medium">Categories</h4>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3">
                            {categories.map(category => (
                                <li key={category.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="capitalize">{category.name}</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {category.productCount} products
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="text-lg font-medium">Low Stock Products</h4>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3">
                            {products
                                .filter(p => p.stock > 0 && p.stock < 10)
                                .slice(0, 5)
                                .map(product => (
                                    <li key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="truncate max-w-[70%]">{product.name}</span>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                            {product.stock} left
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;