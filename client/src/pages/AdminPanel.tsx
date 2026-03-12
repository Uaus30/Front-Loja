import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

type AdminUser = { id: number; name: string; email: string; username: string };
type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  isPromotion: boolean;
};

type StatsResponse = {
  totalProducts: number;
  promotionalProducts: number;
  mockMonthlyVisits: number[];
  mockConversionRate: number[];
};

const EMPTY_PRODUCT = { name: "", description: "", imageUrl: "", price: "", isPromotion: false };
const EMPTY_USER = { name: "", email: "", username: "", password: "" };

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("dashboard");
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({ ...EMPTY_USER });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Uaus Admin | Painel";
  }, []);

  const meQuery = useQuery({
    queryKey: ["/api/admin/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/auth/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Falha ao validar autenticação");
      return res.json();
    },
  });

  const statsQuery = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!meQuery.data,
    queryFn: async () => (await apiRequest("GET", "/api/admin/stats")).json(),
  });

  const productsQuery = useQuery({
    queryKey: ["/api/admin/products"],
    enabled: !!meQuery.data,
    queryFn: async () => (await apiRequest("GET", "/api/admin/products")).json() as Promise<Product[]>,
  });

  const usersQuery = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!meQuery.data,
    queryFn: async () => (await apiRequest("GET", "/api/admin/users")).json() as Promise<AdminUser[]>,
  });

  const saveProduct = useMutation({
    mutationFn: async () => {
      const payload = { ...productForm, price: Number(productForm.price).toFixed(2) };
      if (editingProductId) {
        await apiRequest("PUT", `/api/admin/products/${editingProductId}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/products", payload);
      }
    },
    onSuccess: () => {
      setProductForm({ ...EMPTY_PRODUCT });
      setEditingProductId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const saveUser = useMutation({
    mutationFn: async () => {
      if (editingUserId) {
        await apiRequest("PUT", `/api/admin/users/${editingUserId}`, userForm);
      } else {
        await apiRequest("POST", "/api/admin/users", userForm);
      }
    },
    onSuccess: () => {
      setUserForm({ ...EMPTY_USER });
      setEditingUserId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/admin/auth/logout"),
    onSuccess: () => {
      setLocation("/admin/login");
    },
  });

  async function deleteProduct(id: number) {
    await apiRequest("DELETE", `/api/admin/products/${id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
  }

  async function deleteUser(id: number) {
    await apiRequest("DELETE", `/api/admin/users/${id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
  }

  const stats = statsQuery.data as StatsResponse | undefined;
  const pieData = useMemo(
    () => [
      { name: "Produtos", value: stats?.totalProducts ?? 0, color: "#fb923c" },
      { name: "Em oferta", value: stats?.promotionalProducts ?? 0, color: "#22c55e" },
    ],
    [stats],
  );

  const visitsData = (stats?.mockMonthlyVisits ?? []).map((value, index) => ({ month: `M${index + 1}`, value }));

  if (meQuery.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando painel...</div>;
  }

  if (!meQuery.data) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-xl">Painel Administrativo Uaus</h1>
          <p className="text-sm text-slate-300">Olá, {meQuery.data.name}</p>
        </div>
        <Button variant="secondary" onClick={() => logoutMutation.mutate()}>Sair</Button>
      </header>

      <main className="p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Produtos Cadastrados vs Ofertas</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                          {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Visitas mensais (mock)</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <BarChart data={visitsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>{editingProductId ? "Editar produto" : "Novo produto"}</CardTitle></CardHeader>
              <CardContent>
                <form className="grid md:grid-cols-2 gap-3" onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  saveProduct.mutate();
                }}>
                  <Input placeholder="Nome" value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} required />
                  <Input placeholder="Preço" type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
                  <Input placeholder="URL da imagem" value={productForm.imageUrl} onChange={(e) => setProductForm((p) => ({ ...p, imageUrl: e.target.value }))} required />
                  <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={productForm.isPromotion} onChange={(e) => setProductForm((p) => ({ ...p, isPromotion: e.target.checked }))} /> Em promoção</label>
                  <div className="md:col-span-2"><Input placeholder="Descrição" value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} required /></div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => { setProductForm({ ...EMPTY_PRODUCT }); setEditingProductId(null); }}>Limpar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Lista de produtos</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {productsQuery.data?.map((product) => (
                    <div key={product.id} className="border rounded-md p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-slate-500">R$ {Number(product.price).toFixed(2)}{product.isPromotion ? " • Oferta" : ""}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingProductId(product.id);
                          setProductForm({
                            name: product.name,
                            description: product.description,
                            imageUrl: product.imageUrl,
                            price: String(product.price),
                            isPromotion: product.isPromotion,
                          });
                        }}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>{editingUserId ? "Editar usuário" : "Novo usuário"}</CardTitle></CardHeader>
              <CardContent>
                <form className="grid md:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); saveUser.mutate(); }}>
                  <Input placeholder="Nome" value={userForm.name} onChange={(e) => setUserForm((u) => ({ ...u, name: e.target.value }))} required={!editingUserId} />
                  <Input placeholder="E-mail" type="email" value={userForm.email} onChange={(e) => setUserForm((u) => ({ ...u, email: e.target.value }))} required={!editingUserId} />
                  <Input placeholder="Login" value={userForm.username} onChange={(e) => setUserForm((u) => ({ ...u, username: e.target.value }))} required={!editingUserId} />
                  <Input placeholder={editingUserId ? "Nova senha (opcional)" : "Senha"} type="password" value={userForm.password} onChange={(e) => setUserForm((u) => ({ ...u, password: e.target.value }))} required={!editingUserId} />
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => { setEditingUserId(null); setUserForm({ ...EMPTY_USER }); }}>Limpar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Usuários cadastrados</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usersQuery.data?.map((user) => (
                    <div key={user.id} className="border rounded-md p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email} • {user.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingUserId(user.id);
                          setUserForm({ name: user.name, email: user.email, username: user.username, password: "" });
                        }}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
