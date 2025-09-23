import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  UPLOADS_BASE_URL
} from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

// New component for individual product cards
const ProductCard = ({ product, openModal, handleDelete }) => (
  <Card className="flex-none w-56 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <CardHeader className="p-0">
      <div className="w-full h-36 rounded-t-lg overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={`${UPLOADS_BASE_URL}/${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-3 space-y-1">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
      </div>
      <div className="flex items-center gap-1">
        {product.category && (
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          Stock: {product.stock || 0}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cost:</span>
          <span className="font-medium">${product.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Selling:</span>
          <span className="font-bold text-primary">${product.selling_price}</span>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => openModal(product)}
          className="flex-1 text-xs px-2 h-8"
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(product.id)}
          className="h-8 w-8 px-0"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    profit_margin_percentage: 0,
    stock: 0,
    category: "",
    image_file: null,
  });

  const [calculatedSellingPrice, setCalculatedSellingPrice] = useState(0);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      toast.error(err.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const cost = parseFloat(formData.price) || 0;
    const margin = parseFloat(formData.profit_margin_percentage) || 0;
    const sellingPrice = cost * (1 + margin / 100);
    setCalculatedSellingPrice(sellingPrice);
  }, [formData.price, formData.profit_margin_percentage]);

  const categorizedProducts = useMemo(() => {
    const categories = {};
    const productList = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    productList.forEach(product => {
      if (product.category) {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      }
    });

    // Get a list of categories and sort them by the 'created_at' of the newest product
    const sortedCategoryNames = Object.keys(categories).sort((a, b) => {
      const latestProductA = categories[a].reduce((latest, current) =>
        (new Date(current.created_at) > new Date(latest.created_at) ? current : latest)
      );
      const latestProductB = categories[b].reduce((latest, current) =>
        (new Date(current.created_at) > new Date(latest.created_at) ? current : latest)
      );
      
      return new Date(latestProductB.created_at) - new Date(latestProductA.created_at);
    });

    // Create the final ordered and filtered object
    const finalCategorizedProducts = {};
    sortedCategoryNames.forEach(category => {
      finalCategorizedProducts[category] = categories[category];
    });

    return finalCategorizedProducts;
  }, [products, searchTerm]);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        profit_margin_percentage: product.profit_margin_percentage || 0,
        stock: product.stock || 0,
        category: product.category || "",
        image_file: null,
      });
      const sellingPrice = (product.price || 0) * (1 + (product.profit_margin_percentage || 0) / 100);
      setCalculatedSellingPrice(sellingPrice);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        profit_margin_percentage: 0,
        stock: 0,
        category: "",
        image_file: null,
      });
      setCalculatedSellingPrice(0);
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_file") {
      setFormData((prev) => ({ ...prev, image_file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("selling_price", calculatedSellingPrice);
      data.append("profit_margin_percentage", formData.profit_margin_percentage);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      if (formData.image_file) data.append("image", formData.image_file);

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(data);
        toast.success("Product added successfully!");
      }

      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.detail || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      toast.error(err.detail || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Manage Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Add, edit, and organize your product catalog
          </p>
        </div>
        <Button onClick={() => openModal()} className="btn-primary mt-4 lg:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search Filter */}
      <Card className="card-premium mb-8">
        <CardContent className="p-6">
          <div className="relative flex-1 max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-premium"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Display by Category */}
      {Object.keys(categorizedProducts).length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or add a new product</p>
          <Button onClick={() => openModal()} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(categorizedProducts).map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
              <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                {categorizedProducts[category].map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    openModal={openModal}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-premium"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-premium"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Cost Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <Label htmlFor="profit_margin_percentage">Profit Margin (%)</Label>
                <Input
                  id="profit_margin_percentage"
                  name="profit_margin_percentage"
                  type="number"
                  value={formData.profit_margin_percentage}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="selling_price">Selling Price (Calculated)</Label>
              <Input
                id="selling_price"
                type="number"
                value={calculatedSellingPrice.toFixed(2)}
                readOnly
                className="input-premium bg-muted"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-premium"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image_file">Product Image</Label>
              <Input
                id="image_file"
                name="image_file"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="input-premium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-primary">
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}