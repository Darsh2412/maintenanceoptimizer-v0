"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { MachineMetricsVisual } from "@/components/machine-metrics-visual"

interface Machine {
  machine_id: number
  health_score: number
  status: string
  temperature: number
  vibration: number
  load: number
  rpm: number
  current: number
  energy_kw: number
  idle_time_pct: number
  rul_days: number
}

interface MachineStatusGridProps {
  machines: Machine[]
}

export function MachineStatusGrid({ machines }: MachineStatusGridProps) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getIdleTimeColor = (idleTime: number) => {
    if (idleTime > 20) return "text-red-600 dark:text-red-400"
    if (idleTime > 15) return "text-yellow-600 dark:text-yellow-400"
    return "text-gray-600 dark:text-gray-400"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">Machine Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {machines.map((machine) => (
              <div
                key={machine.machine_id}
                className={`border rounded-lg p-3 sm:p-4 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
                  selectedMachine?.machine_id === machine.machine_id
                    ? "border-blue-500 dark:border-blue-400 shadow-md"
                    : "hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedMachine(machine)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm sm:text-base font-medium">Machine {machine.machine_id}</h3>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(machine.status)}`}>
                    {machine.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p>Health Score: {machine.health_score.toFixed(1)}%</p>
                  <p>RUL: {machine.rul_days.toFixed(0)} days</p>
                  <p>Temperature: {machine.temperature.toFixed(1)}°C</p>
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                    <p>Energy: {machine.energy_kw?.toFixed(1)} kW</p>
                  </div>
                  <p className={getIdleTimeColor(machine.idle_time_pct)}>
                    Idle Time: {machine.idle_time_pct?.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Machine Metrics Visualization */}
      {selectedMachine && <MachineMetricsVisual machine={selectedMachine} />}
    </div>
  )
}
