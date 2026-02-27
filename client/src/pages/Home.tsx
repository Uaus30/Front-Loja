import { motion } from "framer-motion";
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
        <div key={item.label} className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
          <div className="text-2xl md:text-3xl font-black">{item.value}</div>
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
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
                A revolução do preço chegou. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Tudo por Máximo 30!</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance mx-auto">
                A Uaus! traz para você um conceito inovador: qualidade, variedade e preço fixo. 
                Nenhum produto em nossa loja custa mais que R$ 30,00. Surpreenda-se!
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
              <h2 className="text-3xl md:text-5xl font-display font-bold">Grande Inauguração!</h2>
              <p className="text-white/90 text-lg">Venha comemorar conosco e aproveitar as melhores ofertas.</p>
              <Countdown />
            </div>
            
            <div className="flex flex-col gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-4">
                <div className="bg-white text-primary p-3 rounded-xl">
                  <CalendarDays className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Data</p>
                  <p className="text-xl font-bold">7 de Março de 2026</p>
                  <p className="text-white/90 text-sm">Sábado Especial</p>
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
                  <p className="text-white/90 text-sm">Centro, Tapira-PR</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Store Photos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Conheça nossa loja</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um ambiente preparado para receber você com conforto e muitas novidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden shadow-xl border border-border group"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={facadeLeft} 
                  alt="Fachada Lado Esquerdo Uaus!" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <h3 className="text-white text-2xl font-bold font-display">Vista Esquerda</h3>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden shadow-xl border border-border group"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={facadeRight} 
                  alt="Fachada Lado Direito Uaus!" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <h3 className="text-white text-2xl font-bold font-display">Vista Direita</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-orange-50/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Variedade incrível</h3>
              <p className="text-muted-foreground">Milhares de itens para sua casa, presentes e dia a dia.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border text-center hover:shadow-md transition-shadow transform md:-translate-y-4 border-primary/20">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-primary">Preço Único MÁXIMO</h3>
              <p className="text-muted-foreground">Nenhum produto custa mais que R$ 30,00. Nossa promessa.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Ambiente Familiar</h3>
              <p className="text-muted-foreground">Loja climatizada e atendimento especial para você e sua família.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
