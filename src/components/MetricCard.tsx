import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "critical";
}

const variantStyles = {
  default: "border-border",
  success: "border-success/30 glow-success",
  warning: "border-warning/30",
  critical: "border-critical/30 glow-critical",
};

const iconVariant = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
};

const MetricCard = ({ title, value, unit, icon: Icon, trend, trendValue, variant = "default" }: MetricCardProps) => {
  return (
    <div className={`bg-card border rounded-lg p-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <Icon className={`h-4 w-4 ${iconVariant[variant]}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs font-mono text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-mono ${
            trend === "up" ? "text-success" : trend === "down" ? "text-critical" : "text-muted-foreground"
          }`}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "●"} {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
