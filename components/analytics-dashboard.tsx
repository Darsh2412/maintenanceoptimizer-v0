"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMockData } from "@/hooks/use-mock-data"
import { HealthDistributionChart } from "@/components/health-distribution-chart"
import { EfficiencyChart } from "@/components/efficiency-chart"

export function AnalyticsDashboard() {
  const { dashboardSummary, productionInsights } = useMockData()

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">Machine Health Distribution</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="h-48 sm:h-64">
            <HealthDistributionChart dashboardSummary={dashboardSummary} />
          </div>
        </CardContent>
      </Card>

      {productionInsights.efficiency_by_machine && (
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Production Efficiency by Machine</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
            <div className="h-48 sm:h-64">
              <EfficiencyChart data={productionInsights.efficiency_by_machine} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
