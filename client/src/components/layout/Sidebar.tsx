import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside 
      className={`${open ? 'translate-x-0' : '-translate-x-full'} 
        bg-white dark:bg-neutral-800 shadow-xl w-64 fixed inset-y-0 left-0 transform 
        transition duration-200 ease-in-out z-20 md:translate-x-0 md:static md:h-screen`}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Sistema de Permuta</h1>
          <button onClick={onClose} className="ml-auto mr-4 text-neutral-500 dark:text-neutral-400 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            <li className="px-2 mb-2">
              <Link href="/">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </a>
              </Link>
            </li>
            <li className="px-2 mb-2">
              <Link href="/users">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/users" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Utilizadores
                </a>
              </Link>
            </li>
            <li className="px-2 mb-2">
              <Link href="/permutas">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/permutas" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Permutas
                </a>
              </Link>
            </li>
            <li className="px-2 mb-2">
              <Link href="/institutions">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/institutions" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Instituições
                </a>
              </Link>
            </li>
            <li className="px-2 mb-2">
              <Link href="/messages">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/messages" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Mensagens
                </a>
              </Link>
            </li>
            <li className="px-2 mb-2">
              <Link href="/settings">
                <a 
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === "/settings" 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User Profile */}
        {user && (
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center">
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={user.profileImageUrl || "https://ui-avatars.com/api/?name=" + (user.firstName || "") + "+" + (user.lastName || "")} 
                alt="User avatar"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
                </p>
              </div>
              <button 
                onClick={handleLogout} 
                className="ml-auto text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
