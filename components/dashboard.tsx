"use client"

import { useState } from "react"
import { Activity, AlertCircle, Settings, TrendingUp, Zap, RefreshCw, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertsList } from "@/components/alerts-list"
import { MachineMonitoring } from "@/components/machine-monitoring"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { OptimizationDashboard } from "@/components/optimization-dashboard"
import { EnergyDashboard } from "@/components/energy-dashboard"
import { useMockData } from "@/hooks/use-mock-data"
import { ReportGenerator } from "@/components/report-generator"

// Import the FaultZeroLogo component
import { FaultZeroLogo } from "@/components/fault-zero-logo"

// Import the new scalable machine status overview component
import { MachineStatusOverview } from "@/components/machine-status-overview"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { dashboardSummary, machineStatus, alerts, energyData, productionInsights, refreshData } = useMockData()

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    refreshData()
    setTimeout(() => setRefreshing(false), 500)
  }

  const summaryCards = [
    {
      title: "Total Machines",
      value: dashboardSummary.total_machines || 0,
      icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Healthy Machines",
      value: dashboardSummary.healthy_machines || 0,
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Recent Anomalies",
      value: dashboardSummary.recent_anomalies || 0,
      icon: <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-red-500",
    },
    {
      title: "Avg Efficiency",
      value: `${(dashboardSummary.avg_efficiency || 0).toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
            <div>
              <FaultZeroLogo className="mb-2" height={32} />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                AI-Powered Maintenance & Production Optimizer
              </p>
            </div>
            <div className="flex mt-3 md:mt-0 gap-2">
              <Button
                onClick={handleRefresh}
                className="flex items-center text-sm w-full md:w-auto"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              <ReportGenerator
                machines={machineStatus}
                dashboardSummary={dashboardSummary}
                alerts={alerts}
                energyData={energyData}
                productionInsights={productionInsights}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {summaryCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center">
                  <div className={`${card.color} text-white p-2 sm:p-3 rounded-lg mr-3`}>{card.icon}</div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 w-full h-auto">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm"
            >
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Machine Monitoring</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="energy"
              className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm"
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Energy & ROI</span>
            </TabsTrigger>
            <TabsTrigger
              value="optimization"
              className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm"
            >
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Optimization</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <MachineStatusOverview
              machines={machineStatus}
              dashboardSummary={dashboardSummary}
              alerts={alerts}
              energyData={energyData}
              productionInsights={productionInsights}
            />
            <AlertsList alerts={alerts} />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <MachineMonitoring />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="energy" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <EnergyDashboard />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <OptimizationDashboard />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm">
          <p>FaultZero - AI-Powered Maintenance & Production Optimization</p>
          <p>Last updated: {dashboardSummary.last_updated || new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
