import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useGDPR } from "@/hooks/useGDPR";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/hooks/useAdmin";
import LanguageProvider from "@/components/language-provider";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import PrivacyPolicy from "@/components/gdpr/privacy-policy";
import CookiePolicy from "@/components/gdpr/cookie-policy";
import CookieConsent from "@/components/gdpr/cookie-consent";
import NotFound from "@/pages/not-found";

function Router() {
  // Initialize analytics tracking for all page views (respects GDPR consent)
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:section" component={AdminDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const gdpr = useGDPR();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            
            {/* GDPR Cookie Consent Banner */}
            {gdpr.showBanner && (
              <CookieConsent
                onAccept={gdpr.updateConsent}
                onDecline={gdpr.withdrawConsent}
              />
            )}
          </TooltipProvider>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
