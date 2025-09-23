import React, { useEffect, useState, useMemo } from "react";
import { fetchUsers } from "@/utils/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Users, UserCheck, UserX, Mail, Shield, Phone } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Search filter
      const searchMatch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const roleMatch = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      
      // Verification filter
      const verificationMatch = verificationFilter === "all" || 
        (verificationFilter === "verified" && user.is_verified) ||
        (verificationFilter === "unverified" && !user.is_verified);
      
      return searchMatch && roleMatch && verificationMatch;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "email":
          return a.email.localeCompare(b.email);
        case "role":
          return a.role.localeCompare(b.role);
        case "id":
          return a.id - b.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, verificationFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setVerificationFilter("all");
    setSortBy("name");
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role.toLowerCase() === "admin").length;
    const verifiedUsers = users.filter(u => u.is_verified).length;
    
    return { totalUsers, adminUsers, verifiedUsers };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor user accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.adminUsers}</p>
                <p className="text-muted-foreground">Admin Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.verifiedUsers}</p>
                <p className="text-muted-foreground">Verified Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Card className="card-professional p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Filter Users</h2>
            <Button variant="outline" size="sm" onClick={resetFilters} className="ml-auto">
              Reset Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Verification Filter */}
            <div className="space-y-2">
              <Label>Verification Status</Label>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
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
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="email">Email (A-Z)</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="id">User ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({filteredUsers.length})</span>
            {filteredUsers.length !== users.length && (
              <Badge variant="secondary">
                {filteredUsers.length} of {users.length} users
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No users found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge
                          variant={
                            user.role.toLowerCase() === "admin"
                              ? "destructive"
                              : "secondary"
                          }
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.role.toLowerCase() === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge
                          variant={user.is_verified ? "default" : "outline"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.is_verified ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Unverified
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm font-mono">#{user.id}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}