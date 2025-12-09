import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import TechCrisis from "./pages/TechCrisis";
import SupportTicketAnalyzer from "./pages/SupportTicketAnalyzer";
import BrandComparison from "./pages/BrandComparison";
import TodoDemo from "./pages/TodoDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tech" element={<TechCrisis />} />
            <Route path="/support-tickets" element={<SupportTicketAnalyzer />} />
            <Route path="/brand-comparison" element={<BrandComparison />} />
            <Route path="/todo-demo" element={<TodoDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
