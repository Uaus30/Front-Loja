import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Uaus Admin | Login";
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Falha ao autenticar" }));
      setError(data.message ?? "Falha ao autenticar");
      setLoading(false);
      return;
    }

    setLocation("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 text-slate-100 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-center text-2xl">Painel Administrativo</CardTitle>
          <CardDescription className="text-center text-slate-300">
            Faça login com seu e-mail ou usuário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              className="border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
              placeholder="E-mail ou login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                className="border-slate-700 bg-slate-950/70 pr-11 text-slate-100 placeholder:text-slate-500"
                placeholder="Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-100"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button className="w-full bg-orange-500 text-slate-950 hover:bg-orange-400" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
