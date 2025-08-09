import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Eye, MousePointer, Car, Globe } from "lucide-react";

interface AnalyticsDashboardProps {
  token: string;
}

export default function AnalyticsDashboard({ token }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  // Fetch page view stats
  const { data: pageViewStats, isLoading: pageViewsLoading } = useQuery({
    queryKey: ['/api/admin/analytics/page-views', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/admin/analytics/page-views?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch page view stats');
      return response.json();
    },
  });

  // Fetch click stats
  const { data: clickStats, isLoading: clicksLoading } = useQuery({
    queryKey: ['/api/admin/analytics/clicks', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/admin/analytics/clicks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch click stats');
      return response.json();
    },
  });

  // Fetch vehicle selection stats
  const { data: vehicleStats, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['/api/admin/analytics/vehicles', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/admin/analytics/vehicles?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch vehicle stats');
      return response.json();
    },
  });

  // Fetch geolocation stats
  const { data: geoStats, isLoading: geoLoading } = useQuery({
    queryKey: ['/api/admin/analytics/geolocation', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/admin/analytics/geolocation?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch geo stats');
      return response.json();
    },
  });

  const totalPageViews = pageViewStats?.reduce((sum: number, stat: any) => sum + stat.views, 0) || 0;
  const totalUniqueViews = pageViewStats?.reduce((sum: number, stat: any) => sum + stat.uniqueViews, 0) || 0;
  const totalClicks = clickStats?.reduce((sum: number, stat: any) => sum + stat.clicks, 0) || 0;
  const totalVehicleSelections = vehicleStats?.reduce((sum: number, stat: any) => sum + stat.selections, 0) || 0;

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Label htmlFor="startDate" className="text-sm text-gray-300">From:</Label>
            <Input
              id="startDate"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-auto bg-gray-800 border-gray-600 text-gray-100"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label htmlFor="endDate" className="text-sm text-gray-300">To:</Label>
            <Input
              id="endDate"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="w-auto bg-gray-800 border-gray-600 text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {pageViewsLoading ? "..." : totalPageViews.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              {totalUniqueViews.toLocaleString()} unique visitors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {clicksLoading ? "..." : totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">All tracked elements</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vehicle Selections</CardTitle>
            <Car className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {vehiclesLoading ? "..." : totalVehicleSelections.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Power calculator usage</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Countries</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {geoLoading ? "..." : (geoStats?.length || 0)}
            </div>
            <p className="text-xs text-gray-400">Global reach</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="pageviews" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="pageviews" className="data-[state=active]:bg-accent-500">
            Page Views
          </TabsTrigger>
          <TabsTrigger value="clicks" className="data-[state=active]:bg-accent-500">
            Click Events
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="data-[state=active]:bg-accent-500">
            Vehicle Selections
          </TabsTrigger>
          <TabsTrigger value="geolocation" className="data-[state=active]:bg-accent-500">
            Geographic Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pageviews">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Page View Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {pageViewsLoading ? (
                <div className="text-gray-400">Loading page view data...</div>
              ) : (
                <div className="space-y-4">
                  {pageViewStats?.slice(0, 10).map((stat: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-100">{stat.pageName || '/'}</div>
                        <div className="text-sm text-gray-400">{stat.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-400">{stat.views} views</div>
                        <div className="text-sm text-gray-400">{stat.uniqueViews} unique</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Click Event Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {clicksLoading ? (
                <div className="text-gray-400">Loading click data...</div>
              ) : (
                <div className="space-y-4">
                  {clickStats?.slice(0, 10).map((stat: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-100">{stat.element}</div>
                        <div className="text-sm text-gray-400">{stat.pageName} • {stat.date}</div>
                      </div>
                      <div className="font-medium text-green-400">{stat.clicks} clicks</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Most Popular Vehicle Selections</CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclesLoading ? (
                <div className="text-gray-400">Loading vehicle data...</div>
              ) : (
                <div className="space-y-4">
                  {vehicleStats?.slice(0, 10).map((stat: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-100">
                          {stat.brand} {stat.model}
                        </div>
                        <div className="text-sm text-gray-400">{stat.vehicleType} • {stat.date}</div>
                      </div>
                      <div className="font-medium text-purple-400">{stat.selections} selections</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geolocation">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Visitor Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {geoLoading ? (
                <div className="text-gray-400">Loading geographic data...</div>
              ) : (
                <div className="space-y-4">
                  {geoStats?.slice(0, 10).map((stat: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-100">
                          {stat.city && stat.country ? `${stat.city}, ${stat.country}` : stat.country || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400">{stat.date}</div>
                      </div>
                      <div className="font-medium text-orange-400">{stat.visitors} visitors</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}