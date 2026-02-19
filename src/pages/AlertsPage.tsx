import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import AlertFeed, { Alert } from "@/components/AlertFeed";
import { AlertTriangle } from "lucide-react";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase.from('access_logs').select('*').order('timestamp', { ascending: false });
      if (data) setAlerts(data);
    };
    fetchAlerts();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-critical" />
          <h1 className="text-xl font-bold">Incident Log & Alerts</h1>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;