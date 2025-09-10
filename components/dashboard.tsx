"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cog,
  Factory,
  Gauge,
  Lightbulb,
  Settings,
  TrendingUp,
  Zap,
  Users,
} from "lucide-react"

import { useMockData } from "@/hooks/use-mock-data"
import { useSession } from "@/contexts/session-context"
import { FaultZeroLogo } from "@/components/fault-zero-logo"
import { MachineStatusOverview } from "@/components/machine-status-overview"
import { MachineMonitoring } from "@/components/machine-monitoring"
import { RulPrediction } from "@/components/rul-prediction"
import { AnomalyList } from "@/components/anomaly-list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { OptimizationDashboard } from "@/components/optimization-dashboard"
import { EnergyDashboard } from "@/components/energy-dashboard"
import { AlertsList } from "@/components/alerts-list"
import { PlantOverview } from "@/components/plant-overview"
import { HeaderControls } from "@/components/header-controls"
import { FilterSummary } from "@/components/filter-summary"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { currentUser } = useSession()
  const {
    dashboardSummary,
    machineStatus,
    alerts,
    sensorHistory,
    anomalies,
    productionInsights,
    rulPrediction,
    energyData,
    refreshData,
    updateSensorData,
  } = useMockData()

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toFixed(0)
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Determine which tabs to show based on user role
  const shouldShowPlantTab = currentUser.role === "Manager" || currentUser.role === "Admin"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaultZeroLogo />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                AI-Powered Maintenance & Production Optimizer
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Predictive Analytics for Manufacturing Excellence
              </p>
            </div>
          </div>
          <HeaderControls />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${shouldShowPlantTab ? "grid-cols-7" : "grid-cols-6"} lg:w-auto`}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Machines</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Optimization</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Energy</span>
            </TabsTrigger>
            {shouldShowPlantTab && (
              <TabsTrigger value="plant" className="flex items-center gap-2">
                <Factory className="w-4 h-4" />
                <span className="hidden sm:inline">Plant</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Filter Summary */}
            <FilterSummary />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
                  <Cog className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardSummary.total_machines}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardSummary.healthy_machines} healthy, {dashboardSummary.warning_machines} warning,{" "}
                    {dashboardSummary.critical_machines} critical
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getHealthScoreColor(dashboardSummary.avg_health_score)}`}>
                    {dashboardSummary.avg_health_score.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Across all monitored machines</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Anomalies</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{dashboardSummary.recent_anomalies}</div>
                  <p className="text-xs text-muted-foreground">In the last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {dashboardSummary.avg_efficiency.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Production efficiency rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Machine Status Overview */}
            <MachineStatusOverview
              machines={machineStatus}
              dashboardSummary={dashboardSummary}
              alerts={alerts}
              energyData={energyData}
              productionInsights={productionInsights}
            />

            {/* Alerts */}
            <AlertsList alerts={alerts} />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MachineMonitoring
                machineStatus={machineStatus}
                sensorHistory={sensorHistory}
                updateSensorData={updateSensorData}
              />
              <div className="space-y-6">
                <RulPrediction rulPrediction={rulPrediction} />
                <AnomalyList anomalies={anomalies} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <OptimizationDashboard />
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <EnergyDashboard />
          </TabsContent>

          {shouldShowPlantTab && (
            <TabsContent value="plant" className="space-y-6">
              <PlantOverview />
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure your dashboard preferences and system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Refresh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-refresh interval</span>
                        <Badge variant="outline">30 seconds</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={refreshData}>
                        Refresh Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical alerts</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintenance reminders</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Enabled
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Manage user roles and permissions for plant access and machine type visibility.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">Operators</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Limited to assigned plant and Slitter machines
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">Supervisors</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Access to multiple plants and all machine types
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">Managers</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Access to multiple plants, no Plant tab access
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">Admins</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Full access to all plants, machines, and Plant tab
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {productionInsights.recommendations?.slice(0, 3).map((recommendation, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded-lg"
                        >
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
