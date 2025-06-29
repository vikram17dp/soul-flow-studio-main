
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Classes from "./pages/Classes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserPackages from "./pages/AdminUserPackages";
import AdminLogin from "./pages/AdminLogin";
import Pricing from "./pages/Pricing";
import Leaderboard from "./pages/Leaderboard";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import MyPoints from "./pages/MyPoints";
import Profile from "./pages/Profile";
import HabitProgress from "./pages/HabitProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Welcome />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/my-points" element={<MyPoints />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/habit-progress" element={<HabitProgress />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/user-packages" element={<AdminUserPackages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
