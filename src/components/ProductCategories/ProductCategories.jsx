import { Menu } from 'antd';
import {useEffect, useState} from "react";
import productService from "../../api/productService.js";

const ProductCategories = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId?.toString() || null);
        onCategorySelect(categoryId);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productService.getAllCategories();
                if (response.code === '200' && response.data) {
                    setCategories(response.data);
                } else {
                    setError('Failed to fetch categories');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message || 'An error occurred while fetching categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold uppercase mb-4">Categories</h2>
            {loading ? (
                <p>Loading categories...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedCategory]}
                    className="border-0"
                >
                    {categories.map((category) => (
                        <Menu.Item
                            key={category.id.toString()}
                            onClick={() => handleCategorySelect(category.id)}
                            className="!pl-0 !pr-0 hover:!bg-gray-100 hover:!text-gray-900"
                        >
                            <div className="flex justify-between items-center w-full px-4 py-1 text-gray-800">
                                <span>{category.name}</span>
                                <span className="text-gray-400">&gt;</span>
                            </div>
                        </Menu.Item>
                    ))}
                </Menu>
            )}
        </div>
    );
};

export default ProductCategories;