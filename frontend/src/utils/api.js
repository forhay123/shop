import apiClient from "./apiClient";

// ✅ Full image base URL (e.g., http://localhost:8000/uploads)
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

// ---------------------- AUTH ----------------------

// 🟢 Register (supports extra fields + photo)
// 🟢 Register user with JSON payload
export async function registerUserJson(payload) {
  try {
    const res = await apiClient.post("/auth/register", payload);
    return res.data;
  } catch (err) {
    console.error("Register error:", err);
    throw err.response?.data || { detail: "Registration failed" };
  }
}

// 🟢 Login
export async function loginUser(email, password) {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await apiClient.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token } = res.data;

    // ❌ REMOVED: localStorage.setItem("token", access_token);
    // ❌ REMOVED: localStorage.setItem("user", JSON.stringify(profile));
    // ❌ REMOVED: localStorage.setItem("role", normalizedRole);
    // ❌ REMOVED: localStorage.setItem("user_id", profile.id);

    // ✅ Return only the token to be handled by the context
    return { access_token };
  } catch (err) {
    console.error("Login error:", err);
    throw err.response?.data || { detail: "Login failed" };
  }
}

// 🟢 Verify Email (now uses a POST request with a body)
export async function verifyEmail(token) {
  try {
    const res = await apiClient.post("/auth/verify-email", { token });
    return res.data;
  } catch (err) {
    console.error("Email verification error:", err);
    throw err.response?.data || { detail: "Verification failed" };
  }
}

// 🟢 Fetch current user profile
export async function fetchUserProfile() {
  try {
    // The interceptor handles the header, no need to add it here
    const res = await apiClient.get("/users/me");
    return res.data;
  } catch (err) {
    console.error("Fetch profile error:", err);
    throw err.response?.data || { detail: "Failed to fetch profile" };
  }
}


// 🟢 Forgot Password (send reset link)
export async function forgotPassword(email) {
  try {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("Forgot password error:", err);
    throw err.response?.data || { detail: "Failed to send reset link" };
  }
}

// 🟢 Reset Password (with token)
export async function resetPassword(token, newPassword) {
  try {
    const res = await apiClient.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Reset password error:", err);
    throw err.response?.data || { detail: "Failed to reset password" };
  }
}


// ---------------------- PRODUCTS ----------------------

// 🟢 Fetch all products (public)
export async function fetchProducts() {
  try {
    const res = await apiClient.get("/products/");
    return res.data.map((product) => ({
      ...product,
      // don't prepend here, just return the filename
      image_url: product.image_url || null,
      category: product.category || "",
    }));
  } catch (err) {
    console.error("Fetch products error:", err);
    throw err.response?.data || { detail: "Failed to load products" };
  }
}

// 🟢 Fetch single product by ID (public)
export async function fetchProductById(productId) {
  try {
    const res = await apiClient.get(`/products/${productId}`);
    const product = res.data;
    return {
      ...product,
      image_url: product.image_url
        ? `${UPLOADS_BASE_URL}/${product.image_url}`
        : null,
      category: product.category || "", // NEW
    };
  } catch (err) {
    console.error("Fetch product error:", err);
    throw err.response?.data || { detail: "Failed to load product" };
  }
}

export async function addProduct(formData) {
  try {
    // The interceptor handles the header, no need to add it here
    const res = await apiClient.post("/products/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Add product error:", err);
    throw err.response?.data || { detail: "Failed to add product" };
  }
}

export async function updateProduct(productId, formData) {
  try {
    // The interceptor handles the header, no need to add it here
    const res = await apiClient.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Update product error:", err);
    throw err.response?.data || { detail: "Failed to update product" };
  }
}

// 🟢 Delete product (admin only)
export async function deleteProduct(productId) {
  try {
    const res = await apiClient.delete(`/products/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Delete product error:", err);
    throw err.response?.data || { detail: "Failed to delete product" };
  }
}

// ---------------------- ORDERS ----------------------

// 🟢 Fetch my orders (requires login)
export async function fetchMyOrders() {
  try {
    const res = await apiClient.get("/orders/me");
    return res.data;
  } catch (err) {
    console.error("Fetch orders error:", err);
    throw err.response?.data || { detail: "Failed to fetch orders" };
  }
}

// ---------------------- CART ----------------------
// 🟢 Add item to cart
export async function addItemToCart(payload) {
  try {
    const res = await apiClient.post("/cart/", payload);
    return res.data;
  } catch (err) {
    console.error("Add to cart error:", err);
    throw err.response?.data || { detail: "Failed to add item to cart" };
  }
}

// 🟢 Update cart item quantity
export async function updateCartItemQuantity(itemId, newQuantity) {
  try {
    const res = await apiClient.put(`/cart/items/${itemId}`, { quantity: newQuantity });
    return res.data;
  } catch (err) {
    console.error("Update cart item error:", err);
    throw err.response?.data || { detail: "Failed to update item quantity" };
  }
}

// 🟢 Delete cart item
export async function deleteCartItem(itemId) {
  try {
    const res = await apiClient.delete(`/cart/items/${itemId}`);
    return res.data;
  } catch (err) {
    console.error("Delete cart item error:", err);
    throw err.response?.data || { detail: "Failed to delete item" };
  }
}

// 🟢 Checkout selected items
export async function checkoutSelectedItems(selectedItemIds, cartId) { // ✅ Add cartId to the function signature
    try {
        const res = await apiClient.post("/cart/checkout", { 
            selected_item_ids: selectedItemIds,
            cart_id: cartId // ✅ Add cart_id to the payload
        });
        return res.data;
    } catch (err) {
        console.error("Checkout error:", err);
        throw err.response?.data || { detail: "Failed to checkout" };
    }
}


// ---------------------- ADMIN ORDERS ----------------------

// 🟢 Fetch all orders (admin only)
export async function fetchAllOrders() {
  try {
    const res = await apiClient.get("/orders/");
    return res.data;
  } catch (err) {
    console.error("Fetch orders error:", err);
    throw err.response?.data || { detail: "Failed to fetch orders" };
  }
}

// 🟢 Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    // Change to a PUT with a body instead of a query parameter
    const res = await apiClient.put(`/orders/${orderId}`, null, {
      params: { status }
    });
    return res.data;
  } catch (err) {
    console.error("Update order error:", err);
    throw err.response?.data || { detail: "Failed to update order" };
  }
}

// 🟢 Delete order
export async function deleteOrder(orderId) {
  try {
    const res = await apiClient.delete(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("Delete order error:", err);
    throw err.response?.data || { detail: "Failed to delete order" };
  }
}

// 🟢 Ship order (admin only)
export async function shipOrder(orderId, payload) {
  try {
    const res = await apiClient.post(`/orders/${orderId}/ship`, payload);
    return res.data;
  } catch (err) {
    console.error("Ship order error:", err);
    throw err.response?.data || { detail: "Failed to ship order" };
  }
}

// ---------------------- ADMIN USERS ----------------------

// 🟢 Fetch all users (admin only)
export async function fetchUsers() {
  try {
    const res = await apiClient.get("/users/");
    return res.data;
  } catch (err) {
    console.error("Fetch users error:", err);
    throw err.response?.data || { detail: "Failed to fetch users" };
  }
}

// ---------------------- REVIEWS ----------------------

// 🟢 Create a new review
export async function createReview(payload) {
  try {
    const res = await apiClient.post("/reviews/", payload);
    return res.data;
  } catch (err) {
    console.error("Create review error:", err);
    throw err.response?.data || { detail: "Failed to create review" };
  }
}

// 🟢 Fetch all reviews for a product
export async function fetchReviewsByProduct(productId) {
  try {
    const res = await apiClient.get(`/reviews/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Fetch reviews error:", err);
    throw err.response?.data || { detail: "Failed to fetch reviews" };
  }
}

// 🟢 Fetch all reviews (admin only)
export async function fetchAllReviews() {
  try {
    const res = await apiClient.get("/reviews/admin"); // <-- Corrected path
    return res.data;
  } catch (err) {
    console.error("Fetch all reviews error:", err);
    throw err.response?.data || { detail: "Failed to fetch all reviews" };
  }
}