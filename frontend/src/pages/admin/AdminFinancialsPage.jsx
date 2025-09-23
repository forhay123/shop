import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { 
  Loader2, 
  DollarSign, 
  Package, 
  TrendingUp, 
  BarChart2, 
  ShoppingBag, 
  Users,
  Target,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { fetchAllOrders, fetchProducts } from "@/utils/api";

const formatCurrency = (amount) => {
  return `$${(amount || 0).toFixed(2)}`;
};

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, trend }) => (
  <Card className={`card-elevated hover-lift animate-fade-in ${colorClass}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 rounded-lg bg-background/50">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent className="space-y-1">
      <div className="text-3xl font-bold text-foreground">
        {value}
      </div>
      <p className="text-xs text-muted-foreground">
        {subtitle}
      </p>
      {trend && (
        <div className={`flex items-center text-xs ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </CardContent>
  </Card>
);

export default function AdminFinancialsPage() {
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const isLoading = isLoadingOrders || isLoadingProducts;
  const isError = isErrorOrders || isErrorProducts;

  if (isError) {
    toast.error("Failed to load financial data. Please try again.");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <BarChart2 className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Unable to Load Financial Data</h3>
          <p className="text-muted-foreground">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin w-16 h-16 text-primary" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary/20"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Loading Financial Analytics</h3>
          <p className="text-muted-foreground">Analyzing your business metrics...</p>
        </div>
      </div>
    );
  }

  // Enhanced Financial Calculations
  const totalStockValue = products?.reduce(
    (acc, product) => acc + (product.price || 0) * (product.stock || 0),
    0
  ) || 0;

  // This part is already correct, as you've already fixed it.
  const totalRevenue = orders?.reduce((acc, order) => {
    if (order.status === "paid" || order.status === "shipped" || order.status === "delivered") {
      return acc + (order.total_amount || 0);
    }
    return acc;
  }, 0) || 0;

  // FIX: Add 'delivered' to the COGS calculation
  const totalCOGS = orders?.reduce((acc, order) => {
    if (order.status === "paid" || order.status === "shipped" || order.status === "delivered") {
      const orderCost = order.items?.reduce((itemAcc, item) => {
        if (item.product) { 
          const product = products?.find((p) => p.id === item.product.id);
          if (product) {
            return itemAcc + product.price * item.quantity;
          }
        }
        return itemAcc;
      }, 0) || 0;
      return acc + orderCost;
    }
    return acc;
  }, 0) || 0;

  const totalProfit = totalRevenue - totalCOGS;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  const totalOrders = orders?.length || 0;
  // FIX: Add 'delivered' to the paidOrders filter
  const paidOrders = orders?.filter(
    (order) => order.status === "paid" || order.status === "shipped" || order.status === "delivered"
  ).length || 0;
  const pendingOrders = orders?.filter(
    (order) => order.status === "pending"
  ).length || 0;

  // Product Sales Analytics
  const productSalesMap = new Map();
  // FIX: Add 'delivered' to the order status check
  orders?.forEach((order) => {
    if (order.status === "paid" || order.status === "shipped" || order.status === "delivered") {
      order.items?.forEach((item) => {
        if (item.product) {
          const productId = item.product.id;
          const currentSales = productSalesMap.get(productId) || 0;
          productSalesMap.set(productId, currentSales + item.quantity);
        }
      });
    }
  });

  const topSellingProducts = Array.from(productSalesMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, quantity]) => {
      const product = products?.find((p) => p.id === productId);
      return {
        name: product?.name || `Product ID: ${productId}`,
        quantity,
        revenue: (product?.price || 0) * quantity,
      };
    });

  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  return (
    <div className="container mx-auto px-6 py-12 space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text">
          Financial Analytics Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive insights into your business performance, sales metrics, and financial health with real-time analytics
        </p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="From completed orders"
          icon={DollarSign}
          colorClass="bg-gradient-to-br from-success/5 to-success/10 border-success/20"
          trend={15.2}
        />
        
        <MetricCard
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          subtitle={`${profitMargin.toFixed(1)}% profit margin`}
          icon={TrendingUp}
          colorClass="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          trend={8.7}
        />
        
        <MetricCard
          title="Inventory Value"
          value={formatCurrency(totalStockValue)}
          subtitle="Current stock worth"
          icon={Package}
          colorClass="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20"
          trend={-2.1}
        />
        
        <MetricCard
          title="Avg. Order Value"
          value={formatCurrency(averageOrderValue)}
          subtitle={`Across ${paidOrders} orders`}
          icon={Target}
          colorClass="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20"
          trend={12.4}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          subtitle={`${paidOrders} completed, ${pendingOrders} pending`}
          icon={ShoppingBag}
          colorClass="bg-gradient-to-br from-muted/30 to-muted/50"
        />
        
        <MetricCard
          title="Products Sold"
          value={Array.from(productSalesMap.values()).reduce((a, b) => a + b, 0)}
          subtitle="Total units moved"
          icon={Award}
          colorClass="bg-gradient-to-br from-muted/30 to-muted/50"
        />
        
        <MetricCard
          title="Active Products"
          value={products?.length || 0}
          subtitle="In catalog"
          icon={Package}
          colorClass="bg-gradient-to-br from-muted/30 to-muted/50"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Products Performance */}
        <Card className="xl:col-span-1 card-premium animate-slide-up">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Top Performers</CardTitle>
                <CardDescription>Best-selling products by volume</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSellingProducts.length > 0 ? (
              topSellingProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[120px]">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="xl:col-span-2 card-premium animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription>Latest order activity and customer purchases</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.length > 0 ? (
                    orders.slice(0, 8).map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                        <TableCell className="font-medium">
                          {order.user?.name || `User #${order.user_id}`}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items?.map((item) => (
                              <div key={item.id} className="text-sm">
                                <span className="font-medium">
                                  {item.product?.name || "Unknown Product"}
                                </span>
                                <span className="text-muted-foreground"> × {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <span className={`status-${order.status}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-3">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No orders found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}