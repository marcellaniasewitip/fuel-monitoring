import { Signal, BatteryMedium, Wifi, WifiOff, Power, PowerOff } from "lucide-react";
import { useState } from "react";

export interface Site {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  fuelLevel: number;
  temperature: number;
  lastSync: string;
  connectivity: "satellite" | "cellular" | "offline";
  pump_enabled: boolean; // New field from Database
}

interface SiteCardProps {
  site: Site;
}

const statusStyles = {
  online: "bg-success",
  offline: "bg-critical",
  warning: "bg-warning",
};

const connectivityIcon = {
  satellite: Signal,
  cellular: Wifi,
  offline: WifiOff,
};

const SiteCard = ({ site }: SiteCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const ConnIcon = connectivityIcon[site.connectivity];

  const handleTogglePump = async (enable: boolean) => {
    setIsUpdating(true);
    try {
      // Replace with your actual API endpoint
      await fetch(`/api/sites/${site.id}/toggle-pump?enabled=${enable}`, { 
        method: 'POST' 
      });
      // In a real app, Supabase Realtime would update the UI here
    } catch (error) {
      console.error("Failed to toggle pump:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusStyles[site.status]} ${site.status === "online" ? "animate-pulse-glow" : ""}`} />
          <h3 className="text-sm font-semibold text-foreground">{site.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ConnIcon className="h-3 w-3" />
          <BatteryMedium className="h-3 w-3" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 font-mono">{site.location}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">Fuel</span>
          <span className="text-lg font-mono font-bold text-foreground">{site.fuelLevel}%</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">Temp</span>
          <span className="text-lg font-mono font-bold text-foreground">{site.temperature}°C</span>
        </div>
      </div>

      {/* --- REMOTE KILL SWITCH BUTTONS --- */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => handleTogglePump(false)}
          disabled={isUpdating || !site.pump_enabled}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded text-[10px] font-mono uppercase transition-colors ${
            !site.pump_enabled 
            ? "bg-critical/20 text-critical border border-critical/50" 
            : "bg-secondary hover:bg-critical/10 text-muted-foreground hover:text-critical border border-transparent"
          }`}
        >
          <PowerOff className="h-3 w-3" />
          {isUpdating ? "..." : "Stop Pump"}
        </button>
        <button
          onClick={() => handleTogglePump(true)}
          disabled={isUpdating || site.pump_enabled}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded text-[10px] font-mono uppercase transition-colors ${
            site.pump_enabled 
            ? "bg-success/20 text-success border border-success/50" 
            : "bg-secondary hover:bg-success/10 text-muted-foreground hover:text-success border border-transparent"
          }`}
        >
          <Power className="h-3 w-3" />
          {isUpdating ? "..." : "Enable"}
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
        <span className="text-[10px] font-mono text-muted-foreground">
          Last sync: {site.lastSync}
        </span>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${site.pump_enabled ? "text-success bg-success/10" : "text-critical bg-critical/10"}`}>
          {site.pump_enabled ? "READY" : "LOCKED"}
        </span>
      </div>
    </div>
  );
};

export default SiteCard;