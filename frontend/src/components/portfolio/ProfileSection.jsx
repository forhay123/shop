import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Progress from "@/components/ui/progress";
import {
  Code,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
} from "lucide-react";

export const ProfileSection = () => {
  const skills = [
    { name: "Full-Stack Development", level: 95, category: "Software Engineering" },
    { name: "Data Science & Analysis", level: 92, category: "Data Science" },
    { name: "Machine Learning (ML)", level: 90, category: "Machine Learning" },
    { name: "React/Next.js", level: 98, category: "Frontend" },
    { name: "Python/Django/Flask", level: 95, category: "Backend" },
    { name: "TensorFlow/PyTorch", level: 90, category: "ML Frameworks" },
    { name: "SQL/NoSQL Databases", level: 92, category: "Data Management" },
    { name: "Cloud (AWS/GCP)", level: 90, category: "DevOps & Cloud" },
    { name: "Data Visualization (D3.js)", level: 88, category: "Data Science" },
    { name: "System Architecture", level: 95, category: "Architecture" },
    { name: "CI/CD & DevOps", level: 89, category: "DevOps & Cloud" },
  ];

  const experience = [
    {
      title: "Senior Full-Stack Engineer, Data Scientist, ML Engineer",
      company: "Kavsis",
      period: "2024 - Present",
      location: "San Francisco, CA",
      description: "Leading the development of enterprise-grade applications and data products. Architected and deployed ML models for predictive analytics and customer segmentation.",
      achievements: [
        "Built scalable e-commerce platform generating $10M+ revenue",
        "Deployed a real-time fraud detection model, reducing financial losses by 30%",
        "Led a team of 8 engineers and data scientists on key projects"
      ]
    },
    {
      title: "Full-Stack Developer",
      company: "CODED AB TECH",
      period: "2021 - Present",
      location: "Lagos, Nigeria",
      description: "Developed AI-powered analytics platforms and real-time collaboration tools for enterprise clients.",
      achievements: [
        "Created ML-driven recommendation system improving engagement by 45%",
        "Implemented real-time features serving 100K concurrent users",
        "Achieved 99.9% uptime across all production services"
      ]
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
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate professional with 4+ years of experience building scalable software,
            intelligent data systems, and impactful machine learning models
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 text-center card-hover">
              <div className="relative mb-6">
                <img
                    src="/img/prop1.png"
                    alt="Abraham's profile picture"
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">Abraham Oliha</h3>
              <p className="text-primary font-semibold mb-4">Senior Full-Stack Software Engineer, Data Scientist, Machine Learning Engineer</p>

              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              {/* Availability Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 border border-green-200 dark:border-green-800"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>Available for New Projects</span>
              </motion.div>
            </Card>
          </motion.div>

          {/* Bio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6 text-primary" />
                  Professional Summary
                </h3>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I'm a versatile professional with <strong>4+ years of experience</strong> as a Full-Stack Software Engineer, Data Scientist, and Machine Learning Engineer. My expertise lies in building end-to-end, scalable solutions that not only have a robust technical foundation but also harness the power of data to drive business value.
                  </p>
                  <p>
                    I've successfully delivered high-impact projects, from architecting multi-million dollar e-commerce platforms to developing and deploying AI-driven solutions that have reduced costs and improved efficiency. My passion lies in bridging the gap between engineering and data, creating intelligent systems that provide tangible results.
                  </p>
                  <p>
                    My approach combines technical excellence with a deep understanding of data, ensuring every solution I build is secure, performant, and future-proof. I'm dedicated to mentoring teams, fostering innovation, and staying on the cutting edge of technology and data science.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Technical Expertise - Now a full-width section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Technical Expertise</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{skill.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={skill.level} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8">
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Professional Experience
            </h3>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="relative pl-8 border-l-2 border-primary/20 last:border-l-0"
                >
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xl font-bold">{exp.title}</h4>
                      <p className="text-primary font-semibold">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.period} • {exp.location}</p>
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm">Key Achievements:</h5>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
