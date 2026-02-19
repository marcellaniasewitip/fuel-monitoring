import { AlertTriangle, ShieldAlert, Flame, Droplets, UserCheck, ShieldClose } from "lucide-react";

export interface Alert {
  id: string;
  type: string; // Changed from strict union to string to allow log data
  severity: "critical" | "warning" | "info";
  message: string;
  site: string;
  timestamp: string;
}

const iconMap: Record<string, any> = {
  theft: ShieldAlert,
  leak: Droplets,
  fire: Flame,
  overheat: AlertTriangle,
  access: ShieldAlert,
  // Added support for Access Control logs
  Authorized: UserCheck,
  Denied: ShieldClose,
};

const severityStyles = {
  critical: "border-critical/50 bg-critical/5",
  warning: "border-warning/50 bg-warning/5",
  info: "border-border bg-card",
};

const severityBadge = {
  critical: "bg-critical/20 text-critical",
  warning: "bg-warning/20 text-warning",
  info: "bg-muted text-muted-foreground",
};

interface AlertFeedProps {
  alerts: Alert[];
}

const AlertFeed = ({ alerts }: AlertFeedProps) => {
  return (
    <div className="space-y-2">
      {alerts?.map((alert) => {
        // FIX: If alert.type isn't in iconMap, use AlertTriangle as a fallback
        const Icon = iconMap[alert.type] || AlertTriangle;
        
        // FIX: Ensure severity has a fallback value to prevent style crashes
        const severity = alert.severity || "info";

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all animate-slide-in ${
              severityStyles[severity as keyof typeof severityStyles]
            }`}
          >
            <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
              severity === "critical" ? "text-critical" : 
              severity === "warning" ? "text-warning" : 
              "text-muted-foreground"
            }`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  severityBadge[severity as keyof typeof severityBadge]
                }`}>
                  {severity}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {alert.site || "Remote Site"}
                </span>
              </div>
              
              <p className="text-sm text-foreground">{alert.message}</p>
              
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
      
      {(!alerts || alerts.length === 0) && (
        <div className="p-4 text-center text-xs font-mono text-muted-foreground border border-dashed rounded-lg">
          NO ACTIVE INCIDENTS DETECTED
        </div>
      )}
    </div>
  );
};

export default AlertFeed;