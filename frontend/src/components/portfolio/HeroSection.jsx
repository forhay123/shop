import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Twitter, ArrowRight, CheckCircle } from "lucide-react";
import photo from "/img/prop1.png";

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const achievements = [
    "7+ Years Experience",
    "$50M+ Revenue Generated",
    "500K+ Users Served",
    "99.9% Uptime Achieved"
  ];

  return (
    <section className="relative overflow-hidden pt-16 py-24 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-3/5 w-full text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                Available for new projects
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6"
            >
              Hi, I'm{" "}
              <span className="gradient-text">
                Abraham . O . 
              </span>
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl md:text-3xl font-light text-muted-foreground mb-4">
                Senior Full-Stack Software Engineer · Data Scientist · Machine Learning Engineer
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-medium">
                 Delivering AI-powered, enterprise-grade applications that scale seamlessly
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              I design and deploy intelligent systems that combine modern full-stack engineering 
              with advanced data science and machine learning. My solutions optimize business 
              operations, generate measurable ROI, and empower organizations with predictive insights. 
              Projects I’ve led have <strong>automated workflows for Fortune 500 companies</strong>, 
              <strong>analyzed terabytes of real-time data</strong>, and <strong>served over 500K+ global users</strong>.
            </motion.p>

            {/* Achievement Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center lg:text-left p-3 bg-muted/50 rounded-lg backdrop-blur-sm"
                >
                  <div className="text-sm font-semibold text-primary">
                    {achievement}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile Photo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:w-2/5 w-full flex justify-center relative"
          >
            <div className="relative">
              {/* Main Photo */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img
                  src={photo}
                  alt="Abraham - Senior Full-Stack Engineer"
                  className="object-cover w-full h-full"
                />
                
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Available
                </div>
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -left-4 top-1/4 bg-card border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -right-4 bottom-1/4 bg-card border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-primary">500K+</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </motion.div>

              {/* Animated Ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-4 border-primary/30"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ margin: "-4px" }}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};