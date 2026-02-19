import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import SiteCard, { Site } from "@/components/SiteCard";
import { MapPin } from "lucide-react";

const SitesPage = () => {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      const { data } = await supabase.from('sites').select('*');
      if (data) setSites(data);
    };
    fetchSites();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Remote Mining Sites</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map(site => <SiteCard key={site.id} site={site} />)}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SitesPage;