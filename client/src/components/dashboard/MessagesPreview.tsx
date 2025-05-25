import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
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
  sender?: User;
}

export default function MessagesPreview() {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages?limit=4"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const getUserById = (id: string) => {
    return users?.find(user => user.id === id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: false,
      locale: pt
    });
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Mensagens Recentes</h3>
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium">
          Ver Todas
        </button>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => {
            const sender = getUserById(message.senderId);
            
            return (
              <div key={message.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={sender?.profileImageUrl || `https://ui-avatars.com/api/?name=${sender?.firstName || 'User'}`} 
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {sender ? `${sender.firstName} ${sender.lastName}` : 'Utilizador Desconhecido'}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {truncateText(message.content)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatTimeAgo(message.createdAt)}</p>
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
      <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
        <button className="w-full flex items-center justify-center px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md shadow-sm text-sm font-medium text-primary-700 dark:text-primary-400 bg-white dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/20">
          Nova Mensagem
        </button>
      </div>
    </div>
  );
}
