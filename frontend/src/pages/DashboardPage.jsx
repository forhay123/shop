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
import { Search, Star, ArrowRight, Sparkles } from "lucide-react";
import { fetchProducts, UPLOADS_BASE_URL } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // Import Link for category buttons

const ProductCard = ({ product, handleCardClick }) => {
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">Almost Gone ({stock} left)</Badge>;
    // Reduced padding/size for a more compact look
    return <Badge variant="secondary" className="bg-gradient-to-r from-green-500/10 to-blue-500/10 text-foreground border-green-500/20 text-xs px-2 py-0.5">{stock} in stock</Badge>; 
  };

  return (
    <Card 
      // MODIFICATION: Card width remains w-40
      // flex-none is essential to prevent flex-items from shrinking
      className="group flex-none w-40 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
      onClick={() => handleCardClick(product)}
    >
      {/* Reduced image height from h-48 to h-36 */}
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={`${UPLOADS_BASE_URL}/${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold backdrop-blur-sm">
            Sold Out
          </div>
        )}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-1.5 rounded-full bg-background/90 backdrop-blur-sm"> {/* Reduced padding */}
            <ArrowRight className="w-3 h-3 text-primary" /> {/* Reduced icon size */}
          </div>
        </div>
      </div>
      {/* Reduced padding in CardHeader from p-6 to p-4 */}
      <CardHeader className="p-4 space-y-2"> {/* Reduced vertical space */}
        <div className="space-y-1"> {/* Reduced vertical space */}
          {/* Reduced title font size from text-lg to text-base */}
          <CardTitle className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between">
            {/* Reduced price font size from text-2xl to text-xl */}
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ${product.selling_price.toFixed(2)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {/* Reduced icon size */}
              <span className="text-xs text-muted-foreground">4.8</span> {/* Reduced text size */}
            </div>
          </div>
        </div>
        <div className="pt-1">{getStockBadge(product.stock)}</div> {/* Added a div for better stock badge placement */}
      </CardHeader>
      {/* CardContent is hidden to maintain a compact vertical size */}
      <CardContent className="px-4 pb-4 pt-0 hidden"> 
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleCardClick = (product) => {
    navigate(`/products`, { state: { selectedProduct: product } });
  };

  const categorizedProducts = useMemo(() => {
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const categories = [...new Set(filteredProducts.map(p => p.category).filter(Boolean))];
    const categoryMap = {};

    categories.forEach(category => {
      categoryMap[category] = filteredProducts
        .filter(product => product.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));
    });

    const sortedCategories = categories.sort((a, b) => {
      const latestProductA = categoryMap[a].reduce((latest, current) => {
        return (new Date(current.created_at) > new Date(latest.created_at)) ? current : latest;
      }, categoryMap[a][0]);

      const latestProductB = categoryMap[b].reduce((latest, current) => {
        return (new Date(current.created_at) > new Date(latest.created_at)) ? current : latest;
      }, categoryMap[b][0]);

      return new Date(latestProductB.created_at) - new Date(latestProductA.created_at);
    });

    const finalCategorizedProducts = {};
    sortedCategories.forEach(category => {
      if (categoryMap[category].length > 0) {
        finalCategorizedProducts[category] = categoryMap[category];
      }
    });

    return finalCategorizedProducts;
  }, [products, searchTerm]);

  // FIX: This useMemo has been moved here, before the conditional return.
  const allCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Retained `container mx-auto px-6` for loading state padding */}
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-glow animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Loading Dashboard</h3>
                <p className="text-muted-foreground">Fetching your personalized content...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* *** MAJOR CORRECTION: Removed 'container mx-auto px-6' from the main content wrapper. ***
        We now use 'px-6 md:px-0' to remove side padding on mobile (default) and re-introduce it 
        on desktop/larger screens (md:px-0 is effectively removed when container is used).
        The 'container mx-auto' logic is applied using responsive utility classes.
      */}
      <div className="px-0 md:container md:mx-auto md:px-6 py-8 space-y-10">
        
        {/* Hero and Search Section - Re-adding padding just for the content inside */}
        <div className="px-4 md:px-0"> {/* Add horizontal padding back only for internal elements */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
            {/* Hero Content - Adjusted */}
            <div className="text-center md:text-left space-y-4 max-w-2xl md:max-w-xl mx-auto md:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Welcome to your dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                Discover Premium Technology
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore our curated collection of cutting-edge computing devices and accessories, designed for professionals who demand excellence.
              </p>
            </div>

            {/* Search Section */}
            <div className="w-full md:w-auto max-w-lg md:max-w-md">
              <Card className="bg-gradient-to-r from-card via-card/80 to-muted/10 border-border/50 shadow-elegant backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search for laptops, accessories, components..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 text-lg border-border/50 bg-background/50 focus:bg-background transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Categories Section - Added */}
        <div className="py-4 px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Categories</h2>
          <div className="flex flex-wrap gap-4">
            {allCategories.map((category) => (
              <Link 
                key={category} 
                to={`/products?category=${encodeURIComponent(category)}`}
              >
                <Button variant="outline" className="capitalize border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Section */}
        {Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-24 px-4 md:px-0">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or browse all categories</p>
              </div>
              <Button 
                onClick={() => setSearchTerm("")}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
              >
                View All Products
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(categorizedProducts).map((category, index) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between px-4 md:px-0">
                  <div className="space-y-1"> 
                    <h2 className="text-2xl font-bold capitalize bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {category}
                    </h2>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/products')}
                    className="group border-primary/20 hover:bg-primary hover:text-primary-foreground"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                {/* *** CORRECTION FOR ROW LIMIT: 
                  For mobile: We use `overflow-x-auto` with `gap-4` and `pl-4` to create an edge-to-edge scroll.
                  For desktop (`md`): We use `md:flex-nowrap md:overflow-hidden` to show exactly one row of items, 
                  cutting off any items that exceed the screen width. We also add `md:px-0` to the item container itself.
                */}
                <div className="flex overflow-x-auto gap-4 pb-4 pl-4 md:pl-0 md:flex-nowrap md:overflow-hidden"> 
                  {categorizedProducts[category].map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      handleCardClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}