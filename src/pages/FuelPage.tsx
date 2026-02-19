import DashboardLayout from "@/components/DashboardLayout";
import FuelGauge from "@/components/FuelGauge";
import FuelChart from "@/components/FuelChart";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FuelPage = () => {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('sites').select('*');
      if (data) setSites(data);
    };
    getData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Fuel Inventory Management</h1>
        <FuelChart />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sites.map(site => (
            <FuelGauge 
              key={site.id} 
              label={site.name} 
              level={site.fuelLevel} 
              capacity={100} 
              unit="%" 
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FuelPage;