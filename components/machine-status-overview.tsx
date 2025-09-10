"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  Thermometer,
  Zap,
  Timer,
  Search,
  Grid3X3,
  List,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ReportGenerator } from "@/components/report-generator"

interface Machine {
  machine_id: number
  status: string
  health_score: number
  rul_days: number
  temperature: number
  energy_kw: number
  idle_time_pct: number
  vibration?: number
  load?: number
  rpm?: number
  current?: number
}

interface MachineStatusOverviewProps {
  machines: Machine[]
  dashboardSummary?: any
  alerts?: any[]
  energyData?: any
  productionInsights?: any
}

export function MachineStatusOverview({
  machines,
  dashboardSummary = {},
  alerts = [],
  energyData = {},
  productionInsights = {},
}: MachineStatusOverviewProps) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("id")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Helper function to format numbers
  const formatNumber = (value: number, maxDecimals = 2): string => {
    if (Number.isInteger(value)) {
      return value.toString()
    }
    return Number(value.toFixed(maxDecimals)).toString()
  }

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "Warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case "Critical":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
      case "Warning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300"
    }
  }

  // Get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Get temperature status
  const getTemperatureStatus = (temp: number) => {
    if (temp <= 70) return { icon: <TrendingDown className="w-3 h-3 text-emerald-500" />, color: "text-emerald-600" }
    if (temp <= 75) return { icon: <Minus className="w-3 h-3 text-amber-500" />, color: "text-amber-600" }
    return { icon: <TrendingUp className="w-3 h-3 text-red-500" />, color: "text-red-600" }
  }

  // Get RUL status
  const getRulStatus = (days: number) => {
    if (days >= 150) return { color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900" }
    if (days >= 90) return { color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900" }
    return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900" }
  }

  // Get idle time color
  const getIdleTimeColor = (idleTime: number) => {
    if (idleTime <= 15) return "text-emerald-600"
    if (idleTime <= 20) return "text-amber-600"
    return "text-red-600"
  }

  // Generate historical data for charts
  const generateHistoricalData = (metric: string, baseValue: number, days = 30) => {
    const data = []
    const now = new Date()

    // Define variation ranges based on metric
    let variation = 0
    switch (metric) {
      case "health":
        variation = 5
        break
      case "temperature":
        variation = 3
        break
      case "energy":
        variation = 1.5
        break
      default:
        variation = 2
    }

    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Add some random variation with a slight trend
      const trend = (((days - i) / days) * (Math.random() > 0.7 ? 1 : -1) * variation) / 2
      const randomVariation = (Math.random() - 0.5) * variation
      const value = baseValue + randomVariation + trend

      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.max(0, value),
      })
    }

    return data
  }

  // Filter and sort machines
  const filteredMachines = machines
    .filter((machine) => {
      if (filterStatus !== "all" && machine.status !== filterStatus) return false
      if (searchTerm && !`Machine ${machine.machine_id}`.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "id":
          return a.machine_id - b.machine_id
        case "health":
          return b.health_score - a.health_score
        case "rul":
          return b.rul_days - a.rul_days
        case "temperature":
          return a.temperature - b.temperature
        case "energy":
          return a.energy_kw - b.energy_kw
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return a.machine_id - b.machine_id
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage)
  const paginatedMachines = filteredMachines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Summary stats
  const healthyCount = machines.filter((m) => m.status === "Healthy").length
  const warningCount = machines.filter((m) => m.status === "Warning").length
  const criticalCount = machines.filter((m) => m.status === "Critical").length
  const avgHealth = machines.reduce((sum, m) => sum + m.health_score, 0) / machines.length

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Machine Status Overview
            </CardTitle>

            {/* Status summary with improved spacing */}
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 rounded-md">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-emerald-700 dark:text-emerald-300">{healthyCount} Healthy</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950 rounded-md">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-300">{warningCount} Warning</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950 rounded-md">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-300">{criticalCount} Critical</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 rounded-md">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  Avg Health: {formatNumber(avgHealth)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search machines..."
                className="pl-8 h-9 w-full sm:w-[180px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[130px] h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[130px] h-9">
                <SelectValue placeholder="Machine ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Machine ID</SelectItem>
                <SelectItem value="health">Health Score</SelectItem>
                <SelectItem value="rul">RUL Days</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-9 px-3"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-9 px-3"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>

            {/* Report Generator */}
            <ReportGenerator
              machines={machines}
              dashboardSummary={dashboardSummary}
              alerts={alerts}
              energyData={energyData}
              productionInsights={productionInsights}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="w-[100px]">Machine</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Health Score</TableHead>
                  <TableHead className="w-[100px]">RUL</TableHead>
                  <TableHead className="w-[120px]">Temperature</TableHead>
                  <TableHead className="w-[100px]">Energy</TableHead>
                  <TableHead className="w-[100px]">Idle Time</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMachines.map((machine) => {
                  const tempStatus = getTemperatureStatus(machine.temperature)
                  const rulStatus = getRulStatus(machine.rul_days)

                  return (
                    <TableRow
                      key={machine.machine_id}
                      className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(machine.status)}
                          Machine {machine.machine_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getStatusBadge(machine.status)}`}>
                          {machine.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getHealthScoreColor(machine.health_score)}`}>
                          {formatNumber(machine.health_score)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${rulStatus.color}`}>
                          {formatNumber(machine.rul_days, 0)} days
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${tempStatus.color}`}>
                          {tempStatus.icon}
                          <span className="font-medium">{formatNumber(machine.temperature)}°C</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          <span>{formatNumber(machine.energy_kw)} kW</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getIdleTimeColor(machine.idle_time_pct)}`}>
                          {formatNumber(machine.idle_time_pct)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedMachine(machine)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="flex flex-row items-center justify-between">
                              <div>
                                <DialogTitle className="text-xl">Machine {machine.machine_id} Details</DialogTitle>
                                <DialogDescription>Detailed metrics and analysis</DialogDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusBadge(machine.status)}`}>{machine.status}</Badge>
                                <DialogClose>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </DialogClose>
                              </div>
                            </DialogHeader>

                            {/* Key Metrics Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
                              <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
                                <div className="flex justify-center mb-2">
                                  <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xl sm:text-3xl font-bold">{formatNumber(machine.health_score)}%</p>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Health Score</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
                                <div className="flex justify-center mb-2">
                                  <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xl sm:text-3xl font-bold">{formatNumber(machine.rul_days, 0)}</p>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">RUL Days</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
                                <div className="flex justify-center mb-2">
                                  <Thermometer className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xl sm:text-3xl font-bold">{formatNumber(machine.temperature)}°C</p>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
                                <div className="flex justify-center mb-2">
                                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xl sm:text-3xl font-bold">{formatNumber(machine.energy_kw)} kW</p>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Energy</p>
                                </div>
                              </div>
                            </div>

                            {/* Charts Section */}
                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                              {/* Health Score Trend Chart */}
                              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium mb-4">Health Score Trend (30 Days)</h4>
                                <div className="h-48 sm:h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                      data={generateHistoricalData("health", machine.health_score)}
                                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                      <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => {
                                          const date = new Date(value)
                                          return `${date.getDate()}/${date.getMonth() + 1}`
                                        }}
                                      />
                                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                      <Tooltip
                                        formatter={(value) => [`${Number(value).toFixed(2)}%`, "Health Score"]}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.2}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Temperature Trend Chart */}
                              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium mb-4">Temperature Trend (30 Days)</h4>
                                <div className="h-48 sm:h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                      data={generateHistoricalData("temperature", machine.temperature)}
                                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                      <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => {
                                          const date = new Date(value)
                                          return `${date.getDate()}/${date.getMonth() + 1}`
                                        }}
                                      />
                                      <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                                      <Tooltip
                                        formatter={(value) => [`${Number(value).toFixed(2)}°C`, "Temperature"]}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Energy Consumption Chart */}
                              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium mb-4">Energy Consumption (30 Days)</h4>
                                <div className="h-48 sm:h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                      data={generateHistoricalData("energy", machine.energy_kw)}
                                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                      <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => {
                                          const date = new Date(value)
                                          return `${date.getDate()}/${date.getMonth() + 1}`
                                        }}
                                      />
                                      <YAxis domain={[0, "auto"]} tick={{ fontSize: 12 }} />
                                      <Tooltip
                                        formatter={(value) => [`${Number(value).toFixed(2)} kW`, "Energy"]}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#eab308"
                                        fill="#eab308"
                                        fillOpacity={0.2}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Additional Metrics & Recommendations */}
                              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Additional Metrics</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                                        <span>Vibration:</span>
                                        <span className="font-medium">{formatNumber(machine.vibration || 0.5)}</span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                                        <span>Load:</span>
                                        <span className="font-medium">{formatNumber(machine.load || 75)}%</span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                                        <span>RPM:</span>
                                        <span className="font-medium">{formatNumber(machine.rpm || 2200, 0)}</span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                                        <span>Current:</span>
                                        <span className="font-medium">{formatNumber(machine.current || 35)} A</span>
                                      </div>
                                      <div className="flex justify-between py-1">
                                        <span>Idle Time:</span>
                                        <span className={`font-medium ${getIdleTimeColor(machine.idle_time_pct)}`}>
                                          {formatNumber(machine.idle_time_pct)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                                    <div className="space-y-2">
                                      {machine.status === "Critical" && (
                                        <div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-md text-sm">
                                          <p className="font-medium">Immediate maintenance required</p>
                                          <p className="text-xs mt-1">
                                            Schedule maintenance within 48 hours to prevent failure
                                          </p>
                                        </div>
                                      )}
                                      {machine.status === "Warning" && (
                                        <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-md text-sm">
                                          <p className="font-medium">Schedule maintenance soon</p>
                                          <p className="text-xs mt-1">Plan maintenance within 7 days</p>
                                        </div>
                                      )}
                                      {machine.idle_time_pct > 20 && (
                                        <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded-md text-sm">
                                          <p className="font-medium">High idle time detected</p>
                                          <p className="text-xs mt-1">Optimize workflow to reduce energy waste</p>
                                        </div>
                                      )}
                                      {machine.status === "Healthy" && machine.idle_time_pct <= 15 && (
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-md text-sm">
                                          <p className="font-medium">Operating optimally</p>
                                          <p className="text-xs mt-1">Continue regular maintenance schedule</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Grid view for smaller datasets
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedMachines.map((machine) => (
                <Dialog key={machine.machine_id}>
                  <DialogTrigger asChild>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Machine {machine.machine_id}</h3>
                        <Badge className={`${getStatusBadge(machine.status)}`}>{machine.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health:</span>
                          <span className={getHealthScoreColor(machine.health_score)}>
                            {formatNumber(machine.health_score)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>RUL:</span>
                          <span>{formatNumber(machine.rul_days, 0)} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temp:</span>
                          <span>{formatNumber(machine.temperature)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Energy:</span>
                          <span>{formatNumber(machine.energy_kw)} kW</span>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  {/* Same dialog content as table view */}
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredMachines.length)} of {filteredMachines.length} machines
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
