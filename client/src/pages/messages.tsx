import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, formatDistance } from "date-fns";
import { pt } from "date-fns/locale";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const messageSchema = z.object({
  receiverId: z.string().min(1, "Selecione um destinatário"),
  content: z.string().min(1, "A mensagem não pode estar vazia").max(1000, "A mensagem é muito longa"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function Messages() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages?unread=${filter === "unread"}`],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      receiverId: "",
      content: "",
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: async (values: MessageFormValues) => {
      const response = await apiRequest("POST", "/api/messages", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Mensagem enviada",
        description: "A mensagem foi enviada com sucesso.",
      });
      setIsComposeDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a mensagem.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest("PUT", `/api/messages/${messageId}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const onSubmit = (values: MessageFormValues) => {
    createMessageMutation.mutate(values);
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead && message.receiverId === user?.id) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const getUserById = (id: string) => {
    return users?.find(user => user.id === id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: pt
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM, yyyy 'às' HH:mm", { locale: pt });
  };

  const filterMessages = () => {
    if (!messages) return [];
    return messages;
  };

  const filteredMessages = filterMessages();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:truncate">
            Mensagens
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Gerencie suas mensagens e comunicações
          </p>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button onClick={() => setIsComposeDialogOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Mensagem
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Caixa de Entrada</CardTitle>
                <Select value={filter} onValueChange={(value: "all" | "unread") => setFilter(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Suas mensagens recebidas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredMessages?.length ? (
                  filteredMessages.map((message) => {
                    const sender = getUserById(message.senderId);
                    const receiver = getUserById(message.receiverId);
                    const isSelected = selectedMessage?.id === message.id;
                    const isUnread = !message.isRead && message.receiverId === user?.id;
                    
                    return (
                      <div 
                        key={message.id}
                        onClick={() => handleMessageClick(message)}
                        className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer ${
                          isSelected ? 'bg-neutral-100 dark:bg-neutral-800/60' : ''
                        } ${isUnread ? 'border-l-4 border-primary-500' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={sender?.profileImageUrl}
                              alt={`${sender?.firstName} ${sender?.lastName}`}
                            />
                            <AvatarFallback>
                              {sender?.firstName?.[0]}
                              {sender?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {sender ? `${sender.firstName} ${sender.lastName}` : 'Utilizador Desconhecido'}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {formatTimeAgo(message.createdAt)}
                              </p>
                            </div>
                            <p className={`text-sm ${isUnread ? 'font-semibold text-neutral-800 dark:text-neutral-200' : 'text-neutral-500 dark:text-neutral-400'} truncate`}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
                    Nenhuma mensagem encontrada.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Viewer */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedMessage ? (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={getUserById(selectedMessage.senderId)?.profileImageUrl}
                          alt={`${getUserById(selectedMessage.senderId)?.firstName} ${getUserById(selectedMessage.senderId)?.lastName}`}
                        />
                        <AvatarFallback>
                          {getUserById(selectedMessage.senderId)?.firstName?.[0]}
                          {getUserById(selectedMessage.senderId)?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {getUserById(selectedMessage.senderId) 
                            ? `${getUserById(selectedMessage.senderId)?.firstName} ${getUserById(selectedMessage.senderId)?.lastName}`
                            : 'Utilizador Desconhecido'
                          }
                        </CardTitle>
                        <CardDescription>
                          {formatDate(selectedMessage.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                    {!selectedMessage.isRead && selectedMessage.receiverId === user?.id && (
                      <Badge variant="info">Nova</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-neutral-200 dark:border-neutral-700 p-4">
                  <Button 
                    onClick={() => {
                      form.setValue('receiverId', selectedMessage.senderId);
                      setIsComposeDialogOpen(true);
                    }}
                    className="ml-auto"
                  >
                    Responder
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400 p-6">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium">Nenhuma mensagem selecionada</h3>
                  <p className="mt-1">Selecione uma mensagem para ver o conteúdo.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Compose Message Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Nova Mensagem</DialogTitle>
            <DialogDescription>
              Envie uma mensagem para outro utilizador.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="receiverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um destinatário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.filter(u => u.id !== user?.id).map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva sua mensagem aqui..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsComposeDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMessageMutation.isPending}>
                  {createMessageMutation.isPending ? "Enviando..." : "Enviar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
