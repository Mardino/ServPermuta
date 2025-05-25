export default function SystemStatus() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Estado do Sistema</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">API</p>
          </div>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Operacional</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Base de Dados</p>
          </div>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Operacional</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Servidor Web</p>
          </div>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Operacional</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Serviço de Email</p>
          </div>
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Degradado</p>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Última verificação</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Há 5 minutos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
