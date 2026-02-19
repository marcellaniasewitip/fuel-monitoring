interface FuelGaugeProps {
  level: number;
  capacity: number;
  label: string;
  unit?: string;
}

const FuelGauge = ({ level, capacity, label, unit = "L" }: FuelGaugeProps) => {
  const percentage = Math.round((level / capacity) * 100);
  const isLow = percentage < 25;
  const isCritical = percentage < 10;

  const getColor = () => {
    if (isCritical) return "bg-critical";
    if (isLow) return "bg-warning";
    return "bg-success";
  };

  const getGlow = () => {
    if (isCritical) return "glow-critical";
    if (isLow) return "";
    return "glow-success";
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${getGlow()}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
          isCritical ? "bg-critical/20 text-critical" : isLow ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
        }`}>
          {percentage}%
        </span>
      </div>

      {/* Vertical gauge */}
      <div className="flex items-end gap-3">
        <div className="w-8 h-24 bg-secondary rounded-sm overflow-hidden flex flex-col justify-end border border-border">
          <div
            className={`${getColor()} transition-all duration-1000 ease-out rounded-t-sm`}
            style={{ height: `${percentage}%` }}
          />
        </div>
        <div>
          <div className="text-2xl font-mono font-bold text-foreground">
            {level.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            / {capacity.toLocaleString()} {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelGauge;
