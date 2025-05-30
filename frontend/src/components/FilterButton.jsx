const FilterButton = ({ category, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full mx-1 ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      } hover:bg-blue-500 hover:text-white transition-colors`}
    >
      {category}
    </button>
  );
};

export default FilterButton;