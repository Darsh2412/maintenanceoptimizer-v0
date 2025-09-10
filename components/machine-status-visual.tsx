"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Thermometer, Zap, Clock, Timer } from "lucide-react"

interface Machine {
  machine_id: number
  status: string
  health_score: number
  rul_days: number
  temperature: number
  energy_kw: number
  idle_time_pct: number
}

interface MachineStatusVisualProps {
  machines: Machine[]
}

export function MachineStatusVisual({ machines }: MachineStatusVisualProps) {
  // Helper function to format numbers with max 2 decimal places
  const formatNumber = (value: number, maxDecimals = 2): string => {
    if (Number.isInteger(value)) {
      return value.toString()
    }
    return Number(value.toFixed(maxDecimals)).toString()
  }

  // Helper function to determine color based on value and thresholds
  const getColorClass = (value: number, goodThreshold: number, warningThreshold: number, inverse = false) => {
    if (inverse) {
      return value < goodThreshold ? "text-emerald-600" : value < warningThreshold ? "text-amber-600" : "text-red-600"
    } else {
      return value > goodThreshold ? "text-emerald-600" : value > warningThreshold ? "text-amber-600" : "text-red-600"
    }
  }

  // Get progress color based on value
  const getProgressColor = (value: number, goodThreshold: number, warningThreshold: number, inverse = false) => {
    if (inverse) {
      return value < goodThreshold ? "bg-emerald-500" : value < warningThreshold ? "bg-amber-500" : "bg-red-500"
    } else {
      return value > goodThreshold ? "bg-emerald-500" : value > warningThreshold ? "bg-amber-500" : "bg-red-500"
    }
  }

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "Warning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
    }
  }

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Machine Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.machine_id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Machine {machine.machine_id}</h3>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium px-3 py-1 ${getStatusBadgeClass(machine.status)}`}
                >
                  {machine.status}
                </Badge>
              </div>

              {/* Health Score */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Health Score</span>
                  </div>
                  <span className={`text-sm font-bold ${getColorClass(machine.health_score, 80, 60)}`}>
                    {formatNumber(machine.health_score)}%
                  </span>
                </div>
                <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(machine.health_score, 80, 60)} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${machine.health_score}%` }}
                  ></div>
                </div>
              </div>

              {/* RUL Days */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RUL</span>
                  </div>
                  <span className={`text-sm font-bold ${getColorClass(machine.rul_days, 150, 90)}`}>
                    {formatNumber(machine.rul_days, 0)} days
                  </span>
                </div>
                <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(machine.rul_days, 150, 90)} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(100, (machine.rul_days / 365) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Temperature */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                  </div>
                  <span className={`text-sm font-bold ${getColorClass(machine.temperature, 70, 75, true)}`}>
                    {formatNumber(machine.temperature)}°C
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2 w-8">50°C</span>
                  <div className="h-2 flex-grow relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(machine.temperature, 70, 75, true)} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${Math.min(100, Math.max(0, ((machine.temperature - 50) / 50) * 100))}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 w-10">100°C</span>
                </div>
              </div>

              {/* Energy Consumption */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy</span>
                  </div>
                  <span className={`text-sm font-bold ${getColorClass(machine.energy_kw, 12, 15, true)}`}>
                    {formatNumber(machine.energy_kw)} kW
                  </span>
                </div>
                <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(machine.energy_kw, 12, 15, true)} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(100, (machine.energy_kw / 20) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Idle Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Idle Time</span>
                  </div>
                  <span className={`text-sm font-bold ${getColorClass(machine.idle_time_pct, 15, 20, true)}`}>
                    {formatNumber(machine.idle_time_pct)}%
                  </span>
                </div>
                <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(machine.idle_time_pct, 15, 20, true)} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${machine.idle_time_pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
