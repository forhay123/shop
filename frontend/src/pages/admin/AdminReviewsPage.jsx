import React, { useEffect, useState } from "react";
import { fetchAllReviews } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  ThumbsUp,
  Calendar,
  Search,
  Filter,
  Award,
  AlertCircle
} from "lucide-react";

const RatingBadge = ({ rating }) => {
  const getColor = (rating) => {
    if (rating >= 4.5) return "bg-success/10 text-success border-success/20";
    if (rating >= 4) return "bg-primary/10 text-primary border-primary/20";
    if (rating >= 3) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Badge className={getColor(rating)}>
      <Star className="w-3 h-3 mr-1 fill-current" />
      {rating.toFixed(1)}
    </Badge>
  );
};

const ReviewCard = ({ review, index }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card 
      className="card-premium hover-lift animate-fade-in group" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {getInitials(review.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-foreground">
                  {review.user?.name || "Anonymous Customer"}
                </h4>
                <RatingBadge rating={review.rating} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(review.created_at)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {review.product?.name || "Unknown Product"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-colors ${
                  i < review.rating 
                    ? "text-yellow-400 fill-current" 
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-foreground">
              {review.rating}/5
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <blockquote className="text-foreground leading-relaxed italic border-l-4 border-primary/20 pl-4 bg-muted/20 p-4 rounded-r-lg">
            "{review.comment}"
          </blockquote>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                Verified Purchase
              </span>
            </div>
            <span className="text-xs">
              Review #{review.id}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, trend }) => (
  <Card className={`card-elevated hover-lift ${colorClass}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 rounded-lg bg-background/50">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="text-3xl font-bold text-foreground">
        {value}
      </div>
      <p className="text-xs text-muted-foreground">
        {subtitle}
      </p>
      {trend && (
        <div className={`flex items-center text-xs ${trend > 0 ? 'text-success' : 'text-muted-foreground'}`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend > 0 ? '+' : ''}{trend}% this month
        </div>
      )}
    </CardContent>
  </Card>
);

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchAllReviews();
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  // Filter reviews based on search and rating
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => Math.floor(review.rating) === rating);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin w-16 h-16 text-primary" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary/20"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Loading Reviews</h3>
          <p className="text-muted-foreground">Fetching customer feedback...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const positiveReviews = reviews.filter(review => review.rating >= 4).length;
  const recentReviews = reviews.filter(review => {
    const reviewDate = new Date(review.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="container mx-auto px-6 py-12 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text">
          Customer Reviews Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Monitor customer feedback, track satisfaction scores, and gain insights into product performance
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={totalReviews.toLocaleString()}
          subtitle="All customer feedback"
          icon={MessageSquare}
          colorClass="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          trend={12.5}
        />
        
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          subtitle="Out of 5.0 stars"
          icon={Star}
          colorClass="bg-gradient-to-br from-success/5 to-success/10 border-success/20"
          trend={3.2}
        />
        
        <StatCard
          title="Positive Reviews"
          value={`${((positiveReviews / totalReviews) * 100 || 0).toFixed(0)}%`}
          subtitle={`${positiveReviews} of ${totalReviews} reviews`}
          icon={Award}
          colorClass="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20"
          trend={7.1}
        />
        
        <StatCard
          title="This Month"
          value={recentReviews}
          subtitle="New reviews received"
          icon={TrendingUp}
          colorClass="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20"
          trend={18.3}
        />
      </div>

      {/* Filters */}
      <Card className="card-premium">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews by customer, product, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-premium"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="input-premium min-w-[140px]"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <Card className="card-premium">
          <CardContent className="flex flex-col items-center justify-center py-16">
            {totalReviews === 0 ? (
              <>
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">No Reviews Yet</h3>
                <p className="text-muted-foreground text-center max-w-md text-lg">
                  Customer reviews will appear here once customers start sharing their feedback about your products
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">No Reviews Match Your Filters</h3>
                <p className="text-muted-foreground text-center max-w-md text-lg">
                  Try adjusting your search terms or rating filter to find the reviews you're looking for
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}