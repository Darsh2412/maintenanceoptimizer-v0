"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSession } from "@/contexts/session-context"
import { useMockData } from "@/hooks/use-mock-data"
import { Factory, Activity, Zap, TrendingUp } from "lucide-react"

export function PlantOverview() {
  const { currentUser } = useSession()
  const { allMachineStatus } = useMockData()

  // Group machines by plant
  const machinesByPlant = allMachineStatus.reduce(
    (acc, machine) => {
      if (!acc[machine.plant]) {
        acc[machine.plant] = []
      }
      acc[machine.plant].push(machine)
      return acc
    },
    {} as Record<string, typeof allMachineStatus>,
  )

  // Calculate plant statistics
  const getPlantStats = (plantMachines: typeof allMachineStatus) => {
    const total = plantMachines.length
    const healthy = plantMachines.filter((m) => m.status === "Healthy").length
    const warning = plantMachines.filter((m) => m.status === "Warning").length
    const critical = plantMachines.filter((m) => m.status === "Critical").length
    const avgHealth = total > 0 ? plantMachines.reduce((sum, m) => sum + m.health_score, 0) / total : 0
    const totalEnergy = plantMachines.reduce((sum, m) => sum + m.energy_kw, 0)
    const avgEfficiency = total > 0 ? plantMachines.reduce((sum, m) => sum + (100 - m.idle_time_pct), 0) / total : 0

    return {
      total,
      healthy,
      warning,
      critical,
      avgHealth,
      totalEnergy,
      avgEfficiency,
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Warning":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Factory className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Plant Overview</h2>
        <Badge variant="outline" className="ml-2">
          {currentUser.assignedPlants.length} Plant{currentUser.assignedPlants.length !== 1 ? "s" : ""} Accessible
        </Badge>
      </div>

      {/* Plant Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUser.assignedPlants.map((plantName) => {
          const plantMachines = machinesByPlant[plantName] || []
          const stats = getPlantStats(plantMachines)

          return (
            <Card key={plantName} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-blue-600" />
                    {plantName}
                  </CardTitle>
                  <Badge variant="outline">{stats.total} Machines</Badge>
                </div>
                <CardDescription>Production facility overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.total > 0 ? (
                  <>
                    {/* Health Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Health</span>
                        <span className={`text-sm font-bold ${getHealthColor(stats.avgHealth)}`}>
                          {stats.avgHealth.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={stats.avgHealth} className="h-2" />
                    </div>

                    {/* Machine Status Distribution */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{stats.healthy}</div>
                        <div className="text-xs text-green-700">Healthy</div>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <div className="text-lg font-bold text-amber-600">{stats.warning}</div>
                        <div className="text-xs text-amber-700">Warning</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{stats.critical}</div>
                        <div className="text-xs text-red-700">Critical</div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-sm">Energy Usage</span>
                        </div>
                        <span className="text-sm font-medium">{stats.totalEnergy.toFixed(1)} kW</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Efficiency</span>
                        </div>
                        <span className="text-sm font-medium">{stats.avgEfficiency.toFixed(1)}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Factory className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No machines accessible in this plant</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Machine List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Machine Details
          </CardTitle>
          <CardDescription>Detailed view of all accessible machines across all plants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentUser.assignedPlants.map((plantName) => {
              const plantMachines = machinesByPlant[plantName] || []

              return (
                <div key={plantName} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Factory className="w-4 h-4 text-blue-600" />
                      {plantName}
                    </h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {plantMachines.length} Machine{plantMachines.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {plantMachines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {plantMachines.map((machine) => (
                        <div
                          key={machine.machine_id}
                          className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Machine {machine.machine_id}</span>
                            <Badge variant="outline" className={getStatusColor(machine.status)}>
                              {machine.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Type:</span>
                              <span>{machine.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Health:</span>
                              <span className={getHealthColor(machine.health_score)}>
                                {machine.health_score.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Energy:</span>
                              <span>{machine.energy_kw.toFixed(1)} kW</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">RUL:</span>
                              <span>{machine.rul_days.toFixed(0)} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                              <span>{(100 - machine.idle_time_pct).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Factory className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No accessible machines in {plantName}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plant Summary Statistics */}
      {allMachineStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Overall Statistics
            </CardTitle>
            <CardDescription>Aggregated statistics across all accessible plants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{allMachineStatus.length}</div>
                <div className="text-sm text-blue-700">Total Machines</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {allMachineStatus.filter((m) => m.status === "Healthy").length}
                </div>
                <div className="text-sm text-green-700">Healthy</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {allMachineStatus.filter((m) => m.status === "Warning").length}
                </div>
                <div className="text-sm text-amber-700">Warning</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {allMachineStatus.filter((m) => m.status === "Critical").length}
                </div>
                <div className="text-sm text-red-700">Critical</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-700">
                  {(allMachineStatus.reduce((sum, m) => sum + m.health_score, 0) / allMachineStatus.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Average Health</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-700">
                  {allMachineStatus.reduce((sum, m) => sum + m.energy_kw, 0).toFixed(1)} kW
                </div>
                <div className="text-sm text-gray-600">Total Energy Usage</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-700">
                  {(
                    allMachineStatus.reduce((sum, m) => sum + (100 - m.idle_time_pct), 0) / allMachineStatus.length
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-600">Average Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
