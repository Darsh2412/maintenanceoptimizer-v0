"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMockData } from "@/hooks/use-mock-data"
import { EnergyConsumptionChart } from "@/components/energy-consumption-chart"
import { IdleTimeChart } from "@/components/idle-time-chart"
import { RoiCalculator } from "@/components/roi-calculator"
import { Zap, DollarSign, Clock } from "lucide-react"

export function EnergyDashboard() {
  const { energyData, dashboardSummary } = useMockData()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Energy Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 sm:mb-2">
              {dashboardSummary.total_energy_consumption?.toFixed(0)} kWh
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Weekly Energy Consumption</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="flex justify-center mb-2">
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
              {dashboardSummary.potential_energy_savings?.toFixed(0)} kWh
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Potential Weekly Savings</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="flex justify-center mb-2">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {dashboardSummary.estimated_roi_days} days
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Estimated ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Energy Consumption Chart */}
      {energyData.daily_energy_by_machine && (
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Energy Consumption by Machine</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
            <div className="h-64 sm:h-80">
              <EnergyConsumptionChart data={energyData.daily_energy_by_machine} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idle Time Analysis */}
      {energyData.idle_time_waste && (
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Idle Time Analysis</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
            <div className="h-64">
              <IdleTimeChart data={energyData.idle_time_waste} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROI Calculator */}
      {energyData.roi_data && (
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">ROI Calculator</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
            <RoiCalculator data={energyData.roi_data} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
