import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Permutas from "@/pages/permutas";
import Sectors from "@/pages/sectors";
import Messages from "@/pages/messages";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-md px-4 py-3 flex items-center justify-between md:hidden">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="text-neutral-600 dark:text-neutral-300 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">Sistema de Permuta</h1>
        </div>
        <div className="flex items-center">
          <button className="text-neutral-600 dark:text-neutral-300 focus:outline-none ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay */}
      <div 
        onClick={() => setSidebarOpen(false)} 
        className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden`}
      ></div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 dark:bg-neutral-900 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/admin-login" component={AdminLogin} />
        </>
      ) : (
        <>
          <Route path="/">
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
          <Route path="/users">
            <Layout>
              <Users />
            </Layout>
          </Route>
          <Route path="/permutas">
            <Layout>
              <Permutas />
            </Layout>
          </Route>
          <Route path="/sectors">
            <Layout>
              <Sectors />
            </Layout>
          </Route>
          <Route path="/messages">
            <Layout>
              <Messages />
            </Layout>
          </Route>
          <Route path="/settings">
            <Layout>
              <Settings />
            </Layout>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
