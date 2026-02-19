import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Ensure you have this helper created
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import FuelGauge from "@/components/FuelGauge";
import AlertFeed, { Alert } from "@/components/AlertFeed";
import SiteCard, { Site } from "@/components/SiteCard";
import FuelChart from "@/components/FuelChart";
import { Fuel, Thermometer, AlertTriangle, Activity, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // If using Shadcn/UI toast

const Index = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Calculate totals for MetricCards
  const totalFuel = sites.reduce((acc, site) => acc + (site.fuelLevel || 0), 0);
  const activeAlertsCount = alerts.filter(a => a.severity === 'critical').length;
  const sitesOnline = sites.filter(s => s.status === 'online').length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Sites from Supabase
        const { data: sitesData, error: sitesError } = await supabase
          .from('sites')
          .select('*')
          .order('name', { ascending: true });

        if (sitesError) throw sitesError;

        // 2. Fetch Recent Alerts from Supabase
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (alertsError) throw alertsError;

        setSites(sitesData || []);
        setAlerts(alertsData || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to fetch live data from PNG sites.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up Real-time Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-mono">CONNECTING TO PNG SATELLITE LINK...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Papua New Guinea — Live Remote Monitoring
          </p>
        </div>

        {/* Key metrics updated from DB */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Total Fuel"
            value={totalFuel.toLocaleString()}
            unit="%"
            icon={Fuel}
            variant="default"
          />
          <MetricCard
            title="Avg Temp"
            value={sites.length ? Math.round(sites.reduce((a, b) => a + b.temperature, 0) / sites.length) : 0}
            unit="°C"
            icon={Thermometer}
            variant="warning"
          />
          <MetricCard
            title="Active Alerts"
            value={activeAlertsCount}
            icon={AlertTriangle}
            variant={activeAlertsCount > 0 ? "critical" : "default"}
          />
          <MetricCard
            title="Sites Online"
            value={`${sitesOnline}/${sites.length}`}
            icon={Activity}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <FuelChart />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sites.map((site) => (
                <FuelGauge 
                  key={site.id} 
                  level={site.fuelLevel} 
                  capacity={100} 
                  label={site.name.split(' ')[0]} 
                  unit="%"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Live Alerts</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-critical/20 text-critical">
                  {alerts.length} LOGGED
                </span>
              </div>
              <AlertFeed alerts={alerts} />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Remote Sites</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;