import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import PageEditor from "@/components/admin/page-editor";
import VisualContentEditor from "@/components/admin/visual-content-editor";
import NavigationManager from "@/components/admin/navigation-manager";
import MultilingualNavigation from "@/components/admin/multilingual-navigation";
import ServicesManager from "@/components/admin/services-manager";
import { ServicesManagement } from "@/components/admin/services-management";
import ContactManager from "@/components/admin/contact-manager";
import VehicleManager from "@/components/admin/vehicle-manager";
import PowerCalculatorManager from "@/components/admin/power-calculator-manager";
import LanguageManager from "@/components/admin/language-manager";
import UserManager from "@/components/admin/user-manager";
import SiteIdentityManager from "@/components/admin/site-identity-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import HelpPanel from "@/components/admin/help-panel";
import ZboxManagement from "@/components/admin/zbox-management";
import WhyChooseUsManagement from "@/components/admin/why-choose-us-management";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, token } = useAdmin();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  // Override the default fetch for authenticated requests
  useEffect(() => {
    if (token) {
      // Set up authenticated fetcher
      const authFetch = (url: string, init?: RequestInit) => {
        return fetch(url, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      };
      
      // Store the authenticated fetch function for use by queries
      (window as any).authFetch = authFetch;
      (window as any).authToken = token;
    }
  }, [token]);

  const { data: pageContent = [], isLoading: pageContentLoading } = useQuery({
    queryKey: ['/api/admin/page-content'],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await fetch('/api/admin/page-content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch page content');
      return response.json();
    },
  });

  const { data: navigationItems = [], isLoading: navigationLoading } = useQuery({
    queryKey: ['/api/admin/navigation'],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await fetch('/api/admin/navigation', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch navigation items');
      return response.json();
    },
  });

  const { data: serviceItems = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/admin/services'],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await fetch('/api/admin/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
  });

  const { data: contactInfo = [], isLoading: contactInfoLoading } = useQuery({
    queryKey: ['/api/admin/contact-info'],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await fetch('/api/admin/contact-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch contact info');
      return response.json();
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-accent-400">
              Website Control Panel
            </h1>
            <p className="text-gray-400 text-sm">Easy website management - no technical skills needed</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.username}</span>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              size="sm"
            >
              <i className="fas fa-home mr-2"></i>
              View Site
            </Button>
            <Button onClick={logout} variant="destructive" size="sm">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Welcome & Quick Start */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-accent-900/30 border-accent-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-rocket text-accent-400 text-xl"></i>
                  <h3 className="text-xl font-bold text-white">Quick Start Guide</h3>
                </div>
                <p className="text-gray-300 mb-4">Everything you need to manage your chiptuning website</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-chart-pie text-accent-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-white">Dashboard</div>
                      <div className="text-gray-400 text-xs">View website stats</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-edit text-green-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-white">Edit Content</div>
                      <div className="text-gray-400 text-xs">Change homepage text</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-cogs text-purple-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-white">Services</div>
                      <div className="text-gray-400 text-xs">Manage offerings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-car text-orange-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-white">Vehicles</div>
                      <div className="text-gray-400 text-xs">Car specifications</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="text-right text-gray-400 text-sm">
                  <i className="fas fa-question-circle mr-1"></i>
                  Need help? Look for the blue help button →
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-chart-pie mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-chart-line mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-edit mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Edit Content</span>
              <span className="sm:hidden">Edit</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-cogs mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Services</span>
              <span className="sm:hidden">Services</span>
            </TabsTrigger>
            <TabsTrigger value="zbox" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-microchip mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">ZBOX</span>
              <span className="sm:hidden">ZBOX</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-compass mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Menu</span>
              <span className="sm:hidden">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-phone mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="why-choose-us" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-star mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Why Choose Us</span>
              <span className="sm:hidden">Why</span>
            </TabsTrigger>
            <TabsTrigger value="site-identity" className="data-[state=active]:bg-accent-500 text-xs md:text-sm p-2">
              <i className="fas fa-palette mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Design</span>
              <span className="sm:hidden">Design</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Website Dashboard</h2>
              <p className="text-gray-400 text-lg">Here's an overview of your website content and settings. Click on any tab above to make changes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Website Pages
                  </CardTitle>
                  <i className="fas fa-file-alt text-accent-400"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {pageContentLoading ? "..." : pageContent?.length || 0}
                  </div>
                  <p className="text-xs text-gray-400">
                    Content sections created
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Menu Items
                  </CardTitle>
                  <i className="fas fa-compass text-accent-400"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {navigationLoading ? "..." : navigationItems?.length || 0}
                  </div>
                  <p className="text-xs text-gray-400">
                    Active menu items
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Services
                  </CardTitle>
                  <i className="fas fa-cogs text-accent-400"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {servicesLoading ? "..." : serviceItems?.length || 0}
                  </div>
                  <p className="text-xs text-gray-400">
                    Available services
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Contact Methods
                  </CardTitle>
                  <i className="fas fa-phone text-accent-400"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {contactInfoLoading ? "..." : contactInfo?.length || 0}
                  </div>
                  <p className="text-xs text-gray-400">
                    Contact options
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-bolt text-accent-400"></i>
                  Quick Actions
                </CardTitle>
                <p className="text-gray-400 text-sm">Common tasks to get started</p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => setLocation("/")} 
                  variant="outline"
                  className="border-gray-600 hover:border-accent-400 hover:bg-accent-500/10 h-20 flex flex-col gap-2"
                >
                  <i className="fas fa-eye text-lg"></i>
                  <div>
                    <div className="font-medium">Preview Website</div>
                    <div className="text-xs text-gray-400">See live site</div>
                  </div>
                </Button>
                <Button 
                  onClick={() => {
                    // Find services tab and switch to it
                    const servicesTab = document.querySelector('[value="services"]') as HTMLElement;
                    if (servicesTab) servicesTab.click();
                  }}
                  variant="outline"
                  className="border-gray-600 hover:border-green-400 hover:bg-green-500/10 h-20 flex flex-col gap-2"
                >
                  <i className="fas fa-plus text-lg"></i>
                  <div>
                    <div className="font-medium">Add Service</div>
                    <div className="text-xs text-gray-400">New offering</div>
                  </div>
                </Button>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Visual Content Editor</h2>
              <p className="text-gray-400">Edit your website content with live preview. See exactly how changes will look to your visitors.</p>
            </div>
            <VisualContentEditor token={token || ''} />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Navigation Menu</h2>
              <p className="text-gray-400">Drag and drop to reorder menu items. Create a navigation that guides visitors through your website.</p>
            </div>
            <MultilingualNavigation token={token || ''} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
              <p className="text-gray-400">Manage your contact details and business information displayed on your website.</p>
            </div>
            <ContactManager token={token || ''} />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="zbox" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">ZBOX Chiptuning Device Content</h2>
              <p className="text-gray-400">Manage the ZBOX section content, features, pricing, and translations for multiple languages.</p>
            </div>
            <ZboxManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">User Accounts</h2>
              <p className="text-gray-400">Manage who can access this admin panel. Add or remove admin users and control their permissions.</p>
            </div>
            <UserManager token={token || ''} />
          </TabsContent>

          <TabsContent value="why-choose-us" className="space-y-6">
            <WhyChooseUsManagement />
          </TabsContent>

          <TabsContent value="site-identity" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Website Design & Branding</h2>
              <p className="text-gray-400">Customize your website's appearance - change colors, logo, company name, and overall visual style.</p>
            </div>
            <SiteIdentityManager token={token || ''} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Website Statistics</h2>
              <p className="text-gray-400">See how visitors use your website - page views, popular services, geographic data, and customer behavior insights.</p>
            </div>
            <AnalyticsDashboard token={token || ''} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Help Panel */}
      <HelpPanel />
    </div>
  );
}