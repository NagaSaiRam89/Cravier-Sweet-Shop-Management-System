// Sets up the application structure and defines which
//  page to show based on the URL.

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { SweetProvider } from "@/context/SweetContext";
import { OrderProvider } from "@/context/OrderContext";
import { CartProvider } from "@/context/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
// Create a client for React Query
const queryClient = new QueryClient(); // Define the main App component
// Wrap the app with various providers for state management, theming, and routing
const App = () => (
  // Provide React Query client to the app
  <QueryClientProvider client={queryClient}>
    {/* // Provide theme context to the app/ */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* // Provide tooltip context to the app */}
      <TooltipProvider>
        {/* // Toast notification containers */}
        <Toaster />
        {/* // Sonner notification container */}
        <Sonner />
        {/* // Set up routing for the app */}
        <BrowserRouter>
          {/* // Provide authentication context to the app  */}
          <AuthProvider>
            {/* // Provide sweet context to the app */}
            <SweetProvider>
              {/* // Provide order context to the app */}
              <OrderProvider>
                {/* // Provide cart context to the app */}
                <CartProvider>
                  {/* // Define application routes */}
                  <Routes>
                    {/* // Home Route */}
                    <Route path="/" element={<Index />} />
                    {/* // Login Route  */}
                    <Route path="/login" element={<Login />} />
                    {/* // Register Route */}
                    <Route path="/register" element={<Register />} />
                    {/* // Dashboard Route */}
                    <Route
                      path="/dashboard"
                      element={
                        // Protected Dashboard Route
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    {/* // Order History Route */}
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    {/* // Admin Panel Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                    {/* // 404 Not Found Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartProvider>
              </OrderProvider>
            </SweetProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
