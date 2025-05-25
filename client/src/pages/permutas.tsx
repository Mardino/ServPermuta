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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

interface Institution {
  id: number;
  name: string;
}

interface Permuta {
  id: number;
  userId: string;
  fromInstitutionId: number;
  toInstitutionId: number;
  status: 'pending' | 'analyzing' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export default function Permutas() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedPermuta, setSelectedPermuta] = useState<Permuta | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const { data: permutas, isLoading } = useQuery<Permuta[]>({
    queryKey: ["/api/permutas"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: institutions } = useQuery<Institution[]>({
    queryKey: ["/api/institutions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ permutaId, status }: { permutaId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/permutas/${permutaId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permutas"] });
      toast({
        title: "Estado atualizado",
        description: "O estado da permuta foi atualizado com sucesso.",
      });
      setIsStatusDialogOpen(false);
      setSelectedPermuta(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o estado da permuta.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (permuta: Permuta) => {
    setSelectedPermuta(permuta);
    setNewStatus(permuta.status);
    setIsStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedPermuta && newStatus) {
      updateStatusMutation.mutate({
        permutaId: selectedPermuta.id,
        status: newStatus,
      });
    }
  };

  const getUserById = (id: string) => {
    return users?.find(user => user.id === id);
  };

  const getInstitutionById = (id: number) => {
    return institutions?.find(inst => inst.id === id);
  };

  const filteredPermutas = permutas
    ?.filter(permuta => {
      const fromInstitution = getInstitutionById(permuta.fromInstitutionId);
      const toInstitution = getInstitutionById(permuta.toInstitutionId);
      const user = getUserById(permuta.userId);
      
      const matchesSearch = 
        fromInstitution?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toInstitution?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(permuta.id).includes(searchTerm);
        
      const matchesStatus = statusFilter === "all" || permuta.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: pt });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="status-badge-pending">Pendente</Badge>;
      case 'analyzing':
        return <Badge className="status-badge-analyzing">Em Análise</Badge>;
      case 'approved':
        return <Badge className="status-badge-approved">Aprovada</Badge>;
      case 'completed':
        return <Badge className="status-badge-completed">Concluída</Badge>;
      case 'rejected':
        return <Badge className="status-badge-rejected">Rejeitada</Badge>;
      case 'cancelled':
        return <Badge className="status-badge-cancelled">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:truncate">
            Permutas
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie as permutas entre instituições
          </p>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Permuta
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Lista de Permutas</CardTitle>
          <CardDescription>
            Lista de todas as permutas registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0 md:space-x-2">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Pesquisar permutas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="analyzing">Em Análise</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermutas?.length ? (
                    filteredPermutas.map((permuta) => {
                      const user = getUserById(permuta.userId);
                      const fromInstitution = getInstitutionById(permuta.fromInstitutionId);
                      const toInstitution = getInstitutionById(permuta.toInstitutionId);
                      
                      return (
                        <TableRow key={permuta.id}>
                          <TableCell className="font-medium">#{permuta.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user?.profileImageUrl}
                                  alt={`${user?.firstName} ${user?.lastName}`}
                                />
                                <AvatarFallback>
                                  {user?.firstName?.[0]}
                                  {user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                {user ? `${user.firstName} ${user.lastName}` : 'Utilizador Desconhecido'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{fromInstitution?.name || 'Instituição Desconhecida'}</TableCell>
                          <TableCell>{toInstitution?.name || 'Instituição Desconhecida'}</TableCell>
                          <TableCell>{getStatusBadge(permuta.status)}</TableCell>
                          <TableCell>{formatDate(permuta.createdAt)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleStatusChange(permuta)}>
                                  Alterar Estado
                                </DropdownMenuItem>
                                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhuma permuta encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Estado da Permuta</DialogTitle>
            <DialogDescription>
              Altere o estado da permuta #{selectedPermuta?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="analyzing">Em Análise</SelectItem>
                <SelectItem value="approved">Aprovada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="rejected">Rejeitada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
