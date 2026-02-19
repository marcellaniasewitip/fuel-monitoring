import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, UserCheck, Clock } from "lucide-react";

const AccessPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('access_logs') 
        .select('*')
        .order('timestamp', { ascending: false });
      if (data) setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Access Control & RFID Logs</h1>
        </div>

        <div className="grid gap-4">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="bg-card border border-border p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold">{log.operator_name}</p>
                  <p className="text-xs text-muted-foreground">ID: {log.badge_number} • {log.site_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" />
                  {log.timestamp}
                </div>
                <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded uppercase font-bold">
                  Authorized
                </span>
              </div>
            </div>
          )) : (
            <div className="p-12 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground font-mono">
              NO RECENT ACCESS ATTEMPTS DETECTED
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccessPage;