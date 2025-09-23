import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "olihahenry8@gmail.com",
      description: "Best way to reach me",
      href: "mailto:olihahenry8@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+2348149367275",
      description: "Available Mon-Fri 9AM-6PM PST",
      href: "tel:+2348149367275",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Lagos, Nigeria",
      description: "Open to remote work worldwide",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "< 24 hours",
      description: "Guaranteed quick response",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/johndoe", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/johndoe",
      label: "LinkedIn",
    },
    { icon: Twitter, href: "https://twitter.com/johndoe", label: "Twitter" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Let's Work Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Let's discuss your project and
            create something amazing together.
          </p>
        </motion.div>

        {/* Combined Contact Info and Status */}
        <div className="flex flex-col items-center space-y-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{info.title}</h4>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-primary hover:underline font-medium"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-primary font-medium">{info.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
