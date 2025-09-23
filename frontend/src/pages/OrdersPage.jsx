import React, { useEffect, useState, useMemo } from "react";
import { fetchMyOrders } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createReview, UPLOADS_BASE_URL } from "@/utils/api";
import { Star, Package, Truck, CheckCircle, Clock, Search, Filter, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const getOrderStatusIcon = (status) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "shipped":
      return <Truck className="w-4 h-4 text-blue-500" />;
    case "delivered":
      return <Package className="w-4 h-4 text-purple-500" />;
    case "canceled":
      return <span className="w-4 h-4 text-red-500">✕</span>;
    case "pending":
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

const getOrderStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "success";
    case "shipped":
      return "default";
    case "delivered":
      return "secondary";
    case "canceled":
      return "destructive";
    case "pending":
    default:
      return "outline";
  }
};

const getOrderStatusText = (status) => {
  switch (status) {
    case "paid":
      return "Confirmed";
    case "shipped":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "canceled":
      return "Canceled";
    case "pending":
    default:
      return "Processing";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadOrders = async () => {
    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Search filter - search in order ID and product names
      const searchMatch = searchTerm === "" || 
        order.id.toString().includes(searchTerm) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Status filter
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      
      return searchMatch && statusMatch;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "amount-high":
          return b.total_amount - a.total_amount;
        case "amount-low":
          return a.total_amount - b.total_amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  const handleReviewClick = (item) => {
    setCurrentReviewItem(item);
    setRating(0);
    setComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!currentReviewItem || rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    
    try {
      await createReview({
        product_id: currentReviewItem.product_id,
        rating: rating,
        comment: comment,
      });
      setShowReviewModal(false);
      toast.success("Review submitted successfully!");
      loadOrders();
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review");
    }
  };

  const findUserReview = (reviews, userId) => {
    return reviews?.find(review => review.user_id === userId);
  };
  
  const currentUser = { id: 18 }; // Replace with actual user context

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">No orders yet</h1>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Button onClick={() => window.location.href = "/products"} className="btn-professional">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  const pendingOrders = filteredOrders.filter(order => order.status === "pending");
  const completedOrders = filteredOrders.filter(order => 
    ["paid", "shipped", "delivered", "canceled"].includes(order.status)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your order history
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Card className="card-professional p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Filter Orders</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by order ID or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Processing</SelectItem>
                  <SelectItem value="paid">Confirmed</SelectItem>
                  <SelectItem value="shipped">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No orders found</p>
          <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
          <Button onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setSortBy("newest");
          }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Orders */}
          {pendingOrders.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                Processing Orders
              </h2>
              <div className="grid gap-4">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="card-professional border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Order #{order.id}
                            <Badge variant={getOrderStatusColor(order.status)} className="flex items-center gap-1">
                              {getOrderStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </Badge>
                          </CardTitle>
                          <p className="text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${order.total_amount?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <img
                              src={`${UPLOADS_BASE_URL}/${item.product.image_url}`}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} • ${item.product.selling_price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${(item.product.selling_price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <>
              {pendingOrders.length > 0 && <Separator className="my-8" />}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Order History
                </h2>
                <div className="grid gap-4">
                  {completedOrders.map((order) => (
                    <Card key={order.id} className="card-professional">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              Order #{order.id}
                              <Badge variant={getOrderStatusColor(order.status)} className="flex items-center gap-1">
                                {getOrderStatusIcon(order.status)}
                                {getOrderStatusText(order.status)}
                              </Badge>
                            </CardTitle>
                            <p className="text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            {(order.status === "shipped" || order.status === "delivered") && order.tracking_id && (
                              <p className="text-sm mt-1">
                                <strong>Tracking ID:</strong> {order.tracking_id}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ${order.total_amount?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.items.map((item) => {
                            const userReview = findUserReview(item.product.reviews, currentUser.id);
                            return (
                              <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                <img
                                  src={`${UPLOADS_BASE_URL}/${item.product.image_url}`}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium">{item.product.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} • ${item.product.selling_price.toFixed(2)} each
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      ${(item.product.selling_price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                  {order.status === "delivered" && (
                                    <div>
                                      {userReview ? (
                                        <div className="text-center">
                                          <Badge variant="secondary" className="mb-1">
                                            Your Review ({userReview.rating}★)
                                          </Badge>
                                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                            "{userReview.comment}"
                                          </p>
                                        </div>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleReviewClick(item)}
                                          className="whitespace-nowrap"
                                        >
                                          Write Review
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {currentReviewItem?.product.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell others about your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-professional"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={rating === 0} className="btn-professional">
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}