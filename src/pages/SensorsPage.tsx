import { useEffect, useState } from "react"; // 1. Import hooks
import { supabase } from "@/lib/supabase";    // 2. Import supabase client
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { Activity, BatteryMedium, Cpu, Wifi } from "lucide-react";

const SensorsPage = () => {
  // 3. Create state to store the sensor data
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Add the fetch logic inside useEffect
  useEffect(() => {
    const fetchSensors = async () => {
      const { data, error } = await supabase
        .from('sensor_health')
        .select('*');

      if (error) {
        console.error("Error fetching sensors:", error);
      } else {
        setSensors(data || []);
      }
      setLoading(false);
    };

    fetchSensors();
  }, []);

  // 5. Calculate Average Battery for the MetricCard
  const avgBattery = sensors.length 
    ? Math.round(sensors.reduce((acc, s) => acc + s.battery_level, 0) / sensors.length) 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Field Sensor Health</h1>
        </div>

        {/* Updated MetricCards with real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Gateway Status" value="Online" icon={Wifi} variant="success" />
          <MetricCard title="Avg Battery" value={avgBattery} unit="%" icon={BatteryMedium} variant={avgBattery < 20 ? "critical" : "default"} />
          <MetricCard title="CPU Load" value="12" unit="%" icon={Cpu} variant="default" />
          <MetricCard title="Latency" value="240" unit="ms" icon={Activity} variant="warning" />
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-mono mb-4 text-muted-foreground">ACTIVE SENSOR NODES</h3>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-left border-b border-border text-muted-foreground uppercase text-[10px]">
                <th className="pb-2">Node ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Voltage</th>
                <th className="pb-2">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="py-4 text-center">Loading PNG site data...</td></tr>
              ) : (
                sensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <td className="py-3 font-bold">{sensor.node_id}</td>
                    <td>{sensor.sensor_type}</td>
                    <td>{sensor.voltage}V</td>
                    <td className="text-muted-foreground">
                      {new Date(sensor.last_heartbeat).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SensorsPage;