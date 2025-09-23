import { Navigation } from "@/components/portfolio/Navigation.jsx";
import { HeroSection } from "@/components/portfolio/HeroSection.jsx";
import { ProfileSection } from "@/components/portfolio/ProfileSection.jsx";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection.jsx";
import { MetricsSection } from "@/components/portfolio/MetricsSection.jsx";
import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection.jsx";
import { ContactSection } from "@/components/portfolio/ContactSection.jsx";
import { Github, Linkedin, Twitter, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="overflow-hidden">
        <section id="home">
          <HeroSection />
        </section>

        <section id="about">
          <ProfileSection />
        </section>

        <section id="portfolio">
          <PortfolioSection />
        </section>

        <section id="metrics">
          <MetricsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>

        {/* ✅ Shop Button Section */}
        <section className="py-16 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            <ShoppingBag size={18} />
            Visit Our Shop
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-muted/10">
        <div className="container">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="font-bold text-2xl gradient-text mb-2">Abraham Oliha</h3>
              <p className="text-muted-foreground">Full-Stack Software Engineer</p>
            </div>

            <div className="flex justify-center space-x-8 mb-8">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Terms of Service
              </a>
              <a
                href="mailto:john.doe@email.com"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Contact
              </a>
            </div>

            <div className="flex justify-center space-x-6 mb-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>

            <div className="pt-6 border-t border-border/50">
              <p className="text-muted-foreground">
                © 2024 Abraham Oliha.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
