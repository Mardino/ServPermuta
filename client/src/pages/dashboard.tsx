import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import PermutasTable from "@/components/dashboard/PermutasTable";
import QuickStats from "@/components/dashboard/QuickStats";
import MessagesPreview from "@/components/dashboard/MessagesPreview";
import SystemStatus from "@/components/dashboard/SystemStatus";

interface DashboardStats {
  totalUsers: number;
  activePermutas: number;
  completedPermutas: number;
  sectors: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const currentDate = format(new Date(), "d 'de' MMMM, yyyy", { locale: pt });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block ml-3">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Dados
            </button>
          </span>
          <span className="sm:ml-3">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Ação
            </button>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center">
                <div className="rounded-md bg-neutral-200 dark:bg-neutral-700 h-12 w-12"></div>
                <div className="ml-5 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Utilizadores Totais"
              value={stats?.totalUsers || 0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              iconBgColor="bg-primary-100 dark:bg-primary-900/20"
              iconColor="text-primary-600 dark:text-primary-400"
              change={{ value: "+8.1%", isPositive: true }}
              period="Nos últimos 30 dias"
            />
            <StatCard
              title="Permutas Ativas"
              value={stats?.activePermutas || 0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              iconBgColor="bg-blue-100 dark:bg-blue-900/20"
              iconColor="text-blue-600 dark:text-blue-400"
              change={{ value: "+12.5%", isPositive: true }}
              period="Nos últimos 30 dias"
            />
            <StatCard
              title="Permutas Concluídas"
              value={stats?.completedPermutas || 0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBgColor="bg-green-100 dark:bg-green-900/20"
              iconColor="text-green-600 dark:text-green-400"
              change={{ value: "+3.2%", isPositive: true }}
              period="Este mês"
            />
            <StatCard
              title="Sectores"
              value={stats?.sectors || 0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              iconBgColor="bg-orange-100 dark:bg-orange-900/20"
              iconColor="text-orange-600 dark:text-orange-400"
              change={{ value: "0.0%", isNeutral: true }}
              period="Desde o último mês"
            />
          </>
        )}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <ActivityFeed />
          <PermutasTable />
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="lg:col-span-1 space-y-8">
          <QuickStats />
          <MessagesPreview />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
