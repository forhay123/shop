import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Star, Heart, ArrowLeft, Package, Truck, ArrowRight } from "lucide-react"; // Added ArrowRight for the card
import { fetchProducts, addItemToCart, UPLOADS_BASE_URL } from "@/utils/api";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // Import Link for category buttons

// Renamed ProductGridCard to ProductCard for consistency.
// Note: This is the same as the ProductCard in your DashboardPage.js.
// For a production app, you'd move this component to a shared file.
const DashboardProductCard = ({ product, handleCardClick }) => {
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">Almost Gone ({stock} left)</Badge>;
    return <Badge variant="secondary" className="bg-gradient-to-r from-green-500/10 to-blue-500/10 text-foreground border-green-500/20">{stock} in stock</Badge>;
  };

  return (
    <Card 
      className="group flex-none w-56 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
      onClick={() => handleCardClick(product)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={`${UPLOADS_BASE_URL}/${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold backdrop-blur-sm">
            Sold Out
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 rounded-full bg-background/90 backdrop-blur-sm">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
      <CardHeader className="p-6 space-y-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ${product.selling_price.toFixed(2)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">4.8</span>
            </div>
          </div>
        </div>
        {getStockBadge(product.stock)}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};

// Featured product display component (retained as is)
const FeaturedProductCard = ({ product, handleAddToCart, isLoggedIn }) => {
  const navigate = useNavigate();
  
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="destructive" className="text-sm px-3 py-1">Out of Stock</Badge>;
    if (stock <= 5) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-sm px-3 py-1">Limited Stock ({stock} left)</Badge>;
    return <Badge variant="secondary" className="bg-gradient-to-r from-green-500/10 to-blue-500/10 text-foreground border-green-500/20 text-sm px-3 py-1">{stock} available</Badge>;
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card/80 to-muted/20 border-border/50 shadow-glow overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative h-96 lg:h-full bg-gradient-to-br from-muted/10 to-muted/30 flex items-center justify-center p-8">
          <img
            src={`${UPLOADS_BASE_URL}/${product.image_url}`}
            alt={product.name}
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
          />
          <div className="absolute top-6 left-6">
            <Badge className="bg-primary text-primary-foreground font-semibold">Featured</Badge>
          </div>
          {product.stock === 0 && (
            <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-semibold backdrop-blur-sm">
              Sold Out
            </div>
          )}
        </div>
        <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider">
                {product.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  ${product.selling_price.toFixed(2)}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(247 reviews)</span>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
            
            {getStockBadge(product.stock)}
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-elegant"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-14 text-lg border-primary/20 hover:bg-primary hover:text-primary-foreground"
                onClick={() =>
                  isLoggedIn
                    ? navigate("/checkout", { state: { product } })
                    : navigate("/login")
                }
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>1-year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Related product card component (retained as is)
const RelatedProductCard = ({ product, onSelect }) => {
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
    if (stock <= 5) return <Badge className="bg-orange-500 text-white text-xs">Low Stock</Badge>;
    return <Badge variant="secondary" className="text-xs">{stock} available</Badge>;
  };

  return (
    <Card 
      className="group flex-none w-56 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-medium hover:shadow-glow transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={() => onSelect(product)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={`${UPLOADS_BASE_URL}/${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="p-4 space-y-2">
        <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary">
            ${product.selling_price.toFixed(2)}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">4.6</span>
          </div>
        </div>
        {getStockBadge(product.stock)}
      </CardHeader>
    </Card>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedProduct = location.state?.selectedProduct;

  // Read the category from the URL query parameter
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      if (product.stock === 0) {
        toast.error("Product is out of stock");
        return;
      }
      await addItemToCart({ product_id: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      const errors = err?.response?.data?.detail;
      let errorMessage = "Failed to add to cart.";
      if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors[0].msg || errorMessage;
      } else {
        errorMessage = err.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // If a category is selected from the URL, filter by it
    if (categoryParam) {
      filtered = filtered.filter(product => product.category.toLowerCase() === categoryParam.toLowerCase());
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm, categoryParam]);

  const categorizedProducts = useMemo(() => {
    const categories = [...new Set(filteredProducts.map(p => p.category).filter(Boolean))];
    const categoryMap = {};

    categories.forEach(category => {
      categoryMap[category] = filteredProducts.filter(product => product.category === category);
    });

    return categoryMap;
  }, [filteredProducts]);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    ).slice(0, 6);
  }, [products, selectedProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-glow animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Loading Products</h3>
                <p className="text-muted-foreground">Fetching our premium collection...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle click for product cards on this page
  const handleProductCardClick = (product) => {
    navigate(`/products`, { state: { selectedProduct: product } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16">
        {selectedProduct ? (
          <div className="space-y-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="gap-2 border-border/50 hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <FeaturedProductCard
              product={selectedProduct}
              handleAddToCart={handleAddToCart}
              isLoggedIn={isLoggedIn}
            />
            {relatedProducts.length > 0 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">You might also like</h2>
                  <p className="text-muted-foreground">More products from the {selectedProduct.category} category</p>
                </div>
                
                <div className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide">
                  {relatedProducts.map(product => (
                    <RelatedProductCard
                      key={product.id}
                      product={product}
                      onSelect={(product) => {
                        navigate('/products', { state: { selectedProduct: product } });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Premium Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated collection of professional-grade technology and accessories
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <Card className="bg-gradient-to-r from-card to-muted/10 border-border/50 shadow-medium">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 text-lg border-border/50 bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {categoryParam && (
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/products")}
                  className="gap-2 border-border/50 hover:bg-muted"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Products
                </Button>
                <h2 className="text-3xl font-bold capitalize">{decodeURIComponent(categoryParam)}</h2>
              </div>
            )}

            {Object.keys(categorizedProducts).length === 0 ? (
              <div className="text-center py-24">
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                    <Search className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                  </div>
                  <Button onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
                  <div key={category} className="space-y-8">
                    { !categoryParam && (
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold capitalize">{category}</h2>
                        <p className="text-muted-foreground">
                          {categoryProducts.length} products available
                        </p>
                      </div>
                    )}
                    
                    <div className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide">
                      {categoryProducts.map(product => (
                        <DashboardProductCard
                          key={product.id}
                          product={product}
                          handleCardClick={handleProductCardClick} // Use the new handler
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}