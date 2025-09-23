import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  UPLOADS_BASE_URL,
} from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

const StockBadge = ({ stock }) => {
  if (stock > 20) {
    return (
      <Badge className="bg-success/10 text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        In Stock ({stock})
      </Badge>
    );
  } else if (stock > 5) {
    return (
      <Badge className="bg-warning/10 text-warning border-warning/20">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Low Stock ({stock})
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
        <XCircle className="w-3 h-3 mr-1" />
        Critical ({stock})
      </Badge>
    );
  }
};

const ProductCard = ({ product, onEdit, onDelete, processing, deletingProductId }) => {
  const profitMargin = product.selling_price > product.price 
    ? ((product.selling_price - product.price) / product.selling_price * 100)
    : 0;

  return (
    <Card className="card-premium hover-lift animate-fade-in group">
      <div className="relative overflow-hidden">
        {product.image_url ? (
          <img
            src={`${UPLOADS_BASE_URL}/${product.image_url}`}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground">
            <Package className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
          <Badge variant="outline" className="text-xs mb-3">
            {product.category || 'Uncategorized'}
          </Badge>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing Information */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost Price</span>
            <span className="font-semibold text-foreground">${product.price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Selling Price</span>
            <span className="font-bold text-lg text-success">${product.selling_price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Profit Margin</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="font-semibold text-success">{profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="flex-1 hover:bg-primary/5 hover:border-primary"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          {deletingProductId === product.id ? (
            <div className="flex gap-2 flex-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(product.id, true)}
                disabled={processing === product.id}
                className="flex-1"
              >
                {processing === product.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Confirm
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(product.id, false)}
                className="px-3"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(product.id, false)}
              className="px-3 hover:bg-destructive/5 hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Load products from backend
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error(error.detail || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const handleEdit = (product) => {
    toast.info(`Edit functionality for ${product.name} - Coming Soon!`);
  };

  const handleDelete = async (id, confirm) => {
    if (!confirm) {
      setDeletingProductId(deletingProductId === id ? null : id);
      return;
    }

    try {
      setProcessing(id);
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error.detail || "Failed to delete product");
    } finally {
      setProcessing(null);
      setDeletingProductId(null);
    }
  };

  const handleAddProduct = () => {
    toast.info("Add Product feature - Coming Soon!");
  };

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Inventory Statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock <= 5).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin w-16 h-16 text-primary" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary/20"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Loading Inventory</h3>
          <p className="text-muted-foreground">Fetching your product catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Inventory Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor stock levels, manage products, and track inventory value
          </p>
        </div>
        <Button onClick={handleAddProduct} className="btn-primary">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elevated bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active in catalog</p>
          </CardContent>
        </Card>

        <Card className="card-elevated bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${totalValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Total stock worth</p>
          </CardContent>
        </Card>

        <Card className="card-elevated bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="card-elevated bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-premium">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-premium"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-premium min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="card-premium">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || categoryFilter !== "all" ? "No products match your filters" : "No products found"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm || categoryFilter !== "all" 
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start building your inventory by adding your first product."
              }
            </p>
            {(!searchTerm && categoryFilter === "all") && (
              <Button onClick={handleAddProduct} className="btn-primary mt-4">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
              <ProductCard
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                processing={processing}
                deletingProductId={deletingProductId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}