import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Store, ShoppingBag, Star } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
// Static imports for images
import facadeRight from '@assets/FACHADA_LADODIREITO_1772216408089.png';
import facadeLeft from '@assets/FACHADA_LADOESQUERDO_1772216408090.png';

function Countdown() {
  const targetDate = new Date("2026-03-07T09:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) return null;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mt-8">
      {[
        { label: "Dias", value: days },
        { label: "Horas", value: hours },
        { label: "Min", value: minutes },
        { label: "Seg", value: seconds },
      ].map((item) => (
        <div key={item.label} className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30 flex flex-col items-center justify-center">
          <div className="text-2xl md:text-3xl font-black leading-none">{item.value}</div>
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const storePhotos = [
    facadeLeft,
    facadeRight,
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534452203293-497d1f97e0f0?q=80&w=800&auto=format&fit=crop"
  ];

  useEffect(() => {
    document.title = "Uaus! Máximo 30";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storePhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [storePhotos.length]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-orange-50/50">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-semibold text-sm shadow-sm border border-primary/10 mb-8">
                <Store className="w-4 h-4" />
                <span>Nova loja em Tapira-PR</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-foreground leading-[1.1] mb-6">
                Chegou agora em Tapira... <br className="hidden md:block" />
                <div className="h-4 md:h-8" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Tudo por no máximo 30 reais!
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance mx-auto">
                A loja Uaus traz pra você um conceito inovador: qualidade, variedade e preço baixo de verdade. 
                Nenhum produto em nossa loja custa mais que 30 reais... Surpreenda-se!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-orange-400 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Ver Super Ofertas <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-foreground border-2 border-border shadow-sm hover:border-primary/50 hover:bg-orange-50 transition-all duration-300">
                  Fale Conosco
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Inauguration Banner */}
      <section className="bg-foreground text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://pixabay.com/get/g91995c4d348423980329b86348c5dc4fc693a678c755086b2636cab2eda274e07ed034600cbd2e4911a5b9f1f5ffc755_1280.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20"
          >
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-display font-bold">Inauguração neste Sábado!</h2>
              <p className="text-white/90 text-lg">Venha comemorar conosco e aproveitar as melhores ofertas da região...</p>
              <Countdown />
            </div>
            
            <div className="flex flex-col gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 min-w-[280px]">
              <div className="flex items-center gap-4">
                <div className="bg-white text-primary p-3 rounded-xl">
                  <CalendarDays className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Data</p>
                  <p className="text-xl font-bold">7 de Março de 2026</p>
                  <p className="text-white/90 text-sm font-medium">Sábado</p>
                </div>
              </div>
              <div className="w-full h-px bg-white/20" />
              <div className="flex items-center gap-4">
                <div className="bg-white text-primary p-3 rounded-xl">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Local</p>
                  <p className="text-lg font-bold">Rua Paranaguá, 663</p>
                  <p className="text-white/90 text-sm font-medium">Centro, Tapira-PR</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Store Photos Carousel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Conheça nossa loja</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um ambiente preparado para receber você com bom atendimento e muitos produtos.
            </p>
          </div>

          <div className="relative group max-w-4xl mx-auto px-4 overflow-hidden">
            <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-border bg-gray-100 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={storePhotos[currentSlide]}
                  alt={`Loja Uaus! - Foto ${currentSlide + 1}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Carousel Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + storePhotos.length) % storePhotos.length)}
                  className="bg-white/90 hover:bg-primary hover:text-white p-3 rounded-full shadow-lg transition-all backdrop-blur-sm z-20"
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % storePhotos.length)}
                  className="bg-white/90 hover:bg-primary hover:text-white p-3 rounded-full shadow-lg transition-all backdrop-blur-sm z-20"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {storePhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === idx ? "bg-primary w-8" : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-orange-50/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border text-center hover:shadow-md transition-all flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Presentes</h3>
              <p className="text-muted-foreground">Brinquedos, utilidades de casa, livros e muito mais</p>
            </div>
            
            <div 
              className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 border-2 border-white/20 text-center flex flex-col items-center z-10"
            >
              <div className="w-20 h-20 bg-white text-primary rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <Star className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3 text-white">MÁXIMO 30 REAIS</h3>
              <p className="text-white/90 font-medium">Nenhum produto custa mais que R$ 30,00 reais! Se encontrar um produto caro, reclame ;D</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border text-center hover:shadow-md transition-all flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Diversidade</h3>
              <p className="text-muted-foreground">Diversos outros produtos: Roupa íntima, toalhas, panos de prato, ferramentas, etc...</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
