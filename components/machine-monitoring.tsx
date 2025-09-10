"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMockData } from "@/hooks/use-mock-data"
import { SensorChart } from "@/components/sensor-chart"
import { RulPrediction } from "@/components/rul-prediction"
import { AnomalyList } from "@/components/anomaly-list"

export function MachineMonitoring() {
  const [selectedMachine, setSelectedMachine] = useState("1")
  const [selectedMetric, setSelectedMetric] = useState("temperature")
  const { machineStatus, sensorHistory, rulPrediction, anomalies, updateSensorData } = useMockData()

  const machine = machineStatus.find((m) => m.machine_id === Number.parseInt(selectedMachine))

  const sensorMetrics = [
    { value: "temperature", label: "Temperature (°C)" },
    { value: "vibration", label: "Vibration" },
    { value: "load", label: "Load (%)" },
    { value: "rpm", label: "RPM" },
    { value: "current", label: "Current (A)" },
  ]

  // Update data when machine or metric changes
  useEffect(() => {
    updateSensorData(Number.parseInt(selectedMachine), selectedMetric)
  }, [selectedMachine, selectedMetric, updateSensorData])

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 sm:px-6 sm:py-4 gap-3">
          <CardTitle className="text-base sm:text-lg">Machine Monitoring</CardTitle>
          <Select value={selectedMachine} onValueChange={setSelectedMachine}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
              <SelectValue placeholder="Select machine" />
            </SelectTrigger>
            <SelectContent>
              {machineStatus.map((machine) => (
                <SelectItem key={machine.machine_id} value={machine.machine_id.toString()}>
                  Machine {machine.machine_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          {machine && (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {Object.entries(machine)
                .filter(([key]) => ["temperature", "vibration", "load", "rpm"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="text-center p-2 sm:p-4 border rounded-lg dark:border-gray-700">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</p>
                    <p className="text-base sm:text-2xl font-bold dark:text-gray-100">
                      {typeof value === "number" ? value.toFixed(1) : value}
                      {key === "temperature" ? "°C" : key === "rpm" ? " RPM" : key === "load" ? "%" : ""}
                    </p>
                  </div>
                ))}
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
              <h3 className="text-sm sm:text-lg font-medium dark:text-gray-200">Historical Data</h3>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-full sm:w-[180px] text-sm">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {sensorMetrics.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-48 sm:h-64">
              <SensorChart data={sensorHistory} metric={selectedMetric} machineId={Number.parseInt(selectedMachine)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <RulPrediction prediction={rulPrediction} machineId={Number.parseInt(selectedMachine)} />
        <AnomalyList anomalies={anomalies} machineId={Number.parseInt(selectedMachine)} />
      </div>
    </div>
  )
}
