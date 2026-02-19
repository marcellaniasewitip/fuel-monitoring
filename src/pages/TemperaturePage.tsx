import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { Thermometer } from "lucide-react";

const TemperaturePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Thermal Monitoring</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="High Site" value="42" unit="°C" icon={Thermometer} variant="critical" />
          <MetricCard title="Avg Site" value="31" unit="°C" icon={Thermometer} variant="default" />
          <MetricCard title="Low Site" value="24" unit="°C" icon={Thermometer} variant="success" />
        </div>
        <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
          Detailed Thermal Heatmaps Coming Soon...
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TemperaturePage;