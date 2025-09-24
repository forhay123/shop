import { motion } from "framer-motion";
import { Github, ExternalLink, Star, Users, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PortfolioSection = () => {
  const projects = [
    {
      title: "Enterprise E-Commerce Platform",
      description: "Built a scalable multi-vendor marketplace handling 50k+ daily transactions with real-time inventory management, advanced analytics, and AI-powered recommendations.",
      image: "/img/port4.jpeg",
      technologies: ["React", "Node.js", "MongoDB", "Redis", "AWS", "Stripe"],
      githubLink: "https://github.com/johndoe/enterprise-ecommerce",
      liveLink: "https://shop-frontend-o6yu.onrender.com/dashboard",
      loginDetails: {
        Admin: { username: "awtsmith8@gmail.com", password: "myshop000" },
        Customer: { username: "andiawt14@gmail.com", password: "cabtech00000" }
      },
      functionalities: [
        "AI-Powered Recommendations",
        "Real-time Inventory Sync",
        "Multi-Vendor Marketplace",
        "Advanced Analytics Dashboard"
      ],
      featured: true
    },
    {
      title: "Church Academy Web App",
      description: "A dynamic web application for theological and church activities, featuring a robust content management system, event scheduling, and online course delivery for seamless learning and administration.",
      image: "/img/port2.jpeg",
      technologies: ["React", "Strapi", "PostgreSQL", "Next.js", "AWS"],
      githubLink: "https://github.com/johndoe/church-academy",
      liveLink: "https://subconnectedly-preservable-maxie.ngrok-free.dev/academy/",
      loginDetails: {
        Teacher: { username: "teacher", password: "haybee" },
        Member: { username: "seun", password: "haybee" }
      },
      functionalities: [
        "Dynamic Content Management",
        "Live Event & Course Scheduling",
        "Integrated Online Payments",
        "User Role-Based Access"
      ]
    },
    {
      title: "Church Workforce Platform",
      description: "A comprehensive platform to streamline church departmental routines and activities, including volunteer management, communication tools, and a centralized hub for all ministry-related tasks.",
      image: "/img/port3.jpeg",
      technologies: ["Next.js", "Socket.IO", "WebRTC", "MongoDB", "Redis", "Kubernetes"],
      githubLink: "https://github.com/johndoe/church-workforce",
      liveLink: "https://subconnectedly-preservable-maxie.ngrok-free.dev/workforce/",
      loginDetails: {
        admin: { username: "james.okoro@hqchurch.com", password: "haybee" },
        staff: { username: "staff", password: "password" }
      },
      functionalities: [
        "Real-time Communication & Messaging",
        "Integrated Video Conferencing (WebRTC)",
        "Automated Volunteer Management",
        "Centralized Task & Workflow Hub"
      ],
      featured: true
    },
    {
      title: "Machine Learning Fraud Detection Model",
      description: "Engineered a real-time, high-accuracy fraud detection model using supervised learning to identify fraudulent transactions, reducing losses by 30%.",
      image: "/img/port6.jpg",
      technologies: ["Python", "Pandas", "Scikit-learn", "Flask", "SQL", "GCP"],
      githubLink: "https://github.com/johndoe/ml-fraud-detection",
      liveLink: "https://fraud-detection.demo.com",
      functionalities: [
        "High-Accuracy Real-time Scoring",
        "Self-Learning Model (Adaptable)",
        "Anomaly Detection Engine",
        "Secure API for Integration"
      ],
      featured: true
    },
    {
      title: "Educational Platform for Secondary School Students (JSS1-SS3)",
      description: "An interactive learning platform for secondary school students, offering curriculum-based modules, practice questions, and progress tracking to enhance academic performance.",
      image: "/img/port1.jpeg",
      technologies: ["React Native", "Node.js", "MongoDB", "AWS Lambda"],
      githubLink: "https://github.com/johndoe/educational-platform",
      liveLink: "https://subconnectedly-preservable-maxie.ngrok-free.dev/school/",
      loginDetails: {
        teacher: { username: "georgeteach", password: "haybee" },
        student: { username: "vincentstd", password: "haybee" }
      },
      functionalities: [
        "Adaptive Learning Paths",
        "Gamified Progress Tracking",
        "Interactive Quizzes & Modules",
        "Comprehensive Performance Reports"
      ]
    },
    {
      title: "Healthcare Management System",
      description: "Developed HIPAA-compliant healthcare platform with patient records, appointment scheduling, telemedicine, and integrated billing system.",
      image: "/img/port5.jpg",
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "AWS", "FHIR"],
      githubLink: "https://github.com/johndoe/healthcare-system",
      liveLink: "https://healthcare-pro.demo.com",
      functionalities: [
        "HIPAA-Compliant Patient Records",
        "Secure Telemedicine Integration",
        "Automated Billing & Insurance Claims",
        "AI-Powered Diagnostics Support"
      ]
    },
    {
      title: "Smart City IoT Platform",
      description: "Built an IoT management system for smart cities with real-time monitoring, predictive maintenance, energy optimization, and citizen services.",
      image: "/img/port1.jpeg",
      technologies: ["Angular", "Python", "IoT", "TimescaleDB", "Kafka", "Docker"],
      githubLink: "https://github.com/johndoe/smart-city-iot",
      liveLink: "https://smartcity-platform.demo.com",
      functionalities: [
        "Predictive Maintenance (AI-Driven)",
        "Real-time Sensor Data Visualization",
        "Energy Consumption Optimization",
        "Citizen Service Request Portal"
      ],
      featured: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
            Projects & Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing my work in building enterprise-grade software, data platforms, and machine learning models
          </p>
        </motion.div>

        {/* Featured Projects Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {projects.map((project, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={project.featured ? "xl:col-span-1" : ""}
            >
              <Card className={`rounded-xl overflow-hidden glass-effect card-hover transition-all duration-300 h-full ${
                project.featured ? "ring-2 ring-primary/20 shadow-2xl" : ""
              }`}>
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Key Functionalities */}
                  {project.functionalities && (
                    <div className="grid grid-cols-1 gap-2 p-4 bg-muted/30 rounded-lg">
                      {project.functionalities.map((func, funcIndex) => (
                        <div key={funcIndex} className="flex items-center text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                          <span>{func}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Login Details */}
                  {project.loginDetails && (
                    <div className="p-4 bg-blue-100 dark:bg-blue-950 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                      <h4 className="font-semibold mb-2">Login Details (for Demo)</h4>
                      {Object.entries(project.loginDetails).map(([role, details]) => (
                        <div key={role} className="flex justify-between items-center">
                          <span className="font-medium capitalize">{role}:</span>
                          <span>
                            <span className="font-semibold">User:</span> {details.username} | <span className="font-semibold">Pass:</span> {details.password}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-2">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
