import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Your existing config
import SiteCard, { Site } from '../components/SiteCard';

const Dashboard = () => {
  const [sites, setSites] = useState<Site[]>([]);

  // 1. Initial Fetch
  useEffect(() => {
    const fetchSites = async () => {
      const { data } = await supabase.from('sites').select('*');
      if (data) setSites(data);
    };
    fetchSites();

    // 2. REALTIME SUBSCRIPTION
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // Listen for changes to existing sites
          schema: 'public',
          table: 'sites',
        },
        (payload) => {
          // Update the specific site in our state list
          setSites((currentSites) =>
            currentSites.map((s) =>
              s.id === payload.new.id ? { ...s, ...payload.new } : s
            )
          );
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};