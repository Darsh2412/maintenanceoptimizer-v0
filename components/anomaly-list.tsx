"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface Anomaly {
  machine_id: number
  timestamp: string
  temperature: number
  vibration: number
  load: number
  rpm: number
  current: number
  anomaly_score: number
  health_score: number
}

interface AnomalyListProps {
  anomalies: Anomaly[]
  machineId: number
}

export function AnomalyList({ anomalies, machineId }: AnomalyListProps) {
  // Filter anomalies for the selected machine
  const filteredAnomalies = anomalies.filter((a) => a.machine_id === machineId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2 px-4 py-3 sm:px-6 sm:py-4">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <CardTitle className="text-base sm:text-lg">Recent Anomalies</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
        <div className="space-y-2">
          {filteredAnomalies.slice(0, 5).map((anomaly, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 sm:p-3 bg-red-50 dark:bg-red-950 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium dark:text-gray-200">Anomaly detected</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{anomaly.timestamp}</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                  Score: {anomaly.anomaly_score?.toFixed(3)}
                </p>
              </div>
            </div>
          ))}
          {filteredAnomalies.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent anomalies detected</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
