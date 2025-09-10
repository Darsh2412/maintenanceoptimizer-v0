"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "@/contexts/session-context"
import { useMockData } from "@/hooks/use-mock-data"

export function FilterSummary() {
  const { selectedPlant, selectedMachineType, simulatedMode } = useSession()
  const { machineStatus } = useMockData()

  const healthyCount = machineStatus.filter((m) => m.status === "Healthy").length
  const warningCount = machineStatus.filter((m) => m.status === "Warning").length
  const criticalCount = machineStatus.filter((m) => m.status === "Critical").length

  return (
    <Card className="bg-gray-50 dark:bg-gray-800/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current View:</span>
            <Badge variant="outline" className="bg-white">
              {selectedPlant}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {selectedMachineType}
            </Badge>
            {simulatedMode && <Badge className="bg-green-100 text-green-800 border-green-200">Live Simulation</Badge>}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">{healthyCount} Running</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-amber-700">{warningCount} Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">{criticalCount} Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
