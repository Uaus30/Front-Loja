import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/products", label: "Produtos" },
    { href: "/contact", label: "Contato" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo area with hover effects */}
            <Link href="/" className="flex flex-col group cursor-pointer">
              <span className="font-display font-black text-4xl text-primary leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
                Uaus!
              </span>
              <span className="font-display font-bold text-sm tracking-[0.2em] text-foreground/80 group-hover:text-primary group-hover:scale-105 transition-all duration-300 origin-left">
                MÁXIMO 30
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold text-sm uppercase tracking-wider transition-colors duration-200 ${
                    location === link.href
                      ? "text-primary border-b-2 border-primary py-1"
                      : "text-muted-foreground hover:text-primary py-1"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button (visual only for this demo) */}
            <div className="md:hidden">
              <button className="p-2 text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Col */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="font-display font-black text-4xl text-primary leading-none">
                  Uaus!
                </span>
                <span className="font-display font-bold text-sm tracking-[0.2em] text-white/80">
                  MÁXIMO 30
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Tudo o que você precisa por no máximo R$ 30,00. Qualidade e preço baixo em um só lugar.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Col */}
            <div>
              <h3 className="font-display font-bold text-xl mb-6">Contato</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5" />
                  <a href="https://wa.me/5544991365567" target="_blank" rel="noreferrer">(44) 99136-5567</a>
                </li>
                <li className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                  <a href="mailto:uaus30@gmail.com">uaus30@gmail.com</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Rua Paranaguá, 663, centro,<br />Tapira-PR</span>
                </li>
              </ul>
            </div>

            {/* Links Col */}
            <div>
              <h3 className="font-display font-bold text-xl mb-6">Navegação</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={`footer-${link.href}`}>
                    <Link href={link.href} className="text-white/70 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Col */}
            <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe 
                src="https://maps.google.com/maps?q=Rua+Paranagu%C3%A1,+663,+centro,+Tapira-PR&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Uaus!"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
            <p>&copy; 2024 Uaus! Máximo 30. Todos os direitos reservados.</p>
            <p>CNPJ: 64.958.682/0001-22</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
