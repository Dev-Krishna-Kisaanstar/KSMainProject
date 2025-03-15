import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CategoriesImage from '../Assets/Background/Categories.png';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';

const predefinedCategories = {
  "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients"],
  "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
  "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
  "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
  "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment"],
  "Garden": ["Horticulture"],
};

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
        withCredentials: true,
      });
      return response.data.products || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const prepareCategoriesData = (products) => {
    const categories = {};
    for (const [categoryName, subcategories] of Object.entries(predefinedCategories)) {
      categories[categoryName] = {
        name: categoryName,
        icon: CategoriesImage,
        subcategories: {},
      };
      subcategories.forEach((subCategory) => {
        categories[categoryName].subcategories[subCategory] = {
          name: subCategory,
          count: 0,
        };
      });
    }

    products.forEach(product => {
      const { category, subCategory } = product;
      if (categories[category] && categories[category].subcategories[subCategory]) {
        categories[category].subcategories[subCategory].count += 1;
      }
    });

    return Object.values(categories).map((category) => ({
      name: category.name,
      icon: category.icon,
      subcategories: Object.values(category.subcategories),
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      const products = await fetchProducts();
      const preparedData = prepareCategoriesData(products);
      setCategoriesData(preparedData);
      setLoading(false);
    };

    loadData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div style={{ overflowX: 'hidden', margin: 0, padding: 20 }}>
      <Headerbar />
      <Header />
      <h1 style={{ textAlign: 'center', fontSize: 28, margin: '20px 0' }}>Product Categories</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          padding: 20,
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: 16, color: '#6c757d' }}>Loading categories...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', fontSize: 16, color: 'red' }}>
            Error fetching categories: {error}
          </p>
        ) : (
          categoriesData.map((category, index) => (
            <motion.div
              key={index}
              style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={`/subcategories/${encodeURIComponent(category.name)}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: 140,
                    objectFit: 'contain',
                  }}
                />
                <h2 style={{ textAlign: 'center', fontSize: 18, margin: '10px 0' }}>{category.name}</h2>
              </Link>
            </motion.div>
          ))
        )}
      </div>
      <div style={{ padding: '40px 0 0' }}>
        <Footer />
        <Footerbar />
      </div>
    </div>
  );
};

export default Categories;
