import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Message sent successfully! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@codedabtech.com",
      href: "mailto:contact@codedabtech.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "123 Tech Street, Innovation City",
      href: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-100/10 to-orange-200/5 dark:via-orange-900/10 dark:to-orange-950/5 py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to transform your ideas into powerful digital solutions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-gradient-to-br from-orange-50/5 to-orange-100/5 dark:from-orange-900/10 dark:to-orange-950/5 border-orange-300/20 shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                  Get In Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100/20 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <a 
                        href={info.href}
                        className="text-muted-foreground hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 border-0 shadow-strong">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Why Choose CodedAB Tech?
                </h3>
                <ul className="text-white/90 space-y-2 text-left">
                  <li>• 5+ years of proven expertise</li>
                  <li>• 50+ successful projects delivered</li>
                  <li>• 24/7 dedicated support</li>
                  <li>• Cutting-edge technology stack</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-strong border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Project Details *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={6}
                      className="w-full p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 hover:shadow-strong transition-all duration-300 group"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
