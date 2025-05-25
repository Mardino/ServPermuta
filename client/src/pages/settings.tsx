import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  // Theme toggle would actually be implemented with a theme provider
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );
  
  // Email notifications settings
  const [emailSettings, setEmailSettings] = useState({
    newMessages: true,
    permutaUpdates: true,
    systemAnnouncements: true,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleThemeToggle = () => {
    // This is just a placeholder - in a real app, this would update the theme provider
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    
    toast({
      title: "Tema alterado",
      description: `Modo ${isDarkMode ? "claro" : "escuro"} ativado.`,
    });
  };

  const handleEmailSettingChange = (setting: keyof typeof emailSettings) => {
    setEmailSettings({
      ...emailSettings,
      [setting]: !emailSettings[setting],
    });
    
    toast({
      title: "Configurações atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:truncate">
            Configurações
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie suas preferências e configurações de conta
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.profileImageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="text-xl">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {user?.email}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {user?.role === "admin" ? "Administrador" : "Utilizador"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Alterar foto de perfil</h4>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={user?.profileImageUrl}
                          alt={`${user?.firstName} ${user?.lastName}`}
                        />
                        <AvatarFallback className="text-lg">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-2">
                        <Button size="sm" variant="outline">
                          Carregar foto
                        </Button>
                        <Button size="sm" variant="ghost">
                          Remover foto
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Alterar senha</h4>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="current-password">Senha atual</Label>
                        <input
                          id="current-password"
                          type="password"
                          className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="new-password">Nova senha</Label>
                        <input
                          id="new-password"
                          type="password"
                          className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                        <input
                          id="confirm-password"
                          type="password"
                          className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                        />
                      </div>
                      <Button className="mt-2" size="sm">
                        Alterar senha
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">Tipo de conta</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {user?.accountType || "Free"} 
                          {user?.accountExpiresAt && ` (Expira em: ${new Date(user.accountExpiresAt).toLocaleDateString()})`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="destructive" onClick={() => setIsLogoutDialogOpen(true)} className="mt-4">
                  Terminar Sessão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Ativar modo escuro para a interface
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Notificações por Email
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Novas Mensagens</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Receber notificações para novas mensagens
                      </p>
                    </div>
                    <Switch
                      id="email-messages"
                      checked={emailSettings.newMessages}
                      onCheckedChange={() => handleEmailSettingChange("newMessages")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-permutas">Atualizações de Permutas</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Receber notificações quando o estado de uma permuta mudar
                      </p>
                    </div>
                    <Switch
                      id="email-permutas"
                      checked={emailSettings.permutaUpdates}
                      onCheckedChange={() => handleEmailSettingChange("permutaUpdates")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-system">Anúncios do Sistema</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Receber notificações sobre atualizações do sistema
                      </p>
                    </div>
                    <Switch
                      id="email-system"
                      checked={emailSettings.systemAnnouncements}
                      onCheckedChange={() => handleEmailSettingChange("systemAnnouncements")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminar Sessão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja terminar a sessão? Você precisará fazer login novamente para acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Terminar Sessão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
