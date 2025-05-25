import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  role: string;
  accountType?: 'free' | 'pro_i' | 'pro_ii' | 'premium';
  accountExpiresAt?: string;
  createdAt: string;
}

export default function Users() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [promotionDetails, setPromotionDetails] = useState({
    accountType: "free" as "free" | "pro_i" | "pro_ii" | "premium",
    duration: "7" as "7" | "15" | "30" | "365"
  });

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Função atualizada",
        description: "A função do utilizador foi atualizada com sucesso.",
      });
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a função do utilizador.",
        variant: "destructive",
      });
    },
  });
  
  const promoteUserMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      accountType, 
      duration 
    }: { 
      userId: string; 
      accountType: string;
      duration: string;
    }) => {
      const response = await fetch(`/api/users/${userId}/promote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType, duration })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário promovido",
        description: `O usuário foi promovido para o plano ${getAccountTypeLabel(promotionDetails.accountType)}.`,
      });
      setIsPromoteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao promover o usuário.",
        variant: "destructive",
      });
    },
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (userId: string, role: string) => {
    const user = users?.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setNewRole(role || "user");
    setIsRoleDialogOpen(true);
  };

  const handlePromoteUser = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setPromotionDetails({
      accountType: "free",
      duration: "7"
    });
    setIsPromoteDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setIsDeleteDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({
        userId: selectedUser.id,
        role: newRole,
      });
    }
  };
  
  const confirmPromoteUser = () => {
    if (selectedUser) {
      promoteUserMutation.mutate({
        userId: selectedUser.id,
        accountType: promotionDetails.accountType,
        duration: promotionDetails.duration
      });
    }
  };
  
  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };
  
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "free": return "Free";
      case "pro_i": return "Pro I";
      case "pro_ii": return "Pro II";
      case "premium": return "Premium";
      default: return type;
    }
  };
  
  const getDurationLabel = (days: string) => {
    switch (days) {
      case "7": return "7 dias";
      case "15": return "15 dias";
      case "30": return "1 mês";
      case "365": return "1 ano";
      default: return `${days} dias`;
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(date, "d MMM yyyy", { locale: pt });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="info">Administrador</Badge>;
      case "user":
        return <Badge variant="secondary">Utilizador</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:truncate">
            Utilizadores
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie os utilizadores da plataforma e suas funções
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Lista de Utilizadores</CardTitle>
          <CardDescription>
            Lista de todos os utilizadores registrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Pesquisar utilizadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Data de Registo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.length ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={user.profileImageUrl || ""}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                              <AvatarFallback>
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{`${user.firstName || ""} ${user.lastName || ""}`}</p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email || "-"}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role)}>
                                Alterar Função
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePromoteUser(user.id)}>
                                Promover Usuário
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-700">
                                Excluir Usuário
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum utilizador encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para alterar função */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Função do Utilizador</DialogTitle>
            <DialogDescription>
              Altere a função do utilizador {selectedUser?.firstName} {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(value) => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Utilizador</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmRoleChange} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para promover usuário */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promover Usuário</DialogTitle>
            <DialogDescription>
              Promova o usuário {selectedUser?.firstName} {selectedUser?.lastName} para um plano premium.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-type">Tipo de Conta</Label>
              <Select 
                value={promotionDetails.accountType} 
                onValueChange={(value: any) => setPromotionDetails({...promotionDetails, accountType: value})}
              >
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Selecionar tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro_i">Pro I</SelectItem>
                  <SelectItem value="pro_ii">Pro II</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Select 
                value={promotionDetails.duration} 
                onValueChange={(value: any) => setPromotionDetails({...promotionDetails, duration: value})}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Selecionar duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="15">15 dias</SelectItem>
                  <SelectItem value="30">1 mês</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-medium">Resumo:</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                O usuário será promovido para o plano <strong>{getAccountTypeLabel(promotionDetails.accountType)}</strong> por <strong>{getDurationLabel(promotionDetails.duration)}</strong>.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmPromoteUser} disabled={promoteUserMutation.isPending}>
              {promoteUserMutation.isPending ? "Promovendo..." : "Promover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para excluir usuário */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.firstName} {selectedUser?.lastName}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser} 
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Excluindo..." : "Excluir Permanentemente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
