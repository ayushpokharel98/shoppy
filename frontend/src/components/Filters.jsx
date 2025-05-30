import React from 'react'
import FilterButton from './FilterButton';
const Filters = ({selectedCategory, setSelectedCategory, setMinPrice, setMaxPrice, setActiveChecked, activeChecked}) => {
    const categories = [{ category: 'all', id: 0 }, { category: 'electronics', id: 1 }, { category: 'clothing', id: 2 }, { category: 'home', id: 3 }];
    return (
        <div className="max-w-7xl flex mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col flex-wrap gap-2 w-full">
                <div className="categories">
                    {categories.map(category => (
                        <FilterButton
                            key={category.id}
                            category={category.category}
                            active={selectedCategory === category.id}
                            onClick={() => setSelectedCategory(category.id)}

                        />
                    ))}
                </div>
                <div className='flex justify-between mt-1 w-full'>

                    <div className="maxmin">
                        <label htmlFor="min_price">Min Price:</label>
                        <input
                            type="number"
                            name="min_price"
                            id="min_price"
                            className='w-24 p-2 border border-sky-600 focus:ring-1 focus:ring-sky-700 focus:border-sky-700 focus:outline-0 mx-2'
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <label htmlFor="max_price">Max Price:</label>
                        <input
                            type="number"
                            name="max_price"
                            id="max_price"
                            className='w-24 p-2 border border-sky-600 focus:ring-1 focus:ring-sky-700 focus:border-sky-700 focus:outline-0 mx-2'
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <div className='active'>
                        <input type="checkbox" onChange={() => setActiveChecked(!activeChecked)} name="isactive" id="isactive" />
                        <label htmlFor="isactive">Show Only Active</label>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Filters