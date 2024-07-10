import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    loadCartFromStorage();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(
      "https://8s8yxba6g8.execute-api.ap-south-1.amazonaws.com/api/categories"
    );
    const data = await response.json();
    setCategories(data);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  };

  const handleAddToCart = (product) => {
    // check if product is already in cart
    const existingProduct = cart.find((item) => item.id === product.id);
    if (!existingProduct) {
      // add product to cart
      setCart((prevCart) => [...prevCart, product]);
      saveCartToStorage();
    } else {
      // product is already in cart, remove it
      handleRemoveFromCart(product);
    }
  };

  const handleRemoveFromCart = (product) => {
    // remove product from cart
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
    saveCartToStorage();
  };
  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((acc, product) => acc + product.price, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="menu" size={28} />
        <Text style={styles.headerText}>Vegetables and fruits</Text>
        <Icon name="search" size={28} />
      </View>
      <View style={styles.Outerbox}>
        <View style={styles.categoryContainer}>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.categoryItem}>
                <View style={styles.circle} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={({ item, index }) => (
              <View style={styles.productCard}>
                <View style={styles.imagePlaceholder} />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    if (cart.find((product) => product.id === item.id)) {
                      handleRemoveFromCart(item);
                    } else {
                      handleAddToCart(item);
                    }
                  }}
                >
                  <Text style={styles.addButtonText}>
                    {cart.find((product) => product.id === item.id)
                      ? "Remove"
                      : "+ Add"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productDetails}>{item.category}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productRate}>{item.rate}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            key={(products.length > 0).toString()} // Add this line to force re-render
          />
        </View>
      </View>
      <View style={styles.cartBar}>
        <Text style={styles.cartBarText}>
          Total Amount: ${calculateTotalAmount()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  Outerbox: {
    display: "flex",
    flexDirection: "row",
  },
  categoryContainer: {
    width: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 5,
    textAlign: "center",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    textAlign: "left",
    marginBottom: 10,
  },
  productsContainer: {
    flex: 1,
  },
  productCard: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxWidth: "48%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#00f",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productDetails: {
    fontSize: 12,
    color: "#888",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  productRate: {
    color: "#888",
    fontSize: 20,
  },
});

export default ProductList;
