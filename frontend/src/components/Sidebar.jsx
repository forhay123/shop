import React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Sidebar() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/codedabtech", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/codedab-tech", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@codedabtech.com", label: "Email" },
    { icon: Phone, href: "tel:+1234567890", label: "Phone" },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed left-6 top-1/2 transform -translate-y-1/2 space-y-6 z-40">
      <div className="bg-[hsl(var(--card))/80] backdrop-blur-sm rounded-2xl p-4 shadow-medium border border-[hsl(var(--border))/40]">
        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/10] transition-all duration-300 transform hover:scale-110 mb-2 last:mb-0"
            title={link.label}
          >
            <link.icon size={20} />
          </a>
        ))}
      </div>

      {/* Floating contact button */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] rounded-2xl p-1 shadow-strong">
        <a
          href="/contact"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--primary-foreground))/10] backdrop-blur-sm text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))/20] transition-all duration-300 transform hover:scale-105"
          title="Contact Us"
        >
          <Mail size={20} />
        </a>
      </div>
    </aside>
  );
}
