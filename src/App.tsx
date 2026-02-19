import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FuelPage from "./pages/FuelPage";
import AlertsPage from "./pages/AlertsPage";
import SitesPage from "./pages/SitesPage";
import TemperaturePage from "./pages/TemperaturePage";
import SensorsPage from "./pages/SensorsPage";
import AccessPage from "./pages/AccessPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/fuel" element={<FuelPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/sites" element={<SitesPage />} />
      <Route path="/temperature" element={<TemperaturePage />} />
      <Route path="/sensors" element={<SensorsPage />} />
<Route path="/access" element={<AccessPage />} />
<Route path="/settings" element={<SettingsPage />} />
      
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;