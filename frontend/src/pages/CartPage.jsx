import React, { useEffect, useState } from "react";
import { fetchMyOrders, updateCartItemQuantity, deleteCartItem } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import { UPLOADS_BASE_URL } from "@/utils/api";

export default function CartPage() {
    const [cartOrder, setCartOrder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const loadCart = async () => {
        setLoading(true);
        try {
            const allOrders = await fetchMyOrders();
            const pendingOrder = allOrders.find((o) => o.status === "pending");
            setCartOrder(pendingOrder);
            setSelectedItems([]);
        } catch (err) {
            console.error("Failed to load cart", err);
            toast.error("Failed to load your cart.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartOrder.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartOrder.items.map(item => item.id));
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setIsUpdating(true);
        try {
            await updateCartItemQuantity(itemId, newQuantity);
            setCartOrder((prevOrder) => {
                const updatedItems = prevOrder.items.map((item) =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );
                return { ...prevOrder, items: updatedItems };
            });
            toast.success("Quantity updated successfully!");
        } catch (err) {
            toast.error(err?.detail || "Failed to update quantity.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setIsUpdating(true);
        try {
            await deleteCartItem(itemId);
            setCartOrder((prevOrder) => ({
                ...prevOrder,
                items: prevOrder.items.filter((item) => item.id !== itemId),
            }));
            setSelectedItems((prev) => prev.filter((id) => id !== itemId));
            toast.success("Item removed from cart!");
        } catch (err) {
            toast.error(err?.detail || "Failed to remove item.");
        } finally {
            setIsUpdating(false);
        }
    };

    const calculateSubtotal = () => {
        if (!cartOrder) return 0;
        return cartOrder.items.reduce((sum, item) => {
            return sum + item.product.selling_price * item.quantity;
        }, 0);
    };

    const calculateSelectedTotal = () => {
        if (!cartOrder) return 0;
        return cartOrder.items.reduce((sum, item) => {
            if (selectedItems.includes(item.id)) {
                return sum + item.product.selling_price * item.quantity;
            }
            return sum;
        }, 0);
    };

    const calculateSavings = () => {
        // Calculate potential savings (mock discount)
        const selectedTotal = calculateSelectedTotal();
        return selectedTotal * 0.05; // 5% mock savings
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to checkout.");
            return;
        }
        navigate("/checkout", { 
            state: { 
                selectedItemIds: selectedItems, 
                cartId: cartOrder.id 
            } 
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cartOrder || cartOrder.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center max-w-md mx-auto">
                    <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-6">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Button onClick={() => navigate("/products")} className="btn-professional">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const selectedTotal = calculateSelectedTotal();
    const savings = calculateSavings();
    const finalTotal = selectedTotal - savings;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/products")}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                </Button>
                <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
                <p className="text-muted-foreground">
                    {cartOrder.items.length} item{cartOrder.items.length !== 1 ? 's' : ''} in your cart
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Select All */}
                    <div className="card-professional p-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={selectedItems.length === cartOrder.items.length && cartOrder.items.length > 0}
                                onCheckedChange={handleSelectAll}
                                className="w-5 h-5"
                            />
                            <span className="font-medium">
                                Select All ({cartOrder.items.length} items)
                            </span>
                            {selectedItems.length > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                    {selectedItems.length} selected
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Cart Items List */}
                    {cartOrder.items.map((item) => (
                        <Card key={item.id} className="card-professional overflow-hidden">
                            <div className="flex p-4">
                                <Checkbox
                                    checked={selectedItems.includes(item.id)}
                                    onCheckedChange={() => handleCheckboxChange(item.id)}
                                    className="mt-2 mr-4 w-5 h-5"
                                />
                                
                                <div className="flex-shrink-0 w-24 h-24 mr-4">
                                    <img
                                        src={`${UPLOADS_BASE_URL}/${item.product.image_url}`}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg leading-tight">
                                                {item.product.name}
                                            </h3>
                                            {item.product.category && (
                                                <Badge variant="outline" className="mt-1">
                                                    {item.product.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={isUpdating}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={isUpdating || item.quantity <= 1}
                                                className="h-8 w-8"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-12 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                disabled={isUpdating}
                                                className="h-8 w-8"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary">
                                                ${(item.product.selling_price * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                ${item.product.selling_price.toFixed(2)} each
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="card-professional sticky top-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartOrder.items.length} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                
                                {selectedItems.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span>Selected Items ({selectedItems.length})</span>
                                            <span>${selectedTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Savings (5%)</span>
                                            <span>-${savings.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <Button
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                                className="w-full btn-professional gradient-primary text-white"
                                size="lg"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Proceed to Checkout ({selectedItems.length})
                            </Button>
                            
                            {selectedItems.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    Select items to proceed with checkout
                                </p>
                            )}
                            
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>🚚</span>
                                    <span>Free shipping on orders over $100</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span>🔒</span>
                                    <span>Secure checkout guaranteed</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}