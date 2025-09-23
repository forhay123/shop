import { useEffect, useState } from "react";
import { fetchUsers, fetchAllOrders, fetchProducts } from "@/utils/api";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          fetchUsers(),
          fetchAllOrders(),
          fetchProducts(),
        ]);
        setUsers(usersRes);
        setOrders(ordersRes);
        setProducts(productsRes);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

  return (
    <div className="container mx-auto px-6 py-24 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor your business performance and manage operations
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-premium p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Total Users</h2>
              <p className="text-3xl font-bold text-primary mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-xl">👥</span>
            </div>
          </div>
          <Link 
            to="/admin/users" 
            className="text-primary hover:text-primary-glow text-sm font-medium mt-4 inline-block"
          >
            View all →
          </Link>
        </div>

        <div className="card-premium p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Total Orders</h2>
              <p className="text-3xl font-bold text-primary mt-1">{orders.length}</p>
              <p className="text-xs text-muted-foreground">{pendingOrders} pending</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-accent text-xl">📦</span>
            </div>
          </div>
          <Link 
            to="/admin/orders" 
            className="text-primary hover:text-primary-glow text-sm font-medium mt-4 inline-block"
          >
            View all →
          </Link>
        </div>

        <div className="card-premium p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Products</h2>
              <p className="text-3xl font-bold text-primary mt-1">{products.length}</p>
              <p className="text-xs text-muted-foreground">{lowStockProducts} low stock</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-warning text-xl">🛍️</span>
            </div>
          </div>
          <Link 
            to="/admin/products" 
            className="text-primary hover:text-primary-glow text-sm font-medium mt-4 inline-block"
          >
            View all →
          </Link>
        </div>

        <div className="card-premium p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Revenue</h2>
              <p className="text-3xl font-bold text-success mt-1">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-success text-xl">💰</span>
            </div>
          </div>
          <Link 
            to="/admin/financials" 
            className="text-primary hover:text-primary-glow text-sm font-medium mt-4 inline-block"
          >
            View details →
          </Link>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="card-premium">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {order.user?.name ?? "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.user?.email ?? "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    ${order.total_amount !== undefined ? order.total_amount.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      order.status === 'paid' ? 'bg-success/10 text-success' :
                      order.status === 'shipped' ? 'bg-primary/10 text-primary' :
                      order.status === 'delivered' ? 'bg-accent/10 text-accent' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}