import { Progress } from "@/components/ui/progress";

export default function QuickStats() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Estatísticas Rápidas</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Utilizadores Ativos</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">78%</p>
            </div>
            <Progress value={78} className="h-2 bg-neutral-200 dark:bg-neutral-700" indicatorClassName="bg-primary-600" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Taxa de Sucesso</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">65%</p>
            </div>
            <Progress value={65} className="h-2 bg-neutral-200 dark:bg-neutral-700" indicatorClassName="bg-green-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tempo Médio de Resolução</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">14 dias</p>
            </div>
            <Progress value={45} className="h-2 bg-neutral-200 dark:bg-neutral-700" indicatorClassName="bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
