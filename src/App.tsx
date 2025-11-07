import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimulationPage from "./pages/SimulationPage";
import RequestPage from "./pages/RequestPage";
import Dashboard from "./pages/admin/Dashboard";
import RequestsPage from "./pages/admin/RequestsPage";
import RequestDetailPage from "./pages/admin/RequestDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimulationPage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/requests" element={<RequestsPage />} />
          <Route path="/admin/requests/:id" element={<RequestDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
