import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Save, Database, BellRing } from "lucide-react";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-xl font-bold">System Configuration</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase font-mono">Alert Thresholds</h2>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-muted-foreground font-mono">Critical Fuel Level (%)</span>
                <input type="number" className="w-full bg-secondary border border-border p-2 rounded mt-1" defaultValue="10" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground font-mono">Max Temp Threshold (°C)</span>
                <input type="number" className="w-full bg-secondary border border-border p-2 rounded mt-1" defaultValue="65" />
              </label>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold text-sm">
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;