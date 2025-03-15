import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon, CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Headerbar from "../Components/SmallComponents/Headerbar";
import Header from "../Components/SmallComponents/Header";
import Footer from "../Components/SmallComponents/Footer";
import Footerbar from "../Components/SmallComponents/Footerbar";
import { green } from "@mui/material/colors";

const predefinedCategories = {
  "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients"],
  "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
  "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
  "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
  "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment"],
  "Garden": ["Horticulture"],
};

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
          params: {
            category: selectedCategory,
            subcategories: selectedSubcategories.join(","),
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          },
        });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedSubcategories, priceRange]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((item) => item !== subcategory) : [...prev, subcategory]
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const SidebarContent = (
    <Box sx={{ width: "300px", padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>Filters</Typography>
      <Divider sx={{ marginBottom: "16px" }} />
      <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
      <Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={1000} sx={{ marginBottom: "16px" }} />
      <Typography variant="subtitle1" gutterBottom>Categories</Typography>
      {Object.keys(predefinedCategories).map((category) => (
        <FormControlLabel key={category} control={<Checkbox checked={selectedCategory === category} onChange={() => handleCategoryChange(category)} icon={<CheckCircleOutline sx={{ color: green[500] }} />} checkedIcon={<CheckCircleOutline sx={{ color: green[500] }} />} />} label={category} />
      ))}
      <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "16px" }}>Subcategories</Typography>
      {selectedCategory && predefinedCategories[selectedCategory].map((subcategory) => (
        <FormControlLabel key={subcategory} control={<Checkbox checked={selectedSubcategories.includes(subcategory)} onChange={() => handleSubcategoryChange(subcategory)} icon={<CheckCircleOutline sx={{ color: green[500] }} />} checkedIcon={<CheckCircleOutline sx={{ color: green[500] }} />} />} label={subcategory} />
      ))}
      <Button variant="outlined" color="error" fullWidth sx={{ marginTop: "16px" }} onClick={() => { setSelectedCategory(""); setSelectedSubcategories([]); setPriceRange([0, 1000]); }} startIcon={<HighlightOff sx={{ color: green[500] }} />}>Reset Filters</Button>
    </Box>
  );

  return (
    <>
      <Headerbar />
      <Header />
      <Box sx={{ display: { xs: "block", md: "flex" }, padding: "16px" }}>
        <IconButton sx={{ display: { xs: "block", md: "none" } }} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>{SidebarContent}</Drawer>
        <Box sx={{ display: { xs: "none", md: "block" }, marginRight: "16px" }}>{SidebarContent}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>Products</Typography>
          {loading ? (<Typography>Loading products...</Typography>) : error ? (<Typography color="error">{error}</Typography>) : products.length === 0 ? (<Typography>No products found.</Typography>) : (
            <Grid container spacing={2}>{products.map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product._id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", boxShadow: 3 }}>
                  <CardMedia component="img" height="240" image={product.productImages[0] || "https://via.placeholder.com/150"} alt={product.productName} sx={{ objectFit: "cover" }} />
                  <CardContent>
                    <Typography variant="h6">{product.productName}</Typography>
                    <Typography variant="h6" color="primary">₹{product.MRP}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}</Grid>
          )}
        </Box>
      </Box>
      <Footer />
      <Footerbar />
    </>
  );
};
export default Shop;
