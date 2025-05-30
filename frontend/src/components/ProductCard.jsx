import { useState } from "react";
import api from "../services/api";
import { FaInfoCircle } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleAddtoCart = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.post(`user/cart/add/${id}/`);
      setSuccess("Product Added to Cart Successfully!")
    } catch {
      setError("Sorry, we can't add to cart right now!")
    }

  }
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${(product.stock == 0 || !product.is_active) && "opacity-40"}`}>
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
          <FaTimes onClick={() => setError("")} />
        </div>
      }

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="font-semibold text-lg mt-2">{product.name}</h3>
      <div className="flex justify-between">
        <p className="text-gray-600">${product.price}</p>
        <p>Stock: {product.stock} </p>
      </div>
      <p>{product.desc}</p>
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-gray-300"
        disabled={product.stock == 0 || !product.is_active}
        onClick={() => handleAddtoCart(product.id)}
      >
        {(product.stock > 0 && product.is_active) ? "Add to Cart" : <strike>Item not available</strike>}
      </button>
    </div>
  );
};

export default ProductCard;