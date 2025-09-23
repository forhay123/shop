import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Lock, ArrowLeft, CheckCircle, Package } from "lucide-react";
import {
  fetchUserProfile,
  fetchMyOrders,
  checkoutSelectedItems,
  UPLOADS_BASE_URL,
} from "@/utils/api";

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItemIds, cartId } = location.state || {
    selectedItemIds: [],
    cartId: null,
  };

  useEffect(() => {
    if (!selectedItemIds || selectedItemIds.length === 0) {
      toast.error("No items selected for checkout.");
      navigate("/cart");
      return;
    }

    async function loadData() {
      try {
        const currentUser = await fetchUserProfile();
        setUser(currentUser);
        
        // Pre-fill shipping address if user has profile data
        setShippingAddress(prev => ({
          ...prev,
          fullName: currentUser.name || "",
          // Add other fields if available in user profile
        }));

        const myOrders = await fetchMyOrders();
        const pending = myOrders.find((o) => o.id === cartId);
        if (pending) {
          setPendingOrder({
            ...pending,
            items: pending.items.filter((item) =>
              selectedItemIds.includes(item.id)
            ),
          });
        }
      } catch (error) {
        console.warn("Not logged in or failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedItemIds, cartId, navigate]);

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'address', 'city', 'state', 'zipCode', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleConfirmPay = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    try {
      await checkoutSelectedItems(selectedItemIds, cartId);
      toast.success("Payment successful! Your order is confirmed.");
      navigate("/orders");
    } catch (err) {
      toast.error(err?.detail || "Payment failed, please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to proceed with your order.
        </p>
        <Button onClick={() => navigate("/login")} className="btn-professional">
          Go to Login
        </Button>
      </div>
    );
  }

  if (!pendingOrder || pendingOrder.items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Items Selected</h1>
        <p className="text-muted-foreground mb-6">No items selected for checkout.</p>
        <Button onClick={() => navigate("/cart")} className="btn-professional">
          Return to Cart
        </Button>
      </div>
    );
  }

  const subtotal = pendingOrder.items.reduce(
    (sum, item) => sum + item.product.selling_price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const totalAmount = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/cart")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase, {user.name}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipping Information
              </CardTitle>
              <CardDescription>
                Enter your delivery address details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="input-professional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="input-professional"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your street address"
                  className="input-professional"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    className="input-professional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    className="input-professional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="ZIP Code"
                    className="input-professional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
              <CardDescription>
                Any special delivery instructions (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Enter any special delivery instructions..."
                className="input-professional"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Secure payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">Credit/Debit Card</span>
                    <Badge variant="secondary" className="ml-auto">Secure</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your payment information is encrypted and secure
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="card-professional sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {pendingOrder.items.length} item{pendingOrder.items.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items List */}
              <div className="space-y-3">
                {pendingOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={`${UPLOADS_BASE_URL}/${item.product.image_url}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ${(item.product.selling_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free shipping applied!</span>
                </div>
              )}

              <Button
                onClick={handleConfirmPay}
                disabled={processing}
                className="w-full btn-professional gradient-primary text-white"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Payment ${totalAmount.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>By completing this order, you agree to our Terms of Service</p>
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}