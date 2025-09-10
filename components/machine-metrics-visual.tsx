"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Clock, Zap, Activity, Timer } from "lucide-react"

interface MachineMetricsVisualProps {
  machine: {
    machine_id: number
    health_score: number
    status: string
    temperature: number
    energy_kw: number
    idle_time_pct: number
    rul_days: number
  }
}

export function MachineMetricsVisual({ machine }: MachineMetricsVisualProps) {
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

  // Calculate RUL percentage (assuming 365 days is 100%)
  const rulPercentage = Math.min(100, (machine.rul_days / 365) * 100)

  // Calculate temperature percentage (50-100°C range)
  const tempPercentage = Math.min(100, Math.max(0, ((machine.temperature - 50) / 50) * 100))

  // Energy percentage (0-25kW range)
  const energyPercentage = Math.min(100, (machine.energy_kw / 25) * 100)

  return (
    <Card className="w-full shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Activity className="w-5 h-5 mr-3 text-blue-600" />
          Machine {machine.machine_id} Detailed Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Health Score Gauge */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Health Score</span>
              </div>
              <span
                className={`text-xl font-bold ${getColorClass(machine.health_score, 80, 60)}`}
              >{`${formatNumber(machine.health_score)}%`}</span>
            </div>
            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(machine.health_score, 80, 60)} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${machine.health_score}%` }}
              ></div>
            </div>
          </div>

          {/* RUL Days Gauge */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Timer className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Remaining Useful Life</span>
              </div>
              <span
                className={`text-xl font-bold ${getColorClass(machine.rul_days, 150, 90)}`}
              >{`${formatNumber(machine.rul_days, 0)} days`}</span>
            </div>
            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(machine.rul_days, 150, 90)} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${rulPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Temperature Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Temperature</span>
              </div>
              <span
                className={`text-xl font-bold ${getColorClass(machine.temperature, 70, 75, true)}`}
              >{`${formatNumber(machine.temperature)}°C`}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-3 w-10">50°C</span>
              <div className="h-3 flex-grow relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(
                    machine.temperature,
                    70,
                    75,
                    true,
                  )} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${tempPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 ml-3 w-12">100°C</span>
            </div>
          </div>

          {/* Energy Consumption */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Energy Consumption</span>
              </div>
              <span
                className={`text-xl font-bold ${getColorClass(machine.energy_kw, 12, 15, true)}`}
              >{`${formatNumber(machine.energy_kw)} kW`}</span>
            </div>
            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(
                  machine.energy_kw,
                  12,
                  15,
                  true,
                )} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${energyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Idle Time */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Idle Time</span>
              </div>
              <span
                className={`text-xl font-bold ${getColorClass(machine.idle_time_pct, 15, 20, true)}`}
              >{`${formatNumber(machine.idle_time_pct)}%`}</span>
            </div>
            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(
                  machine.idle_time_pct,
                  15,
                  20,
                  true,
                )} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${machine.idle_time_pct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
