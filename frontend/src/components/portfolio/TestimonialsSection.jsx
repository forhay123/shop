// Corrected TestimonialsSection.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "CEO",
      company: "TechStartup Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Coded AB Tech delivered an exceptional e-commerce platform that exceeded our expectations. The performance improvements and user experience were remarkable. Revenue increased by 40% within the first month of launch.",
      project: "E-Commerce Platform",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "CTO",
      company: "DataCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Working with Coded AB Tech was a game-changer for our analytics dashboard project. His technical expertise and attention to detail resulted in a solution that processes millions of data points seamlessly.",
      project: "Analytics Dashboard",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Product Manager",
      company: "FinTech Pro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The mobile banking app Coded AB Tech developed has been praised by our users for its intuitive design and robust security features. Our customer satisfaction scores have never been higher.",
      project: "Mobile Banking App",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Founder",
      company: "AI Innovations",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Coded AB Tech's AI content generator transformed our content creation process. What used to take hours now takes minutes, with 94% accuracy. Absolutely brilliant work and technical implementation.",
      project: "AI Content Generator",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    },
    {
      id: 5,
      name: "Lisa Zhang",
      role: "VP Engineering",
      company: "CloudScale Systems",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The chat application Coded AB Tech built handles our real-time communication needs perfectly. Scalable, reliable, and feature-rich. The WebRTC integration was flawlessly executed.",
      project: "Real-time Chat App",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    },
    {
      id: 6,
      name: "Robert Thompson",
      role: "Director of Operations",
      company: "Enterprise Solutions",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Coded AB Tech's task management API has streamlined our entire workflow. The documentation is excellent, performance is outstanding, and the real-time features work seamlessly at scale.",
      project: "Task Management API",
      companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=50&fit=crop"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
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
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trusted by industry leaders and innovative companies worldwide
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="card-hover">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <Quote className="w-12 h-12 text-primary/30" />
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-muted-foreground">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                  
                  <div className="flex justify-center mb-6">
                    <div className="flex space-x-1">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage 
                          src={testimonials[currentIndex].avatar} 
                          alt={testimonials[currentIndex].name} 
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="text-left">
                        <div className="font-semibold text-lg">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </div>
                        <div className="text-primary font-medium">
                          {testimonials[currentIndex].company}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="px-4 py-2">
                      {testimonials[currentIndex].project}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                className={`card-hover cursor-pointer transition-all duration-300 ${
                  index === currentIndex ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.project}
                    </Badge>
                  </div>
                  
                  <blockquote className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">Trusted by companies of all sizes</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Company logos would go here */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-12 bg-muted/50 rounded flex items-center justify-center"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  Company {i + 1}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};