import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Progress from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Code, 
  GitCommit,
  Award,
  Zap,
  CheckCircle
} from "lucide-react";

export const MetricsSection = () => {
  const metrics = [
    {
      title: "Project Delivery",
      value: "95%",
      subtitle: "On-time completion rate",
      icon: Clock,
      color: "text-green-500",
      trend: "+5% from last year"
    },
    {
      title: "Client Satisfaction",
      value: "4.9/5",
      subtitle: "Average rating from clients",
      icon: Star,
      color: "text-yellow-500",
      trend: "Based on 47 reviews"
    },
    {
      title: "Code Quality",
      value: "98%",
      subtitle: "Test coverage average",
      icon: Code,
      color: "text-blue-500",
      trend: "Maintained consistently"
    },
    {
      title: "Project Success",
      value: "89%",
      subtitle: "Projects exceeding goals",
      icon: Target,
      color: "text-purple-500",
      trend: "+12% improvement"
    }
  ];


  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Performance Metrics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quantifiable results and efficiency metrics that demonstrate consistent 
            excellence in software development and client delivery
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="text-center card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-muted/50 ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold mb-2">{metric.value}</div>
                  <h3 className="font-semibold mb-2">{metric.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{metric.subtitle}</p>
                  
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};