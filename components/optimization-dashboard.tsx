"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useMockData } from "@/hooks/use-mock-data"

export function OptimizationDashboard() {
  const { dashboardSummary, productionInsights } = useMockData()

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            {productionInsights.recommendations?.map((recommendation, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 dark:border-blue-700 rounded"
              >
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 shrink-0">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">{recommendation}</p>
                </div>
              </div>
            ))}
            {(!productionInsights.recommendations || productionInsights.recommendations.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8">
                AI recommendations will appear here based on machine performance data
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
              {dashboardSummary.total_batches || 0}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Batches (7 days)</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {(dashboardSummary.avg_efficiency || 0).toFixed(1)}%
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Efficiency</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 px-3 py-2 sm:px-6 sm:py-4">
            <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1 sm:mb-2">
              {dashboardSummary.total_defects || 0}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Defects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
