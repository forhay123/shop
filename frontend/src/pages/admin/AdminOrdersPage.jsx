import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
  shipOrder,
} from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash, CheckCircle, Truck, Package } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [trackingId, setTrackingId] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setProcessing(id);
    try {
      await updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleShipOrder = async () => {
    setProcessing(currentOrderId);
    try {
      await shipOrder(currentOrderId, { tracking_id: trackingId });
      setShowShipModal(false);
      setTrackingId("");
      loadOrders();
    } catch (error) {
      console.error("Failed to ship order:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async () => {
    if (!currentOrderId) return;
    setProcessing(currentOrderId);
    try {
      await deleteOrder(currentOrderId);
      setOrders((prev) => prev.filter((order) => order.id !== currentOrderId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setProcessing(null);
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Manage Orders
        </h1>
        <p className="text-muted-foreground text-lg">
          Process and track customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">Orders will appear here once customers make purchases</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order, index) => (
            <Card key={order.id} className="card-premium hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <Badge
                    className={`${
                      order.status === "pending"
                        ? "badge-warning"
                        : order.status === "shipped"
                        ? "bg-primary/10 text-primary"
                        : order.status === "delivered"
                        ? "bg-accent/10 text-accent"
                        : order.status === "paid"
                        ? "badge-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{order.user?.name || `User ID: ${order.user_id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{order.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-primary">${order.total_amount.toFixed(2)}</span>
                  </div>
                  {order.tracking_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{order.tracking_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, "paid")}
                      disabled={processing === order.id}
                      className="btn-primary"
                    >
                      {processing === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Mark as Paid
                    </Button>
                  )}

                  {order.status === "paid" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setCurrentOrderId(order.id);
                        setShowShipModal(true);
                      }}
                      disabled={processing === order.id}
                      className="btn-accent"
                    >
                      {processing === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Truck className="w-4 h-4 mr-2" />
                      )}
                      Ship Order
                    </Button>
                  )}

                  {order.status === "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, "delivered")}
                      disabled={processing === order.id}
                      className="btn-primary"
                    >
                      {processing === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Mark as Delivered
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setCurrentOrderId(order.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Shipping Dialog */}
      <Dialog open={showShipModal} onOpenChange={setShowShipModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ship Order #{currentOrderId}</DialogTitle>
            <DialogDescription>
              Enter the tracking ID to mark this order as shipped.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingId" className="text-right">
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g., 1Z9999999999999999"
                className="col-span-3 input-premium"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowShipModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleShipOrder} disabled={!trackingId} className="btn-primary">
              {processing === currentOrderId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm Ship
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing === currentOrderId}>
              {processing === currentOrderId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}