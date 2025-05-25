import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  change?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  period?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  change,
  period,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md ${iconBgColor} p-3`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
      </div>
      {(change || period) && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {change && (
              <span className={`text-sm flex items-center ${
                change.isNeutral 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : change.isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {change.isNeutral ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                ) : change.isPositive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {change.value}
              </span>
            )}
            {period && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{period}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
