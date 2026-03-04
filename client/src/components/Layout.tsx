import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Phone, Mail, Instagram, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoIcon from "@assets/icone_sem_fundo_1772322579980.png";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/products", label: "Produtos" },
    { href: "/contact", label: "Contato" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo area with hover effects */}
            <Link href="/" className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src={logoIcon} 
                  alt="Uaus! Logo" 
                  className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-4xl text-white leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
                  Uaus!
                </span>
                <span className="font-display font-bold text-sm tracking-[0.2em] text-white/90 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 origin-left">
                  MÁXIMO 30
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105 ${
                    location === link.href
                      ? "text-white border-b-2 border-white py-1"
                      : "text-white/80 hover:text-white py-1"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-primary border-t border-white/10 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-display font-bold text-lg uppercase tracking-wider py-2 px-4 rounded-lg transition-colors ${
                      location === link.href
                        ? "bg-white text-primary"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
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
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="Uaus! Logo" className="w-12 h-12 object-contain brightness-100" />
                <div className="flex flex-col">
                  <span className="font-display font-black text-3xl text-primary leading-none">
                    Uaus!
                  </span>
                  <span className="font-display font-bold text-xs tracking-[0.2em] text-white/80 uppercase">
                    MÁXIMO 30
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Tudo o que você precisa por no máximo R$ 30,00. Qualidade e preço baixo em um só lugar.
              </p>
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://www.instagram.com/uaus_oficial/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/5544991365567" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
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
                  <a 
                    href="https://share.google/ryVm9lKIGuVFk0sN2" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Rua Paranaguá, 663, centro,<br />Tapira-PR
                  </a>
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
