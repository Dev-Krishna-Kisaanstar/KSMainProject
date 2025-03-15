import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import CategoriesImage from '../Assets/Background/Categories.png';

const categories = {
  "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients"],
  "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
  "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
  "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
  "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment"],
  "Garden": ["Horticulture"],
};

const SubCategory = () => {
  const { categoryName } = useParams();
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
          withCredentials: true,
        });
        const products = response.data.products || [];
        processSubcategories(products);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const processSubcategories = (products) => {
      const subcategoryCounts = {};
      const selectedSubcategories = categories[decodeURIComponent(categoryName)];

      if (selectedSubcategories) {
        selectedSubcategories.forEach(subCategory => {
          subcategoryCounts[subCategory] = {
            name: subCategory,
            count: 0,
            icon: CategoriesImage,
          };
        });

        products.forEach(product => {
          if (product.category === decodeURIComponent(categoryName) && subcategoryCounts[product.subCategory]) {
            subcategoryCounts[product.subCategory].count += 1;
          }
        });
      }

      setSubcategoriesData(Object.values(subcategoryCounts));
      setLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  const handleSubCategoryClick = (subCategoryName) => {
    navigate(`/subcategories/${encodeURIComponent(categoryName)}/${encodeURIComponent(subCategoryName)}`);
  };

  const handleProductClick = (productId) => {
    console.log("Navigating to product ID:", productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <Headerbar />
      <Header />
      <div style={{ padding: '20px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 16, color: '#6c757d', marginBottom: 10 }}>
          <Link to="/products/Categories" style={{ textDecoration: 'none', color: '#007bff' }}>Categories</Link> / {decodeURIComponent(categoryName)}
        </div>

        <h1 style={{ textAlign: 'center', fontSize: 28, margin: '20px 0' }}>
          Subcategories in {decodeURIComponent(categoryName)}
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{
                width: 50,
                height: 50,
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #007bff',
                borderRadius: '50%',
              }}
            ></motion.div>
          </div>
        ) : error ? (
          <p style={{ textAlign: 'center', fontSize: 16, color: 'red' }}>Error fetching subcategories: {error}</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
              marginTop: 20,
            }}
          >
            {subcategoriesData.length > 0 ? (
              subcategoriesData.map((subCategory) => (
                <motion.div
                  key={subCategory.name}
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSubCategoryClick(subCategory.name)}
                >
                  <img
                    src={subCategory.icon}
                    alt={subCategory.name}
                    style={{
                      width: '100%',
                      height: 140,
                      objectFit: 'contain',
                    }}
                  />
                  <div style={{ padding: 10, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 18, margin: '10px 0' }}>{subCategory.name}</h2>
                    <p style={{ fontSize: 14, color: '#6c757d' }}>{subCategory.count} Products</p>
                    {/* Replace with actual product ID */}
                    <button
                      style={{
                        marginTop: 10,
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(subCategory.productId)} // Use actual product ID here
                    >
                      View Product
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ textAlign: 'center', fontSize: 16, color: '#6c757d' }}>
                No subcategories found for this category.
              </p>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: '40px 0 0' }}>
        <Footer />
        <Footerbar />
      </div>
    </div>
  );
};

export default SubCategory;