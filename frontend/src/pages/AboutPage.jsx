import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Target, Lightbulb, Code, Database, Palette, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're committed to delivering solutions that drive real business results and exceed client expectations.",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We stay ahead of the curve, leveraging cutting-edge technologies to solve tomorrow's challenges today.",
    },
    {
      icon: Users,
      title: "Client-Centric",
      description:
        "Your success is our success. We build lasting partnerships through transparency and collaboration.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description:
        "Every line of code, every design element, and every user interaction is crafted with meticulous attention to detail.",
    },
  ];

  const skills = [
    {
      category: "Frontend Development",
      icon: Code,
      technologies: [
        "React",
        "Vue.js",
        "Angular",
        "TypeScript",
        "Next.js",
        "Nuxt.js",
        "TailwindCSS",
        "SASS/SCSS",
      ],
    },
    {
      category: "Backend Development",
      icon: Database,
      technologies: [
        "Node.js",
        "Python",
        "Express",
        "FastAPI",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "GraphQL",
      ],
    },
    {
      category: "UI/UX Design",
      icon: Palette,
      technologies: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Prototyping",
        "User Research",
        "Design Systems",
        "Responsive Design",
        "Accessibility",
      ],
    },
    {
      category: "DevOps & Cloud",
      icon: Zap,
      technologies: [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "GitHub Actions",
        "Terraform",
        "Monitoring",
        "Security",
      ],
    },
  ];

  const stats = [
    {
      number: "50+",
      label: "Projects Completed",
      description: "From startups to enterprise solutions",
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      description: "Measured by project success and retention",
    },
    {
      number: "5+",
      label: "Years Experience",
      description: "Building cutting-edge digital solutions",
    },
    {
      number: "24/7",
      label: "Support Available",
      description: "Dedicated support when you need it",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800 py-24 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
            About CodedAB Tech
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We are a passionate team of developers, designers, and innovators dedicated to crafting exceptional digital experiences that transform businesses and empower growth.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Founded with a vision to bridge the gap between innovative technology and practical business solutions, CodedAB Tech has grown from a small team of passionate developers to a trusted partner for businesses seeking digital transformation.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our journey began with a simple belief: that technology should serve people, not the other way around. This philosophy drives everything we do, from the user interfaces we design to the scalable architectures we build.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Today, we continue to push boundaries, embrace new technologies, and deliver solutions that not only meet current needs but anticipate future challenges.
            </p>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 border-orange-300/20 dark:border-orange-700/30 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-6">
                  What Sets Us Apart
                </h3>
                <ul className="space-y-4">
                  {[
                    "Deep technical expertise across modern tech stacks",
                    "Agile development methodology with rapid iteration",
                    "User-centered design approach for optimal experiences",
                    "Scalable solutions built for long-term success",
                    "Transparent communication throughout the process",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide our work and define our relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/70 dark:bg-orange-900/40 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-orange-600 dark:text-orange-300" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Technical Expertise
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive skill set spans the entire development lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-orange-900/40 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
                      <skill.icon className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                    </div>
                    <CardTitle className="text-2xl">{skill.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-200 text-sm rounded-full font-medium hover:bg-orange-200 dark:hover:bg-orange-600 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-24">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-white">{stat.number}</div>
                    <div className="text-xl font-semibold text-white">{stat.label}</div>
                    <div className="text-white/80 text-sm">{stat.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how our expertise can help transform your ideas into powerful digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Your Project
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800 font-semibold transition-all duration-300"
            >
              View Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
