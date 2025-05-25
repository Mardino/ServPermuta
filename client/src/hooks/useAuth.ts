import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Verificar se o admin está logado pelo cookie
  useEffect(() => {
    const checkAdminCookie = () => {
      const cookies = document.cookie.split(';');
      const adminCookie = cookies.find(cookie => cookie.trim().startsWith('admin_logged_in='));
      setIsAdminLoggedIn(!!adminCookie);
    };
    
    checkAdminCookie();
    
    // Verificar novamente quando o componente montar
    const interval = setInterval(checkAdminCookie, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Se o usuário está autenticado pelo Replit Auth ou pelo login admin
  const isAuthenticated = !!user || isAdminLoggedIn;
  
  return {
    user: user || (isAdminLoggedIn ? { 
      id: 'admin',
      firstName: 'Administrador', 
      lastName: 'Sistema',
      email: 'admin@sistema.permuta',
      role: 'admin'
    } : null),
    isLoading: isLoading && !isAdminLoggedIn,
    isAuthenticated,
    isAdmin: isAdminLoggedIn
  };
}
