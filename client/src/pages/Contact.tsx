import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import type { ContactMessageInput } from "@shared/routes";
import { useContact } from "@/hooks/use-contact";
import { MapPin, Phone, Mail, MessageSquare, Send } from "lucide-react";
import { useEffect } from "react";

export default function Contact() {
  const mutation = useContact();

  useEffect(() => {
    document.title = "Uaus! | Contatos";
  }, []);
  
  const form = useForm<ContactMessageInput>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    }
  });

  const onSubmit = (data: ContactMessageInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-24">
      <div className="bg-primary pt-20 pb-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black text-white mb-6"
          >
            Fale <span className="text-white/90">Conosco</span>
          </motion.h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
            Dúvidas, sugestões ou elogios? Queremos ouvir você. Preencha o formulário ou entre em contato pelos nossos canais.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-50/50 p-8 md:p-10 rounded-3xl border border-orange-100"
          >
            <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2 text-foreground">
              <MessageSquare className="text-primary w-6 h-6" />
              Envie uma mensagem
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nome Completo</label>
                <input 
                  {...form.register("name")}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  placeholder="Seu nome"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">E-mail</label>
                  <input 
                    {...form.register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Telefone / WhatsApp</label>
                  <input 
                    {...form.register("phone")}
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                    placeholder="(44) 99999-9999"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mensagem</label>
                <textarea 
                  {...form.register("message")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
                  placeholder="Escreva sua mensagem aqui..."
                />
                {form.formState.errors.message && (
                  <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-orange-400 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {mutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                {!mutation.isPending && <Send className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold font-display mb-6">Informações de Contato</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-orange-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">WhatsApp / Telefone</p>
                      <a href="https://wa.me/5544991365567" target="_blank" rel="noreferrer" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        (44) 99136-5567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-orange-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
                      <a href="mailto:uaus30@gmail.com" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        uaus30@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-orange-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Endereço</p>
                      <p className="text-lg font-bold text-foreground">
                        Rua Paranaguá, 663, centro<br/>Tapira-PR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action Button */}
              <a 
                href="https://wa.me/5544991365567" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full py-5 px-6 rounded-2xl font-display font-black text-center text-white bg-green-600 shadow-xl hover:bg-green-500 hover:-translate-y-1 transition-all duration-300 animate-pulse-glow"
              >
                CHAMAR NO WHATSAPP
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
