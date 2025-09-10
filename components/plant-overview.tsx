"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Check, AlertTriangle, AlertCircle, Zap } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { PieChart, Pie } from "recharts"

interface Plant {
  plant_id: number
  plant_name: string
  location: string
  total_machines: number
  healthy_machines: number
  warning_machines: number
  critical_machines: number
  avg_health_score: number
  avg_energy_consumption: number
  avg_efficiency: number
}

interface PlantOverviewProps {
  plants: Plant[]
  machineToPlantMap: Record<number, number>
  machines: any[]
}

export function PlantOverview({ plants, machineToPlantMap, machines }: PlantOverviewProps) {
  // Transform data for machine distribution chart
  const machineDistributionData = plants.map((plant) => ({
    name: plant.plant_name,
    total: plant.total_machines,
    healthy: plant.healthy_machines,
    warning: plant.warning_machines,
    critical: plant.critical_machines,
  }))

  // Transform data for health score comparison
  const healthScoreData = plants.map((plant) => ({
    name: plant.plant_name,
    value: plant.avg_health_score,
    fill: plant.avg_health_score > 80 ? "#10b981" : plant.avg_health_score > 60 ? "#f59e0b" : "#ef4444",
  }))

  // Transform data for energy consumption
  const energyData = plants.map((plant) => ({
    name: plant.plant_name,
    value: plant.avg_energy_consumption,
    fill: "#0ea5e9",
  }))

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md text-xs sm:text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2 px-4 py-3 sm:px-6 sm:py-4">
          <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
          <CardTitle className="text-base sm:text-lg">Plant Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Plant Machine Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-4">Machine Distribution by Plant</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={machineDistributionData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    barSize={30}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                    <Bar dataKey="healthy" name="Healthy" fill="#10b981" />
                    <Bar dataKey="warning" name="Warning" fill="#f59e0b" />
                    <Bar dataKey="critical" name="Critical" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plant Health Score Comparison */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-4">Plant Health Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthScoreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {healthScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(0)} kWh`}
                        labelLine={false}
                      >
                        {energyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toFixed(0)} kWh`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {plants.map((plant) => (
              <div key={plant.plant_id} className="border rounded-lg p-3 sm:p-4 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm sm:text-base font-medium">{plant.plant_name}</h3>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{plant.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full mr-2">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Healthy</p>
                      <p className="text-sm sm:text-base font-medium">{plant.healthy_machines}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-yellow-500 text-white p-1.5 sm:p-2 rounded-full mr-2">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Warning</p>
                      <p className="text-sm sm:text-base font-medium">{plant.warning_machines}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-500 text-white p-1.5 sm:p-2 rounded-full mr-2">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Critical</p>
                      <p className="text-sm sm:text-base font-medium">{plant.critical_machines}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-full mr-2">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Efficiency</p>
                      <p className="text-sm sm:text-base font-medium">{plant.avg_efficiency.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
