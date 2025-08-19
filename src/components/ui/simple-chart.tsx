import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ children, className }: ChartContainerProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      {children}
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}